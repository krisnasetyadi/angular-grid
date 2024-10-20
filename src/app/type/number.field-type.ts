import { FormFieldTypeSpecs } from './form-field-type-specs.model';
import { FormFieldTypes } from './form-field-types.enum';

export class NumberFieldType implements FormFieldTypeSpecs {
  readonly name: string = FormFieldTypes.Number;
  readonly hasDefaultValue: boolean = true;
  readonly hasUom: boolean = true;
  readonly hasMinMaxLength: boolean = false;
  readonly hasMinMaxValue: boolean = true;
  readonly hasAbsoluteMinMaxValue: boolean = true;
  readonly hasMultipleOptions: boolean = false;
  readonly hasMaxSelectableOptions: boolean = false;
  readonly hasDigitalSignature: boolean = true;
}
