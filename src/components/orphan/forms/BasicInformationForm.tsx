import React from 'react';
import { Home, Heart, User, Phone, CreditCard, Building } from 'lucide-react';
import { BasicInformation, PhysicalCondition, ResidenceStatus, HouseType, ValidationError } from '../../../types';
import { validateRequired } from '../../../utils/validation';

interface BasicInformationFormProps {
  data: BasicInformation;
  onChange: (data: BasicInformation) => void;
  onFieldTouch?: (fieldName: string) => void;
  errors: ValidationError[];
}

export const BasicInformationForm: React.FC<BasicInformationFormProps> = ({
  data,
  onChange,
  onFieldTouch,
  errors
}) => {
  const getFieldError = (fieldName: string) => {
    return errors.find(error => error.field === fieldName)?.message;
  };

  const handleChange = (field: keyof BasicInformation, value: any) => {
    onFieldTouch?.(field);
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <div className="space-y-8">
      {/* Physical Condition */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
        <div className="flex items-center space-x-4 mb-8">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 dark:from-red-600 dark:to-pink-600 rounded-xl shadow-lg">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              শারীরিক তথ্যাবলী
            </h3>
            <p className="text-gray-600 text-sm dark:text-gray-400">
              শারীরিক অবস্থান এবং স্বাস্থ্য সংক্রান্ত তথ্য
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              শারীরিক অবস্থা
            </label>
            <select
              name="physicalCondition"
              value={data.physicalCondition || ''}
              onChange={(e) => handleChange('physicalCondition', e.target.value as PhysicalCondition)}
              className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 ${
                getFieldError('physicalCondition') ? 'border-red-400 dark:border-red-500' : ''
              }`}
              onBlur={() => onFieldTouch?.('physicalCondition')}
            >
              <option value="">Select condition</option>
              <option value={PhysicalCondition.HEALTHY}>সুস্থ</option>
              <option value={PhysicalCondition.SICK}>অসুস্থ</option>
              <option value={PhysicalCondition.DISABLED}>প্রতিবন্ধী</option>
            </select>
            {getFieldError('physicalCondition') && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{getFieldError('physicalCondition')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              গুরুতর অসুস্থতা আছে?
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="hasCriticalIllness"
                  checked={data.hasCriticalIllness === true}
                  onChange={() => handleChange('hasCriticalIllness', true)}
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">হ্যাঁ</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="hasCriticalIllness"
                  checked={data.hasCriticalIllness === false}
                  onChange={() => handleChange('hasCriticalIllness', false)}
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">না</span>
              </label>
            </div>
          </div>

          {data.hasCriticalIllness && (
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                অসুস্থতার প্রকার
              </label>
              <textarea
                name="typeOfIllness"
                value={data.typeOfIllness || ''}
                onChange={(e) => handleChange('typeOfIllness', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Describe the type of illness"
              />
            </div>
          )}
        </div>
      </div>

      {/* Residence Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
        <div className="flex items-center space-x-4 mb-8">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 dark:from-blue-600 dark:to-indigo-600 rounded-xl shadow-lg">
            <Home className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              আবাসিক তথ্য
            </h3>
            <p className="text-gray-600 text-sm dark:text-gray-400">
              বাসস্থান সম্পর্কিত তথ্যাবলী
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              আবাসিক?
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="isResident"
                  checked={data.isResident === true}
                  onChange={() => handleChange('isResident', true)}
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Yes</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="isResident"
                  checked={data.isResident === false}
                  onChange={() => handleChange('isResident', false)}
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">No</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              আবাসিক অবস্থান
            </label>
            <select
              name="residenceStatus"
              value={data.residenceStatus || ''}
              onChange={(e) => handleChange('residenceStatus', e.target.value as ResidenceStatus)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select status</option>
              <option value={ResidenceStatus.OWN}>নিজ</option>
              <option value={ResidenceStatus.RENTED}>ভাড়া</option>
              <option value={ResidenceStatus.SHELTERED}>আশ্রয়প্রাপ্ত</option>
              <option value={ResidenceStatus.HOMELESS}>গৃহহীন</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              বাড়ির ধরন
            </label>
            <select
              name="houseType"
              value={data.houseType || ''}
              onChange={(e) => handleChange('houseType', e.target.value as HouseType)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select type</option>
              <option value={HouseType.CONCRETE_HOUSE}>পাকা বাড়ি</option>
              <option value={HouseType.SEMI_CONCRETE_HOUSE}>আধপাকা বাড়ি</option>
              <option value={HouseType.MUD_HOUSE}>কাঁচা বাড়ি</option>
            </select>
          </div>
        </div>
      </div>

      {/* Household Details */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
        <div className="flex items-center space-x-4 mb-8">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 dark:from-green-600 dark:to-teal-600 rounded-xl shadow-lg">
            <Building className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              বাড়ির বিবরণ
            </h3>
            <p className="text-gray-600 text-sm dark:text-gray-400">
              বাড়ির অবকাঠামো এবং সুবিধাসমূহ
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              ঘরের সংখ্যা
            </label>
            <input
              type="number"
              name="bedroom"
              value={data.bedroom || 0}
              onChange={(e) => handleChange('bedroom', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter number of bedrooms"
              min="0"
            />
          </div>

          {/* Facilities Checkboxes */}
          <div className="md:col-span-2 lg:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              বাড়ির সুবিধাসমূহ
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.balcony || false}
                  onChange={(e) => handleChange('balcony', e.target.checked)}
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">বারান্দা</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.kitchen || false}
                  onChange={(e) => handleChange('kitchen', e.target.checked)}
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">রান্নাঘর</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.store || false}
                  onChange={(e) => handleChange('store', e.target.checked)}
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">স্টোর রুম</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.hasTubeWell || false}
                  onChange={(e) => handleChange('hasTubeWell', e.target.checked)}
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">টিউবয়েল</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.toilet || false}
                  onChange={(e) => handleChange('toilet', e.target.checked)}
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">শৌচাগার</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Guardian Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
        <div className="flex items-center space-x-4 mb-8">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 dark:from-orange-600 dark:to-red-600 rounded-xl shadow-lg">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              অভিভাবকের তথ্য
            </h3>
            <p className="text-gray-600 text-sm dark:text-gray-400">
              অভিভাবক বা গার্ডিয়ানের পরিচিতি
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              অভিভাবকের নাম
            </label>
            <input
              type="text"
              name="guardiansName"
              value={data.guardiansName || ''}
              onChange={(e) => handleChange('guardiansName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter guardian's name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              সম্পর্ক
            </label>
            <input
              type="text"
              name="guardiansRelation"
              value={data.guardiansRelation || ''}
              onChange={(e) => handleChange('guardiansRelation', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter relation (e.g., Uncle, Aunt)"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              জাতীয় পরিচয়পত্র (NID)
            </label>
            <input
              type="text"
              name="nid"
              value={data.NID || ''}
              onChange={(e) => handleChange('NID', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter NID number"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              যোগাযোগের নম্বর
            </label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <input
                  type="tel"
                  name="cell1"
                  value={data.cell1 || ''}
                  onChange={(e) => handleChange('cell1', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Primary phone number"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <input
                  type="tel"
                  name="cell2"
                  value={data.cell2 || ''}
                  onChange={(e) => handleChange('cell2', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Secondary phone number (optional)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const validateBasicInformation = (data: BasicInformation): ValidationError[] => {
  const errors: ValidationError[] = [];
  const tabName = 'Basic Information';

  // Required field validations
  const physicalConditionError = validateRequired(data.physicalCondition, 'physicalCondition', tabName);
  if (physicalConditionError) errors.push(physicalConditionError);

  // If has critical illness, type of illness should be provided
  if (data.hasCriticalIllness && !data.typeOfIllness?.trim()) {
    errors.push({
      field: 'typeOfIllness',
      message: 'Type of illness is required when critical illness is indicated',
      tab: tabName
    });
  }

  return errors;
};