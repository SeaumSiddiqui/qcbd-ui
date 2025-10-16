import React from 'react';
import { FormikProps, FieldArray, useFormikContext } from 'formik';
import { Users, Plus, Trash2 } from 'lucide-react';
import { FormField } from '../ui/FormField';
import { FormSelect } from '../ui/FormSelect';
import { FormSection } from '../ui/FormSection';
import { Button } from '../ui/Button';
import { Gender, MaritalStatus, OrphanApplication, FamilyMember } from '../../types';

interface FamilyMembersFormikProps {
  formik: FormikProps<OrphanApplication>;
}

export const FamilyMembersFormik: React.FC<FamilyMembersFormikProps> = ({
  formik
}) => {
  const genderOptions = [
    { value: Gender.MALE, label: 'ছেলে' },
    { value: Gender.FEMALE, label: 'মেয়ে' },
  ];

  const maritalStatusOptions = [
    { value: MaritalStatus.UNMARRIED, label: 'অবিবাহিত' },
    { value: MaritalStatus.MARRIED, label: 'বিবাহিত' },
    { value: MaritalStatus.DIVORCED, label: 'তালাকপ্রাপ্ত' },
    { value: MaritalStatus.WIDOWED, label: 'বিধবা' },
  ];

  const familyMembers = formik.values.familyMembers || [];
  const numOfSiblings = formik.values.primaryInformation?.numOfSiblings || 0;

  // Update numOfSiblings when family members array changes
  const updateSiblingsCount = (newCount: number) => {
    formik.setFieldValue('primaryInformation.numOfSiblings', newCount);
  };

  const createEmptyFamilyMember = (): FamilyMember => ({
    name: '',
    age: 0,
    siblingsGrade: 0,
    occupation: '',
    siblingsGender: Gender.MALE,
    maritalStatus: MaritalStatus.UNMARRIED,
  });

  return (
    <div className="space-y-6">
      <FormSection
        title="ভাইবোন এর বিবরণী"
        description={`(${familyMembers.length} of ${numOfSiblings} siblings)`}
        icon={Users}
        gradient="from-primary-500 to-primary-600"
      >
        <FieldArray name="familyMembers">
          {({ push, remove }) => (
            <>
              <div className="flex items-center justify-between mb-6">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Family Members: {familyMembers.length} / {numOfSiblings}
                </div>
                <Button
                  type="button"
                  onClick={() => {
                    push(createEmptyFamilyMember());
                    updateSiblingsCount(familyMembers.length + 1);
                  }}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </div>

              {familyMembers.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>
                    {numOfSiblings === 0 
                      ? 'No siblings specified' 
                      : 'No family members added yet'
                    }
                  </p>
                  <p className="text-sm mt-2">
                    {numOfSiblings === 0 
                      ? 'Set number of siblings in Primary Information first' 
                      : 'Click "Add Member" to add family members'
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {familyMembers.map((_, index) => (
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
                          onClick={() => {
                            remove(index);
                            updateSiblingsCount(familyMembers.length - 1);
                          }}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <FormField
                          name={`familyMembers.${index}.name`}
                          label="নাম"
                          placeholder="Enter name"
                        />

                        <FormField
                          name={`familyMembers.${index}.age`}
                          label="বয়স"
                          type="number"
                          placeholder="Enter age"
                          min={0}
                        />

                        <FormSelect
                          name={`familyMembers.${index}.siblingsGender`}
                          label="লিঙ্গ"
                          options={genderOptions}
                          placeholder="Select gender"
                        />

                        <FormField
                          name={`familyMembers.${index}.siblingsGrade`}
                          label="শ্রেণী"
                          type="number"
                          placeholder="Enter grade"
                          min={0}
                        />

                        <FormField
                          name={`familyMembers.${index}.occupation`}
                          label="পেশা"
                          placeholder="Enter occupation"
                        />

                        <FormSelect
                          name={`familyMembers.${index}.maritalStatus`}
                          label="বৈবাহিক অবস্থা"
                          options={maritalStatusOptions}
                          placeholder="Select status"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </FieldArray>
      </FormSection>
    </div>
  );
};