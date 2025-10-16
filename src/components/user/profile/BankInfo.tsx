import React from 'react';
import { Banknote, Building2, Hash, MapPin } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../ui/Card';
import { UserProfile } from '../../../types';

interface BankInfoProps {
  profile: UserProfile;
}

export const BankInfo: React.FC<BankInfoProps> = ({ profile }) => {
  const bankDetails = [
    {
      icon: Building2,
      label: 'Bank Name',
      value: profile.bankTitle,
    },
    {
      icon: Banknote,
      label: 'Account Title',
      value: profile.accountTitle,
    },
    {
      icon: Hash,
      label: 'Account Number',
      value: profile.accountNumber,
    },
    {
      icon: MapPin,
      label: 'Branch',
      value: profile.branch,
    },
    {
      icon: Hash,
      label: 'Routing Number',
      value: profile.routingNumber,
    },
  ];

  const hasAnyBankInfo = bankDetails.some(detail => detail.value);

  if (!hasAnyBankInfo) {
    return (
      <Card className="animate-slide-up">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-secondary-100 dark:bg-primary-900/30 rounded-lg">
              <Banknote className="h-5 w-5 text-secondary-500 dark:text-primary-900" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Banking Information
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your payment and banking details
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="text-center py-8">
            <Banknote className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No banking information provided</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Contact support to add your banking details
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg">
            <Banknote className="h-5 w-5 text-secondary-500 dark:text-secondary-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Banking Information
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your payment and banking details
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bankDetails.map((detail, index) => {
            const Icon = detail.icon;
            return (
              <div key={index} className="flex items-center space-x-3">
                <Icon className="h-5 w-5 text-gray-400" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {detail.label}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 truncate">
                    {detail.value || 'Not provided'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};