﻿import { FormFieldTypeSpecs } from './form-field-type-specs.model';
import { FormFieldTypes } from './form-field-types.enum';

export class DateFieldType implements FormFieldTypeSpecs {
  readonly name: string = FormFieldTypes.Date;
  readonly hasDefaultValue: boolean = false;
  readonly hasUom: boolean = false;
  readonly hasMinMaxLength: boolean = false;
  readonly hasMinMaxValue: boolean = false;
  readonly hasAbsoluteMinMaxValue: boolean = false;
  readonly hasMultipleOptions: boolean = false;
  readonly hasMaxSelectableOptions: boolean = false;
  readonly hasDigitalSignature: boolean = true;
}
