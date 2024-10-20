// import {
//   Component,
//   EventEmitter,
//   HostListener,
//   Input,
//   OnInit,
//   Output,
//   TemplateRef,
//   ViewChild,
// } from '@angular/core';
// import { FormFieldTypeSpecs } from '../type/form-field-type-specs.model';
// import {
//   FormArray,
//   FormBuilder,
//   FormControl,
//   FormGroup,
//   Validators,
// } from '@angular/forms';
// import { FormType } from '../type/form-type.model';
// import { AuthoredForm } from '../type/authored-form.model';
// import { FormFieldTypes } from '../type/form-field-types.enum';
// import ReactiveFormUtils from '../utils/ReactiveFormUtils';
// // import { FormBuilderService } from '../../services/form-builder.service';
// import { specsValidationHint } from '../type/section-field.specification';
// import * as Editor from '../../../shared/ckeditor-custom-build/ckeditor';
// import { CkEditorConfig } from '../../builder-ckeditor-defaults';
// import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
// import { MODAL_OPTIONS_LG } from '../../../app/constants/app-constants';
// import FormBuilderUtils from '../../utils/form-builder.utils';
// import {
//   FormSectionFieldSpecs,
//   FormSectionSpecs,
// } from '../../../shared/form-core/models/form-specs.model';
// import { Labels } from '../../models/labels.model';

// @Component({
//   selector: 'app-table-section-field',
//   templateUrl: './table-section-field.component.html',
//   styleUrls: ['./table-section-field.component.scss'],
// })
// export class TableSectionFieldComponent implements OnInit {
//   @ViewChild('cellFieldModal') cellFieldModal: TemplateRef<any>;

//   @Input() tableIndex: number;
//   @Input() rowIndex: number;
//   @Input() colIndex: number;
//   @Input() rowCount: number;
//   @Input() columnCount: number;
//   @Input() sectionCellType: string;
//   @Input() cellLabel: string;
//   @Input() sectionFieldFormGroup: FormGroup;
//   @Input() sectionIndex: number;
//   @Input() activateEditMode: boolean;
//   @Input() submitted: boolean;
//   @Input() authoredForm: AuthoredForm;
//   @Input() formTypeSpecs: FormType;
//   @Input() uploadFilePathParts: string[];
//   @Input() selectedRange: any;
//   @Input() tableData: any;

//   private readonly LabelMaxLength: number = 20;

//   fieldTypes: FormFieldTypeSpecs[];
//   selectedFieldType: FormFieldTypeSpecs;
//   filesFormArray: FormArray;
//   ids: any = {};
//   editRichTextbox: boolean = false;
//   editValidationHint: boolean = false;
//   editAbsoluteValidationHint: boolean = false;
//   labels: Labels;
//   hasSignatureRole = false;
//   readonly formFieldTypes = FormFieldTypes;
//   cellTypes = Object.values(this.formFieldTypes);
//   cellType: string;
//   modalRef: BsModalRef;
//   notAutoRequired: string[] = [
//     FormFieldTypes.StaticText,
//     FormFieldTypes.StaticRichText,
//     FormFieldTypes.DigitalSignature,
//   ];

//   public editor = Editor;
//   config = CkEditorConfig;

//   @Output() onCellFieldSaved: EventEmitter<any> = new EventEmitter<any>();

//   // Avoid binding between field's FormGroup and parent section's FormGroup
//   // Use temp FormGroup, only transfer data on Save
//   tempFieldFormGroup: FormGroup = new FormGroup({});

//   constructor(
//     private readonly formBuilderService: FormBuilderService,
//     private readonly fb: FormBuilder,
//     private readonly modalService: BsModalService
//   ) {}

//   ngOnInit(): void {
//     this.fieldTypes = this.formBuilderService.getTableFieldTypes();
//     this.hasSignatureRole =
//       this.formTypeSpecs.signature?.roles?.length > 0 || false;

//     // Clone FormGroup to temp
//     const field = this.sectionFieldFormGroup.value as FormSectionFieldSpecs;
//     this.tempFieldFormGroup = FormBuilderUtils.createTableSectionFieldFormGroup(
//       field,
//       this.fb,
//       this.formTypeSpecs
//     );

//     this.cellType = this.sectionFieldFormGroup.get('type').value;

//     this.onCellTypeChange(this.cellType);

//     this.ids = {
//       fieldNameId: `field-name-${this.sectionIndex}-${this.rowIndex}.${this.colIndex}`,
//       descriptionId: `field-description-${this.sectionIndex}-${this.rowIndex}.${this.colIndex}`,
//       fieldTypeId: `field-type-${this.sectionIndex}-${this.rowIndex}.${this.colIndex}`,
//       defaultValueId: `default-value-${this.sectionIndex}-${this.rowIndex}.${this.colIndex}`,
//       fieldRequiredId: `field-required-${this.sectionIndex}-${this.rowIndex}.${this.colIndex}`,
//       minLengthId: `field-min-length-${this.sectionIndex}-${this.rowIndex}.${this.colIndex}`,
//       maxLengthId: `field-max-length-${this.sectionIndex}-${this.rowIndex}.${this.colIndex}`,
//       minValueId: `field-min-value-${this.sectionIndex}-${this.rowIndex}.${this.colIndex}`,
//       maxValueId: `field-max-value-${this.sectionIndex}-${this.rowIndex}.${this.colIndex}`,
//       minValueInclusiveId: `field-min-value-inclusive-${this.sectionIndex}-${this.rowIndex}.${this.colIndex}`,
//       maxValueInclusiveId: `field-max-value-inclusive-${this.sectionIndex}-${this.rowIndex}.${this.colIndex}`,
//       absoluteMinValueId: `field-absolute-min-value-${this.sectionIndex}-${this.rowIndex}.${this.colIndex}`,
//       absoluteMaxValueId: `field-absolute-max-value-${this.sectionIndex}-${this.rowIndex}.${this.colIndex}`,
//       absoluteMinValueInclusiveId: `field-absolute-min-value-inclusive-${this.sectionIndex}-${this.rowIndex}.${this.colIndex}`,
//       absoluteMaxValueInclusiveId: `field-absolute-max-value-inclusive-${this.sectionIndex}-${this.rowIndex}.${this.colIndex}`,
//       uomId: `field-uom-${this.sectionIndex}-${this.rowIndex}.${this.colIndex}`,
//       validationHintId: `validation-hint-${this.sectionIndex}-${this.rowIndex}.${this.colIndex}`,
//       absoltueValidationHintId: `absolute-validation-hint-${this.sectionIndex}-${this.rowIndex}.${this.colIndex}`,
//       multipleOptions: `multipleOptions-${this.sectionIndex}-${this.rowIndex}.${this.colIndex}`,
//       maxSelectableOptions: `max-selectable-options-${this.sectionIndex}-${this.rowIndex}.${this.colIndex}`,
//       digitalSignature: `digital-signature-${this.sectionIndex}-${this.rowIndex}.${this.colIndex}`,
//       signatures: `signatures-${this.sectionIndex}-${this.rowIndex}.${this.colIndex}`,
//       newOrAmendedId: `field-new-or-amended-${this.sectionIndex}-${this.rowIndex}.${this.colIndex}`,
//       fieldAmendmentRemarksId: `field-amendment-remarks-${this.sectionIndex}-${this.rowIndex}.${this.colIndex}`,
//       multipleOptionsPreview: `multipleOptionsPreview-${this.sectionIndex}-${this.rowIndex}.${this.colIndex}`,
//     };
//     this.filesFormArray = this.sectionFieldFormGroup.controls
//       .files as FormArray;
//     this.labels = this.getLabels();
//   }

//   onCellTypeChange(value: string) {
//     this.getFormControl('type')?.setValue(value);
//     this.selectedFieldType = this.fieldTypes.find((x) => x.name == value);
//     if (this.cellType === FormFieldTypes.DigitalSignature) {
//       this.getFormControl('hasDigitalSignature').setValue(true);
//       if (this.tempSignaturesFormControl.value.length === 0) {
//         this.addDefaultSignature();
//       }
//     }
//     this.checkIsRequired(this.cellType);
//   }

//   get formType(): string {
//     return this.authoredForm?.formType;
//   }

//   get signatureRoles(): string[] {
//     return this.formTypeSpecs.signature?.roles ?? [];
//   }

//   getErrorMessage(formControlName: string): string {
//     const formControl = this.getFormControl(formControlName);
//     const errorMessages = ReactiveFormUtils.getErrors(formControl);
//     return errorMessages.reduce((acc, val) => acc.concat(val));
//   }

//   getFormControl(formControlName: string): FormControl {
//     return this.tempFieldFormGroup.get(formControlName) as FormControl;
//   }

//   get tempMultipleOptionsFormControl() {
//     return this.getFormControl('options') as FormControl;
//   }

//   get tempSignaturesFormControl() {
//     return this.tempFieldFormGroup.get('signatures') as FormArray;
//   }

//   get hasDigitalSignature(): boolean {
//     return this.getFormControl('hasDigitalSignature')?.value ?? false;
//   }

//   get isNewOrAmended(): boolean {
//     return this.getFormControl('isNewOrAmended')?.value ?? false;
//   }

//   get multipleOptionsFormControl() {
//     return this.sectionFieldFormGroup.get('options') as FormControl;
//   }

//   get signaturesFormControl() {
//     return this.sectionFieldFormGroup.get('signatures') as FormArray;
//   }

//   addOption(optionInputValue: string) {
//     optionInputValue = this.sanitizeOption(optionInputValue);
//     const comparableOptions = this.tempMultipleOptionsFormControl.value.map(
//       (x) => x.toLowerCase()
//     );
//     const comparableNewOption = optionInputValue.toLowerCase();

//     // only add when option doesn't exist already
//     if (!comparableOptions.includes(comparableNewOption)) {
//       this.tempMultipleOptionsFormControl.setValue(
//         (this.tempMultipleOptionsFormControl.value as Array<string>).concat([
//           optionInputValue,
//         ])
//       );
//     }
//   }

//   deleteOption(i) {
//     this.tempMultipleOptionsFormControl.value.splice(i, 1);
//   }

//   private sanitizeOption(optionInputValue: string): string {
//     return optionInputValue?.trim();
//   }

//   addSignature(
//     label: string = null,
//     required: boolean = false,
//     signatureRoles: string[]
//   ) {
//     const signatureRoleSpecs =
//       !!signatureRoles && signatureRoles.length > 0
//         ? [signatureRoles, Validators.required]
//         : [''];
//     this.tempSignaturesFormControl.push(
//       this.fb.group({
//         label: [
//           label || '',
//           [Validators.required, Validators.maxLength(this.LabelMaxLength)],
//         ],
//         required: [required],
//         signatureRoles: signatureRoleSpecs,
//       })
//     );
//   }

//   addNewSignature() {
//     this.addSignature('Sign', true, []);
//   }

//   addDefaultSignature() {
//     this.addSignature('Non-AC Holder', false, ['Non-AC Holder']);
//     this.addSignature('AC Holder', true, ['AC Holder', 'Release Signatory']);
//   }

//   deleteSignature(i) {
//     if (this.tempSignaturesFormControl.length === 1) {
//       return;
//     }
//     this.tempSignaturesFormControl.removeAt(i);
//   }

//   private sanitizeSignature(optionInputValue: string): string {
//     return optionInputValue?.trim();
//   }

//   getLabels(): Labels {
//     return {
//       fieldName: this.formTypeSpecs.formTypeLabels.fieldName,
//       validationHint: this.formTypeSpecs.formTypeLabels.validationHint,
//       absoluteValidationHint:
//         this.formTypeSpecs.formTypeLabels.absoluteValidationHint,
//       signatureRole: this.formTypeSpecs.formTypeLabels.signatureRole,
//     };
//   }

//   get tempSignaturesFormGroups(): FormGroup[] {
//     return (
//       this.tempSignaturesFormControl?.controls?.map((c) => c as FormGroup) ?? []
//     );
//   }

//   get signaturesFormGroups(): FormGroup[] {
//     return (
//       this.signaturesFormControl?.controls?.map((c) => c as FormGroup) ?? []
//     );
//   }

//   generateSpecificationHint() {
//     if (this.selectedFieldType.name != FormFieldTypes.Number) return;
//     const lowerInclusive = this.getFormControl('minValueInclusive').value;
//     const minValue = this.getFormControl('minValue').value ?? '';
//     const upperInclusive = this.getFormControl('maxValueInclusive').value;
//     const maxValue = this.getFormControl('maxValue').value ?? '';
//     const uom = this.getFormControl('uom').value;
//     const hint = specsValidationHint(
//       lowerInclusive,
//       upperInclusive,
//       minValue,
//       maxValue,
//       uom
//     );
//     this.getFormControl('validationHint').patchValue(hint);
//   }

//   generateAbsoluteSpecificationHint() {
//     if (this.selectedFieldType.name != FormFieldTypes.Number) return;
//     const lowerInclusive = this.getFormControl(
//       'absoluteMinValueInclusive'
//     ).value;
//     const minValue = this.getFormControl('absoluteMinValue').value ?? '';
//     const upperInclusive = this.getFormControl(
//       'absoluteMaxValueInclusive'
//     ).value;
//     const maxValue = this.getFormControl('absoluteMaxValue').value ?? '';
//     const uom = this.getFormControl('uom').value;
//     const hint = specsValidationHint(
//       lowerInclusive,
//       upperInclusive,
//       minValue,
//       maxValue,
//       uom
//     );
//     this.getFormControl('absoluteValidationHint').patchValue(hint);
//   }

//   openCellFieldModal() {
//     const field = this.tableData[this.selectedRange.startRow][
//       this.selectedRange.startCol
//     ].cell as FormSectionFieldSpecs;

//     this.tempFieldFormGroup = FormBuilderUtils.createTableSectionFieldFormGroup(
//       field,
//       this.fb,
//       this.formTypeSpecs
//     );

//     this.cellType = field.type;

//     this.modalRef = this.modalService.show(
//       this.cellFieldModal,
//       MODAL_OPTIONS_LG
//     );
//   }

//   checkIsRequired(type: string) {
//     if (!this.notAutoRequired.includes(type)) {
//       this.getFormControl('required').setValue(true);
//     } else {
//       this.getFormControl('required').setValue(false);
//     }
//   }

//   dismissModal() {
//     const field = this.sectionFieldFormGroup.value as FormSectionFieldSpecs;
//     this.getFormControl('type')?.setValue(field.type);
//     this.checkIsRequired(field.type);
//     this.cellType = field.type;
//     this.modalRef.hide();
//   }

//   saveCellField() {
//     // this change directly to tableData
//     this.tableData[this.selectedRange.startRow][
//       this.selectedRange.startCol
//     ].cell = this.tempFieldFormGroup.value;

//     // this is use to trigger table formgroup
//     this.onCellFieldSaved.emit();
//     this.dismissModal();
//   }

//   getAlphabetIndex(index: number): string {
//     return (index + 10).toString(36).toUpperCase();
//   }

//   get cellIndex(): number {
//     return this.rowIndex * this.columnCount + this.colIndex;
//   }
// }
