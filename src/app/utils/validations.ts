// To improve re-usability, the keys must match the validation names
// in Angular's AbstractControl.
// Building the message must accept a context based on `ValidationError` object
// returned for validators in
// at https://github.com/angular/angular/blob/a92a89b0eb127a59d7e071502b5850e57618ec2d/packages/forms/src/validators.ts#L476

export const VALIDATIONS = {
  required: {
    name: 'required',
    message: (context: any = null) => 'This field is required.',
    isValid: (value: any): boolean => (value ? true : false),
  },
  min: {
    name: 'min',
    message: (context: MinValueValidationContext) =>
      `Minimum value is ${context.min}.`,
    isValid: (value: any, min: number, inclusive: boolean): boolean =>
      isEmptyInputValue(value) ||
      (isNumeric(value) &&
        ((inclusive && value >= min) || (!inclusive && value > min))),
  },
  max: {
    name: 'max',
    message: (context: MaxValueValidationContext) =>
      `Maximum value is ${context.max}.`,
    isValid: (value: any, max: number, inclusive: boolean): boolean =>
      isEmptyInputValue(value) ||
      (isNumeric(value) &&
        ((inclusive && value <= max) || (!inclusive && value < max))),
  },
  absoluteMin: {
    name: 'absoluteMin',
    message: (context: MinValueValidationContext) =>
      `Absolute minimum value is ${context.min}.`,
    isValid: (value: any, min: number, inclusive: boolean): boolean =>
      isEmptyInputValue(value) ||
      (isNumeric(value) &&
        ((inclusive && value >= min) || (!inclusive && value > min))),
  },
  absoluteMax: {
    name: 'absoluteMax',
    message: (context: MaxValueValidationContext) =>
      `Absolute maximum value is ${context.max}.`,
    isValid: (value: any, max: number, inclusive: boolean): boolean =>
      isEmptyInputValue(value) ||
      (isNumeric(value) &&
        ((inclusive && value <= max) || (!inclusive && value < max))),
  },
  minLength: {
    name: 'minLength',
    message: (context: MinLengthValidationContext) =>
      `Minimum length is ${context?.minLength?.requiredLength}.`,
    isValid: (value: any, minLength: number): boolean =>
      (typeof value === 'string' || 'length' in value) &&
      value.length >= minLength,
  },
  maxLength: {
    name: 'maxLength',
    message: (context: MaxLengthValidationContext) =>
      `Maximum length is ${context?.maxLength?.requiredLength}.`,
    isValid: (value: any, maxLength: number): boolean =>
      (typeof value === 'string' || 'length' in value) &&
      value.length <= maxLength,
  },
  numeric: {
    name: 'numeric',
    message: (context: any = null) => `Value should be numeric.`,
    isValid: (value: any): boolean =>
      isEmptyInputValue(value) || isNumeric(value),
  },
  numericExp: {
    name: 'numericExp',
    message: (context: any = null) =>
      `Numeric Expression is limited to ex: 4, -4, 4.13, +4.13, -4.13.`,
    isValid: (value: any): boolean =>
      isEmptyInputValue(value) || isValidExp(value),
  },
  remarks: {
    name: 'remarks',
    message: (context: RemarksValidationContext) =>
      context.isAbsoluteLimitViolated
        ? `Value is out of Rework Limit. Please enter Remarks.`
        : `Value is out of Design Specification. Please enter Remarks.`,
    isValid: (remarks: string, hasViolatedLimits: boolean[]): boolean =>
      !remarks && hasViolatedLimits.some((v) => !!v),
  },
};

const numericRegex: RegExp = /^[+-]?\d+(?:,\d{3})*?(?:.\d+)?$/;

function isEmptyInputValue(value: any): boolean {
  // we don't check for string here so it also works with arrays
  return value == null || value.length === 0;
}

function isNumeric(value: any): boolean {
  const num = Number(value);
  return !isNaN(num);
}

function isValidExp(value: string): boolean {
  return numericRegex.test(value);
}

export interface MinLengthValidationContext {
  minLength: { requiredLength: number; actualLength: number };
}

export interface MaxLengthValidationContext {
  maxLength: { requiredLength: number; actualLength: number };
}

export interface MinValueValidationContext {
  min: number;
}

export interface MaxValueValidationContext {
  max: number;
}

export interface RemarksValidationContext {
  isDesignSpecViolated: boolean;
  isAbsoluteLimitViolated: boolean;
}
