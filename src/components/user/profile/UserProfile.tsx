import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { PersonalInfo } from './PersonalInfo';
import { BankInfo } from './BankInfo';
import { ProgramsList } from './ProgramsList';
import { Button } from '../../ui/Button';
import { useUserProfile } from '../../../hooks/useUserProfile';

interface UserProfileProps {
  userId: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const { data: profile, loading, error, refetch } = useUserProfile(userId);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto h-8 w-8 text-primary-900 dark:text-secondary-500 animate-spin mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Error Loading Profile
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error}
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            <p>Troubleshooting tips:</p>
            <ul className="text-left mt-2 space-y-1">
              <li>• Make sure your backend server is running</li>
              <li>• Check if the API endpoint is accessible</li>
              <li>• Verify your authentication token is valid</li>
            </ul>
          </div>
          <Button onClick={refetch} variant="primary">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {profile.username}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your profile and track your charity program enrollment
            </p>
          </div>

          {/* Profile Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <PersonalInfo profile={profile} />
              <BankInfo profile={profile} />
            </div>
            
            <div>
              <ProgramsList programs={profile.programs || []} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};