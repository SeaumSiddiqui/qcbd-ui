import * as Yup from 'yup';
import { Gender, MothersStatus, PhysicalCondition, ResidenceStatus, HouseType, MaritalStatus } from '../types';

// Common validation schemas
export const commonValidationSchemas = {
  requiredString: Yup.string().required('This field is required').trim(),
  optionalString: Yup.string().trim(),
  requiredEmail: Yup.string().email('Please enter a valid email address').required('Email is required'),
  optionalEmail: Yup.string().email('Invalid email format'),
  requiredNumber: Yup.number().required('This field is required').min(0, 'Value must be 0 or greater'),
  optionalNumber: Yup.number().min(0, 'Must be a positive number'),
  requiredAge: Yup.number().required('Age is required').min(0, 'Age must be 0 or greater').max(18, 'Age must be 18 or under for orphan eligibility'),
  requiredDate: Yup.date().required('Please select a date').max(new Date(), 'Date cannot be in the future'),
  optionalDate: Yup.date().max(new Date(), 'Date cannot be in the future'),
  phoneNumber: Yup.string()
    .matches(/^\+880\d{2}-\d{4}-\d{4}$/, 'Phone number must be in format +88017-0602-0534')
    .test('valid-bd-number', 'Please enter a valid Bangladesh phone number', (value) => {
      if (!value) return true; // Allow empty

      // Strip non-digits
      const digitsOnly = value.replace(/[^\d]/g, '');

      // Remove country code (+880)
      const afterCode = digitsOnly.slice(3);

      // Must be 10 digits (Bangladesh rule)
      return afterCode.length === 10;
    }),
  bcRegistration: Yup.string().required('Birth Certificate Registration number is required').trim(),
  postalCode: Yup.string().matches(/^\d{4}$/, 'Postal code must be 4 digits'),
};

// Primary Information Schema
export const primaryInformationSchema = Yup.object({
  fullName: Yup.string().required('Full name is required').trim(),
  dateOfBirth: Yup.date().required('Date of birth is required').max(new Date(), 'Date of birth cannot be in the future'),
  bcRegistration: commonValidationSchemas.bcRegistration,
  placeOfBirth: commonValidationSchemas.optionalString,
  age: commonValidationSchemas.requiredAge,
  gender: Yup.mixed<Gender>().oneOf(Object.values(Gender), 'Please select a gender').required('Gender selection is required'),
  fathersName: Yup.string().required("Father's name is required").trim(),
  dateOfDeath: commonValidationSchemas.optionalDate,
  causeOfDeath: commonValidationSchemas.optionalString,
  mothersName: commonValidationSchemas.optionalString,
  mothersOccupation: commonValidationSchemas.optionalString,
  mothersStatus: Yup.mixed<MothersStatus>().oneOf(Object.values(MothersStatus), 'Please select mother\'s status'),
  fixedAssets: commonValidationSchemas.optionalString,
  annualIncome: commonValidationSchemas.optionalString,
  numOfSiblings: Yup.number().required('Number of siblings is required').min(0, 'Number of siblings cannot be negative'),
  academicInstitution: commonValidationSchemas.optionalString,
  grade: Yup.number().required('Current grade/class is required').min(0, 'Grade cannot be negative'),
});

// Address Schema
export const addressSchema = Yup.object({
  isSameAsPermanent: Yup.boolean(),
  permanentDistrict: Yup.string().required('Permanent district is required').trim(),
  permanentSubDistrict: Yup.string().required('Permanent sub-district is required').trim(),
  permanentUnion: commonValidationSchemas.optionalString,
  permanentVillage: commonValidationSchemas.optionalString,
  permanentArea: commonValidationSchemas.optionalString,
  presentDistrict: commonValidationSchemas.optionalString,
  presentSubDistrict: commonValidationSchemas.optionalString,
  presentUnion: commonValidationSchemas.optionalString,
  presentVillage: commonValidationSchemas.optionalString,
  presentArea: commonValidationSchemas.optionalString,
});

// Family Member Schema
export const familyMemberSchema = Yup.object({
  name: commonValidationSchemas.optionalString,
  age: commonValidationSchemas.optionalNumber,
  siblingsGrade: commonValidationSchemas.optionalNumber,
  occupation: commonValidationSchemas.optionalString,
  siblingsGender: Yup.mixed<Gender>().oneOf(Object.values(Gender), 'Please select a valid gender'),
  maritalStatus: Yup.mixed<MaritalStatus>().oneOf(Object.values(MaritalStatus), 'Please select a valid status'),
});

// Basic Information Schema
export const basicInformationSchema = Yup.object({
  physicalCondition: Yup.mixed<PhysicalCondition>().oneOf(Object.values(PhysicalCondition), 'Please select physical condition').required('Physical condition selection is required'),
  hasCriticalIllness: Yup.boolean().required(),
  typeOfIllness: Yup.string().when('hasCriticalIllness', {
    is: true,
    then: (schema) => schema.required('Please describe the type of illness'),
    otherwise: (schema) => schema,
  }),
  isResident: Yup.boolean().required(),
  residenceStatus: Yup.mixed<ResidenceStatus>().oneOf(Object.values(ResidenceStatus), 'Please select a valid status'),
  houseType: Yup.mixed<HouseType>().oneOf(Object.values(HouseType), 'Please select a valid type'),
  bedroom: commonValidationSchemas.optionalNumber,
  balcony: Yup.boolean(),
  kitchen: Yup.boolean(),
  store: Yup.boolean(),
  hasTubeWell: Yup.boolean(),
  toilet: Yup.boolean(),
  guardiansName: commonValidationSchemas.optionalString,
  guardiansRelation: commonValidationSchemas.optionalString,
  nid: commonValidationSchemas.optionalString,
  cell1: Yup.string().when('$isSubmitting', {
    is: true,
    then: (schema) => commonValidationSchemas.phoneNumber.required('Primary contact number is required'),
    otherwise: (schema) => commonValidationSchemas.phoneNumber,
  }),
  cell2: commonValidationSchemas.phoneNumber,
});

// Complete Orphan Application Schema
export const orphanApplicationSchema = Yup.object({
  primaryInformation: primaryInformationSchema,
  address: addressSchema,
  familyMembers: Yup.array().of(familyMemberSchema),
  basicInformation: basicInformationSchema,
});

// User Creation Schema
export const userCreationSchema = Yup.object({
  username: commonValidationSchemas.requiredString,
  email: commonValidationSchemas.requiredEmail,
  password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
  isEnabled: Yup.boolean(),
  groups: Yup.array().of(Yup.string()).min(1, 'At least one role must be selected'),
  cell: commonValidationSchemas.phoneNumber,
  address: commonValidationSchemas.optionalString,
  beneficiaryCreateRequest: Yup.object({
    bcRegistration: commonValidationSchemas.optionalString,
    accountTitle: commonValidationSchemas.optionalString,
    accountNumber: commonValidationSchemas.optionalString,
    bankTitle: commonValidationSchemas.optionalString,
    branch: commonValidationSchemas.optionalString,
    routingNumber: commonValidationSchemas.optionalString,
  }),
});

// Partial validation schemas for different submission states
export const partialOrphanApplicationSchema = Yup.object({
  primaryInformation: Yup.object({
    fullName: commonValidationSchemas.requiredString,
    fathersName: commonValidationSchemas.requiredString,
    bcRegistration: commonValidationSchemas.bcRegistration,
  }),
});