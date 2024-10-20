import { FormFieldTypeSpecs } from './form-field-type-specs.model';
import { FormFieldTypes } from './form-field-types.enum';

export class StaticRichTextFieldType implements FormFieldTypeSpecs {
  readonly name: string = FormFieldTypes.StaticRichText;
  readonly hasDefaultValue: boolean = false;
  readonly hasUom: boolean = false;
  readonly hasMinMaxLength: boolean = false;
  readonly hasMinMaxValue: boolean = false;
  readonly hasAbsoluteMinMaxValue: boolean = false;
  readonly hasMultipleOptions: boolean = false;
  readonly hasMaxSelectableOptions: boolean = false;
  readonly hasDigitalSignature: boolean = false;
}
