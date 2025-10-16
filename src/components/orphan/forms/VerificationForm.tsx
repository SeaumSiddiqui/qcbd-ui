import React, { useState } from 'react';
import { FileText, CheckCircle, User, Shield, Eye, Award } from 'lucide-react';
import { Verification, ValidationError } from '../../../types';
import { useAuth } from '../../../hooks/useAuth';

interface VerificationFormProps {
  data: Verification;
  onChange: (data: Verification) => void;
  onFieldTouch?: (fieldName: string) => void;
  errors: ValidationError[];
}


export const VerificationForm: React.FC<VerificationFormProps> = ({
  data,
  onChange,
  onFieldTouch,
  errors
}) => {
  const { user } = useAuth();

  const getFieldError = (fieldName: string) => {
    return errors.find(error => error.field === fieldName)?.message;
  };

  const signatureSections = [
    {
      key: 'agentUserId',
      title: 'Agent Signature',
      description: 'Automatically captured when application is created by an agent',
      color: 'from-blue-500 to-indigo-500',
      icon: User,
      status: data?.agentUserId ? 'incompleted' : 'pending'
    },
    {
      key: 'authenticatorUserId',
      title: 'Authenticator Signature',
      description: 'Automatically captured when application status changes to Accepted/Rejected',
      color: 'from-green-500 to-teal-500',
      icon: Shield,
      status: data?.authenticatorUserId ? 'incompleted' : 'pending'
    },
    {
      key: 'investigatorUserId',
      title: 'Investigator Signature',
      description: 'Automatically captured when application status changes to Granted',
      color: 'from-purple-500 to-indigo-500',
      icon: Eye,
      status: data?.investigatorUserId ? 'incompleted' : 'pending'
    },
    {
      key: 'qcSwdUserId',
      title: 'QC SWD Signature',
      description: 'Final signature from Qatar Charity Social Welfare Department',
      color: 'from-orange-500 to-red-500',
      icon: Award,
      status: data?.qcSwdUserId ? 'incompleted' : 'pending'
    }
  ] as const;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 dark:from-indigo-600 dark:to-purple-600 rounded-xl shadow-lg">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Verification & Signatures
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Digital signatures are automatically captured based on user actions and status changes
            </p>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-400 mb-1">
                Automatic Signature Capture
              </h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Agent signature is captured when the application is created</li>
                <li>• Authenticator signature is captured when status changes to Accepted/Rejected</li>
                <li>• Investigator signature is captured when status changes to Granted</li>
                <li>• All signatures are fetched from user profiles automatically</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Signature Sections */}
      {signatureSections.map((section) => {
        const IconComponent = section.icon;
        const hasSignature = data?.[section.key as keyof Verification];
        const isIncompleted = section.status === 'incompleted';

        return (
          <div key={section.key} className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
            <div className="flex items-center space-x-4 mb-6">
              <div className={`flex items-center justify-center w-12 h-12 bg-gradient-to-br ${section.color} dark:${section.color} rounded-xl shadow-lg`}>
                <IconComponent className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                  {section.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {section.description}
                </p>
              </div>
              {isIncompleted && (
                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">Captured</span>
                </div>
              )}
            </div>

            {isIncompleted ? (
              // Show captured signature info
              <div className="border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Signature captured automatically
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Captured from user profile
                      </p>
                    </div>
                  </div>
                  {hasSignature && (
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => window.open(hasSignature as string, '_blank')}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors duration-200"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Show pending status
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <IconComponent className="h-6 w-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      {section.title} Pending
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Will be captured automatically based on workflow
                    </p>
                  </div>
                </div>
              </div>
            )}

            {getFieldError(section.key) && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {getFieldError(section.key)}
              </p>
            )}
          </div>
        );
      })}

      {/* Completion Status */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Verification Progress
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Track the completion of signature collection
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-600 dark:text-secondary-500">
              {Object.values(data || {}).filter(url => url && url.trim()).length}/4
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Signatures Collected
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Progress</span>
            <span>{Math.round((Object.values(data).filter(url => url && url.trim()).length / 4) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(Object.values(data || {}).filter(url => url && url.trim()).length / 4) * 100}%`
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const validateVerification = (data: Verification): ValidationError[] => {
  const errors: ValidationError[] = [];
  const tabName = 'Verification';

  // For now, we'll make signatures optional since they're typically added by staff
  // You can uncomment these if you want to make them required:
  
  // if (!data.agentSignatureUrl?.trim()) {
  //   errors.push({
  //     field: 'agentSignatureUrl',
  //     message: 'Agent signature is required',
  //     tab: tabName
  //   });
  // }

  return errors;
};