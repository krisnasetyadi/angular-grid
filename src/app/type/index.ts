import { NumberFieldType } from './number.field-type';
import { PassedFailedFieldType } from './passed-failed.field-type';
import { TextboxFieldType } from './textbox.field-type';
import { RichTextboxFieldType } from './rich-textbox.field-type';
import { FormFieldTypeSpecs } from './form-field-type-specs.model';
import { MultipleOptionsFieldType } from './multiple-options.field-type';
import { DateFieldType } from './date.field-type';
import { DigitalSignatureFieldType } from './digital-signature-field.type';
import { RadioButtonGroupFieldType } from './radio-button-group-field.type';
import { StaticTextFieldType } from './static-text.field-type';
import { StaticRichTextFieldType } from './static-rich-text.field-type';
import { TmeFieldType } from './tme.field-type';

export * from './form-field-type-specs.model';

export const FIELD_TYPES: FormFieldTypeSpecs[] = [
  new TextboxFieldType(),
  new NumberFieldType(),
  new RichTextboxFieldType(),
  new PassedFailedFieldType(),
  new MultipleOptionsFieldType(),
  new DateFieldType(),
  new DigitalSignatureFieldType(),
  new RadioButtonGroupFieldType(),
  new TmeFieldType(),
];

export const TABLE_FIELD_TYPES: FormFieldTypeSpecs[] = [
  new StaticTextFieldType(),
  new StaticRichTextFieldType(),
  new TextboxFieldType(),
  new NumberFieldType(),
  new RichTextboxFieldType(),
  new PassedFailedFieldType(),
  new MultipleOptionsFieldType(),
  new DateFieldType(),
  new DigitalSignatureFieldType(),
  new RadioButtonGroupFieldType(),
  new TmeFieldType(),
];

export const DEFAULT_TABLE_FIELD_TYPE = TABLE_FIELD_TYPES[0];
export const DEFAULT_FIELD_TYPE = FIELD_TYPES[0];
