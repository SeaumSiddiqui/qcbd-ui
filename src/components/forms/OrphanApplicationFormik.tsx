import React, { useState, useEffect } from 'react';
import { Formik, FormikProps } from 'formik';
import { AlertCircle, CheckCircle, Clock, X, User, AlertTriangle } from 'lucide-react';
import { OrphanApplication, ApplicationStatus, PhysicalCondition, Gender, UserProfile, Verification } from '../../types';
import { orphanApplicationSchema, partialOrphanApplicationSchema } from '../../utils/validationSchemas';
import { scrollToError } from '../../utils/validation';
import { PrimaryInformationFormik } from '../forms/PrimaryInformationFormik';
import { AddressFormik } from '../forms/AddressFormik';
import { FamilyMembersFormik } from '../forms/FamilyMembersFormik';
import { BasicInformationFormik } from '../forms/BasicInformationFormik';
import { VerificationForm } from '../orphan/forms/VerificationForm';
import { DocumentsForm } from '../orphan/forms/DocumentsForm';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useToast } from '../ui/Toast';
import { Carousel } from '../ui/Carousel';
import { FormTabs } from '../orphan/shared/FormTabs';
import { FormNavigation } from '../orphan/shared/FormNavigation';
import { UserSelector } from '../orphan/shared/UserSelector';
import { ApplicationDocumentView } from '../orphan/shared/ApplicationDocumentView';
import { useAuth } from '../../hooks/useAuth';

interface OrphanApplicationFormProps {
  initialValues: OrphanApplication;
  onSubmit: (values: OrphanApplication, isSubmit?: boolean) => Promise<void>;
  saving: boolean;
  targetUserId: string;
  onUserIdChange: (userId: string) => void;
  userProfile?: UserProfile | null;
  profileLoading: boolean;
  profileError: any;
  isEditing?: boolean;
  hasUnsavedChanges: boolean;
  onExit?: () => void;
  showStatusChangeButton?: boolean;
  onStatusChange?: () => void;
}

export const OrphanApplicationForm: React.FC<OrphanApplicationFormProps> = ({
  initialValues,
  onSubmit,
  saving,
  targetUserId,
  onUserIdChange,
  userProfile,
  profileLoading,
  profileError,
  isEditing = false,
  hasUnsavedChanges,
  onExit,
  showStatusChangeButton = false,
  onStatusChange
}) => {
  const [activeTab, setActiveTab] = useState('primary');
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<OrphanApplication | null>(null);
  const { user, hasAnyRole } = useAuth();
  const { showToast } = useToast();

  const tabs = [
    {
      id: 'primary',
      label: 'Primary Information',
      component: PrimaryInformationFormik,
      isValid: false,
      hasErrors: false
    },
    {
      id: 'address',
      label: 'Address',
      component: AddressFormik,
      isValid: false,
      hasErrors: false
    },
    {
      id: 'family',
      label: 'Family Members',
      component: FamilyMembersFormik,
      isValid: false,
      hasErrors: false
    },
    {
      id: 'basic',
      label: 'Basic Information',
      component: BasicInformationFormik,
      isValid: false,
      hasErrors: false
    },
    {
      id: 'documents',
      label: 'Documents',
      component: DocumentsForm,
      isValid: false,
      hasErrors: false
    },
    {
      id: 'verification',
      label: 'Verification',
      component: VerificationForm,
      isValid: false,
      hasErrors: false
    }
  ];

  const handleSave = async (values: OrphanApplication, formik: FormikProps<OrphanApplication>, submit = false) => {
    try {
      const validationSchema = submit ? orphanApplicationSchema : partialOrphanApplicationSchema;

      await validationSchema.validate(values, { abortEarly: false });

      let newStatus = values.status;

      if (submit) {
        // Submit button: Change NEW, INCOMPLETE, or REJECTED to COMPLETE
        if ([ApplicationStatus.NEW, ApplicationStatus.INCOMPLETE, ApplicationStatus.REJECTED].includes(values.status)) {
          newStatus = ApplicationStatus.COMPLETE;
          setTimeout(() => {
            setActiveTab('documents');
            showToast('success', 'Form Completed', 'Please upload all required documents to submit the application.');
          }, 1000);
        }
      } else {
        // Save Draft button: Change NEW to INCOMPLETE
        if (values.status === ApplicationStatus.NEW) {
          newStatus = ApplicationStatus.INCOMPLETE;
        }
      }

      if (!isEditing && !values.verification?.agentUserId) {
        try {
          const currentUser = user;
          if (currentUser?.id) {
            values.verification = {
              ...values.verification,
              agentUserId: currentUser.id
            };
          }
        } catch (error) {
          console.warn('Failed to capture agent user ID:', error);
        }
      }

      const applicationToSave = {
        ...values,
        status: newStatus,
        beneficiaryUserId: isEditing ? values.beneficiaryUserId : targetUserId
      };

      await onSubmit(applicationToSave, submit);
    } catch (error: any) {
      if (error.inner && error.inner.length > 0) {
        const errors: { [key: string]: string } = {};

        error.inner.forEach((err: any) => {
          errors[err.path] = err.message;
        });

        formik.setErrors(errors);

        const firstError = error.inner[0];
        const firstErrorTab = getTabNameFromPath(firstError.path);

        showToast('error', 'Validation Error', firstError.message);

        const tabMapping: { [key: string]: string } = {
          'primaryInformation': 'primary',
          'address': 'address',
          'familyMembers': 'family',
          'basicInformation': 'basic',
          'documents': 'documents',
          'verification': 'verification'
        };

        const targetTab = tabMapping[firstErrorTab.split('.')[0]];
        if (targetTab && targetTab !== activeTab) {
          setActiveTab(targetTab);
          setTimeout(() => {
            scrollToError(firstError.path);
          }, 100);
        } else {
          scrollToError(firstError.path);
        }
      } else {
        console.error('Save error:', error);
        showToast('error', 'Save Failed', 'An unexpected error occurred');
      }
    }
  };

  const getTabNameFromPath = (path: string): string => {
    if (path.startsWith('primaryInformation')) return 'Primary Information';
    if (path.startsWith('address')) return 'Address';
    if (path.startsWith('familyMembers')) return 'Family Members';
    if (path.startsWith('basicInformation')) return 'Basic Information';
    if (path.startsWith('verification')) return 'Verification';
    return 'General';
  };

  const handleSiblingsChange = (count: number, formik: FormikProps<OrphanApplication>) => {
    const currentMembers = formik.values.familyMembers || [];
    let updatedMembers = [...currentMembers];

    if (count > currentMembers.length) {
      for (let i = currentMembers.length; i < count; i++) {
        updatedMembers.push({
          name: '',
          age: 0,
          siblingsGrade: 0,
          occupation: '',
          siblingsGender: Gender.MALE,
          maritalStatus: 'UNMARRIED' as any,
        });
      }
    } else if (count < currentMembers.length) {
      updatedMembers = updatedMembers.slice(0, count);
    }

    formik.setFieldValue('familyMembers', updatedMembers);
  };

  const handleFamilyCountChange = (count: number, formik: FormikProps<OrphanApplication>) => {
    formik.setFieldValue('primaryInformation.numOfSiblings', count);
  };

  const handleExitAttempt = () => {
    if (hasUnsavedChanges) {
      setShowExitWarning(true);
    } else {
      onExit?.();
    }
  };

  const handleConfirmExit = () => {
    setShowExitWarning(false);
    onExit?.();
  };

  const handleSaveAndExit = async (formik: FormikProps<OrphanApplication>) => {
    await handleSave(formik.values, formik, false);
    setShowExitWarning(false);
    onExit?.();
  };

  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.COMPLETE:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case ApplicationStatus.PENDING:
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case ApplicationStatus.REJECTED:
        return <X className="h-4 w-4 text-red-500" />;
      case ApplicationStatus.ACCEPTED:
      case ApplicationStatus.GRANTED:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusVariant = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.COMPLETE:
        return 'success';
      case ApplicationStatus.PENDING:
        return 'warning';
      case ApplicationStatus.REJECTED:
        return 'error';
      case ApplicationStatus.ACCEPTED:
      case ApplicationStatus.GRANTED:
        return 'success';
      default:
        return 'default';
    }
  };

  const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);
  const canGoNext = currentTabIndex < tabs.length - 1;
  const canGoPrevious = currentTabIndex > 0;

  const goToNextTab = () => {
    if (canGoNext) {
      setActiveTab(tabs[currentTabIndex + 1].id);
    }
  };

  const goToPreviousTab = () => {
    if (canGoPrevious) {
      setActiveTab(tabs[currentTabIndex - 1].id);
    }
  };

  const handlePreview = (values: OrphanApplication) => {
    setPreviewData(values);
    setShowPreview(true);
  };

  if (!isEditing && !targetUserId) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Carousel />
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-6xl mx-auto">
            <UserSelector
              targetUserId={targetUserId}
              onUserIdChange={onUserIdChange}
              userProfile={userProfile}
              profileLoading={profileLoading}
              profileError={profileError}
              isEditing={isEditing}
            />
            <div className="text-center py-12">
              <User className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Enter User ID to Begin
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Please enter a User ID above to load the user profile and start creating the orphan application.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isEditing && targetUserId && profileError && !profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Carousel />
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-6xl mx-auto">
            <UserSelector
              targetUserId={targetUserId}
              onUserIdChange={onUserIdChange}
              userProfile={userProfile}
              profileLoading={profileLoading}
              profileError={profileError}
              isEditing={isEditing}
            />
            <div className="text-center py-12">
              <AlertCircle className="mx-auto h-16 w-16 text-red-400 dark:text-red-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                User Not Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                No user found with ID "{targetUserId}". Please check the User ID and try again.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isEditing && !userProfile) {
    return null;
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={partialOrphanApplicationSchema}
      onSubmit={(values) => onSubmit(values)}
      enableReinitialize
    >
      {(formik) => (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Carousel />
          <FormTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onPreview={() => handlePreview(formik.values)}
          />

          <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <UserSelector
                  targetUserId={targetUserId}
                  onUserIdChange={onUserIdChange}
                  userProfile={userProfile}
                  profileLoading={profileLoading}
                  profileError={profileError}
                  isEditing={isEditing}
                />

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {isEditing ? 'Edit' : 'New'} Orphan Application
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      Complete all sections to submit your application
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(formik.values.status)}
                    <Badge variant={getStatusVariant(formik.values.status)}>
                      {formik.values.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>

              {formik.values.status === ApplicationStatus.REJECTED && formik.values.rejectionMessage && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl shadow-lg p-6 mb-8">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">
                        Application Rejected
                      </h3>
                      <p className="text-sm text-red-800 dark:text-red-300">
                        {formik.values.rejectionMessage}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8 overflow-hidden">
                <div className="p-8">
                  {activeTab === 'primary' && (
                    <PrimaryInformationFormik
                      formik={formik}
                      userProfile={userProfile}
                      isEditing={isEditing}
                    />
                  )}
                  {activeTab === 'address' && (
                    <AddressFormik formik={formik} />
                  )}
                  {activeTab === 'family' && (
                    <FamilyMembersFormik
                      formik={formik}
                    />
                  )}
                  {activeTab === 'basic' && (
                    <BasicInformationFormik formik={formik} />
                  )}
                  {activeTab === 'documents' && (
                    <DocumentsForm
                      applicationId={formik.values.id}
                      applicationStatus={formik.values.status}
                      onStatusChange={(status) => formik.setFieldValue('status', status)}
                      errors={[]}
                    />
                  )}
                  {activeTab === 'verification' && (
                    <VerificationForm
                      data={formik.values.verification as Verification}
                    />
                  )}
                </div>
              </div>

              <FormNavigation
                tabs={tabs}
                currentTabIndex={currentTabIndex}
                onPreviousTab={goToPreviousTab}
                onNextTab={goToNextTab}
                canGoPrevious={canGoPrevious}
                canGoNext={canGoNext}
              />

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  {showStatusChangeButton && (
                    <Button
                      type="button"
                      variant="primary"
                      onClick={onStatusChange}
                      size="lg"
                      className="w-full sm:w-auto min-w-[200px]"
                    >
                      Change Status
                    </Button>
                  )}

                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => handleSave(formik.values, formik, true)}
                    loading={saving}
                    size="lg"
                    className="w-full sm:w-auto min-w-[200px]"
                  >
                    Submit Application
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => handleSave(formik.values, formik, false)}
                    loading={saving}
                    size="lg"
                    className="w-full sm:w-auto min-w-[200px]"
                  >
                    Save as Draft
                  </Button>
                </div>
              </div>

              {showExitWarning && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <AlertTriangle className="h-6 w-6 text-yellow-500" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Unsaved Changes
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      You have unsaved changes that will be lost if you leave this page. What would you like to do?
                    </p>
                    <div className="flex items-center justify-end space-x-3">
                      <Button
                        variant="outline"
                        onClick={() => setShowExitWarning(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => handleSaveAndExit(formik)}
                        loading={saving}
                      >
                        Save & Exit
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleConfirmExit}
                      >
                        Exit Without Saving
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {previewData && (
                <ApplicationDocumentView
                  application={previewData}
                  isOpen={showPreview}
                  onClose={() => setShowPreview(false)}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </Formik>
  );
};
