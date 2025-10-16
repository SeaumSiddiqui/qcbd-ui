import React, { useState, useEffect } from 'react';
import { OrphanApplication, ApplicationStatus } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../ui/Toast';
import { applicationService } from '../../services/applicationService';
import { OrphanApplicationForm } from './OrphanApplicationForm';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { StatusChangeModal } from './shared/StatusChangeModal';

interface UpdateOrphanApplicationProps {
  applicationId: string;
  onCancel?: () => void;
  onSave?: (application: OrphanApplication) => void;
}

export const UpdateOrphanApplication: React.FC<UpdateOrphanApplicationProps> = ({
  applicationId,
  onCancel,
  onSave
}) => {
  const { hasAnyRole, isAdmin, isAuthenticator } = useAuth();
  const [application, setApplication] = useState<OrphanApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [targetUserId] = useState(''); // Empty for edit mode
  const [showStatusModal, setShowStatusModal] = useState(false);
  const { showToast } = useToast();

  const hasStaffAccess = hasAnyRole(['app-agent', 'app-authenticator', 'app-admin']);
  const canChangeStatus = application?.status === 'PENDING' || application?.status === 'ACCEPTED';

  // Load existing application
  useEffect(() => {
    const loadApplication = async () => {
      if (!applicationId || application) return; // Prevent double fetch
      
      try {
        setLoading(true);
        const data = await applicationService.getApplication(applicationId);
        setApplication(data);
      } catch (error) {
        console.error('Failed to load application:', error);
        showToast('error', 'Load Failed', 'Failed to load application. Please try again.');
        onCancel?.();
      } finally {
        setLoading(false);
      }
    };

    if (applicationId) {
      loadApplication();
    }
  }, [applicationId, showToast, onCancel]);

  // Redirect if user doesn't have staff access
  useEffect(() => {
    if (!hasStaffAccess) {
      showToast('error', 'Access Denied', 'This page is only accessible to staff members.');
      onCancel?.();
    }
  }, [hasStaffAccess, onCancel, showToast]);

  const handleSubmit = async (values: OrphanApplication, isSubmit = false) => {
    if (!applicationId) return;

    try {
      setSaving(true);
      const savedApplication = await applicationService.updateApplication(applicationId, values);

      setApplication(savedApplication);
      onSave?.(savedApplication);
      setHasUnsavedChanges(false);

      if (isSubmit) {
        showToast('success', 'Application Submitted', 'Your application has been submitted successfully!');
      } else {
        showToast('success', 'Application Updated', 'Your application has been updated successfully!');
      }
    } catch (error) {
      console.error('Failed to update application:', error);
      showToast('error', 'Update Failed', 'Failed to update application. Please try again.');
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: ApplicationStatus, rejectionMessage?: string) => {
    if (!applicationId) return;

    try {
      await applicationService.updateApplicationStatus(applicationId, newStatus, rejectionMessage);
      const updatedApp = await applicationService.getApplication(applicationId);
      setApplication(updatedApp);
      onSave?.(updatedApp);
      showToast('success', 'Status Updated', `Application status changed to ${newStatus}`);
    } catch (error) {
      console.error('Failed to update status:', error);
      showToast('error', 'Status Update Failed', 'Failed to update application status.');
      throw error;
    }
  };

  if (!hasStaffAccess) {
    return null;
  }

  if (loading) {
    return <LoadingSpinner message="Loading application..." />;
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Application not found</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <OrphanApplicationForm
        initialValues={application}
        onSubmit={handleSubmit}
        saving={saving}
        targetUserId={targetUserId}
        onUserIdChange={() => {}} // Not needed for edit mode
        userProfile={null} // Not needed for edit mode
        profileLoading={false}
        profileError={null}
        isEditing={true}
        hasUnsavedChanges={hasUnsavedChanges}
        onExit={onCancel}
        showStatusChangeButton={canChangeStatus}
        onStatusChange={() => setShowStatusModal(true)}
      />

      {showStatusModal && application && (
        <StatusChangeModal
          currentStatus={application.status}
          onClose={() => setShowStatusModal(false)}
          onConfirm={handleStatusChange}
        />
      )}
    </>
  );
};