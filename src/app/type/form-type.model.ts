import { HeaderField } from "./header-field.model";
import { FormTypeLabels } from "./form-type-labels.model";

export class FormType {
  name: string;
  headerFields: HeaderField[];
  signature?: FormTypeSignature;
  formTypeLabels: FormTypeLabels;
}

export interface FormTypeSignature {
  roles: string[];
}
