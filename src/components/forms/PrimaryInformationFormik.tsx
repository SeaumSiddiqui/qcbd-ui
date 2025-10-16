import React from 'react';
import { FormikProps } from 'formik';
import { User, Calendar, Heart, GraduationCap, Users } from 'lucide-react';
import { FormField } from '../ui/FormField';
import { FormSelect } from '../ui/FormSelect';
import { FormSection } from '../ui/FormSection';
import { Gender, MothersStatus, OrphanApplication } from '../../types';
import { UserProfile } from '../../types';

interface PrimaryInformationFormikProps {
  formik: FormikProps<OrphanApplication>;
  userProfile?: UserProfile | null;
}

export const PrimaryInformationFormik: React.FC<PrimaryInformationFormikProps> = ({
  formik,
  userProfile
}) => {
  const genderOptions = [
    { value: Gender.MALE, label: 'Male' },
    { value: Gender.FEMALE, label: 'Female' },
  ];

  const mothersStatusOptions = [
    { value: MothersStatus.WIDOWED, label: 'Widowed' },
    { value: MothersStatus.REMARRIED, label: 'Remarried' },
    { value: MothersStatus.DEAD, label: 'Dead' },
  ];

  const handleSiblingsChange = (count: number) => {
    formik.setFieldValue('primaryInformation.numOfSiblings', count);
    
    // Update family members array to match siblings count
    const currentMembers = formik.values.familyMembers || [];
    let updatedMembers = [...currentMembers];

    if (count > currentMembers.length) {
      // Add new family members
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
      // Remove excess family members from the end
      updatedMembers = updatedMembers.slice(0, count);
    }

    formik.setFieldValue('familyMembers', updatedMembers);
  };

  return (
    <div className="space-y-8">
      {/* Basic Information */}
      <FormSection
        title="প্রাথমিক তথ্য"
        description="এতিমের জন্মনিবন্ধন সদৃশ তথ্য প্রদান করুন"
        icon={User}
        gradient="from-primary-500 to-primary-600"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            name="primaryInformation.fullName"
            label="সম্পূর্ণ নাম"
            placeholder="Enter full name"
            required
          />

          <FormField
            name="primaryInformation.dateOfBirth"
            label="জন্মতারিখ"
            type="date"
            required
          />

          <FormField
            name="primaryInformation.bcRegistration"
            label="জন্মনিবন্ধন নম্বর"
            placeholder="Enter BC registration number"
            required
            readOnly
            autoFilled={!!userProfile}
            helpText="BC Registration cannot be modified after creation."
          />

          <FormField
            name="primaryInformation.age"
            label="বয়স"
            type="number"
            placeholder="Enter age"
            min={0}
            max={18}
            required
          />

          <FormSelect
            name="primaryInformation.gender"
            label="লিঙ্গ"
            options={genderOptions}
            placeholder="Select gender"
            required
          />


          <FormField
            name="primaryInformation.placeOfBirth"
            label="জন্মস্থান"
            placeholder="Enter place of birth"
          />
        </div>
      </FormSection>

      {/* Parents Information */}
      <FormSection
        title="পিতা-মাতার তথ্য"
        description="পিতা-মাতার জাতীয়তা পরিচয়পত্র সদৃশ তথ্য প্রদান করুন"
        icon={Heart}
        gradient="from-pink-500 to-rose-500"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Father Information */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              পিতার তথ্যাবলি
            </h4>
            
            <FormField
              name="primaryInformation.fathersName"
              label="পিতার নাম"
              placeholder="Enter father's name"
              required
            />

            <FormField
              name="primaryInformation.dateOfDeath"
              label="মৃত্যু তারিখ"
              type="date"
            />

            <FormField
              name="primaryInformation.causeOfDeath"
              label="মৃত্যুর কারণ"
              placeholder="Describe the cause of death"
            />
          </div>

          {/* Mother Information */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
              মাতার তথ্যাবলি
            </h4>
            
            <FormField
              name="primaryInformation.mothersName"
              label="মাতার নাম"
              placeholder="Enter mother's name"
            />

            <FormSelect
              name="primaryInformation.mothersStatus"
              label="মাতার অবস্থা"
              options={mothersStatusOptions}
              placeholder="Select status"
            />

            <FormField
              name="primaryInformation.mothersOccupation"
              label="মাতার পেশা"
              placeholder="Enter mother's occupation"
            />
          </div>
        </div>
      </FormSection>

      {/* Financial & Family Information */}
      <FormSection
        title="অর্থনৈতিক ও পারিবারিক তথ্য"
        description="পরিবারের আর্থিক অবস্থা ও সদস্যদের তথ্য প্রদান করুন"
        icon={Users}
        gradient="from-emerald-500 to-teal-500"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            name="primaryInformation.fixedAssets"
            label="স্থাবর সম্পত্তি"
            type="textarea"
            placeholder="Describe fixed assets"
            rows={3}
          />

          <FormField
            name="primaryInformation.annualIncome"
            label="বার্ষিক আয়"
            placeholder="Enter annual income"
          />

          <div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                ভাইবোনের সংখ্যা
              </label>
              <input
                type="number"
                value={formik.values.primaryInformation?.numOfSiblings || 0}
                onChange={(e) => handleSiblingsChange(parseInt(e.target.value) || 0)}
                min={0}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg transition-all duration-200 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-0 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter number of siblings"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                This will automatically add/remove rows in the Family Members section
              </p>
            </div>
          </div>
        </div>
      </FormSection>

      {/* Education Information */}
      <FormSection
        title="শিক্ষাগত তথ্য"
        description="এতিমের বর্তমান শিক্ষাগত তথ্য প্রদান করুন"
        icon={GraduationCap}
        gradient="from-purple-500 to-indigo-500"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            name="primaryInformation.academicInstitution"
            label="শিক্ষা প্রতিষ্ঠান"
            placeholder="Enter school/institution name"
          />

          <FormField
            name="primaryInformation.grade"
            label="শ্রেণী"
            type="number"
            placeholder="Enter current grade/class"
            min={0}
          />
        </div>
      </FormSection>
    </div>
  );
};