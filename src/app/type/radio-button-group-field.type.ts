import { FormFieldTypeSpecs } from './form-field-type-specs.model';
import { FormFieldTypes } from './form-field-types.enum';

export class RadioButtonGroupFieldType implements FormFieldTypeSpecs {
  readonly name: string = FormFieldTypes.RadioButtonGroup;
  readonly hasDefaultValue: boolean = false;
  readonly hasUom: boolean = false;
  readonly hasMinMaxLength: boolean = false;
  readonly hasMinMaxValue: boolean = false;
  readonly hasAbsoluteMinMaxValue: boolean = false;
  readonly hasMultipleOptions: boolean = true;
  readonly hasMaxSelectableOptions: boolean = false;
  readonly hasDigitalSignature: boolean = true;
}
