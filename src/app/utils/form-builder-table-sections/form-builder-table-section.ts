import { FormFieldTypes } from 'src/app/type/form-field-types.enum';
import { Cell, TableDataType } from '../../type/table-section.model';

export default class FormBuilderTableSectionUtils {
  static defaultEmptyCell() {
    return {
      id: null,
      name: null,
      description: null,
      type: 'Static Text',
      default: null,
      required: false,
      minValue: null,
      maxValue: null,
      minValueInclusive: true,
      maxValueInclusive: true,
      absoluteMinValue: null,
      absoluteMaxValue: null,
      absoluteMinValueInclusive: true,
      absoluteMaxValueInclusive: true,
      minLength: null,
      maxLength: null,
      options: [],
      maxSelectableOptions: null,
      uom: null,
      validationHint: '',
      absoluteValidationHint: '',
      files: [],
      hasDigitalSignature: false,
      signatures: null,
      isNewOrAmended: false,
      amendmentRemarks: null,
    };
  }

  static defaultIds(sectionIndex: number) {
    return {
      sectionId: 'section-' + sectionIndex,
      sectionCollapsibleId: 'section-collapse-' + sectionIndex,
      sectionAccordionId: 'section-accordion-' + sectionIndex,
      deleteSectionModalId: 'section-delete-modal-' + sectionIndex,
      deleteSectionFieldModalId: 'section-field-delete-modal-' + sectionIndex,
      duplicateSectionId: 'section-duplicate' + sectionIndex,
      duplicateSectionFieldId: 'section-field-duplicate' + sectionIndex,
      rowCountId: 'section-' + sectionIndex + '-rowcount',
      columnCountId: 'section-' + sectionIndex + '-columncount',
    };
  }

  static flattenArrayAs(as = '', tableData: TableDataType) {
    return tableData
      .map((row) => {
        return row.map((col: any) =>
          as.includes('Span') ? col.spanInfo[as] : col[as]
        );
      })
      .flat();
  }

  static validateByFieldType(value: any): boolean {
    const {
      type,
      options,
      name,
      signatures,
      amendmentRemarks,
      hasDigitalSignature,
      required,
    } = value;
    let pass = false;

    switch (type) {
      case FormFieldTypes.StaticText:
      case FormFieldTypes.StaticRichText:
        pass = !!name;
        break;
      case FormFieldTypes.Text:
      case FormFieldTypes.Date:
      case FormFieldTypes.Number:
      case FormFieldTypes.PassFail:
      case FormFieldTypes.RichText:
        // passing true for field copy
        pass = true;
        break;
      case FormFieldTypes.MultipleOptions:
        pass = options.length > 0;
        break;
      case FormFieldTypes.RadioButtonGroup:
        pass = options.length > 0;
        break;
      case FormFieldTypes.DigitalSignature:
        pass = signatures.length > 0 || hasDigitalSignature;
        break;
      case FormFieldTypes.Tme:
        pass = !!name || !!amendmentRemarks || !!required;
        break;
      default:
        pass = false;
        break;
    }

    return pass;
  }

  static resetFieldId(formSectionFieldSpecs: any): void {
    formSectionFieldSpecs.id = null;
  }

  /*
   * this validateTableData function is to check data wether this has
   * new data (create) or it has existing data (edit).
   * first => check each cell has an id or not
   * second => check the field is the fields has length > 1 (length = 1 means it has default value)
   * if field has a default value so it means it is a new table not from existing table
   * */
  static validateTableData(
    tableData: any,
    authoredForm: any,
    sectionIndex: number
  ) {
    const authoredFormBySections =
      authoredForm.sections[sectionIndex] &&
      authoredForm.sections[sectionIndex].fields.length > 1;

    const mapper = this.flattenArrayAs('cell', tableData).map((i: any) => i.id);

    return (
      mapper.some((id: any) => id !== '' && id !== null) ||
      authoredFormBySections
    );
  }

  /**
   * This function convert old format into matrix format that
   * @returns array of array shape
   */
  static generateTable(setionGroup: any, tableViewSpecs: any) {
    const tableData: any = [];
    const parent: any = {};
    // this.sectionFormGroup.value
    const { fields } = setionGroup;
    const { rowSpan, colSpan, visible } = tableViewSpecs;

    for (let i = 0; i < tableViewSpecs.numberOfRows; i++) {
      for (let j = 0; j < tableViewSpecs.numberOfColumns; j++) {
        parent[`${i}:${j}`] = {
          cellIndex: i * tableViewSpecs.numberOfColumns + j,
        };
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

      if (!tableData[row]) {
        tableData[row] = [];
      }

      tableData[row][col] = value as Cell;
    });

    return tableData;
  }

  static numberToColumnLetter = (index: number): string => {
    let letter = '';
    while (index >= 0) {
      letter = String.fromCharCode((index % 26) + 65) + letter;
      index = Math.floor(index / 26) - 1;
    }
    return letter;
  };
}
