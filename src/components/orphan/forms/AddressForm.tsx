import React from 'react';
import { MapPin, Copy } from 'lucide-react';
import { Address, ValidationError } from '../../../types';
import { validateRequired } from '../../../utils/validation';

interface AddressFormProps {
  data: Address;
  onChange: (data: Address) => void;
  onFieldTouch?: (fieldName: string) => void;
  errors: ValidationError[];
}

export const AddressForm: React.FC<AddressFormProps> = ({
  data,
  onChange,
  onFieldTouch,
  errors
}) => {
  const getFieldError = (fieldName: string) => {
    return errors.find(error => error.field === fieldName)?.message;
  };

  const handleChange = (field: keyof Address, value: any) => {
    const updatedData = {
      ...data,
      [field]: value
    };

    // If isSameAsPermanent is checked, copy permanent address to present address
    if (field === 'isSameAsPermanent' && value) {
      updatedData.presentDistrict = data.permanentDistrict;
      updatedData.presentSubDistrict = data.permanentSubDistrict;
      updatedData.presentUnion = data.permanentUnion;
      updatedData.presentVillage = data.permanentVillage;
      updatedData.presentArea = data.permanentArea;
    }

    // If isSameAsPermanent is checked and permanent address fields change, update present address too
    if (data.isSameAsPermanent && field.startsWith('permanent')) {
      const presentField = field.replace('permanent', 'present') as keyof Address;
      (updatedData as any)[presentField] = value;
    }

    onChange(updatedData);
  };

  const copyPermanentToPresent = () => {
    onChange({
      ...data,
      isSameAsPermanent: true,
      presentDistrict: data.permanentDistrict,
      presentSubDistrict: data.permanentSubDistrict,
      presentUnion: data.permanentUnion,
      presentVillage: data.permanentVillage,
      presentArea: data.permanentArea,
    });
  };

  return (
    <div className="space-y-8">
      {/* Permanent Address */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 bg-primary-100 dark:bg-secondary-900/30 rounded-lg">
            <MapPin className="h-5 w-5 text-primary-900 dark:text-secondary-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              স্থায়ী ঠিকানা
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              স্থায়ী ঠিকানার বিস্তারিত বিবরণ
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              জেলা *
            </label>
            <input
              type="text"
              name="permanentDistrict"
              value={data.permanentDistrict || ''}
              onChange={(e) => handleChange('permanentDistrict', e.target.value)}
              className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 ${
                getFieldError('permanentDistrict') ? 'border-red-400 dark:border-red-500' : ''
              }`}
              placeholder="Enter district"
              onBlur={() => onFieldTouch?.('permanentDistrict')}
            />
            {getFieldError('permanentDistrict') && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{getFieldError('permanentDistrict')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              উপজেলা *
            </label>
            <input
              type="text"
              name="permanentSubDistrict"
              value={data.permanentSubDistrict || ''}
              onChange={(e) => handleChange('permanentSubDistrict', e.target.value)}
              className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 ${
                getFieldError('permanentSubDistrict') ? 'border-red-400 dark:border-red-500' : ''
              }`}
              placeholder="Enter sub-district"
              onBlur={() => onFieldTouch?.('permanentSubDistrict')}
            />
            {getFieldError('permanentSubDistrict') && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{getFieldError('permanentSubDistrict')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ইউনিয়ন
            </label>
            <input
              type="text"
              name="permanentUnion"
              value={data.permanentUnion || ''}
              onChange={(e) => handleChange('permanentUnion', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter union"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              গ্রাম
            </label>
            <input
              type="text"
              name="permanentVillage"
              value={data.permanentVillage || ''}
              onChange={(e) => handleChange('permanentVillage', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter village"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              বিস্তারিত/এলাকা
            </label>
            <textarea
              name="permanentArea"
              value={data.permanentArea || ''}
              onChange={(e) => handleChange('permanentArea', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter detailed area information"
            />
          </div>
        </div>
      </div>

      {/* Present Address */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-secondary-100 dark:bg-primary-900/30 rounded-lg">
              <MapPin className="h-5 w-5 text-secondary-500 dark:text-primary-900" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                বর্তমান ঠিকানা
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                বর্তমান ঠিকানার বিস্তারিত বিবরণ
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data.isSameAsPermanent || false}
                onChange={(e) => handleChange('isSameAsPermanent', e.target.checked)}
                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Same as permanent address
              </span>
            </label>

            {!data.isSameAsPermanent && (
              <button
                type="button"
                onClick={copyPermanentToPresent}
                className="inline-flex items-center px-3 py-1 text-xs font-medium text-primary-700 bg-primary-100 rounded-full hover:bg-primary-200 dark:bg-secondary-900/30 dark:text-secondary-500 dark:hover:bg-secondary-900/50 transition-colors duration-200"
              >
                <Copy className="w-3 h-3 mr-1" />
                Copy from permanent
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              জেলা
            </label>
            <input
              type="text"
              name="presentDistrict"
              value={data.presentDistrict || ''}
              onChange={(e) => handleChange('presentDistrict', e.target.value)}
              disabled={data.isSameAsPermanent}
              className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:text-white ${
                data.isSameAsPermanent ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' : 'dark:bg-gray-700 focus:ring-1 focus:ring-primary-500 focus:border-primary-500'
              }`}
              placeholder="Enter district"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              উপজেলা
            </label>
            <input
              type="text"
              name="presentSubDistrict"
              value={data.presentSubDistrict || ''}
              onChange={(e) => handleChange('presentSubDistrict', e.target.value)}
              disabled={data.isSameAsPermanent}
              className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:text-white ${
                data.isSameAsPermanent ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' : 'dark:bg-gray-700 focus:ring-1 focus:ring-primary-500 focus:border-primary-500'
              }`}
              placeholder="Enter sub-district"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ইউনিয়ন
            </label>
            <input
              type="text"
              name="presentUnion"
              value={data.presentUnion || ''}
              onChange={(e) => handleChange('presentUnion', e.target.value)}
              disabled={data.isSameAsPermanent}
              className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:text-white ${
                data.isSameAsPermanent ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' : 'dark:bg-gray-700 focus:ring-1 focus:ring-primary-500 focus:border-primary-500'
              }`}
              placeholder="Enter union"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              গ্রাম
            </label>
            <input
              type="text"
              name="presentVillage"
              value={data.presentVillage || ''}
              onChange={(e) => handleChange('presentVillage', e.target.value)}
              disabled={data.isSameAsPermanent}
              className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:text-white ${
                data.isSameAsPermanent ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' : 'dark:bg-gray-700 focus:ring-1 focus:ring-primary-500 focus:border-primary-500'
              }`}
              placeholder="Enter village"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              বিস্তারিত/এলাকা
            </label>
            <textarea
              name="presentArea"
              value={data.presentArea || ''}
              onChange={(e) => handleChange('presentArea', e.target.value)}
              disabled={data.isSameAsPermanent}
              rows={3}
              className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:text-white ${
                data.isSameAsPermanent ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' : 'dark:bg-gray-700 focus:ring-1 focus:ring-primary-500 focus:border-primary-500'
              }`}
              placeholder="Enter detailed area information"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const validateAddress = (data: Address): ValidationError[] => {
  const errors: ValidationError[] = [];
  const tabName = 'Address';

  // Permanent address validations
  const permanentDistrictError = validateRequired(data.permanentDistrict, 'permanentDistrict', tabName);
  if (permanentDistrictError) errors.push(permanentDistrictError);

  const permanentSubDistrictError = validateRequired(data.permanentSubDistrict, 'permanentSubDistrict', tabName);
  if (permanentSubDistrictError) errors.push(permanentSubDistrictError);

  return errors;
};