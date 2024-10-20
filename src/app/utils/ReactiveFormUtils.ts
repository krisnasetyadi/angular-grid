import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { VALIDATIONS } from './validations';

export default class ReactiveFormUtils {
  static getErrors(formControl: AbstractControl): string[] {
    const errorMessages: string[] = [];
    Object.keys(formControl.errors).forEach((messageKey) => {
      if (messageKey) {
        errorMessages.push(
          VALIDATIONS[messageKey].message(formControl.errors[messageKey])
        );
      }
    });
    return errorMessages;
  }

  static hasValidationError(
    formControl: AbstractControl,
    submitted: boolean
  ): boolean {
    return !!(
      (formControl.dirty || formControl.touched || submitted) &&
      formControl.errors
    );
  }

  static isRequired(formControl: AbstractControl): boolean {
    const validator = formControl.validator
      ? formControl.validator({} as AbstractControl)
      : '';
    if (validator && validator.required) {
      return true;
    }
    return false;
  }

  static validateAll(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAll(control);
      }
    });
  }
}
