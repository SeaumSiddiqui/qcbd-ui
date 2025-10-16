import React, { useEffect } from 'react';
import { Users, Plus, Trash2 } from 'lucide-react';
import { FamilyMember, Gender, MaritalStatus, ValidationError } from '../../../types';
import { Button } from '../../ui/Button';

interface FamilyMembersFormProps {
  data: FamilyMember[];
  onChange: (data: FamilyMember[]) => void;
  onCountChange: (count: number) => void;
  errors: ValidationError[];
  numOfSiblings: number;
}

export const FamilyMembersForm: React.FC<FamilyMembersFormProps> = ({
  data,
  onChange,
  onCountChange,
  errors,
  numOfSiblings
}) => {
  // Sync family members array with numOfSiblings value
  useEffect(() => {
    const currentLength = data.length;
    
    if (numOfSiblings > currentLength) {
      // Add new family members
      const newMembers: FamilyMember[] = [];
      for (let i = currentLength; i < numOfSiblings; i++) {
        newMembers.push({
          name: '',
          age: 0,
          siblingsGrade: 0,
          occupation: '',
          siblingsGender: Gender.MALE,
          maritalStatus: MaritalStatus.SINGLE,
        });
      }
      onChange([...data, ...newMembers]);
    } else if (numOfSiblings < currentLength) {
      // Remove excess family members
      onChange(data.slice(0, numOfSiblings));
    }
  }, [numOfSiblings, data, onChange]);

  const getFieldError = (fieldName: string, index?: number) => {
    const errorKey = index !== undefined ? `${fieldName}_${index}` : fieldName;
    return errors.find(error => error.field === errorKey)?.message;
  };

  const addFamilyMember = () => {
    const newMember: FamilyMember = {
      name: '',
      age: 0,
      siblingsGrade: 0,
      occupation: '',
      siblingsGender: Gender.MALE,
      maritalStatus: MaritalStatus.SINGLE,
    };
    const updatedData = [...data, newMember];
    onChange(updatedData);
    // Update the numOfSiblings field in primary information
    onCountChange(updatedData.length);
  };

  const removeFamilyMember = (index: number) => {
    const updatedData = data.filter((_, i) => i !== index); // Remove specific index
    onChange(updatedData);
    onCountChange(updatedData.length);
  };

  const updateFamilyMember = (index: number, field: keyof FamilyMember, value: any) => {
    const updatedData = data.map((member, i) => 
      i === index ? { ...member, [field]: value } : member
    );
    onChange(updatedData);
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-100 dark:bg-secondary-900/30 rounded-lg">
              <Users className="h-5 w-5 text-primary-900 dark:text-secondary-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                ভাইবোন এর বিবরণী
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ({data.length} of {numOfSiblings} siblings)
              </p>
            </div>
          </div>

          <Button
            type="button"
            onClick={addFamilyMember}
            variant="outline"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            <span>Add Member</span>
          </Button>
        </div>
        
        {data.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>{numOfSiblings === 0 ? 'No siblings specified' : 'No family members added yet'}</p>
            <p className="text-sm mt-2">
              {numOfSiblings === 0 ? 'Set number of siblings in Primary Information first' : 'Click "Add Member" to add family members'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {data.map((member, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 relative"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white">
                    ভাই/বোন - {index + 1}
                  </h4>
                  <Button
                    type="button"
                    onClick={() => removeFamilyMember(index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      নাম
                    </label>
                    <input
                      type="text"
                      value={member.name || ''}
                      onChange={(e) => updateFamilyMember(index, 'name', e.target.value)}
                      className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 ${
                        getFieldError('name', index) ? 'border-red-400 dark:border-red-500' : ''
                      }`}
                      placeholder="Enter name"
                    />
                    {getFieldError('name', index) && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">{getFieldError('name', index)}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      বয়স
                    </label>
                    <input
                      type="number"
                      value={member.age || ''}
                      onChange={(e) => updateFamilyMember(index, 'age', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter age"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      লিঙ্গ
                    </label>
                    <select
                      value={member.siblingsGender || ''}
                      onChange={(e) => updateFamilyMember(index, 'siblingsGender', e.target.value as Gender)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select gender</option>
                      <option value={Gender.MALE}>ছেলে</option>
                      <option value={Gender.FEMALE}>মেয়ে</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      শ্রেণী
                    </label>
                    <input
                      type="number"
                      value={member.siblingsGrade || ''}
                      onChange={(e) => updateFamilyMember(index, 'siblingsGrade', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter grade"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      পেশা
                    </label>
                    <input
                      type="text"
                      value={member.occupation || ''}
                      onChange={(e) => updateFamilyMember(index, 'occupation', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter occupation"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      বৈবাহিক অবস্থা
                    </label>
                    <select
                      value={member.maritalStatus || ''}
                      onChange={(e) => updateFamilyMember(index, 'maritalStatus', e.target.value as MaritalStatus)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select status</option>
                      <option value={MaritalStatus.SINGLE}>অবিবাহিত</option>
                      <option value={MaritalStatus.MARRIED}>বিবাহিত</option>
                      <option value={MaritalStatus.DIVORCED}>তালাকপ্রাপ্ত</option>
                      <option value={MaritalStatus.WIDOWED}>বিধবা</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const validateFamilyMembers = (data: FamilyMember[]): ValidationError[] => {
  const errors: ValidationError[] = [];
  const tabName = 'Family Members';

  // No specific validation required for family members as they are optional
  // But we can add validation if needed in the future

  return errors;
};