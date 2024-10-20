import { FormSpecsDigitalSignature } from './form-digital-signature-specs.model';
import { TableSectionViewSpecs } from './table-section-view-specs.model';

export interface FormSpecs {
  id: number;
  formName: string;
  formType: string;
  initialIssueNumber?: number;
  headerFieldSpecs: FormHeaderFieldSpecs[];
  sections: FormSectionSpecs[];
  ndtIssueNumber?: string;
  ndtRevStatus?: string;
  newVersionHasImpact: boolean;
  isRWWSIndexPage?: boolean;
  aircraftType?: string;
  rwwsIndex?: string;
  rwwsIndexDescription?: string;
}

export interface FormSectionSpecs {
  name: string;
  description: string;
  files?: FormUploadedFile[];
  fields: FormSectionFieldSpecs[];
  subindex?: string;
  isTableSection?: boolean;
  tableViewSpecs?: TableSectionViewSpecs;
}

export interface FormSectionFieldSpecs {
  id: string;
  name: string;
  description: string;
  type: string;
  default: string;
  required: boolean;
  minValue?: number;
  maxValue?: number;
  minValueInclusive?: boolean;
  maxValueInclusive?: boolean;
  absoluteMinValue?: number;
  absoluteMaxValue?: number;
  absoluteMinValueInclusive?: boolean;
  absoluteMaxValueInclusive?: boolean;
  minLength?: number;
  maxLength?: number;
  uom: string;
  options?: string[];
  maxSelectableOptions?: number;
  validationHint: string;
  absoluteValidationHint: string;
  files?: FormUploadedFile[];
  hasDigitalSignature: boolean;
  signatures: FormSpecsDigitalSignature[];
  isNewOrAmended: boolean;
  amendmentRemarks: string;
}

export interface FormHeaderFieldSpecs {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly fieldType: string;
  readonly isEditableByAuthor: boolean;
  readonly isEditableByResponder: boolean;
  readonly isRequiredFromAuthor: boolean;
  readonly isRequiredFromResponder: boolean;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly minValue?: number;
  readonly maxValue?: number;
  readonly validationHint: string;
  readonly showInFormListPage: boolean;
  readonly options?: string[];
  readonly maxSelectableOptions?: number;
  value: string;
}

export interface FormUploadedFile {
  readonly fileId: string;
  readonly originalFilename: string;
  caption: string;
}
