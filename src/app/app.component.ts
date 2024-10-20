import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subscription } from 'rxjs';

import { AppToastService } from './services/AppToastService';

// models
import { AuthoredForm } from './type/authored-form.model';
import { FormType } from './type/form-type.model';
import { FormSectionFieldSpecs } from './type/form-specs.model';
import { TableSectionViewSpecs } from './type/table-section-view-specs.model';

// utils

import {
  TableCellUtils,
  TableColumnUtils,
  TableRowUtils,
  FormBuilderTableSectionUtils,
} from './utils/form-builder-table-sections';

import { MODAL_OPTIONS_SM } from './constants/app-constants';

import {
  Cell,
  RangeProperties,
  TableDataType,
} from './type/table-section.model';
import FormBuilderUtils from './utils/form-builder.utils';
import { dummy_form_data } from 'src/shared/form-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('tableContainer') tableContainer: ElementRef;
  @ViewChild('tableBody') tableBody: ElementRef;

  sectionIndex: number = 0;
  sectionCount: number;
  sectionFormGroup: FormGroup;
  activateEditMode: boolean = true;
  @Input() submitted: boolean;
  authoredForm: any = dummy_form_data.data.authoredForm;
  formTypeSpecs: FormType = dummy_form_data.data.formTypeSpecs;
  sectionListFormArray: FormArray;

  @Output() duplicateFormSection = new EventEmitter<number>();
  @Output() deleteSectionEvent = new EventEmitter<number>();

  @ViewChild('mergeModal') mergeModalTemplate: TemplateRef<any>;
  @ViewChild('deleteRowModal') deleteRowModalTemplate: TemplateRef<any>;
  @ViewChild('deleteColumnModal') deleteColumnModalTemplate: TemplateRef<any>;

  ids: any;
  tableData: TableDataType = [];
  selectedMergeRange: any;
  initializeTableData: any;

  mouseDown: boolean = false;
  tableInit: boolean = false;
  isCollapsed: boolean = false;
  editRichTextbox: boolean = false;

  fieldIdToDelete: number;
  rowIndexToDelete: number;
  colIndexToDelete: number;
  initialRowsNumber: number;
  initialColumnsNumber: number;

  modalMessage: string;
  manualReferenceName: string;

  modalRef: BsModalRef;
  editModalRef: BsModalRef;

  currentModalTemplate: TemplateRef<any> | null = null;

  sectionFieldListFormArray: FormArray;

  tableViewSpecs: TableSectionViewSpecs;

  sectionToggleSubscription: Subscription;
  formBuilderFormGroup: FormGroup;
  selectedFieldToCopy: any = {
    status: false,
    value: {},
  };

  defaultSelectedRangeValue: RangeProperties = {
    startRow: -1,
    startCol: -1,
    endRow: -1,
    endCol: -1,
  };

  selectedRange: RangeProperties = this.defaultSelectedRangeValue;
  formVersionId: number = 1767;
  defaultCell = {
    cellIndex: null,
    cell: FormBuilderTableSectionUtils.defaultEmptyCell(),
    spanInfo: { rowSpan: 1, colSpan: 1 },
    visibility: true,
  };

  // Table Stack  purposes is store changes in table to achieve undo and redo action
  undoTableStack = [];
  redoTableStack = [];
  private readonly MAX_HISTORY = 10;

  constructor(
    private reactiveFormBuilder: FormBuilder,
    private readonly toastService: AppToastService,
    private readonly modalService: BsModalService
  ) {}

  ngOnInit(): void {
    const response = dummy_form_data;
    this.formBuilderFormGroup = FormBuilderUtils.createAuthoredFormFormGroup(
      this.authoredForm,
      this.formTypeSpecs,
      this.reactiveFormBuilder,
      !this.formVersionId
    );

    this.sectionListFormArray = this.formBuilderFormGroup.controls
      .sections as FormArray;

    this.sectionFormGroup = this.sectionListFormArray.controls[0] as FormGroup;
    this.sectionCount = this.sectionListFormArray.controls.length;
    console.log('sectionListFormArray', this.sectionListFormArray);

    this.ids = FormBuilderTableSectionUtils.defaultIds(this.sectionIndex);

    this.sectionFieldListFormArray = this.sectionFormGroup.controls
      .fields as FormArray;
    this.tableViewSpecs = this.sectionFormGroup.controls.tableViewSpecs
      .value as TableSectionViewSpecs;

    if (
      !this.tableInit &&
      this.tableViewSpecs.numberOfRows > 0 &&
      this.tableViewSpecs.numberOfColumns > 0 &&
      this.sectionFieldListFormArray.length > 0
    ) {
      this.initializeTable(true).then(() => {});
    }
  }

  async initializeTable(onFirstLoad = false) {
    if (
      !this.tableViewSpecs.numberOfRows ||
      !this.tableViewSpecs.numberOfColumns
    ) {
      return await this.toastService.error(
        'Number of rows and columns must be min 1'
      );
    }

    // store initial value before generate table function
    this.initialRowsNumber = this.tableViewSpecs.numberOfRows;
    this.initialColumnsNumber = this.tableViewSpecs.numberOfColumns;

    if (
      !onFirstLoad &&
      !FormBuilderTableSectionUtils.validateTableData(
        this.tableData,
        this.authoredForm,
        this.sectionIndex
      )
    ) {
      this.generateInitializeTable();
      this.updateTableDataAndTableViewSpecsToFormGroup();
    } else {
      this.generateTable();
      this.updateTableDataAndTableViewSpecsToFormGroup();
    }

    // deep copy the initial table Data
    this.initializeTableData = JSON.stringify(this.tableData);
    this.tableInit = true;
  }

  ngOnDestroy(): void {
    this.sectionToggleSubscription?.unsubscribe();
  }

  get formType(): string {
    return this.authoredForm.formType;
  }

  /**
   * Re-initialize table to begining
   */
  reInitializeTable() {
    this.tableInit = false;
  }

  replaceFormArrayValues(newValues: any[], formArray: FormArray) {
    // clear existing controls
    formArray.clear();

    // add new controls and set new value
    newValues.forEach((value) => {
      formArray.push(new FormControl(value));
    });
  }

  /**
   *  this generate table viewspecs will always call in updateTableDataAndTableViewSpecsToFormGroup
   *  cause this updateTableDataAndTableViewSpecsToFormGroup will execute in every
   *  action functions
   * */
  generateTableViewSpecs() {
    const visible = FormBuilderTableSectionUtils.flattenArrayAs(
      'visibility',
      this.tableData
    );
    const numberOfColumns = this.tableData[0].length;
    const numberOfRows = this.tableData.length;
    const columnWidth = 100 / numberOfColumns;

    return {
      numberOfRows,
      numberOfColumns,
      colWidths: Array(numberOfColumns).fill(`${columnWidth}%`),
      rowHeights: Array(numberOfRows).fill(`0px`),
      rowSpan: FormBuilderTableSectionUtils.flattenArrayAs(
        'rowSpan',
        this.tableData
      ),
      colSpan: FormBuilderTableSectionUtils.flattenArrayAs(
        'colSpan',
        this.tableData
      ),
      visible,
    };
  }

  /**
   * This function convert old format into matrix format that
   * @returns array of array shape
   */
  generateTable() {
    // reset initialisizing table data
    this.tableData = [];
    const parent: any = {};

    const { fields } = this.sectionFormGroup.value;
    const { rowSpan, colSpan, visible } = this.tableViewSpecs;

    for (let i = 0; i < this.initialRowsNumber; i++) {
      for (let j = 0; j < this.initialColumnsNumber; j++) {
        parent[`${i}:${j}`] = { cellIndex: i * this.initialColumnsNumber + j };
      }
    }

    for (let p = 0; p < Object.keys(parent).length; p++) {
      const keys = Object.keys(parent)[p];

      parent[keys] = {
        ...parent[keys],
        cell: fields[parent[keys].cellIndex],
        spanInfo: {
          rowSpan: rowSpan[parent[keys].cellIndex] || 1,
          colSpan: colSpan[parent[keys].cellIndex] || 1,
        },
        visibility: visible[parent[keys].cellIndex],
      };
    }

    const result = Object.entries(parent);

    result.forEach(([key, value]) => {
      const [row, col] = key.split(':').map(Number);

      if (!this.tableData[row]) {
        this.tableData[row] = [];
      }

      this.tableData[row][col] = value as Cell;
    });

    // reset range value
    this.resetSelectedRange();
    return parent;
  }

  /**
   * @Note
   * This generateInitializeTable function looks similiar with generateTable,
   * the different just on the assignee value, it cant be put together,
   * to avoid any confusion and it can effect the shape of the matrix
   */
  generateInitializeTable() {
    this.tableData = [];
    const parent: any = {};

    for (let i = 0; i < this.initialRowsNumber; i++) {
      for (let j = 0; j < this.initialColumnsNumber; j++) {
        parent[`${i}:${j}`] = { cellIndex: i * this.initialColumnsNumber + j };
      }
    }

    for (let p = 0; p < Object.keys(parent).length; p++) {
      const keys = Object.keys(parent)[p];
      parent[keys] = {
        ...this.defaultCell,
        cellIndex: parent[keys].cellIndex,
      };
    }

    const result = Object.entries(parent);

    result.forEach(([key, value]) => {
      const [row, col] = key.split(':').map(Number);

      if (!this.tableData[row]) {
        this.tableData[row] = [];
      }

      this.tableData[row][col] = value as Cell;
    });

    this.resetSelectedRange();
    return parent;
  }

  /**
   *  this updateTableDataAndTableViewSpecsToFormGroup function is
   *  to update table data matrix to form array and table view specs to it object,
   *  the result will use as payload data
   */
  updateTableDataAndTableViewSpecsToFormGroup(action?: string) {
    const newTableViewSpecs = this.generateTableViewSpecs();

    const flattenedCell = FormBuilderTableSectionUtils.flattenArrayAs(
      'cell',
      this.tableData
    );

    this.sectionFormGroup.get('tableViewSpecs')?.patchValue(newTableViewSpecs);

    this.replaceFormArrayValues(flattenedCell, this.sectionFieldListFormArray);
    this.resetSelectedRange();

    if (!action) {
      this.saveState();
      this.selectedFieldToCopy = {
        status: false,
        value: {},
      };
    }
  }

  private saveState() {
    const currentState = JSON.stringify(this.tableData);
    this.undoTableStack.push(currentState);
    if (this.undoTableStack.length > this.MAX_HISTORY) {
      this.undoTableStack.shift();
    }
    this.redoTableStack = [];
  }

  onReset() {
    this.tableData = JSON.parse(this.initializeTableData);

    if (
      FormBuilderTableSectionUtils.validateTableData(
        JSON.parse(this.initializeTableData),
        this.authoredForm,
        this.sectionIndex
      )
    ) {
      this.generateTable();
    } else {
      this.generateInitializeTable();
    }
    this.updateTableDataAndTableViewSpecsToFormGroup();
    this.undoTableStack = [];
    this.redoTableStack = [];
    this.selectedFieldToCopy = {
      status: false,
      value: {},
    };
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // common keyboard or mac keyboard
    if (event.ctrlKey || event.metaKey) {
      switch (event.key.toLowerCase()) {
        case 'z':
          event.preventDefault();
          this.undoTable();
          break;
        case 'y':
          event.preventDefault();
          this.redoTable();
          break;
        case 'c':
          event.preventDefault();
          if (this.isSelectedRangeHasValue()) {
            this.copyCell(
              this.selectedRange.startRow,
              this.selectedRange.startCol
            );
          } else {
            this.toastService.warning(
              "Nothing to select! Please ensure there's a cell you select."
            );
          }
          break;
        case 'v':
          event.preventDefault();
          if (this.isSelectedRangeHasValue()) {
            this.pasteCell(
              this.selectedRange.startRow,
              this.selectedRange.startCol
            );
          } else {
            this.toastService.warning(
              "Nothing to select! Please ensure there's a cell you select."
            );
          }
          break;
      }
    }
  }

  resetSelectedRange() {
    this.selectedRange = this.defaultSelectedRangeValue;
  }

  confirmDeleteSection(): void {
    const parent = this.sectionFormGroup.parent as FormArray;
    this.deleteSectionEvent.emit(this.sectionIndex);
    parent.removeAt(this.sectionIndex);
  }

  generatePathParts(): string[] {
    return ['eFormBuilder', this.formType];
  }

  onMouseLeave() {
    if (this.mouseDown) this.mouseDown = false;
  }

  startSelecting(rowIndex: number, colIndex: number) {
    this.mouseDown = true;

    this.selectedRange = {
      startRow: rowIndex,
      startCol: colIndex,
      endRow: rowIndex,
      endCol: colIndex,
    };
  }

  /**
   * Update seleted cell
   * @param rowIndex
   * @param colIndex
   */
  updateSelection(rowIndex: number, colIndex: number) {
    if (this.mouseDown) {
      const { startRow, startCol } = this.selectedRange;

      this.selectedRange = TableCellUtils.rangeUpdate(
        startRow,
        startCol,
        rowIndex,
        colIndex,
        this.tableData
      );
    }
  }

  /**
   * Update and validate the selection move from update range
   * @param rowIndex
   * @param colIndex
   */
  endSelecting() {
    this.mouseDown = false;
  }

  scrollYAxisIfNeeded(startRowIndex: number, endRowIndex: number) {
    const containerRect =
      this.tableContainer.nativeElement.getBoundingClientRect();
    const rowRect = this.tableBody.nativeElement.getBoundingClientRect();
    const rows = this.tableBody.nativeElement.rows;
    const startRowRect = rows[startRowIndex].getBoundingClientRect();
    const endRowRect = rows[endRowIndex].getBoundingClientRect();
    const bottomArea = endRowRect.bottom - startRowRect.bottom;

    const scrollThreshold = 100;
    const scrollStep = 30;

    const scrollDownCondition =
      bottomArea > 100 &&
      endRowRect.bottom > containerRect.bottom - scrollThreshold;
    const scrollUpCondition =
      endRowRect.top < containerRect.top + scrollThreshold;

    const maxRowSpan = Math.max(
      ...this.tableData[0].map((row: any) => row.spanInfo.rowSpan)
    );
    const totalRows = this.tableData.length;

    if (
      (startRowIndex === 0 && endRowIndex === 0) ||
      endRowIndex === totalRows
    ) {
      this.endSelecting();
      return;
    }
    const scrollDownSpeed: number = 800;
    const scrollUpSpeed: number = 100;
    if (scrollDownCondition && endRowIndex > 1) {
      const scrollInterval = setInterval(() => {
        if (this.mouseDown) {
          this.tableContainer.nativeElement.scrollTop += scrollStep;
        } else {
          clearInterval(scrollInterval);
        }
      }, scrollDownSpeed);
    }

    if (scrollUpCondition && endRowIndex > 1) {
      const scrollInterval = setInterval(() => {
        if (this.mouseDown) {
          this.tableContainer.nativeElement.scrollTop -= scrollStep;
        } else {
          clearInterval(scrollInterval);
        }
      }, scrollUpSpeed);
    }
  }

  getSpan(field: any) {
    return { row: field.spanInfo.rowSpan, col: field.spanInfo.colSpan };
  }

  getColumnHeaders(): string[] {
    const numberOfColumns = this.tableData[0]?.length || 0;

    const columns = [];
    for (let i = 0; i < numberOfColumns; i++) {
      columns.push(FormBuilderTableSectionUtils.numberToColumnLetter(i));
    }
    return columns;
  }

  isCellSelected(rowIndex: number, colIndex: number) {
    return (
      rowIndex >=
        Math.min(this.selectedRange.startRow, this.selectedRange.endRow) &&
      rowIndex <=
        Math.max(this.selectedRange.startRow, this.selectedRange.endRow) &&
      colIndex >=
        Math.min(this.selectedRange.startCol, this.selectedRange.endCol) &&
      colIndex <=
        Math.max(this.selectedRange.startCol, this.selectedRange.endCol)
    );
  }

  rearrangeSection(shift: number, currentIndex: number): void {
    // FormBuilderUtils.rearrangeFormArrayPosition(
    //   this.sectionListFormArray,
    //   shift,
    //   currentIndex
    // );
  }

  dismissModal() {
    this.modalRef.hide();
  }

  insertColumn(colIndexToInsert: number) {
    TableColumnUtils.insertColumnByIndex(
      colIndexToInsert,
      this.tableData,
      this.defaultCell
    );

    this.updateTableDataAndTableViewSpecsToFormGroup();
  }

  duplicateColumn(colIndexToDuplicate: number) {
    TableColumnUtils.duplicateSingleColumn(colIndexToDuplicate, this.tableData);
    this.updateTableDataAndTableViewSpecsToFormGroup();
  }

  insertRow(rowIndexToInsert: number) {
    TableRowUtils.insertRowByIndex(rowIndexToInsert, this.tableData);
    this.updateTableDataAndTableViewSpecsToFormGroup();
  }

  duplicateRow(rowIndexToDuplicate: number) {
    TableRowUtils.duplicateRowByIndex(rowIndexToDuplicate, this.tableData);
    this.updateTableDataAndTableViewSpecsToFormGroup();
  }

  showDeleteRowModal(rowIndex: number) {
    this.rowIndexToDelete = rowIndex;

    this.modalRef = this.modalService.show(
      this.deleteRowModalTemplate,
      MODAL_OPTIONS_SM
    );
  }

  showDeleteColumnModal(colIndex: number) {
    this.colIndexToDelete = colIndex;
    this.modalRef = this.modalService.show(
      this.deleteColumnModalTemplate,
      MODAL_OPTIONS_SM
    );
  }

  mergeCells() {
    if (
      this.selectedRange.startRow === -1 &&
      this.selectedRange.endRow === -1
    ) {
      return;
    }

    const { startRow, endRow, startCol, endCol } = this.selectedRange;
    const startRowRange = Math.min(startRow, endRow);
    const endRowRange = Math.max(startRow, endRow);
    const startColRange = Math.min(startCol, endCol);
    const endColRange = Math.max(startCol, endCol);

    // filtere span has span row / col
    const filteredSpanCell = TableCellUtils.getCellVisibility(
      this.selectedRange,
      this.tableData
    ).filter((f) => f.spanInfo.rowSpan > 1 || f.spanInfo.colSpan > 1);

    // filtered cell that has visibility = true and its not the spanned row \ col
    const filteredCell = TableCellUtils.getCellVisibility(
      this.selectedRange,
      this.tableData
    ).filter((f) => !(f.spanInfo.rowSpan > 1 || f.spanInfo.colSpan > 1));

    if (filteredSpanCell.length > 0 && filteredCell.length === 0) {
      return;
    } else {
      const existingValues = TableCellUtils.checkExistingValues(
        startRowRange,
        endRowRange,
        startColRange,
        endColRange,
        this.tableData
      );

      if (existingValues.length > 0) {
        this.showActionModal(existingValues);
        this.selectedMergeRange = {
          startRowRange,
          endRowRange,
          startColRange,
          endColRange,
        };
      } else {
        TableCellUtils.performMerge(
          startRowRange,
          endRowRange,
          startColRange,
          endColRange,
          this.tableData
        );
        this.updateTableDataAndTableViewSpecsToFormGroup();
      }
    }
  }

  showActionModal(existingValues: string[]) {
    this.modalMessage = `The following cells contain values that will be overwritten:\n${existingValues.join(
      '\n'
    )}\n\nDo you want to proceed with the merge?`;

    this.modalRef = this.modalService.show(
      this.mergeModalTemplate,
      MODAL_OPTIONS_SM
    );
  }

  undoMergeCells(rangeProperties?: any) {
    const hasRangeProperties =
      rangeProperties && Object.keys(rangeProperties).length > 0;
    if (
      !hasRangeProperties &&
      this.selectedRange.startRow === -1 &&
      this.selectedRange.endRow === -1
    ) {
      return;
    }

    const spanInfo = {
      rowSpan: 1,
      colSpan: 1,
    };

    let currentCell;

    let startRowMin;
    let startColMin;
    let endRowsMax;
    let endColMax;

    if (hasRangeProperties) {
      const { startRow, endRow, startCol, endCol } = rangeProperties;

      currentCell = this.tableData[startRow][startCol];

      startRowMin = Math.min(startRow, endRow);
      startColMin = Math.min(startCol, endCol);
      endRowsMax = Math.max(startRow, endRow);
      endColMax = Math.max(startCol, endCol);
    } else {
      const { startRow, endRow, startCol, endCol } = this.selectedRange;

      currentCell = this.tableData[startRow][startCol];

      startRowMin = Math.min(startRow, endRow);
      startColMin = Math.min(startCol, endCol);
      endRowsMax = Math.max(startRow, endRow);
      endColMax = Math.max(startCol, endCol);
    }

    for (
      let r = startRowMin;
      r <= endRowsMax + (currentCell.spanInfo.rowSpan - 1);
      r++
    ) {
      for (
        let c = startColMin;
        c <= endColMax + (currentCell.spanInfo.colSpan - 1);
        c++
      ) {
        if (
          r >= 0 &&
          r < this.tableData.length &&
          c >= 0 &&
          c < this.tableData[0].length
        ) {
          const cell = this.tableData[r][c];

          this.tableData[r][c] = {
            ...this.tableData[r][c],
            visibility: true,
            spanInfo,
          };
        }
      }
    }

    // regenerate table view specs
    this.updateTableDataAndTableViewSpecsToFormGroup();
  }

  confirmDeleteRow() {
    if (this.tableData.length > 0) {
      TableRowUtils.deleteRowByIndex(
        this.rowIndexToDelete,
        this.tableData,
        (e) => this.undoMergeCells(e)
      );
      this.updateTableDataAndTableViewSpecsToFormGroup();
    } else {
      this.toastService.warning(
        'The table must have at least one row. Deletion is not allowed.'
      );
    }
    this.dismissModal();
    this.resetSelectedRange();
  }

  confirmMergeModal() {
    const { startRowRange, endRowRange, startColRange, endColRange } =
      this.selectedMergeRange;

    TableCellUtils.performMerge(
      startRowRange,
      endRowRange,
      startColRange,
      endColRange,
      this.tableData
    );
    this.updateTableDataAndTableViewSpecsToFormGroup();

    this.dismissModal();
  }

  getTableSectionField(rowIndex: number, colIndex: number) {
    return FormBuilderUtils.createTableSectionFieldFormGroup(
      this.tableData[rowIndex][colIndex].cell,
      this.reactiveFormBuilder,
      this.formTypeSpecs
    );
  }

  getCellType(rowIndex: number, colIndex: number): string {
    return this.tableData[rowIndex][colIndex]?.cell?.type;
  }

  getCellLabel(rowIndex: number, colIndex: number): string {
    return this.tableData[rowIndex][colIndex]?.cell?.name;
  }

  confirmDeleteColumn() {
    if (this.tableData[0].length <= 1) {
      this.toastService.warning(
        'The table must have at least one column. Deletion is not allowed.'
      );

      return;
    }

    TableColumnUtils.deleteColumnByIndex(this.colIndexToDelete, this.tableData);
    this.updateTableDataAndTableViewSpecsToFormGroup();
    this.resetSelectedRange();
    this.dismissModal();
  }

  isSelectedRangeHasValue(): boolean {
    const keys = Object.keys(this.selectedRange);

    return keys.every((key) => this.selectedRange[key] !== -1);
  }

  openCellFieldModal() {
    // this.tableSectionFieldComponent.openCellFieldModal();
  }

  checkSelectedCopiedPosition(by?: string) {
    let passed = false;

    if (by === 'paste') {
      passed = Object.keys(this.selectedFieldToCopy.value).length === 0;
    } else {
      passed = true;
    }

    return passed;
  }

  copyCell(rowIndex: number, colIndex: number) {
    const fieldToCopied = this.tableData[rowIndex][colIndex]
      .cell as FormSectionFieldSpecs;

    FormBuilderTableSectionUtils.resetFieldId(fieldToCopied);

    if (FormBuilderTableSectionUtils.validateByFieldType(fieldToCopied)) {
      this.selectedFieldToCopy = {
        status: true,
        value: fieldToCopied,
        copiedFrom: { row: rowIndex, col: colIndex },
      };
    } else {
      this.toastService.warning(
        "Nothing to copy! Please ensure there's something to duplicate."
      );

      // reset selection field
      this.selectedFieldToCopy = {
        status: false,
        value: {},
      };
    }
  }

  pasteCell(rowIndex: number, colIndex: number) {
    if (
      this.selectedFieldToCopy.copiedFrom.row !== rowIndex ||
      this.selectedFieldToCopy.copiedFrom.col !== colIndex
    ) {
      const fieldToCopyValue = this.selectedFieldToCopy.value;

      if (Object.keys(fieldToCopyValue).length > 0) {
        this.tableData[rowIndex][colIndex].cell = fieldToCopyValue;
      }
      this.updateTableDataAndTableViewSpecsToFormGroup('paste');
    }
  }

  isCellCopied(rowIndex: number, colIndex: number, by: string = '') {
    const copiedFrom = this.selectedFieldToCopy.copiedFrom;

    return (
      by.length === 0 &&
      Object.keys(this.selectedFieldToCopy).length > 0 &&
      copiedFrom &&
      copiedFrom?.row === rowIndex &&
      copiedFrom?.col === colIndex
    );
  }

  updateCellField() {
    this.updateTableDataAndTableViewSpecsToFormGroup();
  }

  getAlphabetIndex(index: number): string {
    return (index + 10).toString(36).toUpperCase();
  }

  canUndo(): boolean {
    return this.undoTableStack.length > 0;
  }

  canRedo(): boolean {
    return this.redoTableStack.length > 0;
  }

  undoTable() {
    if (this.canUndo()) {
      const currentState = JSON.stringify(this.tableData);
      this.redoTableStack.push(currentState);

      const previousState = this.undoTableStack.pop()!;
      this.tableData = JSON.parse(previousState);
      this.updateTableDataAndTableViewSpecsToFormGroup('undo');
    }
  }

  redoTable() {
    if (this.canRedo()) {
      const currentState = JSON.stringify(this.tableData);
      this.undoTableStack.push(currentState);

      const nextState = this.redoTableStack.pop()!;
      this.tableData = JSON.parse(nextState);
      this.updateTableDataAndTableViewSpecsToFormGroup('redo');
    }
  }
}
