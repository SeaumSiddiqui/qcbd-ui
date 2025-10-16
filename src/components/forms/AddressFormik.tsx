import React from 'react';
import { FormikProps } from 'formik';
import { MapPin, Copy } from 'lucide-react';
import { FormField } from '../ui/FormField';
import { FormCheckbox } from '../ui/FormCheckbox';
import { FormSection } from '../ui/FormSection';
import { OrphanApplication } from '../../types';
import { Button } from '../ui/Button';

interface AddressFormikProps {
  formik: FormikProps<OrphanApplication>;
}

export const AddressFormik: React.FC<AddressFormikProps> = ({ formik }) => {
  const copyPermanentToPresent = () => {
    const permanentAddress = formik.values.address;
    if (permanentAddress) {
      formik.setFieldValue('address.isSameAsPermanent', true);
      formik.setFieldValue('address.presentDistrict', permanentAddress.permanentDistrict);
      formik.setFieldValue('address.presentSubDistrict', permanentAddress.permanentSubDistrict);
      formik.setFieldValue('address.presentUnion', permanentAddress.permanentUnion);
      formik.setFieldValue('address.presentVillage', permanentAddress.permanentVillage);
      formik.setFieldValue('address.presentArea', permanentAddress.permanentArea);
    }
  };

  // Watch for changes in permanent address fields and update present address if same as permanent is checked
  React.useEffect(() => {
    if (formik.values.address?.isSameAsPermanent) {
      const permanentAddress = formik.values.address;
      formik.setFieldValue('address.presentDistrict', permanentAddress.permanentDistrict);
      formik.setFieldValue('address.presentSubDistrict', permanentAddress.permanentSubDistrict);
      formik.setFieldValue('address.presentUnion', permanentAddress.permanentUnion);
      formik.setFieldValue('address.presentVillage', permanentAddress.permanentVillage);
      formik.setFieldValue('address.presentArea', permanentAddress.permanentArea);
    }
  }, [
    formik.values.address?.permanentDistrict,
    formik.values.address?.permanentSubDistrict,
    formik.values.address?.permanentUnion,
    formik.values.address?.permanentVillage,
    formik.values.address?.permanentArea,
    formik.values.address?.isSameAsPermanent
  ]);

  const isSameAsPermanent = formik.values.address?.isSameAsPermanent || false;

  return (
    <div className="space-y-8">
      {/* Permanent Address */}
      <FormSection
        title="স্থায়ী ঠিকানা"
        description="স্থায়ী ঠিকানার বিস্তারিত বিবরণ"
        icon={MapPin}
        gradient="from-primary-500 to-primary-600"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            name="address.permanentDistrict"
            label="জেলা"
            placeholder="Enter district"
            required
          />

          <FormField
            name="address.permanentSubDistrict"
            label="উপজেলা"
            placeholder="Enter sub-district"
            required
          />

          <FormField
            name="address.permanentUnion"
            label="ইউনিয়ন"
            placeholder="Enter union"
          />

          <FormField
            name="address.permanentVillage"
            label="গ্রাম"
            placeholder="Enter village"
          />

          <div className="md:col-span-2">
            <FormField
              name="address.permanentArea"
              label="বিস্তারিত/এলাকা"
              type="textarea"
              placeholder="Enter detailed area information"
              rows={3}
            />
          </div>
        </div>
      </FormSection>

      {/* Present Address */}
      <FormSection
        title="বর্তমান ঠিকানা"
        description="বর্তমান ঠিকানার বিস্তারিত বিবরণ"
        icon={MapPin}
        gradient="from-secondary-500 to-secondary-600"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isSameAsPermanent}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  formik.setFieldValue('address.isSameAsPermanent', isChecked);
                  if (isChecked) {
                    copyPermanentToPresent();
                  }
                }}
                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Same as permanent address
              </span>
            </label>

            {!isSameAsPermanent && (
              <Button
                type="button"
                onClick={copyPermanentToPresent}
                variant="outline"
                size="sm"
                className="inline-flex items-center px-3 py-1 text-xs font-medium text-primary-700 bg-primary-100 rounded-full hover:bg-primary-200 dark:bg-secondary-900/30 dark:text-secondary-500 dark:hover:bg-secondary-900/50 transition-colors duration-200"
              >
                <Copy className="w-3 h-3 mr-1" />
                Copy from permanent
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            name="address.presentDistrict"
            label="জেলা"
            placeholder="Enter district"
            disabled={isSameAsPermanent}
          />

          <FormField
            name="address.presentSubDistrict"
            label="উপজেলা"
            placeholder="Enter sub-district"
            disabled={isSameAsPermanent}
          />

          <FormField
            name="address.presentUnion"
            label="ইউনিয়ন"
            placeholder="Enter union"
            disabled={isSameAsPermanent}
          />

          <FormField
            name="address.presentVillage"
            label="গ্রাম"
            placeholder="Enter village"
            disabled={isSameAsPermanent}
          />

          <div className="md:col-span-2">
            <FormField
              name="address.presentArea"
              label="বিস্তারিত/এলাকা"
              type="textarea"
              placeholder="Enter detailed area information"
              rows={3}
              disabled={isSameAsPermanent}
            />
          </div>
        </div>
      </FormSection>
    </div>
  );
};