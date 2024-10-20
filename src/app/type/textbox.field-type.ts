import { FormFieldTypeSpecs } from './form-field-type-specs.model';
import { FormFieldTypes } from './form-field-types.enum';

export class TextboxFieldType implements FormFieldTypeSpecs {
  readonly name: string = FormFieldTypes.Text;
  readonly hasDefaultValue: boolean = true;
  readonly hasUom: boolean = false;
  readonly hasMinMaxLength: boolean = true;
  readonly hasMinMaxValue: boolean = false;
  readonly hasAbsoluteMinMaxValue: boolean = false;
  readonly hasMultipleOptions: boolean = false;
  readonly hasMaxSelectableOptions: boolean = false;
  readonly hasDigitalSignature: boolean = true;
}
