import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../../ui/Button';
import { TabData } from '../../../types';

interface FormNavigationProps {
  tabs: TabData[];
  currentTabIndex: number;
  onPreviousTab: () => void;
  onNextTab: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export const FormNavigation: React.FC<FormNavigationProps> = ({
  tabs,
  currentTabIndex,
  onPreviousTab,
  onNextTab,
  canGoPrevious,
  canGoNext
}) => {
  return (
    <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 mb-6">
      <Button
        variant="outline"
        onClick={onPreviousTab}
        disabled={!canGoPrevious}
        className="flex items-center space-x-2"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Previous</span>
      </Button>

      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {currentTabIndex + 1} of {tabs.length}
        </span>
        <div className="flex space-x-1">
          {tabs.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentTabIndex
                  ? 'bg-primary-500'
                  : index < currentTabIndex
                  ? 'bg-green-500'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        onClick={onNextTab}
        disabled={!canGoNext}
        className="flex items-center space-x-2"
      >
        <span>Next</span>
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
};