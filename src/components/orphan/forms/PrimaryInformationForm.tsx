import React from 'react';
import { User, Calendar, Heart, GraduationCap, Users } from 'lucide-react';
import { PrimaryInformation, Gender, MothersStatus, ValidationError } from '../../../types';
import { validateRequired, validateAge, validatePositiveNumber, validateDate } from '../../../utils/validation';
import { UserProfile } from '../../../types';

interface PrimaryInformationFormProps {
  data: PrimaryInformation;
  onChange: (data: PrimaryInformation) => void;
  onSiblingsChange: (count: number) => void;
  onFieldTouch?: (fieldName: string) => void;
  errors: ValidationError[];
  userProfile?: UserProfile | null;
}

export const PrimaryInformationForm: React.FC<PrimaryInformationFormProps> = ({
  data,
  onChange,
  onSiblingsChange,
  onFieldTouch,
  errors,
  userProfile
}) => {
  const getFieldError = (fieldName: string) => {
    return errors.find(error => error.field === fieldName)?.message;
  };

  const handleChange = (field: keyof PrimaryInformation, value: any) => {
    onFieldTouch?.(field);
    const updatedData = {
      ...data,
      [field]: value
    };
    
    // If numOfSiblings changes, notify parent to update family members
    if (field === 'numOfSiblings') {
      onSiblingsChange(value);
    }
    
    onChange(updatedData);
  };

  return (
    <div className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
        <div className="flex items-center space-x-4 mb-8">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 dark:from-secondary-500 dark:to-secondary-600 rounded-xl shadow-lg">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              প্রাথমিক তথ্য
            </h3>
            <p className="text-gray-600 text-sm dark:text-gray-400">
              এতিমের জন্মনিবন্ধন সদৃশ তথ্য প্রদান করুন
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              সম্পূর্ণ নাম *
            </label>
            <input
              type="text"
              name="fullName"
              value={data.fullName || ''}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 ${
                getFieldError('fullName') ? 'border-red-400 dark:border-red-500' : ''
              }`}
              placeholder="Enter full name"
              onBlur={() => onFieldTouch?.('fullName')}
            />
            {getFieldError('fullName') && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{getFieldError('fullName')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              জন্মতারিখ*
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={data.dateOfBirth || ''}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 ${
                getFieldError('dateOfBirth') ? 'border-red-400 dark:border-red-500' : ''
              }`}
              onBlur={() => onFieldTouch?.('dateOfBirth')}
            />
            {getFieldError('dateOfBirth') && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{getFieldError('dateOfBirth')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              জন্মনিবন্ধন নম্বর *
              {userProfile && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 ml-2 font-normal">
                  (Auto-filled from user profile)
                </span>
              )}
            </label>
            <input
              type="text"
              name="bcRegistration"
              value={data.bcRegistration || ''}
              onChange={(e) => handleChange('bcRegistration', e.target.value)}
              readOnly={true}
              className={`w-full px-3 py-2 border-2 rounded-lg transition-all duration-200 form-input dark:text-white ${
                'bg-gray-50 dark:bg-gray-600 border-gray-200 dark:border-gray-500 cursor-not-allowed'
              } ${
                getFieldError('bcRegistration') ? 'border-red-400 dark:border-red-500' : ''
              } focus:outline-none focus:ring-0`}
              placeholder="Enter BC registration number"
              onBlur={() => onFieldTouch?.('bcRegistration')}
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              BC Registration cannot be modified after creation.
            </p>
            {getFieldError('bcRegistration') && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{getFieldError('bcRegistration')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              বয়স *
            </label>
            <input
              type="number"
              name="age"
              value={data.age || ''}
              onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
              className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 ${
                getFieldError('age') ? 'border-red-400 dark:border-red-500' : ''
              }`}
              placeholder="Enter age"
              min="0"
              max="18"
              onBlur={() => onFieldTouch?.('age')}
            />
            {getFieldError('age') && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{getFieldError('age')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              লিঙ্গ *
            </label>
            <select
              name="gender"
              value={data.gender || ''}
              onChange={(e) => handleChange('gender', e.target.value as Gender)}
              className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 ${
                getFieldError('gender') ? 'border-red-400 dark:border-red-500' : ''
              }`}
              onBlur={() => onFieldTouch?.('gender')}
            >
              <option value="">Select gender</option>
              <option value={Gender.MALE}>Male</option>
              <option value={Gender.FEMALE}>Female</option>
            </select>
            {getFieldError('gender') && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{getFieldError('gender')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              জাতীয়তা
            </label>
            <input
              type="text"
              name="nationality"
              value={data.nationality || ''}
              onChange={(e) => handleChange('nationality', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter nationality"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              জন্মস্থান
            </label>
            <input
              type="text"
              name="placeOfBirth"
              value={data.placeOfBirth || ''}
              onChange={(e) => handleChange('placeOfBirth', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter place of birth"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              ধর্ম
            </label>
            <input
              type="text"
              name="religion"
              value={data.religion || ''}
              onChange={(e) => handleChange('religion', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter religion"
            />
          </div>
        </div>
      </div>

      {/* Parents Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
        <div className="flex items-center space-x-4 mb-8">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 dark:from-pink-600 dark:to-rose-600 rounded-xl shadow-lg">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              পিতা-মাতার তথ্য 
            </h3>
            <p className="text-gray-600 text-sm dark:text-gray-400">
              পিতা-মাতার জাতীয়তা পরিচয়পত্র সদৃশ তথ্য প্রদান করুন
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Father Information */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              পিতার তথ্যাবলি
            </h4>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                পিতার নাম *
              </label>
              <input
                type="text"
                name="fathersName"
                value={data.fathersName || ''}
                onChange={(e) => handleChange('fathersName', e.target.value)}
                className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 ${
                  getFieldError('fathersName') ? 'border-red-400 dark:border-red-500' : ''
                }`}
                placeholder="Enter father's name"
                onBlur={() => onFieldTouch?.('fathersName')}
              />
              {getFieldError('fathersName') && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{getFieldError('fathersName')}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                মৃত্যু তারিখ
              </label>
              <input
                type="date"
                name="dateOfDeath"
                value={data.dateOfDeath || ''}
                onChange={(e) => handleChange('dateOfDeath', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                মৃত্যুর কারণ
              </label>
              <input
                name="causeOfDeath"
                value={data.causeOfDeath || ''}
                onChange={(e) => handleChange('causeOfDeath', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Describe the cause of death"
              />
            </div>
          </div>

          {/* Mother Information */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
              মাতার তথ্যাবলি
            </h4>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                মাতার নাম *
              </label>
              <input
                type="text"
                name="mothersName"
                value={data.mothersName || ''}
                onChange={(e) => handleChange('mothersName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter mother's name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                মাতার অবস্থা *
              </label>
              <select
                name="mothersStatus"
                value={data.mothersStatus || ''}
                onChange={(e) => handleChange('mothersStatus', e.target.value as MothersStatus)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select status</option>
                <option value={MothersStatus.WIDOW}>Widow</option>
                <option value={MothersStatus.REMARRIED}>Remarried</option>
                <option value={MothersStatus.DEAD}>Dead</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                মাতার পেশা
              </label>
              <input
                type="text"
                name="mothersOccupation"
                value={data.mothersOccupation || ''}
                onChange={(e) => handleChange('mothersOccupation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter mother's occupation"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Financial & Family Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
        <div className="flex items-center space-x-4 mb-8">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600 rounded-xl shadow-lg">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              অর্থনৈতিক ও পারিবারিক তথ্য
            </h3>
            <p className="text-gray-600 text-sm dark:text-gray-400">
              পরিবারের আর্থিক অবস্থা ও সদস্যদের তথ্য প্রদান করুন
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              স্থাবর সম্পত্তি
            </label>
            <textarea
              name="fixedAssets"
              value={data.fixedAssets || ''}
              onChange={(e) => handleChange('fixedAssets', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Describe fixed assets"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              বার্ষিক আয়
            </label>
            <input
              type="text"
              name="annualIncome"
              value={data.annualIncome || ''}
              onChange={(e) => handleChange('annualIncome', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter annual income"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              ভাইবোনের সংখ্যা
            </label>
            <input
              type="number"
              name="numOfSiblings"
              value={data.numOfSiblings || 0}
              onChange={(e) => handleChange('numOfSiblings', parseInt(e.target.value) || 0)}
              className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 ${
                getFieldError('numOfSiblings') ? 'border-red-400 dark:border-red-500' : ''
              }`}
              placeholder="Enter number of siblings"
              min="0"
              onBlur={() => onFieldTouch?.('numOfSiblings')}
            />
            {getFieldError('numOfSiblings') && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{getFieldError('numOfSiblings')}</p>
            )}
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              This will automatically add/remove rows in the Family Members section
            </p>
          </div>
        </div>
      </div>

      {/* Education Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
        <div className="flex items-center space-x-4 mb-8">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 dark:from-purple-600 dark:to-indigo-600 rounded-xl shadow-lg">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              শিক্ষাগত তথ্য
            </h3>
            <p className="text-gray-600 text-sm dark:text-gray-400">
              এতিমের বর্তমান শিক্ষাগত তথ্য প্রদান করুন
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              শিক্ষা প্রতিষ্ঠান
            </label>
            <input
              type="text"
              name="academicInstitution"
              value={data.academicInstitution || ''}
              onChange={(e) => handleChange('academicInstitution', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter school/institution name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              শ্রেণী
            </label>
            <input
              type="number"
              name="grade"
              value={data.grade || 0}
              onChange={(e) => handleChange('grade', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter current grade/class"
              min="0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const validatePrimaryInformation = (data: PrimaryInformation): ValidationError[] => {
  const errors: ValidationError[] = [];
  const tabName = 'Primary Information';

  // Required field validations
  const fullNameError = validateRequired(data.fullName, 'fullName', tabName);
  if (fullNameError) errors.push(fullNameError);

  const dateOfBirthError = validateDate(data.dateOfBirth, 'dateOfBirth', tabName);
  if (dateOfBirthError) errors.push(dateOfBirthError);

  const bcRegistrationError = validateRequired(data.bcRegistration, 'bcRegistration', tabName);
  if (bcRegistrationError) errors.push(bcRegistrationError);

  const ageError = validateAge(data.age, 'age', 0, 18, tabName);
  if (ageError) errors.push(ageError);

  const genderError = validateRequired(data.gender, 'gender', tabName);
  if (genderError) errors.push(genderError);

  const fathersNameError = validateRequired(data.fathersName, 'fathersName', tabName);
  if (fathersNameError) errors.push(fathersNameError);

  const numOfSiblingsError = validatePositiveNumber(data.numOfSiblings, 'numOfSiblings', tabName);
  if (numOfSiblingsError) errors.push(numOfSiblingsError);

  const gradeError = validatePositiveNumber(data.grade, 'grade', tabName);
  if (gradeError) errors.push(gradeError);

  return errors;
};