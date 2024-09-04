import { ChangeDetectorRef, Component } from '@angular/core';
import data from '../shared/data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'spread-sheet';

  tableViewSpecs: any = data;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.generateTable();
  }

  tableData: any = [];
  sectionFieldListFormArray = [];
  defaultSelectedRangeValue = {
    startRow: -1,
    startCol: -1,
    endRow: -1,
    endCol: -1,
  };
  selectedRange = this.defaultSelectedRangeValue;
  startRange = {};
  updateRangetest = {};
  updateRange = {};
  isSelected = {};
  mouseDown = false;

  generateTable() {
    this.testTable = [];
    const parent: any = {};
    const columnsNumber = this.tableViewSpecs.tableViewSpecs.numberOfColumns;

    for (let i = 0; i < this.tableViewSpecs.tableViewSpecs.numberOfRows; i++) {
      for (
        let j = 0;
        j < this.tableViewSpecs.tableViewSpecs.numberOfColumns;
        j++
      ) {
        parent[`${i}:${j}`] = { cellIndex: i * columnsNumber + j };
      }
    }

    for (let p = 0; p < Object.keys(parent).length; p++) {
      const keys = Object.keys(parent)[p];

      parent[keys] = {
        ...parent[keys],
        cell: this.tableViewSpecs.fields[parent[keys].cellIndex],
        spanInfo: {
          rowSpan:
            this.tableViewSpecs.tableViewSpecs.rowSpan[
              parent[keys].cellIndex
            ] || 1,
          colSpan:
            this.tableViewSpecs.tableViewSpecs.colSpan[
              parent[keys].cellIndex
            ] || 1,
        },
        visibility:
          this.tableViewSpecs.tableViewSpecs.visible[parent[keys].cellIndex],
      };
    }

    const result = Object.entries(parent);

    result.forEach(([key, value]) => {
      const [row, col] = key.split(':').map(Number);

      if (!this.tableData[row]) {
        this.tableData[row] = [];
      }

      this.tableData[row][col] = value;
    });

    return parent;
  }

  getSpan(field: any) {
    return { row: field.spanInfo.rowSpan, col: field.spanInfo.colSpan };
  }

  rowSpan_tablec_spec_colSpan: any = [];
  startSelecting(rowIndex: number, colIndex: number) {
    this.mouseDown = true;

    const { rowSpan, colSpan } = this.tableData[rowIndex][colIndex].spanInfo;
    this.rowSpan_tablec_spec_colSpan = [rowSpan, colSpan];

    this.startRange = { rowIndex, colIndex };
    this.selectedRange = {
      startRow: rowIndex,
      startCol: colIndex,
      endRow: rowIndex,
      endCol: colIndex,
    };
  }

  endRangeTest = {};

  endSelecting(rowIndex: number, colIndex: number) {
    this.mouseDown = false;

    const isVerticalSelection = this.selectedRange.startCol === colIndex;
    const isHorizontalSelection = this.selectedRange.startRow === rowIndex;

    const startCellHasSpanned =
      this.tableData[this.selectedRange.startRow][this.selectedRange.startCol]
        ?.spanInfo;

    const cell =
      this.tableData[this.selectedRange.startRow][this.selectedRange.startCol];

    if (isVerticalSelection && !isHorizontalSelection) {
      if (startCellHasSpanned.colSpan > 1) {
        this.selectedRange.endRow = rowIndex;
        this.selectedRange.endCol = startCellHasSpanned.colSpan;
      } else if (startCellHasSpanned.rowSpan > 1) {
        this.selectedRange.endCol = colIndex;
        this.selectedRange.endRow = startCellHasSpanned.rowSpan;
      }
    } else if (isHorizontalSelection && !isVerticalSelection) {
      if (startCellHasSpanned.rowSpan > 1) {
        this.selectedRange.endRow = startCellHasSpanned.rowSpan - 1;
        this.selectedRange.endCol = startCellHasSpanned.rowSpan;
      } else if (startCellHasSpanned.colSpan > 1) {
        this.selectedRange.endRow = startCellHasSpanned.colSpan - 1;
        this.selectedRange.endCol = startCellHasSpanned.colSpan;
      } else if (
        !cell.visibility &&
        this.selectedRange.startCol !== this.selectedRange.endCol
      ) {
        // in this condition it prevent weird selection to normal selection
        for (let row = 0; row <= this.selectedRange.endRow; row++) {
          for (
            let col = this.selectedRange.startCol;
            col === this.selectedRange.startCol;
            col++
          ) {
            const eachCell = this.tableData[row][col];
            if (!eachCell.visibility) {
              continue;
            } else {
              this.selectedRange.startRow = row;
            }
          }
        }
      }
    }
  }

  rangeUpdate(
    startRow: number,
    startCol: number,
    endRow: number,
    endCol: number
  ) {
    let startRowUpdate = Math.min(startRow, endRow);

    let startColumnUpdate = Math.min(startCol, endCol);

    let endRowUpdate = Math.max(startRow, endRow);

    let endColumnUpdate = Math.max(startCol, endCol);

    let counter = 0;

    if (startRowUpdate < endRowUpdate) {
      for (let row = startRowUpdate; row <= endRowUpdate; row++) {
        for (let col = startColumnUpdate; col <= endColumnUpdate; col++) {
          const cell = this.tableData[row][col];
          const { rowSpan, colSpan } = cell.spanInfo;

          if (rowSpan > 1) {
            endRowUpdate = Math.max(endRowUpdate, row + rowSpan - 1);
          }
          if (colSpan > 1) {
            endColumnUpdate = Math.max(endColumnUpdate, col + colSpan - 1);
          }
        }
        counter++;
      }
    }

    this.selectedRange = {
      startRow: startRowUpdate,
      startCol: startColumnUpdate,
      endRow: endRowUpdate,
      endCol: endColumnUpdate,
    };
  }

  updateSelection(rowIndex: number, colIndex: number) {
    if (this.mouseDown) {
      this.selectedRange.endRow = rowIndex;
      this.selectedRange.endCol = colIndex;

      const { startRow, startCol, endRow, endCol } = this.selectedRange;

      this.rangeUpdate(startRow, startCol, endRow, endCol);
    }
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

  kesini: any = [];

  updateCellToMerge(
    startRow: number,
    endRow: number,
    startCol: number,
    endCol: number
  ) {
    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        if (r !== startRow || c !== startCol) {
          this.toMerge[`${r}:${c}`] = {
            ...this.tableData[r][c],
            r,
            c,
            visibility: false,
          };
          this.tableData[r][c] = {
            ...this.tableData[r][c],
            visibility: false,
          };
        } else {
          const spanInfo = {
            rowSpan: endRow - startRow + 1,
            colSpan: endCol - startCol + 1,
          };
          this.toMerge[`${r}:${c}`] = {
            ...this.toMerge[`${r}:${c}`],
            spanInfo,
          };
          this.tableData[r][c] = {
            ...this.tableData[r][c],
            spanInfo,
          };
        }
      }
    }
  }

  toMerge: any = {};
  testTable: any = [];
  mergeCells() {
    if (
      this.selectedRange.startRow === -1 &&
      this.selectedRange.endRow === -1
    ) {
      return;
    }

    const { startRow, endRow, startCol, endCol } = this.selectedRange;

    let cellGroup = [];

    for (let row = 0; row <= this.selectedRange.endRow; row++) {
      if (this.tableData[row][this.selectedRange.endCol]) {
        cellGroup.push(this.tableData[row][this.selectedRange.endCol]);
      }
    }

    if (startRow < endRow || startRow === endRow) {
      if (startCol < endCol) {
        this.updateCellToMerge(startRow, endRow, startCol, endCol);
      } else {
        this.updateCellToMerge(startRow, endRow, endCol, startCol);
      }
    } else if (startRow > endRow) {
      if (startCol > endCol) {
        this.updateCellToMerge(endRow, startRow, endCol, startCol);
      } else {
        this.updateCellToMerge(endRow, startRow, startCol, endCol);
      }
    }

    this.cdr.detectChanges();
    this.testTable = cellGroup;
  }

  undoMergeCells() {
    if (
      this.selectedRange.startRow === -1 &&
      this.selectedRange.endRow === -1
    ) {
      return;
    }

    const { startRow, endRow, startCol, endCol } = this.selectedRange;

    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        this.toMerge[`${r}:${c}`] = { r, c, visibility: true };
        this.tableData[r][c] = {
          ...this.tableData[r][c],
          visibility: true,
          spanInfo: {
            spanRow: 1,
            spanCol: 1,
          },
        };
      }
    }

    this.cdr.detectChanges();
    this.testTable = [...this.tableData];
  }

  onmouseleave() {
    if (this.mouseDown) this.mouseDown = false;
  }
}
