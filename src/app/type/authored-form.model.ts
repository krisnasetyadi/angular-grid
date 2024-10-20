import {
  FormHeaderFieldSpecs,
  FormSectionSpecs,
  FormSpecs,
} from './form-specs.model';
import { FormStatus } from './form.status';

export interface AuthoredForm {
  id: number;
  formType: string;
  formName: string;
  versionId: number;
  latestPublishedVersion: string;
  initialIssueNumber?: number;
  status: FormStatus;
  authoredBy: string;
  reviewedBy?: string;
  approvedBy?: string;
  rejectReason?: string;
  lastModified?: Date;
  ndtIssueNumber?: string;
  ndtRevStatus?: string;
  newVersionHasImpact: boolean;
  headerFields: FormHeaderFieldSpecs[];
  sections: FormSectionSpecs[];
  isActive: boolean;
  relatedUnpublishedForms: UnpublishedForm[];
  approvedOn?: Date;
  reviewedOn?: Date;
  isRWWSIndexPage?: boolean;
  aircraftType?: string;
  rwwsIndex?: string;
  rwwsIndexDescription?: string;
}

export interface UnpublishedForm {
  id: number;
  formName: string;
  formType: string;
  status: FormStatus;
  newVersionHasImpact: boolean;
}

export function mapAuthoredFormToFormSpecs(
  authoredForm: AuthoredForm
): FormSpecs {
  return {
    formName: authoredForm.formName,
    formType: authoredForm.formType,
    headerFieldSpecs: authoredForm.headerFields,
    id: authoredForm.id,
    sections: authoredForm.sections,
    initialIssueNumber: authoredForm.initialIssueNumber,
    ndtIssueNumber: authoredForm.ndtIssueNumber,
    ndtRevStatus: authoredForm.ndtRevStatus,
    newVersionHasImpact: authoredForm.newVersionHasImpact,
    isRWWSIndexPage: authoredForm.isRWWSIndexPage,
    aircraftType: authoredForm.aircraftType,
    rwwsIndex: authoredForm.rwwsIndex,
    rwwsIndexDescription: authoredForm.rwwsIndexDescription,
  };
}
