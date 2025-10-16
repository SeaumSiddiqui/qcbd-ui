import React from 'react';
import { FormikProps } from 'formik';
import { Home, Heart, User, Phone, Building } from 'lucide-react';
import { FormField } from '../ui/FormField';
import { FormSelect } from '../ui/FormSelect';
import { FormRadioGroup } from '../ui/FormRadioGroup';
import { FormCheckbox } from '../ui/FormCheckbox';
import { FormSection } from '../ui/FormSection';
import { PhysicalCondition, ResidenceStatus, HouseType, OrphanApplication } from '../../types';

interface BasicInformationFormikProps {
  formik: FormikProps<OrphanApplication>;
}

export const BasicInformationFormik: React.FC<BasicInformationFormikProps> = ({ formik }) => {
  const physicalConditionOptions = [
    { value: PhysicalCondition.HEALTHY, label: 'সুস্থ' },
    { value: PhysicalCondition.SICK, label: 'অসুস্থ' },
    { value: PhysicalCondition.DISABLED, label: 'প্রতিবন্ধী' },
  ];

  const residenceStatusOptions = [
    { value: ResidenceStatus.OWN, label: 'নিজ' },
    { value: ResidenceStatus.RENTED, label: 'ভাড়া' },
    { value: ResidenceStatus.SHELTERED, label: 'আশ্রয়প্রাপ্ত' },
    { value: ResidenceStatus.HOMELESS, label: 'গৃহহীন' },
  ];

  const houseTypeOptions = [
    { value: HouseType.CONCRETE_HOUSE, label: 'পাকা বাড়ি' },
    { value: HouseType.SEMI_CONCRETE_HOUSE, label: 'আধপাকা বাড়ি' },
    { value: HouseType.MUD_HOUSE, label: 'কাঁচা বাড়ি' },
  ];

  const yesNoOptions = [
    { value: true, label: 'হ্যাঁ' },
    { value: false, label: 'না' },
  ];

  const hasCriticalIllness = formik.values.basicInformation?.hasCriticalIllness;

  return (
    <div className="space-y-8">
      {/* Physical Condition */}
      <FormSection
        title="শারীরিক তথ্যাবলী"
        description="শারীরিক অবস্থান এবং স্বাস্থ্য সংক্রান্ত তথ্য"
        icon={Heart}
        gradient="from-red-500 to-pink-500"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormSelect
            name="basicInformation.physicalCondition"
            label="শারীরিক অবস্থা"
            options={physicalConditionOptions}
            placeholder="Select condition"
            required
          />

          <FormRadioGroup
            name="basicInformation.hasCriticalIllness"
            label="গুরুতর অসুস্থতা আছে?"
            options={yesNoOptions}
            required
          />

          {hasCriticalIllness && (
            <div className="md:col-span-2">
              <FormField
                name="basicInformation.typeOfIllness"
                label="অসুস্থতার প্রকার"
                type="textarea"
                placeholder="Describe the type of illness"
                rows={3}
              />
            </div>
          )}
        </div>
      </FormSection>

      {/* Residence Information */}
      <FormSection
        title="আবাসিক তথ্য"
        description="বাসস্থান সম্পর্কিত তথ্যাবলী"
        icon={Home}
        gradient="from-blue-500 to-indigo-500"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FormRadioGroup
            name="basicInformation.isResident"
            label="আবাসিক?"
            options={yesNoOptions}
          />

          <FormCheckbox
            name="basicInformation.isResident"
            label="আবাসিক? (Resident)"
          />

          <FormSelect
            name="basicInformation.residenceStatus"
            label="আবাসিক অবস্থান"
            options={residenceStatusOptions}
            placeholder="Select status"
          />

          <FormSelect
            name="basicInformation.houseType"
            label="বাড়ির ধরন"
            options={houseTypeOptions}
            placeholder="Select type"
          />
        </div>
      </FormSection>

      {/* Household Details */}
      <FormSection
        title="বাড়ির বিবরণ"
        description="বাড়ির অবকাঠামো এবং সুবিধাসমূহ"
        icon={Building}
        gradient="from-green-500 to-teal-500"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FormField
            name="basicInformation.bedroom"
            label="ঘরের সংখ্যা"
            type="number"
            placeholder="Enter number of bedrooms"
            min={0}
          />

          {/* Facilities Checkboxes */}
          <div className="md:col-span-2 lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              বাড়ির সুবিধাসমূহ
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <FormCheckbox
                name="basicInformation.balcony"
                label="বারান্দা"
              />

              <FormCheckbox
                name="basicInformation.kitchen"
                label="রান্নাঘর"
              />

              <FormCheckbox
                name="basicInformation.store"
                label="স্টোর রুম"
              />

              <FormCheckbox
                name="basicInformation.hasTubeWell"
                label="টিউবয়েল"
              />

              <FormCheckbox
                name="basicInformation.toilet"
                label="শৌচাগার"
              />
            </div>
          </div>
        </div>
      </FormSection>

      {/* Guardian Information */}
      <FormSection
        title="অভিভাবকের তথ্য"
        description="অভিভাবক বা গার্ডিয়ানের পরিচিতি"
        icon={User}
        gradient="from-orange-500 to-red-500"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            name="basicInformation.guardiansName"
            label="অভিভাবকের নাম"
            placeholder="Enter guardian's name"
          />

          <FormField
            name="basicInformation.guardiansRelation"
            label="সম্পর্ক"
            placeholder="Enter relation (e.g., Uncle, Aunt)"
          />

          <FormField
            name="basicInformation.nid"
            label="জাতীয় পরিচয়পত্র (NID)"
            placeholder="Enter NID number"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              যোগাযোগের নম্বর
            </label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <FormField
                  name="basicInformation.cell1"
                  label=""
                  placeholder="Primary phone number"
                  className="flex-1"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <FormField
                  name="basicInformation.cell2"
                  label=""
                  placeholder="Secondary phone number (optional)"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </div>
      </FormSection>
    </div>
  );
};