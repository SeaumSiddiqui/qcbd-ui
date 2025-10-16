import { ValidationError } from '../types';

export const validateRequired = (value: any, fieldName: string, tabName?: string): ValidationError | null => {
  if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
    return {
      field: fieldName,
      message: `${fieldName} is required`,
      tab: tabName
    };
  }
  return null;
};

export const validateEmail = (email: string, fieldName: string, tabName?: string): ValidationError | null => {
  if (!email) return null; // Optional field
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      field: fieldName,
      message: `${fieldName} must be a valid email address`,
      tab: tabName
    };
  }
  return null;
};

export const validatePhone = (phone: string, fieldName: string, tabName?: string): ValidationError | null => {
  if (!phone) return null; // Optional field
  
  const phoneRegex = /^[\+]?[0-9\-\(\)\s]+$/;
  if (!phoneRegex.test(phone) || phone.length < 10) {
    return {
      field: fieldName,
      message: `${fieldName} must be a valid phone number`,
      tab: tabName
    };
  }
  return null;
};

export const validateAge = (age: number, fieldName: string, min: number = 0, max: number = 150, tabName?: string): ValidationError | null => {
  if (age === null || age === undefined) {
    return {
      field: fieldName,
      message: `${fieldName} is required`,
      tab: tabName
    };
  }
  
  if (age < min || age > max) {
    return {
      field: fieldName,
      message: `${fieldName} must be between ${min} and ${max}`,
      tab: tabName
    };
  }
  return null;
};

export const validatePositiveNumber = (value: number, fieldName: string, tabName?: string): ValidationError | null => {
  if (value === null || value === undefined) {
    return {
      field: fieldName,
      message: `${fieldName} is required`,
      tab: tabName
    };
  }
  
  if (value < 0) {
    return {
      field: fieldName,
      message: `${fieldName} must be a positive number`,
      tab: tabName
    };
  }
  return null;
};

export const validateDate = (date: string, fieldName: string, tabName?: string): ValidationError | null => {
  if (!date) {
    return {
      field: fieldName,
      message: `${fieldName} is required`,
      tab: tabName
    };
  }
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return {
      field: fieldName,
      message: `${fieldName} must be a valid date`,
      tab: tabName
    };
  }
  
  // Check if date is not in the future (for birth dates, death dates, etc.)
  if (dateObj > new Date()) {
    return {
      field: fieldName,
      message: `${fieldName} cannot be in the future`,
      tab: tabName
    };
  }
  
  return null;
};

export const validatePostalCode = (code: string, fieldName: string, tabName?: string): ValidationError | null => {
  if (!code) {
    return {
      field: fieldName,
      message: `${fieldName} is required`,
      tab: tabName
    };
  }
  
  // Bangladesh postal code format (4 digits)
  const postalRegex = /^\d{4}$/;
  if (!postalRegex.test(code)) {
    return {
      field: fieldName,
      message: `${fieldName} must be a 4-digit postal code`,
      tab: tabName
    };
  }
  return null;
};

export const scrollToError = (path: string) => {
  // Convert path to input name (e.g., 'primaryInformation.fullName' -> 'primary-information-full-name')
  const fieldId = path.replace(/\./g, '-').toLowerCase();
  
  // Find the error element
  const errorElement = document.querySelector(`[name="${path}"]`);
  if (errorElement) {
    // Scroll the element into view with smooth behavior
    errorElement.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
    
    // Optional: Add focus and highlight effect
    (errorElement as HTMLElement).focus();
    errorElement.classList.add('error-highlight');
    
    // Remove highlight after animation
    setTimeout(() => {
      errorElement.classList.remove('error-highlight');
    }, 2000);
  }
};

export const groupErrorsByTab = (errors: ValidationError[]): Record<string, ValidationError[]> => {
  return errors.reduce((acc, error) => {
    const tab = error.tab || 'general';
    if (!acc[tab]) {
      acc[tab] = [];
    }
    acc[tab].push(error);
    return acc;
  }, {} as Record<string, ValidationError[]>);
};

// Full validation for all required fields
export const validateApplicationFull = (application: any): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Primary Information - all required fields
  if (!application.primaryInformation?.fullName?.trim()) {
    errors.push({ field: 'fullName', message: 'Full name is required', tab: 'Primary Information' });
  }
  if (!application.primaryInformation?.dateOfBirth) {
    errors.push({ field: 'dateOfBirth', message: 'Date of birth is required', tab: 'Primary Information' });
  }
  if (!application.primaryInformation?.bcRegistration?.trim()) {
    errors.push({ field: 'bcRegistration', message: 'BC registration is required', tab: 'Primary Information' });
  }
  if (!application.primaryInformation?.gender) {
    errors.push({ field: 'gender', message: 'Gender is required', tab: 'Primary Information' });
  }
  if (!application.primaryInformation?.fathersName?.trim()) {
    errors.push({ field: 'fathersName', message: 'Father\'s name is required', tab: 'Primary Information' });
  }
  if (!application.primaryInformation?.dateOfDeath) {
    errors.push({ field: 'dateOfDeath', message: 'Father\'s date of death is required', tab: 'Primary Information' });
  }
  if (application.primaryInformation?.age === undefined || application.primaryInformation?.age < 0 || application.primaryInformation?.age > 18) {
    errors.push({ field: 'age', message: 'Valid age between 0 and 18 is required', tab: 'Primary Information' });
  }
  if (application.primaryInformation?.grade === undefined || application.primaryInformation?.grade < 0) {
    errors.push({ field: 'grade', message: 'Grade is required', tab: 'Primary Information' });
  }

  // Address - required fields
  if (!application.address?.permanentDistrict?.trim()) {
    errors.push({ field: 'permanentDistrict', message: 'Permanent district is required', tab: 'Address' });
  }
  if (!application.address?.permanentSubDistrict?.trim()) {
    errors.push({ field: 'permanentSubDistrict', message: 'Permanent sub-district is required', tab: 'Address' });
  }
  if (!application.address?.isSameAsPermanent) {
    if (!application.address?.presentDistrict?.trim()) {
      errors.push({ field: 'presentDistrict', message: 'Present district is required', tab: 'Address' });
    }
    if (!application.address?.presentSubDistrict?.trim()) {
      errors.push({ field: 'presentSubDistrict', message: 'Present sub-district is required', tab: 'Address' });
    }
  }

  // Basic Information - required fields
  if (!application.basicInformation?.physicalCondition) {
    errors.push({ field: 'physicalCondition', message: 'Physical condition is required', tab: 'Basic Information' });
  }
  if (!application.basicInformation?.guardiansName?.trim()) {
    errors.push({ field: 'guardiansName', message: 'Guardian\'s name is required', tab: 'Basic Information' });
  }
  if (!application.basicInformation?.cell1?.trim()) {
    errors.push({ field: 'cell1', message: 'Contact number is required', tab: 'Basic Information' });
  }

  return errors;
};

// Partial validation for key fields only
export const validateApplicationPartial = (application: any): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // Only check most critical fields for partial validation
  if (!application.primaryInformation?.fullName?.trim()) {
    errors.push({ field: 'fullName', message: 'Full name is required', tab: 'Primary Information' });
  }
  if (!application.primaryInformation?.fathersName?.trim()) {
    errors.push({ field: 'fathersName', message: 'Father\'s name is required', tab: 'Primary Information' });
  }
  if (!application.primaryInformation?.bcRegistration?.trim()) {
    errors.push({ field: 'bcRegistration', message: 'BC registration is required', tab: 'Primary Information' });
  }
  
  return errors;
};