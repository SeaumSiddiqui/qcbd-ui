import React from 'react';
import { FormikProps } from 'formik';
import { User, Calendar, Heart, GraduationCap, Users, DollarSign } from 'lucide-react';
import { Gender, MothersStatus, OrphanApplication } from '../../types';
import { UserProfile } from '../../types';

interface PrimaryInformationFormikProps {
  formik: FormikProps<OrphanApplication>;
  userProfile?: UserProfile | null;
  isEditing?: boolean;
}

export const PrimaryInformationFormik: React.FC<PrimaryInformationFormikProps> = ({
  formik,
  userProfile,
  isEditing = false
}) => {
  const handleSiblingsChange = (count: number) => {
    formik.setFieldValue('primaryInformation.numOfSiblings', count);

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

  const getFieldError = (fieldName: string) => {
    const keys = fieldName.split('.');
    let error: any = formik.errors;
    let touched: any = formik.touched;

    for (const key of keys) {
      error = error?.[key];
      touched = touched?.[key];
    }

    return touched && error ? error : null;
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <User className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">প্রাথমিক তথ্য</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">এতিমের জন্মনিবন্ধন সদৃশ তথ্য প্রদান করুন</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                সম্পূর্ণ নাম <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="primaryInformation.fullName"
                value={formik.values.primaryInformation?.fullName || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors"
                placeholder="Enter full name"
              />
              {getFieldError('primaryInformation.fullName') && (
                <p className="text-xs text-red-600 dark:text-red-400">{getFieldError('primaryInformation.fullName')}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                জন্মতারিখ <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="primaryInformation.dateOfBirth"
                value={formik.values.primaryInformation?.dateOfBirth || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors"
              />
              {getFieldError('primaryInformation.dateOfBirth') && (
                <p className="text-xs text-red-600 dark:text-red-400">{getFieldError('primaryInformation.dateOfBirth')}</p>
              )}
            </div>

            {/* BC Registration */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                জন্মনিবন্ধন নম্বর <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="primaryInformation.bcRegistration"
                value={formik.values.primaryInformation?.bcRegistration || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                readOnly={isEditing || !!userProfile}
                className={`w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors ${
                  (isEditing || userProfile) ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : 'bg-white dark:bg-gray-900'
                }`}
                placeholder="Enter BC registration number"
              />
              {(isEditing || userProfile) && (
                <p className="text-xs text-gray-500 dark:text-gray-400">BC Registration cannot be modified after creation.</p>
              )}
              {getFieldError('primaryInformation.bcRegistration') && (
                <p className="text-xs text-red-600 dark:text-red-400">{getFieldError('primaryInformation.bcRegistration')}</p>
              )}
            </div>

            {/* Age */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                বয়স <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="primaryInformation.age"
                value={formik.values.primaryInformation?.age || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                min={0}
                max={18}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors"
                placeholder="Enter age"
              />
              {getFieldError('primaryInformation.age') && (
                <p className="text-xs text-red-600 dark:text-red-400">{getFieldError('primaryInformation.age')}</p>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                লিঙ্গ <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="primaryInformation.gender"
                  value={formik.values.primaryInformation?.gender || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 appearance-none cursor-pointer transition-colors"
                >
                  <option value="">নির্বাচন করুন</option>
                  <option value={Gender.MALE}>ছেলে</option>
                  <option value={Gender.FEMALE}>মেয়ে</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {getFieldError('primaryInformation.gender') && (
                <p className="text-xs text-red-600 dark:text-red-400">{getFieldError('primaryInformation.gender')}</p>
              )}
            </div>

            {/* Place of Birth */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                জন্মস্থান
              </label>
              <input
                type="text"
                name="primaryInformation.placeOfBirth"
                value={formik.values.primaryInformation?.placeOfBirth || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors"
                placeholder="Enter place of birth"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Parents Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <Heart className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">পিতা-মাতার তথ্য</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">পিতা-মাতার জাতীয়তা পরিচয়পত্র সদৃশ তথ্য প্রদান করুন</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Father Information - 3 columns inline */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              পিতার তথ্যাবলি
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  পিতার নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="primaryInformation.fathersName"
                  value={formik.values.primaryInformation?.fathersName || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors"
                  placeholder="Enter father's name"
                />
                {getFieldError('primaryInformation.fathersName') && (
                  <p className="text-xs text-red-600 dark:text-red-400">{getFieldError('primaryInformation.fathersName')}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  মৃত্যু তারিখ
                </label>
                <input
                  type="date"
                  name="primaryInformation.dateOfDeath"
                  value={formik.values.primaryInformation?.dateOfDeath || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  মৃত্যুর কারণ
                </label>
                <input
                  type="text"
                  name="primaryInformation.causeOfDeath"
                  value={formik.values.primaryInformation?.causeOfDeath || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors"
                  placeholder="Describe the cause of death"
                />
              </div>
            </div>
          </div>

          {/* Mother Information - 3 columns inline */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              মাতার তথ্যাবলি
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  মাতার নাম
                </label>
                <input
                  type="text"
                  name="primaryInformation.mothersName"
                  value={formik.values.primaryInformation?.mothersName || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors"
                  placeholder="Enter mother's name"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  মাতার পেশা
                </label>
                <input
                  type="text"
                  name="primaryInformation.mothersOccupation"
                  value={formik.values.primaryInformation?.mothersOccupation || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors"
                  placeholder="Enter mother's occupation"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  মাতার অবস্থা
                </label>
                <div className="relative">
                  <select
                    name="primaryInformation.mothersStatus"
                    value={formik.values.primaryInformation?.mothersStatus || ''}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 appearance-none cursor-pointer transition-colors"
                  >
                    <option value="">নির্বাচন করুন</option>
                    <option value={MothersStatus.WIDOWED}>বিধবা</option>
                    <option value={MothersStatus.REMARRIED}>পুনর্বিবাহিত</option>
                    <option value={MothersStatus.DEAD}>মৃত</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial & Family Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <DollarSign className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">অর্থনৈতিক ও পারিবারিক তথ্য</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">পরিবারের আর্থিক অবস্থা ও সদস্যদের তথ্য প্রদান করুন</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Annual Income */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                বার্ষিক আয়
              </label>
              <input
                type="text"
                name="primaryInformation.annualIncome"
                value={formik.values.primaryInformation?.annualIncome || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors"
                placeholder="Enter annual income"
              />
            </div>

            {/* Number of Siblings */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                ভাইবোনের সংখ্যা
              </label>
              <input
                type="number"
                value={formik.values.primaryInformation?.numOfSiblings || 0}
                onChange={(e) => handleSiblingsChange(parseInt(e.target.value) || 0)}
                min={0}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors"
                placeholder="Enter number of siblings"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                This will automatically add/remove rows in the Family Members section
              </p>
            </div>

            {/* Fixed Assets - Full Width in Second Row */}
            <div className="space-y-2 md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                স্থাবর সম্পত্তি
              </label>
              <textarea
                name="primaryInformation.fixedAssets"
                value={formik.values.primaryInformation?.fixedAssets || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows={3}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors resize-none"
                placeholder="Describe fixed assets"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Education Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <GraduationCap className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">শিক্ষাগত তথ্য</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">এতিমের বর্তমান শিক্ষাগত তথ্য প্রদান করুন</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Academic Institution - 2 columns */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                শিক্ষা প্রতিষ্ঠান
              </label>
              <input
                type="text"
                name="primaryInformation.academicInstitution"
                value={formik.values.primaryInformation?.academicInstitution || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors"
                placeholder="Enter school/institution name"
              />
            </div>

            {/* Grade - 1 column */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                শ্রেণী
              </label>
              <input
                type="number"
                name="primaryInformation.grade"
                value={formik.values.primaryInformation?.grade || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                min={0}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors"
                placeholder="Enter current grade/class"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
