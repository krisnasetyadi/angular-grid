import { ChangeDetectorRef, Component } from '@angular/core';
import { CustomCellComponent } from './custom-cell';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'spread-sheet';
 
  tableViewSpecs: any =   {
    "name": "TEST_TABLE_TEST",
    "description": "",
    "files": [],
    "fields": [
        {
            "id": "9478fa770d9545d7a40bc931fbab8034",
            "name": "1",
            "description": null,
            "type": "Static Text",
            "default": null,
            "required": true,
            "minValue": null,
            "maxValue": null,
            "minValueInclusive": true,
            "maxValueInclusive": true,
            "absoluteMinValue": null,
            "absoluteMaxValue": null,
            "absoluteMinValueInclusive": true,
            "absoluteMaxValueInclusive": true,
            "minLength": null,
            "maxLength": null,
            "maxSelectableOptions": null,
            "uom": null,
            "validationHint": "",
            "absoluteValidationHint": "",
            "options": [],
            "files": [],
            "hasDigitalSignature": false,
            "signatures": null,
            "isNewOrAmended": false,
            "amendmentRemarks": null
        },
        {
            "id": "97d428948505460bbd428edcfafc19cd",
            "name": null,
            "description": null,
            "type": "Static Text",
            "default": null,
            "required": true,
            "minValue": null,
            "maxValue": null,
            "minValueInclusive": true,
            "maxValueInclusive": true,
            "absoluteMinValue": null,
            "absoluteMaxValue": null,
            "absoluteMinValueInclusive": true,
            "absoluteMaxValueInclusive": true,
            "minLength": null,
            "maxLength": null,
            "maxSelectableOptions": null,
            "uom": null,
            "validationHint": "",
            "absoluteValidationHint": "",
            "options": [],
            "files": [],
            "hasDigitalSignature": false,
            "signatures": null,
            "isNewOrAmended": false,
            "amendmentRemarks": null
        },
        {
            "id": "60af3d2b9dba44cd96661a77170e76d1",
            "name": null,
            "description": null,
            "type": "Static Text",
            "default": null,
            "required": true,
            "minValue": null,
            "maxValue": null,
            "minValueInclusive": true,
            "maxValueInclusive": true,
            "absoluteMinValue": null,
            "absoluteMaxValue": null,
            "absoluteMinValueInclusive": true,
            "absoluteMaxValueInclusive": true,
            "minLength": null,
            "maxLength": null,
            "maxSelectableOptions": null,
            "uom": null,
            "validationHint": "",
            "absoluteValidationHint": "",
            "options": [],
            "files": [],
            "hasDigitalSignature": false,
            "signatures": null,
            "isNewOrAmended": false,
            "amendmentRemarks": null
        },
        {
            "id": "6a04bcc7e473499a8f657903ef9dbb01",
            "name": null,
            "description": null,
            "type": "Static Text",
            "default": null,
            "required": true,
            "minValue": null,
            "maxValue": null,
            "minValueInclusive": true,
            "maxValueInclusive": true,
            "absoluteMinValue": null,
            "absoluteMaxValue": null,
            "absoluteMinValueInclusive": true,
            "absoluteMaxValueInclusive": true,
            "minLength": null,
            "maxLength": null,
            "maxSelectableOptions": null,
            "uom": null,
            "validationHint": "",
            "absoluteValidationHint": "",
            "options": [],
            "files": [],
            "hasDigitalSignature": false,
            "signatures": null,
            "isNewOrAmended": false,
            "amendmentRemarks": null
        },
        {
            "id": "bccf9cb797834954902e52c8c5cda835",
            "name": "2",
            "description": null,
            "type": "Static Text",
            "default": null,
            "required": true,
            "minValue": null,
            "maxValue": null,
            "minValueInclusive": true,
            "maxValueInclusive": true,
            "absoluteMinValue": null,
            "absoluteMaxValue": null,
            "absoluteMinValueInclusive": true,
            "absoluteMaxValueInclusive": true,
            "minLength": null,
            "maxLength": null,
            "maxSelectableOptions": null,
            "uom": null,
            "validationHint": "",
            "absoluteValidationHint": "",
            "options": [],
            "files": [],
            "hasDigitalSignature": false,
            "signatures": null,
            "isNewOrAmended": false,
            "amendmentRemarks": null
        },
        {
            "id": "2f130d5f18d749528f6a59900b42de63",
            "name": null,
            "description": null,
            "type": "Static Text",
            "default": null,
            "required": true,
            "minValue": null,
            "maxValue": null,
            "minValueInclusive": true,
            "maxValueInclusive": true,
            "absoluteMinValue": null,
            "absoluteMaxValue": null,
            "absoluteMinValueInclusive": true,
            "absoluteMaxValueInclusive": true,
            "minLength": null,
            "maxLength": null,
            "maxSelectableOptions": null,
            "uom": null,
            "validationHint": "",
            "absoluteValidationHint": "",
            "options": [],
            "files": [],
            "hasDigitalSignature": false,
            "signatures": null,
            "isNewOrAmended": false,
            "amendmentRemarks": null
        },
        {
            "id": "362d45c698654198aa27ed5fde2e51db",
            "name": null,
            "description": null,
            "type": "Static Text",
            "default": null,
            "required": true,
            "minValue": null,
            "maxValue": null,
            "minValueInclusive": true,
            "maxValueInclusive": true,
            "absoluteMinValue": null,
            "absoluteMaxValue": null,
            "absoluteMinValueInclusive": true,
            "absoluteMaxValueInclusive": true,
            "minLength": null,
            "maxLength": null,
            "maxSelectableOptions": null,
            "uom": null,
            "validationHint": "",
            "absoluteValidationHint": "",
            "options": [],
            "files": [],
            "hasDigitalSignature": false,
            "signatures": null,
            "isNewOrAmended": false,
            "amendmentRemarks": null
        },
        {
            "id": "b569e85116f9458f889332a396f82f2d",
            "name": "6",
            "description": null,
            "type": "Static Text",
            "default": null,
            "required": true,
            "minValue": null,
            "maxValue": null,
            "minValueInclusive": true,
            "maxValueInclusive": true,
            "absoluteMinValue": null,
            "absoluteMaxValue": null,
            "absoluteMinValueInclusive": true,
            "absoluteMaxValueInclusive": true,
            "minLength": null,
            "maxLength": null,
            "maxSelectableOptions": null,
            "uom": null,
            "validationHint": "",
            "absoluteValidationHint": "",
            "options": [],
            "files": [],
            "hasDigitalSignature": false,
            "signatures": null,
            "isNewOrAmended": false,
            "amendmentRemarks": null
        },
        {
            "id": "5a4d06ad6a974903a7c9d6c1bd66f7e6",
            "name": null,
            "description": null,
            "type": "Static Text",
            "default": null,
            "required": true,
            "minValue": null,
            "maxValue": null,
            "minValueInclusive": true,
            "maxValueInclusive": true,
            "absoluteMinValue": null,
            "absoluteMaxValue": null,
            "absoluteMinValueInclusive": true,
            "absoluteMaxValueInclusive": true,
            "minLength": null,
            "maxLength": null,
            "maxSelectableOptions": null,
            "uom": null,
            "validationHint": "",
            "absoluteValidationHint": "",
            "options": [],
            "files": [],
            "hasDigitalSignature": false,
            "signatures": null,
            "isNewOrAmended": false,
            "amendmentRemarks": null
        }
    ],
    "isTableSection": true,
    "tableViewSpecs": {
        "numberOfRows": 3,
        "numberOfColumns": 3,
        "rowSpan": [
            2,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1
        ],
        "colSpan": [
            1,
            1,
            1,
            1,
            2,
            1,
            1,
            1,
            1
        ],
        "visible": [
            true,
            true,
            true,
            false,
            true,
            false,
            true,
            true,
            true
        ]
    }
}

constructor(private cdr: ChangeDetectorRef){}

  ngOnInit() {
    this.generateMatrix()
  }

 
  tableData: any = []
  sectionFieldListFormArray = []
  defaultSelectedRangeValue = { startRow: -1, startCol: -1, endRow: -1, endCol: -1}
  selectedRange = this.defaultSelectedRangeValue
  startRange = {}
  endRange = {}
  updateRange = {}
  isSelected = {}

  generateMatrix() {
    this.testTable = []
    const parent: any = {};
    const columnsNumber = this.tableViewSpecs.tableViewSpecs.numberOfColumns

    for (let i = 0; i < this.tableViewSpecs.tableViewSpecs.numberOfRows; i++) {
      for (let j = 0; j < this.tableViewSpecs.tableViewSpecs.numberOfColumns; j++) {
        parent[`${i}:${j}`] = { cellIndex: (i * columnsNumber) + j};
      }
    }
    
    for(let p = 0; p < Object.keys(parent).length; p++) {
      const keys = Object.keys(parent)[p]

      parent[keys] = {
        ...parent[keys],
        cell: this.tableViewSpecs.fields[parent[keys].cellIndex],
        spanInfo: {
          rowSpan: this.tableViewSpecs.tableViewSpecs.rowSpan[parent[keys].cellIndex] || 1,
          colSpan: this.tableViewSpecs.tableViewSpecs.colSpan[parent[keys].cellIndex] || 1,
        },
        visibility: this.tableViewSpecs.tableViewSpecs.visible[parent[keys].cellIndex],
      }
    }

    const result =  Object.entries(parent)
     
    result.forEach(([key, value]) => {
      const [row, col] = key.split(':').map(Number);
 
      if (!this.tableData[row]) {
        this.tableData[row] = []; 
      }

      this.tableData[row][col] = value
    })

    console.log('this.tableData', (this.tableData))

    return parent
  }
  
  getSpan(field: any) {
    return {row:field.spanInfo.rowSpan, col: field.spanInfo.colSpan}
  }

  handleCellClick(field: any) {
    console.log('field', field)
  }

  startSelecting(rowIndex: number, colIndex: number){
    this.startRange = { rowIndex, colIndex }
    this.selectedRange = { startRow: rowIndex, startCol: colIndex, endRow: rowIndex, endCol: colIndex}
    // console.log('startSelecting', [])
  }

  endSelecting(rowIndex: number, colIndex: number) {
    this.endRange = { rowIndex, colIndex }
    this.selectedRange = { ...this.selectedRange, endRow: rowIndex, endCol: colIndex}
    // console.log('endSelecting', [])
  }

  updateSelection(rowIndex: number, colIndex: number) {
    this.updateRange = { rowIndex, colIndex  }

    if (this.selectedRange.startRow >= 0) {
      this.selectedRange.endRow = rowIndex;
      this.selectedRange.endCol = colIndex;
    }
  }  

  isCellSelected(rowIndex: number, colIndex: number) {
    this.isSelected = { rowIndex, colIndex }
    // console.log('isCellSelected', [])
    return rowIndex >= Math.min(this.selectedRange.startRow, this.selectedRange.endRow)
    && rowIndex <= Math.max(this.selectedRange.startRow, this.selectedRange.endRow)
    && colIndex >= Math.min(this.selectedRange.startCol, this.selectedRange.endCol)
    && colIndex <= Math.max(this.selectedRange.startCol, this.selectedRange.endCol)
  }

  toMerge: any = {}
  testTable: any = []
  mergeCells(){
    if(this.selectedRange.startRow === -1 && this.selectedRange.endRow === -1) {
      return ;
    }

    const { startRow, endRow, startCol, endCol } =  this.selectedRange
    
    for (let r = startRow; r <= endRow; r++) {
      for(let c = startCol; c <= endCol; c++) {
        if(r !== startRow  || c !== startCol) {

          this.toMerge[`${r}:${c}`] = { r, c, visibility: false }
          this.tableData[r][c] = {
            ...this.tableData[r][c], 
            visibility: false 
          }

        } else {
          const spanInfo =   {
            rowSpan: (endRow - startRow) + 1,
            colSpan: (endCol - startCol) + 1
          }
          this.toMerge[`${r}:${c}`] = {...this.toMerge[`${r}:${c}`], spanInfo }
          this.tableData[r][c] = {
            ...this.tableData[r][c], 
            spanInfo,
          }
        }
      }
    }
    

    this.cdr.detectChanges()
    this.testTable = [...this.tableData]
  }

  undoMergeCells() {
    if(this.selectedRange.startRow === -1 && this.selectedRange.endRow === -1) {
      return ;
    }

    const { startRow, endRow, startCol, endCol } =  this.selectedRange
    
    for (let r = startRow; r <= endRow; r++) {
      for(let c = startCol; c <= endCol; c++) {

         this.toMerge[`${r}:${c}`] = { r, c, visibility: true };
            this.tableData[r][c] = {
                ...this.tableData[r][c],
                visibility: true,
                spanInfo: {
                  spanRow: 1,
                  spanCol: 1
                }
            };
      }
    }
    
    
    this.cdr.detectChanges()
    this.testTable = [...this.tableData]
  }
}
