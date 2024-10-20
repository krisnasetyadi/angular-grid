export interface HeaderField {
  id: string;
  name: string;
  description: string;
  fieldType: string;
  isEditableByAuthor: boolean;
  isEditableByResponder: boolean;
  isRequiredFromAuthor: boolean;
  isRequiredFromResponder: boolean;
  minLength: number | null;
  maxLength: number | null;
  minValue: number | null;
  maxValue: number | null;
  validationHint: string;
  showInFormListPage: boolean;
  options: { [key: string]: string; };
  value: string;
}
