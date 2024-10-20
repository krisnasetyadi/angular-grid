import { DEFAULT_FIELD_TYPE, DEFAULT_TABLE_FIELD_TYPE } from '../type';
import { NumberFieldType } from '../type/number.field-type';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthoredForm } from '../type/authored-form.model';
import {
  FormHeaderFieldSpecs,
  FormSectionFieldSpecs,
  FormSectionSpecs,
  FormUploadedFile,
} from '../type/form-specs.model';
import { FormSpecsDigitalSignature } from '../type/form-digital-signature-specs.model';
import { FormType } from '../type/form-type.model';
import { FormStatus, FormStatusModel } from '../type/form.status';
import { CrrFormTypeModel } from '../type/crr-form-type.model';
import { TableSectionViewSpecs } from '../type/table-section-view-specs.model';
import { FormFieldTypeSpecs, FIELD_TYPES, TABLE_FIELD_TYPES } from '../type';
import { FormFieldTypes } from '../type/form-field-types.enum';
import { specsValidationHint } from '../type/section-field.specification';

export default class FormBuilderUtils {
  static transformFormBuilderHeaderFieldToFormControl(
    headerField: FormHeaderFieldSpecs
  ): AbstractControl {
    const validators = this.generateValidators(headerField);
    return new FormControl(headerField.value, validators);
  }

  static generateValidators(headerField: FormHeaderFieldSpecs): ValidatorFn[] {
    var validators: ValidatorFn[] = [];
    if (headerField.isEditableByAuthor) {
      validators.push(Validators.required);
    }
    if (headerField.minLength) {
      validators.push(Validators.minLength(headerField.minLength));
    }
    if (headerField.maxLength) {
      validators.push(Validators.maxLength(headerField.maxLength));
    }
    if (headerField.minValue) {
      validators.push(Validators.min(headerField.minValue));
    }
    if (headerField.maxLength) {
      validators.push(Validators.max(headerField.maxLength));
    }
    return validators;
  }

  static createAuthoredFormFormGroup(
    authoredForm: AuthoredForm,
    formTypeSpecs: FormType,
    fb: FormBuilder,
    createEmptyAuthoredForm: boolean = false
  ): FormGroup {
    const formHeaderFields = fb.group({});
    for (let headerField of authoredForm.headerFields) {
      const headerFieldControl =
        FormBuilderUtils.transformFormBuilderHeaderFieldToFormControl(
          headerField
        );
      formHeaderFields.addControl(headerField.id, headerFieldControl);
    }

    const formSectionArray = fb.array([]);
    if (authoredForm.sections.length > 0) {
      for (let section of authoredForm.sections) {
        if (!!section.isTableSection) {
          formSectionArray.push(
            FormBuilderUtils.createTableSectionFormGroup(
              section,
              fb,
              formTypeSpecs
            )
          );
        } else {
          formSectionArray.push(
            FormBuilderUtils.createSectionFormGroup(section, fb, formTypeSpecs)
          );
        }
      }
    } else if (createEmptyAuthoredForm) {
      formSectionArray.push(
        FormBuilderUtils.createSectionFormGroup(null, fb, formTypeSpecs)
      );
    }

    const formGroup = fb.group({
      id: [authoredForm?.id],
      formName: [authoredForm?.formName, [Validators.required]],
      formType: [authoredForm?.formType],
      initialIssueNumber: [
        authoredForm?.initialIssueNumber,
        [Validators.min(0), Validators.max(999)],
      ],
      reviewedBy: [authoredForm?.reviewedBy],
      approvedBy: [authoredForm?.approvedBy],
      authoredBy: [authoredForm?.authoredBy],
      rejectReason: [authoredForm?.rejectReason],
      ndtIssueNumber: [authoredForm?.ndtIssueNumber],
      ndtRevStatus: [authoredForm?.ndtRevStatus],
      newVersionHasImpact: [authoredForm?.newVersionHasImpact],
      headerFields: formHeaderFields,
      sections: formSectionArray,
      isRWWSIndexPage: [authoredForm?.isRWWSIndexPage],
      aircraftType: [authoredForm?.aircraftType],
      rwwsIndex: [authoredForm?.rwwsIndex],
      rwwsIndexDescription: [authoredForm?.rwwsIndexDescription],
    });

    return formGroup;
  }

  // FormGroup is supplemented after initializing table rows and columns
  static createTableSectionFormGroup(
    section: FormSectionSpecs,
    fb: FormBuilder,
    formTypeSpecs: FormType
  ): FormGroup {
    const formFieldArray = fb.array([]);
    for (let field of section.fields) {
      formFieldArray.push(
        FormBuilderUtils.createTableSectionFieldFormGroup(
          field,
          fb,
          formTypeSpecs
        )
      );
    }

    const columnWidth = 100 / section.tableViewSpecs.numberOfColumns;
    const widths =
      section.tableViewSpecs.colWidths &&
      !section.tableViewSpecs.colWidths.includes('')
        ? section.tableViewSpecs.colWidths
        : Array(section.tableViewSpecs.numberOfColumns).fill(`${columnWidth}%`);
    const heights =
      section.tableViewSpecs.rowHeights &&
      !section.tableViewSpecs.rowHeights.includes('')
        ? section.tableViewSpecs.rowHeights
        : Array(section.tableViewSpecs.numberOfRows).fill('0px');

    const tableViewSpecs: TableSectionViewSpecs = {
      ...section.tableViewSpecs,
      colWidths: widths,
      rowHeights: heights,
      rowSpan: [...section.tableViewSpecs.rowSpan],
      colSpan: [...section.tableViewSpecs.colSpan],
      visible: [...section.tableViewSpecs.visible],
    };

    const filesFieldArray = fb.array([]);
    const files = section?.files || [];
    for (let file of files) {
      filesFieldArray.push(FormBuilderUtils.createFilesFormGroup(file, fb));
    }

    return fb.group({
      name: [section?.name, [Validators.required, Validators.maxLength(100)]],
      description: [section?.description],
      fields: formFieldArray,
      isTableSection: [true],
      tableViewSpecs: [tableViewSpecs],
    });
  }

  // Unlike regular section, table section's field:
  // - Name is not required
  // - Required is false by default
  // - Default field type is StaticText
  static createTableSectionFieldFormGroup(
    field: FormSectionFieldSpecs,
    fb: FormBuilder,
    formTypeSpecs: FormType
  ): FormGroup {
    const filesFieldArray = fb.array([]);
    const files = field?.files || [];
    for (let file of files) {
      filesFieldArray.push(FormBuilderUtils.createFilesFormGroup(file, fb));
    }

    const signaturesFieldArray = fb.array([]);
    const signatures = field?.signatures || [];
    for (let signature of signatures) {
      signaturesFieldArray.push(
        FormBuilderUtils.createSignatureFormGroup(signature, fb, formTypeSpecs)
      );
    }

    return fb.group({
      id: field?.id,
      name: [field?.name],
      description: [field?.description],
      type: [
        field?.type || DEFAULT_TABLE_FIELD_TYPE.name,
        [Validators.required],
      ],
      default: [field?.default],
      required: [
        field?.required ??
          this.getIsRequired(field?.type || DEFAULT_TABLE_FIELD_TYPE.name),
      ],
      minValue: [field?.minValue],
      maxValue: [field?.maxValue],
      minValueInclusive: [
        field?.minValueInclusive ?? true,
        [Validators.required],
      ],
      maxValueInclusive: [
        field?.maxValueInclusive ?? true,
        [Validators.required],
      ],
      absoluteMinValue: [field?.absoluteMinValue],
      absoluteMaxValue: [field?.absoluteMaxValue],
      absoluteMinValueInclusive: [
        field?.absoluteMinValueInclusive ?? true,
        [Validators.required],
      ],
      absoluteMaxValueInclusive: [
        field?.absoluteMaxValueInclusive ?? true,
        [Validators.required],
      ],
      minLength: [field?.minLength, [Validators.min(0)]],
      maxLength: [field?.maxLength, [Validators.min(0)]],
      // TODO: add validators for multipleOptions
      options: [field?.options || []],
      maxSelectableOptions: [field?.maxSelectableOptions, [Validators.min(1)]],
      // TODO: add options which will likely be a form array of key-value fields
      uom: [field?.uom],
      validationHint: [field?.validationHint],
      absoluteValidationHint: [field?.absoluteValidationHint],
      files: filesFieldArray,
      hasDigitalSignature: [field?.hasDigitalSignature || false],
      signatures: signaturesFieldArray,
      isNewOrAmended: [field?.isNewOrAmended ?? false],
      amendmentRemarks: [field?.amendmentRemarks],
    });
  }

  static cloneFormGroupWithValues(
    source: FormGroup,
    target: FormGroup,
    fb: FormBuilder
  ): FormGroup {
    Object.keys(source.controls).forEach((k) => {
      if (k === 'signatures' || k === 'files') {
        const sourceGroups = (source.get(k) as FormArray)
          .controls as FormGroup[];
        let targetGroups = (target.get(k) as FormArray).controls as FormGroup[];
        (target.get(k) as FormArray).clear();
        Object.keys(sourceGroups).forEach((i) => {
          delete targetGroups[i];
          targetGroups[i] = new FormGroup({});
          Object.keys(sourceGroups[i].controls).forEach((c) => {
            const sourceGroupControl = sourceGroups[i].get(c) as FormControl;
            (targetGroups[i] as FormGroup).addControl(
              c,
              new FormControl(
                sourceGroupControl.value,
                sourceGroupControl.validator
              )
            );
          });
        });
        target.setControl(k, fb.array(targetGroups));
      } else {
        target.get(k).setValue(source.get(k).value);
      }
    });
    return target;
  }

  static createSectionFormGroup(
    section: FormSectionSpecs,
    fb: FormBuilder,
    formTypeSpecs: FormType
  ): FormGroup {
    const formFieldArray = fb.array([]);
    for (let field of section.fields) {
      formFieldArray.push(
        FormBuilderUtils.createSectionFieldFormGroup(field, fb, formTypeSpecs)
      );
    }

    const filesFieldArray = fb.array([]);
    const files = section?.files || [];
    for (let file of files) {
      filesFieldArray.push(FormBuilderUtils.createFilesFormGroup(file, fb));
    }

    return fb.group({
      name: [section?.name, [Validators.required, Validators.maxLength(100)]],
      description: [section?.description],
      files: filesFieldArray,
      fields: formFieldArray,
      isTableSection: [false],
    });
  }

  static createFilesFormGroup(file: FormUploadedFile, fb: FormBuilder) {
    return fb.group({
      fileId: [file.fileId],
      caption: [file.caption],
      originalFilename: [file.originalFilename],
    });
  }

  static createSectionFieldFormGroup(
    field: FormSectionFieldSpecs,
    fb: FormBuilder,
    formTypeSpecs: FormType
  ): FormGroup {
    const filesFieldArray = fb.array([]);
    const files = field?.files || [];
    for (let file of files) {
      filesFieldArray.push(FormBuilderUtils.createFilesFormGroup(file, fb));
    }

    const signaturesFieldArray = fb.array([]);
    const signatures = field?.signatures || [];
    for (let signature of signatures) {
      signaturesFieldArray.push(
        FormBuilderUtils.createSignatureFormGroup(signature, fb, formTypeSpecs)
      );
    }

    return fb.group({
      id: field?.id,
      name: [field?.name, [Validators.required]],
      description: [field?.description],
      type: [field?.type || DEFAULT_FIELD_TYPE.name, [Validators.required]],
      default: [field?.default],
      required: [
        field?.required ??
          this.getIsRequired(field?.type || DEFAULT_FIELD_TYPE.name),
      ],
      minValue: [field?.minValue],
      maxValue: [field?.maxValue],
      minValueInclusive: [
        field?.minValueInclusive ?? true,
        [Validators.required],
      ],
      maxValueInclusive: [
        field?.maxValueInclusive ?? true,
        [Validators.required],
      ],
      absoluteMinValue: [field?.absoluteMinValue],
      absoluteMaxValue: [field?.absoluteMaxValue],
      absoluteMinValueInclusive: [
        field?.absoluteMinValueInclusive ?? true,
        [Validators.required],
      ],
      absoluteMaxValueInclusive: [
        field?.absoluteMaxValueInclusive ?? true,
        [Validators.required],
      ],
      minLength: [field?.minLength, [Validators.min(0)]],
      maxLength: [field?.maxLength, [Validators.min(0)]],
      // TODO: add validators for multipleOptions
      options: [field?.options || []],
      maxSelectableOptions: [field?.maxSelectableOptions, [Validators.min(1)]],
      // TODO: add options which will likely be a form array of key-value fields
      uom: [field?.uom],
      validationHint: [field?.validationHint],
      absoluteValidationHint: [field?.absoluteValidationHint],
      files: filesFieldArray,
      hasDigitalSignature: [field?.hasDigitalSignature || false],
      signatures: signaturesFieldArray,
      isNewOrAmended: [field?.isNewOrAmended ?? false],
      amendmentRemarks: [field?.amendmentRemarks],
    });
  }

  static getSignatures(
    formArray: AbstractControl,
    field: FormSectionFieldSpecs,
    fb: FormBuilder,
    formTypeSpecs: FormType
  ) {
    const signaturesArray = formArray.get('signatures') as FormArray;

    signaturesArray.clear();

    field.signatures.forEach((signature: FormSpecsDigitalSignature) => {
      signaturesArray.push(
        FormBuilderUtils.createSignatureFormGroup(signature, fb, formTypeSpecs)
      );
    });

    return field;
  }

  private static getIsRequired(type: string): boolean {
    const requiredTypes = [
      'Date',
      'Multiple Options',
      'Number',
      'Passed/Failed',
      'Rich Text',
      'Text',
      'Radio Button Group',
      'TME',
    ];

    return requiredTypes.includes(type);
  }

  private static createSignatureFormGroup(
    signature: FormSpecsDigitalSignature,
    fb: FormBuilder,
    formTypeSpecs: FormType
  ) {
    const config: any = {
      label: [signature.label, [Validators.required]],
      required: [signature.required],
    };

    // assign signature
    const availableRoles = formTypeSpecs.signature?.roles ?? [];
    const defaultSignatureRoles =
      availableRoles.length > 0 ? [availableRoles[0]] : [];
    const signatureRoles = signature.signatureRoles || defaultSignatureRoles;

    if (availableRoles.length > 0) {
      config.signatureRoles = [signatureRoles, [Validators.required]];
    }
    return fb.group(config);
  }

  static rearrangeFormArrayPosition(
    elements: FormArray,
    shift: number,
    currentIndex: number
  ): void {
    let newIndex: number = currentIndex + shift;

    if (newIndex === -1) {
      newIndex = elements.length - 1;
    } else if (newIndex == elements.length) {
      newIndex = 0;
    }

    const currentElement = elements.at(currentIndex);
    elements.removeAt(currentIndex);
    elements.insert(newIndex, currentElement);
  }

  static getFormStatusFriendlyName(status: FormStatus) {
    return FormStatusModel[status];
  }

  static readonly CRR_FORM_TYPE = {
    NONDESTRUCTIVE_TESTING_RECORD: 'Non-Destructive Testing Record',
    ROUTER: 'Router',
    REWORK_WORKSHEET: 'Rework Worksheet',
    CONCESSION_REPAIR: 'Concession Repair',
  };

  static isReworkWorksheetOrConcessionRepair(
    crrFormType: CrrFormTypeModel
  ): boolean {
    return (
      crrFormType?.formType == this.CRR_FORM_TYPE.REWORK_WORKSHEET ||
      crrFormType?.formType == this.CRR_FORM_TYPE.CONCESSION_REPAIR
    );
  }

  static getFieldTypes(isTableSection = false): FormFieldTypeSpecs[] {
    return isTableSection ? [...TABLE_FIELD_TYPES] : [...FIELD_TYPES];
  }

  static removeRedundantFieldsAuthoredForm(
    authoredForm: AuthoredForm
  ): AuthoredForm {
    authoredForm.sections.forEach((section) =>
      FormBuilderUtils.removeRedundantFieldsSection(section)
    );
    return authoredForm;
  }

  static removeRedundantFieldsSection(
    section: FormSectionSpecs
  ): FormSectionSpecs {
    const fieldTypes = FormBuilderUtils.getFieldTypes(section.isTableSection);
    section.fields.forEach((field) => {
      const fieldType = fieldTypes.find((ft) => ft.name == field.type);

      if (!fieldType.hasMinMaxValue && fieldType.name == NumberFieldType.name) {
        field.minValue = field.maxValue = null;
        field.validationHint = '';
      }

      if (!fieldType.hasAbsoluteMinMaxValue) {
        field.absoluteMinValue = field.absoluteMaxValue = null;
        field.absoluteValidationHint = '';
      }

      if (!fieldType.hasUom) {
        field.uom = null;
      }

      if (!fieldType.hasMinMaxLength) {
        field.minLength = field.maxLength = null;
      }

      if (!fieldType.hasDefaultValue) {
        field.default = null;
      }

      if (!fieldType.hasMultipleOptions) {
        field.options = [];
      }

      if (!fieldType.hasDigitalSignature) {
        field.signatures = null;
      }

      if (field.amendmentRemarks?.length == 0 || !field.isNewOrAmended) {
        field.amendmentRemarks = null;
      }

      // Auto-generate specification hint
      if (field.type === FormFieldTypes.Number) {
        if ((!!field.minValue || !!field.maxValue) && !field.validationHint) {
          field.validationHint = specsValidationHint(
            field.minValueInclusive,
            field.maxValueInclusive,
            field.minValue,
            field.maxValue,
            field.uom
          );
        }
        if (
          (!!field.absoluteMinValue || !!field.absoluteMaxValue) &&
          !field.absoluteValidationHint
        ) {
          field.absoluteValidationHint = specsValidationHint(
            field.absoluteMinValueInclusive,
            field.absoluteMaxValueInclusive,
            field.absoluteMinValue,
            field.absoluteMaxValue,
            field.uom
          );
        }
      }

      // Digital Signatures has their own required per signature
      if (field.type === FormFieldTypes.DigitalSignature) {
        field.required = false;
      }
    });
    return section;
  }
}
