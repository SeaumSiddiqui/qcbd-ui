import React from 'react';
import { FormikProps } from 'formik';
import { Home, Heart, User, Phone, Building2 } from 'lucide-react';
import { PhysicalCondition, ResidenceStatus, HouseType, OrphanApplication } from '../../types';

interface BasicInformationFormikProps {
  formik: FormikProps<OrphanApplication>;
}

// Phone number formatting utility
const formatPhoneNumber = (value: string): string => {
  // Remove all non-digit characters except the leading +
  const digitsOnly = value.replace(/[^\d]/g, '');

  // If starts with 880, keep it; otherwise add it
  let numbers = digitsOnly;
  if (!numbers.startsWith('880')) {
    numbers = '880' + numbers.replace(/^0+/, ''); // Remove leading zeros from local number
  }

  // Remove the 880 prefix for formatting
  const localNumber = numbers.slice(3);

  // Limit to 11 digits total (880 + 11 digits)
  if (localNumber.length > 11) {
    numbers = '880' + localNumber.slice(0, 11);
  }

  // Format as +88017-0602-0534
  const prefix = '+880';
  const formatted = numbers.slice(3); // Get digits after 880

  if (formatted.length <= 2) {
    return prefix + formatted;
  } else if (formatted.length <= 6) {
    return `${prefix}${formatted.slice(0, 2)}-${formatted.slice(2)}`;
  } else if (formatted.length <= 10) {
    return `${prefix}${formatted.slice(0, 2)}-${formatted.slice(2, 6)}-${formatted.slice(6)}`;
  } else {
    return `${prefix}${formatted.slice(0, 2)}-${formatted.slice(2, 6)}-${formatted.slice(6, 10)}`;
  }
};

const handlePhoneChange = (value: string, fieldName: string, formik: FormikProps<OrphanApplication>) => {
  // Don't allow deletion of +880 prefix
  if (!value.startsWith('+880')) {
    value = '+880' + value.replace(/^\+880/, '');
  }

  const formatted = formatPhoneNumber(value);
  formik.setFieldValue(fieldName, formatted);
};

// NID formatting utility
const formatNID = (value: string): string => {
  // Remove all non-digit characters
  const digitsOnly = value.replace(/\D/g, '');

  // Limit to 17 digits max
  const limitedDigits = digitsOnly.slice(0, 17);

  // Format based on length
  if (limitedDigits.length === 0) {
    return '';
  } else if (limitedDigits.length <= 10) {
    // Format as xxx-xxx-xxxx (3-3-4)
    if (limitedDigits.length <= 3) {
      return limitedDigits;
    } else if (limitedDigits.length <= 6) {
      return `${limitedDigits.slice(0, 3)}-${limitedDigits.slice(3)}`;
    } else {
      return `${limitedDigits.slice(0, 3)}-${limitedDigits.slice(3, 6)}-${limitedDigits.slice(6)}`;
    }
  } else if (limitedDigits.length === 13) {
    // Format as xxxx-xxx-xxx-xxx (4-3-3-3) for exactly 13 digits
    if (limitedDigits.length <= 4) {
      return limitedDigits;
    } else if (limitedDigits.length <= 7) {
      return `${limitedDigits.slice(0, 4)}-${limitedDigits.slice(4)}`;
    } else if (limitedDigits.length <= 10) {
      return `${limitedDigits.slice(0, 4)}-${limitedDigits.slice(4, 7)}-${limitedDigits.slice(7)}`;
    } else {
      return `${limitedDigits.slice(0, 4)}-${limitedDigits.slice(4, 7)}-${limitedDigits.slice(7, 10)}-${limitedDigits.slice(10)}`;
    }
  } else {
    // Format as xxxx-xx-x-xx-xx-xxxxxx (4-2-1-2-2-6) for 11-12 and 14-17 digits
    if (limitedDigits.length <= 4) {
      return limitedDigits;
    } else if (limitedDigits.length <= 6) {
      return `${limitedDigits.slice(0, 4)}-${limitedDigits.slice(4)}`;
    } else if (limitedDigits.length <= 7) {
      return `${limitedDigits.slice(0, 4)}-${limitedDigits.slice(4, 6)}-${limitedDigits.slice(6)}`;
    } else if (limitedDigits.length <= 9) {
      return `${limitedDigits.slice(0, 4)}-${limitedDigits.slice(4, 6)}-${limitedDigits.slice(6, 7)}-${limitedDigits.slice(7)}`;
    } else if (limitedDigits.length <= 11) {
      return `${limitedDigits.slice(0, 4)}-${limitedDigits.slice(4, 6)}-${limitedDigits.slice(6, 7)}-${limitedDigits.slice(7, 9)}-${limitedDigits.slice(9)}`;
    } else {
      return `${limitedDigits.slice(0, 4)}-${limitedDigits.slice(4, 6)}-${limitedDigits.slice(6, 7)}-${limitedDigits.slice(7, 9)}-${limitedDigits.slice(9, 11)}-${limitedDigits.slice(11)}`;
    }
  }
};

const handleNIDChange = (value: string, formik: FormikProps<OrphanApplication>) => {
  const formatted = formatNID(value);
  formik.setFieldValue('basicInformation.NID', formatted);
  formik.setFieldValue('basicInformation.nid', formatted);
};

export const BasicInformationFormik: React.FC<BasicInformationFormikProps> = ({ formik }) => {
  const hasCriticalIllness = formik.values.basicInformation?.hasCriticalIllness;

  // Initialize phone fields with +880 if empty
  React.useEffect(() => {
    if (!formik.values.basicInformation?.cell1) {
      formik.setFieldValue('basicInformation.cell1', '+880');
    }
    if (!formik.values.basicInformation?.cell2) {
      formik.setFieldValue('basicInformation.cell2', '+880');
    }
  }, []);

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
      {/* Physical Health Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <Heart className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">শারীরিক তথ্যাবলী</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">স্বাস্থ্য ও শারীরিক অবস্থার বিবরণ</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Physical Condition */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                শারীরিক অবস্থা <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="basicInformation.physicalCondition"
                  value={formik.values.basicInformation?.physicalCondition || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2.5 bg-white dark:bg-gray-900 border rounded-lg text-sm appearance-none cursor-pointer transition-colors ${
                    getFieldError('basicInformation.physicalCondition')
                      ? 'border-red-300 dark:border-red-700 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900/50 focus:border-red-500'
                      : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500'
                  }`}
                >
                  <option value="">নির্বাচন করুন</option>
                  <option value={PhysicalCondition.HEALTHY}>সুস্থ</option>
                  <option value={PhysicalCondition.SICK}>অসুস্থ</option>
                  <option value={PhysicalCondition.DISABLED}>প্রতিবন্ধী</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {getFieldError('basicInformation.physicalCondition') && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {getFieldError('basicInformation.physicalCondition')}
                </p>
              )}
            </div>

            {/* Critical Illness */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                গুরুতর অসুস্থতা আছে?
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => formik.setFieldValue('basicInformation.hasCriticalIllness', true)}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    hasCriticalIllness === true
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  হ্যাঁ
                </button>
                <button
                  type="button"
                  onClick={() => formik.setFieldValue('basicInformation.hasCriticalIllness', false)}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    hasCriticalIllness === false
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  না
                </button>
              </div>
            </div>
          </div>

          {/* Type of Illness (Conditional) */}
          {hasCriticalIllness && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                অসুস্থতার বিস্তারিত বর্ণনা
              </label>
              <textarea
                name="basicInformation.typeOfIllness"
                value={formik.values.basicInformation?.typeOfIllness || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows={3}
                className="w-full px-4 py-2.5 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors resize-none"
                placeholder="অসুস্থতার ধরন, কতদিন ধরে, চিকিৎসা চলছে কিনা ইত্যাদি বিস্তারিত লিখুন..."
              />
            </div>
          )}
        </div>
      </div>

      {/* Residence Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <Home className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">আবাসিক তথ্য</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">বাসস্থান ও বসবাসের অবস্থা</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Is Resident */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                আবাসিক?
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    formik.setFieldValue('basicInformation.isResident', true);
                    formik.setFieldValue('basicInformation.resident', true);
                    formik.setFieldValue('basicInformation.isIsResident', true);
                  }}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    (formik.values.basicInformation?.isResident === true || (formik.values.basicInformation as any)?.resident === true)
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  হ্যাঁ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    formik.setFieldValue('basicInformation.isResident', false);
                    formik.setFieldValue('basicInformation.resident', false);
                  }}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    (formik.values.basicInformation?.isResident === false || (formik.values.basicInformation as any)?.resident === false)
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  না
                </button>
              </div>
            </div>

            {/* Residence Status */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                আবাসিক অবস্থান
              </label>
              <div className="relative">
                <select
                  name="basicInformation.residenceStatus"
                  value={formik.values.basicInformation?.residenceStatus || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 appearance-none cursor-pointer transition-colors"
                >
                  <option value="">নির্বাচন করুন</option>
                  <option value={ResidenceStatus.OWN}>নিজ</option>
                  <option value={ResidenceStatus.RENTED}>ভাড়া</option>
                  <option value={ResidenceStatus.SHELTERED}>আশ্রয়প্রাপ্ত</option>
                  <option value={ResidenceStatus.HOMELESS}>গৃহহীন</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* House Type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                বাড়ির ধরন
              </label>
              <div className="relative">
                <select
                  name="basicInformation.houseType"
                  value={formik.values.basicInformation?.houseType || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 appearance-none cursor-pointer transition-colors"
                >
                  <option value="">নির্বাচন করুন</option>
                  <option value={HouseType.CONCRETE_HOUSE}>পাকা বাড়ি</option>
                  <option value={HouseType.SEMI_CONCRETE_HOUSE}>আধপাকা বাড়ি</option>
                  <option value={HouseType.MUD_HOUSE}>কাঁচা বাড়ি</option>
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

      {/* Household Details Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <Building2 className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">বাড়ির বিবরণ</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">ঘর ও সুবিধাসমূহের তথ্য</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Bedroom Count */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              ঘরের সংখ্যা
            </label>
            <input
              type="number"
              name="basicInformation.bedroom"
              value={formik.values.basicInformation?.bedroom || 0}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full md:w-48 px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors"
              placeholder="0"
              min="0"
            />
          </div>

          {/* Facilities - Label Inline with First 2 Items */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  বাড়ির সুবিধাসমূহ
                </label>
              </div>
              {[
                { key: 'balcony', label: 'বারান্দা' },
                { key: 'kitchen', label: 'রান্নাঘর' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => formik.setFieldValue(
                    `basicInformation.${key}`,
                    !formik.values.basicInformation?.[key as keyof typeof formik.values.basicInformation]
                  )}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    formik.values.basicInformation?.[key as keyof typeof formik.values.basicInformation]
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {label}
                  {formik.values.basicInformation?.[key as keyof typeof formik.values.basicInformation] && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { key: 'store', label: 'স্টোর রুম' },
                { key: 'hasTubeWell', label: 'টিউবয়েল' },
                { key: 'toilet', label: 'শৌচাগার' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => formik.setFieldValue(
                    `basicInformation.${key}`,
                    !formik.values.basicInformation?.[key as keyof typeof formik.values.basicInformation]
                  )}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    formik.values.basicInformation?.[key as keyof typeof formik.values.basicInformation]
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {label}
                  {formik.values.basicInformation?.[key as keyof typeof formik.values.basicInformation] && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Guardian Information Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <User className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">অভিভাবকের তথ্য</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">গার্ডিয়ানের পরিচয় ও যোগাযোগ</p>
            </div>
          </div>
        </div>


        <div className="p-6">

          {/* First Section - 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Guardian's Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                অভিভাবকের নাম
              </label>
              <input
                type="text"
                name="basicInformation.guardiansName"
                value={formik.values.basicInformation?.guardiansName || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm 
                focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors"
                placeholder="পূর্ণ নাম লিখুন"
              />
            </div>

            {/* Guardian's Relation */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                সম্পর্ক
              </label>
              <select
                name="basicInformation.guardiansRelation"
                value={formik.values.basicInformation?.guardiansRelation || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm 
                focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors"
              >
                <option value="">নির্বাচন করুন</option>
                <option value="মা">মা</option>
                <option value="ভাই/বোন">ভাই/বোন</option>
                <option value="দাদা/дাদী">দাদা/দাদী</option>
                <option value="নানা/নানী">নানা/নানী</option>
                <option value="চাচা/চাচী">চাচা/চাচী</option>
                <option value="ফুফা/ফুফু">ফুফা/ফুফু</option>
                <option value="খালা/খালু">খালা/খালু</option>
                <option value="মামা/মামী">মামা/মামী</option>
                <option value="প্রতিবেশী">প্রতিবেশী</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* NID */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                জাতীয় পরিচয়পত্র (NID)
              </label>
              <input
                type="text"
                name="basicInformation.NID"
                value={formik.values.basicInformation?.NID || (formik.values.basicInformation as any)?.nid || ''}
                onChange={(e) => handleNIDChange(e.target.value, formik)}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-2.5 bg-white dark:bg-gray-900 border rounded-lg text-sm focus:ring-2 transition-colors ${
                  getFieldError('basicInformation.NID')
                    ? 'border-red-300 dark:border-red-700 focus:ring-red-200 dark:focus:ring-red-900/50 focus:border-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500'
                }`}
                placeholder="xxx-xxx-xxxx or xxxx-xx-x-xx-xx-xxxxxx"
              />
              {getFieldError('basicInformation.NID') && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {getFieldError('basicInformation.NID')}
                </p>
              )}
            </div>

            {/* Primary Contact */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                যোগাযোগের নম্বর (primary)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="tel"
                  name="basicInformation.cell1"
                  value={formik.values.basicInformation?.cell1 || '+880'}
                  onChange={(e) => handlePhoneChange(e.target.value, 'basicInformation.cell1', formik)}
                  onBlur={formik.handleBlur}
                  onKeyDown={(e) => {
                    const input = e.currentTarget;
                    const value = input.value;
                    // Prevent deletion of +880 prefix
                    if ((e.key === 'Backspace' || e.key === 'Delete') && input.selectionStart !== null && input.selectionStart <= 4) {
                      e.preventDefault();
                    }
                  }}
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors"
                  placeholder="+88017-0602-0534"
                />
              </div>
            </div>

            {/* Optional Contact */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                যোগাযোগের নম্বর (optional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="tel"
                  name="basicInformation.cell2"
                  value={formik.values.basicInformation?.cell2 || '+880'}
                  onChange={(e) => handlePhoneChange(e.target.value, 'basicInformation.cell2', formik)}
                  onBlur={formik.handleBlur}
                  onKeyDown={(e) => {
                    const input = e.currentTarget;
                    const value = input.value;
                    // Prevent deletion of +880 prefix
                    if ((e.key === 'Backspace' || e.key === 'Delete') && input.selectionStart !== null && input.selectionStart <= 4) {
                      e.preventDefault();
                    }
                  }}
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors"
                  placeholder="+88017-0602-0534"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
