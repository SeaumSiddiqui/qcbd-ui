import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Eye, Trash2 } from 'lucide-react';
import { DocumentType, ApplicationStatus, ValidationError } from '../../../types';
import { orphanMediaService } from '../../../services/orphanMediaService';
import { useToast } from '../../ui/Toast';
import { Button } from '../../ui/Button';

interface DocumentsFormProps {
  applicationId?: string;
  applicationStatus?: ApplicationStatus;
  onStatusChange?: (status: ApplicationStatus) => void;
  onFieldTouch?: (fieldName: string) => void;
  errors: ValidationError[];
}

interface DocumentUploadState {
  [key: string]: {
    file?: File;
    url?: string;
    uploading: boolean;
    uploaded: boolean;
  } | undefined;
}

interface UploadProgress {
  total: number;
  completed: number;
  uploading: boolean;
}
const documentLabels: Record<DocumentType, string> = {
  [DocumentType.BIRTH_CERTIFICATE]: 'Birth Certificate',
  [DocumentType.TESTIMONIAL]: 'Testimonial',
  [DocumentType.DEATH_CERTIFICATE]: 'Death Certificate',
  [DocumentType.NATIONAL_ID]: 'National ID',
  [DocumentType.PASSPORT_IMAGE]: 'Passport Image',
  [DocumentType.FULL_SIZE_IMAGE]: 'Full Size Image'
};

const requiredDocuments = [
  DocumentType.BIRTH_CERTIFICATE,
  DocumentType.DEATH_CERTIFICATE,
  DocumentType.FULL_SIZE_IMAGE
];

export const DocumentsForm: React.FC<DocumentsFormProps> = ({
  applicationId,
  applicationStatus,
  onStatusChange,
  onFieldTouch,
  errors
}) => {
  const [documents, setDocuments] = useState<DocumentUploadState>({});
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    total: 0,
    completed: 0,
    uploading: false
  });
  const { showToast } = useToast();

  useEffect(() => {
    if (applicationId) {
      loadExistingDocuments();
    }
  }, [applicationId]);

  // Check if all required documents are uploaded
  useEffect(() => {
    const checkAllRequiredUploaded = () => {
      const allRequiredUploaded = requiredDocuments.every(docType =>
        documents[docType]?.uploaded
      );

      // Auto change status to PENDING when all required documents are uploaded
      // Only for COMPLETE status (after form submission) or REJECTED (after corrections)
      if (allRequiredUploaded &&
          [ApplicationStatus.COMPLETE, ApplicationStatus.REJECTED].includes(applicationStatus!) &&
          onStatusChange) {
        onStatusChange(ApplicationStatus.PENDING);
        showToast('success', 'Application Submitted', 'All required documents uploaded. Application is now pending review.');
      }
    };

    checkAllRequiredUploaded();
  }, [documents, applicationStatus, onStatusChange, showToast]);
  const loadExistingDocuments = async () => {
    if (!applicationId) return;
    
    try {
      setLoading(true);
      const documentUrls = await orphanMediaService.getAllDocumentUrls(applicationId);
      
      const updatedDocuments: DocumentUploadState = {};
      Object.entries(documentUrls).forEach(([type, url]) => {
        updatedDocuments[type as DocumentType] = {
          url,
          uploading: false,
          uploaded: true
        };
      });
      
      setDocuments(updatedDocuments);
    } catch (error) {
      console.error('Failed to load documents:', error);
      showToast('error', 'Load Failed', 'Failed to load existing documents');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (docType: DocumentType, file: File) => {
    setDocuments(prev => ({
      ...prev,
      [docType]: {
        ...prev[docType],
        file,
        uploading: false,
        uploaded: false
      }
    }));
    onFieldTouch?.(docType);
  };

  const handleUpload = async (docType: DocumentType) => {
    const docState = documents[docType];
    if (!docState?.file || !applicationId) return;

    try {
      setDocuments(prev => ({
        ...prev,
        [docType]: {
          ...prev[docType],
          uploading: true,
          uploaded: prev[docType]?.uploaded ?? false
        }
      }));

      await orphanMediaService.uploadDocument(applicationId, docState.file, docType);
      
      // Reload to get the new URL
      const url = await orphanMediaService.getDocumentUrl(applicationId, docType);
      
      setDocuments(prev => ({
        ...prev,
        [docType]: {
          ...prev[docType],
          url,
          uploading: false,
          uploaded: true
        }
      }));

      showToast('success', 'Upload Successful', `${documentLabels[docType]} uploaded successfully`);
    } catch (error) {
      console.error('Upload failed:', error);
      showToast('error', 'Upload Failed', `Failed to upload ${documentLabels[docType]}`);
      
      setDocuments(prev => ({
        ...prev,
        [docType]: {
          ...prev[docType],
          uploading: false,
          uploaded: prev[docType]?.uploaded ?? false,
          file: prev[docType]?.file,
          url: prev[docType]?.url
        }
      }));
    }
  };

  const handleUploadAll = async () => {
    const documentsToUpload = Object.entries(documents).filter(
      ([_, docState]) => docState?.file && !docState.uploaded
    );

    if (documentsToUpload.length === 0) {
      showToast('info', 'No Files', 'No files selected for upload');
      return;
    }

    setUploadProgress({
      total: documentsToUpload.length,
      completed: 0,
      uploading: true
    });

    try {
      for (let i = 0; i < documentsToUpload.length; i++) {
        const [docType, docState] = documentsToUpload[i];
        
        if (docState?.file && applicationId) {
          setDocuments(prev => ({
            ...prev,
            [docType]: {
              ...prev[docType],
              uploading: true,
              uploaded: prev[docType]?.uploaded ?? false
            }
          }));

          await orphanMediaService.uploadDocument(applicationId, docState.file, docType as DocumentType);
          
          const url = await orphanMediaService.getDocumentUrl(applicationId, docType as DocumentType);
          
          setDocuments(prev => ({
            ...prev,
            [docType]: {
              ...prev[docType],
              url,
              uploading: false,
              uploaded: true
            }
          }));

          setUploadProgress(prev => ({
            ...prev,
            completed: prev.completed + 1
          }));
        }
      }

      showToast('success', 'Upload Complete', 'All documents uploaded successfully');
    } catch (error) {
      console.error('Bulk upload failed:', error);
      showToast('error', 'Upload Failed', 'Some documents failed to upload');
    } finally {
      setUploadProgress({
        total: 0,
        completed: 0,
        uploading: false
      });
    }
  };
  const handleRemove = (docType: DocumentType) => {
    setDocuments(prev => ({
      ...prev,
      [docType]: {
        uploading: false,
        uploaded: false
      }
    }));
  };

  const getFieldError = (fieldName: string) => {
    return errors.find(error => error.field === fieldName)?.message;
  };

  const getUploadedCount = () => {
    return Object.values(documents).filter(doc => doc?.uploaded).length;
  };

  const getRequiredUploadedCount = () => {
    return requiredDocuments.filter(docType => documents[docType]?.uploaded).length;
  };

  const hasFilesToUpload = () => {
    return Object.values(documents).some(doc => doc?.file && !doc.uploaded);
  };
  const renderDocumentUpload = (docType: DocumentType) => {
    const docState = documents[docType];
    const isRequired = requiredDocuments.includes(docType);
    const hasError = getFieldError(docType);

    return (
      <div key={docType} className={`border rounded-lg p-4 ${hasError ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-600'}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-gray-500" />
            <h4 className="font-medium text-gray-900 dark:text-white">
              {documentLabels[docType]}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </h4>
          </div>
          
          {docState?.uploaded && (
            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Uploaded</span>
            </div>
          )}
        </div>

        {docState?.uploaded && docState.url ? (
          <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
            <span className="text-sm text-green-800 dark:text-green-200">
              Document uploaded successfully
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(docState.url, '_blank')}
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(docType)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <input
                type="file"
                id={`file-${docType}`}
                accept="image/*,.pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(docType, file);
                }}
                className="hidden"
              />
              <label
                htmlFor={`file-${docType}`}
                className="flex-1 flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md cursor-pointer hover:border-primary-500 dark:hover:border-secondary-500 transition-colors"
              >
                <Upload className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {docState?.file ? docState.file.name : 'Choose file or drag here'}
                </span>
              </label>
              
              {docState?.file && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleUpload(docType)}
                  loading={docState.uploading}
                  disabled={!applicationId}
                >
                  Upload
                </Button>
              )}
            </div>
            
            {!applicationId && (
              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                Save the application first to enable document uploads
              </p>
            )}
          </div>
        )}

        {hasError && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{hasError}</p>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-900 dark:border-secondary-500"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading documents...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
        <div className="flex items-center space-x-4 mb-8">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Required Documents
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Upload all required documents to complete your application
            </p>
          </div>
        </div>


          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Required: {getRequiredUploadedCount()}/{requiredDocuments.length} | 
              Total: {getUploadedCount()}/{Object.keys(DocumentType).length}
            </div>
            {hasFilesToUpload() && (
              <Button
                variant="primary"
                onClick={handleUploadAll}
                loading={uploadProgress.uploading}
                disabled={!applicationId}
              >
                Upload All Files
              </Button>
            )}
          </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.values(DocumentType).map(docType => renderDocumentUpload(docType))}
        </div>

        {/* Upload Progress Bar */}
        {uploadProgress.uploading && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-800 dark:text-blue-400">
                Uploading Documents...
              </span>
              <span className="text-sm text-blue-600 dark:text-blue-400">
                {uploadProgress.completed}/{uploadProgress.total}
              </span>
            </div>
            <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
              <div
                className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(uploadProgress.completed / uploadProgress.total) * 100}%`
                }}
              ></div>
            </div>
          </div>
        )}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-400 mb-1">
                Document Upload Guidelines
              </h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Accepted formats: JPG, PNG, PDF</li>
                <li>• Maximum file size: 5MB per document</li>
                <li>• Documents marked with * are required</li>
                <li>• Ensure documents are clear and readable</li>
                <li>• Application will automatically move to PENDING once all required documents are uploaded</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const validateDocuments = (applicationId?: string): ValidationError[] => {
  const errors: ValidationError[] = [];
  const tabName = 'Documents';

  // Only validate if we have an application ID (saved application)
  if (!applicationId) {
    errors.push({
      field: 'applicationId',
      message: 'Application must be saved before uploading documents',
      tab: tabName
    });
    return errors;
  }

  // Note: We can't validate uploaded documents here without making API calls
  // This validation would need to be done in the component or parent
  
  return errors;
};