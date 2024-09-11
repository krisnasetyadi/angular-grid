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

    // console.log('isVerticalSelection', [
    //   isVerticalSelection,
    //   isHorizontalSelection,
    // ]);
    if (isVerticalSelection && !isHorizontalSelection) {
      // console.log('1');
      if (startCellHasSpanned.colSpan > 1) {
        // console.log('2');
        this.selectedRange.endRow = rowIndex;
        this.selectedRange.endCol = startCellHasSpanned.colSpan;
      } else if (startCellHasSpanned.rowSpan > 1) {
        // console.log('3', startCellHasSpanned);
        // this.selectedRange.endCol = colIndex;
        this.selectedRange.endRow = startCellHasSpanned.rowSpan;
      }
    } else if (isHorizontalSelection && !isVerticalSelection) {
      console.log('4', startCellHasSpanned);
      if (startCellHasSpanned.rowSpan > 1) {
        // console.log('5');
        this.selectedRange.endRow = startCellHasSpanned.rowSpan - 1;
        this.selectedRange.endCol = startCellHasSpanned.rowSpan;
      } else if (startCellHasSpanned.colSpan > 1) {
        // console.log('6');
        // this.selectedRange.endRow = startCellHasSpanned.colSpan - 1;
        this.selectedRange.endCol = startCellHasSpanned.colSpan;
      } else if (
        !cell.visibility &&
        this.selectedRange.startCol !== this.selectedRange.endCol
      ) {
        // console.log('7');
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
    } else if (isVerticalSelection && isHorizontalSelection) {
      const rowNeighborStart = this.findNeighbor(rowIndex, colIndex, true);
      // console.log('8', startCellHasSpanned);
      // console.log('rowNeighborStart', rowNeighborStart);
    }
  }

  findNeighbor(rowIndex: number, colIndex: number, isVisible: boolean = false) {
    const neighbors: any[] = [];
    const tableRows = this.tableViewSpecs.tableViewSpecs.numberOfRows;
    const tableCols = this.tableViewSpecs.tableViewSpecs.numberOfColumns;

    // Directions for checking neighbors
    const directions = [
      { rowOffset: -1, colOffset: 0 }, // Top
      { rowOffset: 1, colOffset: 0 }, // Bottom
      { rowOffset: 0, colOffset: -1 }, // Left
      { rowOffset: 0, colOffset: 1 }, // Right
    ];

    directions.forEach(({ rowOffset, colOffset }) => {
      let r = rowIndex + rowOffset;
      let c = colIndex + colOffset;

      // Traverse to find the nearest visible or valid cell
      while (r >= 0 && r < tableRows && c >= 0 && c < tableCols) {
        const cell = this.tableData[r][c];
        const { rowSpan, colSpan } = cell.spanInfo;

        // Check if the cell is hidden and we are not looking for visible cells
        if (!isVisible && !cell.visibility) {
          neighbors.push({ row: r, col: c, cell });
          break;
        }

        // If looking for visible cells and the cell is visible
        else if (isVisible && cell.visibility) {
          if (
            !this.isCellSelected(r, c) &&
            (cell.spanInfo.rowSpan > 1 || cell.spanInfo.colSpan > 1)
          ) {
            // if (neighbors.length === 0) {
            neighbors.push({ row: r, col: c, cell });
          }
          // break;
        }

        // Adjust for span to skip hidden cells correctly
        r += rowOffset * rowSpan;
        c += colOffset * colSpan;
      }
    });

    return neighbors;
  }

  rangeUpdate(
    startRow: number,
    startCol: number,
    endRow: number,
    endCol: number
  ) {
    // Initial boundaries of the selection range
    let startRowUpdate = Math.min(startRow, endRow);
    let startColUpdate = Math.min(startCol, endCol);
    let endRowUpdate = Math.max(startRow, endRow);
    let endColUpdate = Math.max(startCol, endCol);

    const maxRow = this.tableViewSpecs.tableViewSpecs.numberOfRows - 1;
    const maxCol = this.tableViewSpecs.tableViewSpecs.numberOfColumns - 1;

    const isEdgeToEgeRow = startRowUpdate === 0 && endRowUpdate === maxRow;
    const isEdgeToEdgeCol = startColUpdate === 0 && endColUpdate === maxCol;

    if (isEdgeToEgeRow && isEdgeToEdgeCol) {
      this.selectedRange = {
        startRow: startRowUpdate,
        startCol: startColUpdate,
        endRow: maxRow,
        endCol: maxCol,
      };
      return;
    }

    for (let row = startRowUpdate; row <= endRowUpdate; row++) {
      for (let col = startColUpdate; col <= endColUpdate; col++) {
        const cell = this.tableData[row][col];
        console.log('cell_2', cell);
        const { rowSpan, colSpan } = cell.spanInfo;
        if (rowSpan > 1) {
          console.log('range_3');
          endRowUpdate = Math.max(endRowUpdate, row + rowSpan - 1);
        }
        if (colSpan > 1) {
          endColUpdate = Math.max(endColUpdate, col + colSpan - 1);
        }
      }
    }
    // Track visited cells to prevent reprocessing
    const visited = new Set<string>();

    const expandSelection = (row: number, col: number) => {
      if (visited.has(`${row},${col}`)) return;
      visited.add(`${row},${col}`);

      const cell = this.tableData[row]?.[col];
      if (!cell) return;

      const { rowSpan, colSpan } = cell.spanInfo;

      // Expand the selection range based on rowSpan and colSpan
      const newEndRow = row + rowSpan - 1;
      const newEndCol = col + colSpan - 1;

      const rows: any[] = [];
      const cols: any[] = [];

      if (newEndRow > endRowUpdate) endRowUpdate = newEndRow;
      if (newEndCol > endColUpdate) endColUpdate = newEndCol;
      let counter = 0;

      // Recursively expand for adjacent cells within the expanded range
      for (let r = startRowUpdate; r <= endRowUpdate; r++) {
        for (let c = startColUpdate; c <= endColUpdate; c++) {
          if (!visited.has(`${r},${c}`)) {
            if (this.tableData[r]?.[c]?.visibility) {
              expandSelection(r, c);
              ++counter;
            } else {
              const directions = [
                { rowOffset: -1, colOffset: 0, position: 'top' }, // top
                { rowOffset: 1, colOffset: 0, position: 'bottom' }, // bottom
                { rowOffset: 0, colOffset: -1, position: 'left' }, // left
                { rowOffset: 0, colOffset: 1, position: 'right' }, // right
              ];

              if (this.isCellSelected(r, c)) {
                if (!this.tableData[r]?.[c].visibility) {
                  directions.forEach(({ rowOffset, colOffset, position }) => {
                    let rowOffsetIdx = r + rowOffset;
                    let colOffsetIdx = c + colOffset;

                    let maxAttempts = 20;
                    while (
                      rowOffsetIdx >= 0 &&
                      rowOffsetIdx <
                        this.tableViewSpecs.tableViewSpecs.numberOfRows &&
                      colOffsetIdx >= 0 &&
                      colOffsetIdx <
                        this.tableViewSpecs.tableViewSpecs.numberOfColumns &&
                      maxAttempts > 0
                    ) {
                      const offsetCell =
                        this.tableData[rowOffsetIdx][colOffsetIdx];

                      const { rowSpan: rowSpanOffset, colSpan: colSpanOffset } =
                        offsetCell.spanInfo;

                      console.log(
                        `offsetCell__${position}_${rowOffsetIdx},${colOffsetIdx}`,
                        offsetCell
                      );
                      if (
                        offsetCell.visibility &&
                        !this.isCellSelected(rowOffsetIdx, colOffsetIdx)
                      ) {
                        cols.push(...cols, colOffsetIdx);
                        rows.push(...rows, rowOffsetIdx);

                        break;
                      }

                      rowOffsetIdx += rowOffset * rowSpanOffset;
                      colOffsetIdx += colOffset * colSpanOffset;
                      maxAttempts--;
                    }
                  });
                }
              }
            }
          }
        }
      }
      return { rows, cols };
    };
    const startRowOffset: Set<any> = new Set();
    const startColOffset: Set<any> = new Set();

    // for (let row = startRowUpdate; row <= endRowUpdate; row++) {
    //   for (let col = startColUpdate; col <= endColUpdate; col++) {
    //     const cell = this.tableData[row][col];

    //     const { rowSpan, colSpan } = cell.spanInfo;
    //     const expanded: any = expandSelection(row, col);

    //     const hasExpandedRow = expanded?.rows?.length > 0;
    //     const hasExpandedCol = expanded?.cols?.length > 0;

    //     if (expanded && (hasExpandedRow || hasExpandedCol)) {
    //       if (hasExpandedRow) {
    //         expanded.rows.forEach((row: any) => startRowOffset.add(row));
    //       }

    //       if (colSpan > 1) {
    //         if (hasExpandedCol) {
    //           expanded.cols.forEach((col: any) => startColOffset.add(col));
    //         }
    //       }
    //     } else {
    //       if (rowSpan > 1) {
    //         console.log('range_3');
    //         endRowUpdate = Math.max(endRowUpdate, row + rowSpan - 1);
    //       }
    //       if (colSpan > 1) {
    //         console.log('range_4');
    //         endColUpdate = Math.max(endColUpdate, col + colSpan - 1);
    //       }
    //     }
    //   }
    // }

    const uniqueRows = Array.from(startRowOffset);
    const uniqueCols = Array.from(startColOffset);

    if (uniqueRows.length > 1) {
      startRowUpdate = Math.min(...uniqueRows);
      endRowUpdate = Math.max(...uniqueRows);
    }

    if (uniqueCols.length > 1) {
      startColUpdate = Math.min(...uniqueCols);
      endRowUpdate = Math.max(...uniqueCols);
    } else if (uniqueCols.length === 1) {
      startColUpdate = uniqueCols[0];
    }

    // Update the selection range with the expanded boundaries
    this.selectedRange = {
      startRow: startRowUpdate,
      startCol: startColUpdate,
      endRow: endRowUpdate,
      endCol: endColUpdate,
    };
  }

  flattenArray(arr: any) {
    let result: any = [];
    for (let i = 0; i < arr.length; i++) {
      result.push(...arr[i]);
    }
    return result;
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
    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        const cell = this.tableData[row][col];

        if (row !== startRow || col !== startCol) {
          this.tableData[row][col] = {
            ...this.tableData[row][col],
            visibility: false,
          };
        } else {
          const spanInfo = {
            rowSpan: endRow - startRow + 1,
            colSpan: endCol - startCol + 1,
          };

          this.tableData[row][col] = {
            ...this.tableData[row][col],
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

    const startRowRange = Math.min(startRow, endRow);
    const endRowRange = Math.max(startRow, endRow);
    const startColRange = Math.min(startCol, endCol);
    const endColRange = Math.max(startCol, endCol);

    this.updateCellToMerge(
      startRowRange,
      endRowRange,
      startColRange,
      endColRange
    );
  }

  undoMergeCells() {
    if (
      this.selectedRange.startRow === -1 &&
      this.selectedRange.endRow === -1
    ) {
      return;
    }

    const { startRow, endRow, startCol, endCol } = this.selectedRange;
    const spanInfo = {
      rowSpan: endRow - startRow - 1,
      colSpan: endCol - startCol - 1,
    };
    const currentCell = this.tableData[startRow][startCol];
    const hasSppannedInCurrentSingleSelectedArea =
      (currentCell.spanInfo.rowSpan || currentCell.spanInfo.colSpan) &&
      [startRow, endRow, startCol, endCol].every(
        (i) => i === startRow && i === startCol
      );

    if (hasSppannedInCurrentSingleSelectedArea) {
      for (
        let r = startRow;
        r <= endRow + (currentCell.spanInfo.rowSpan - 1);
        r++
      ) {
        for (
          let c = startCol;
          c <= endCol + (currentCell.spanInfo.colSpan - 1);
          c++
        ) {
          const cell = this.tableData[r][c];

          this.tableData[r][c] = {
            ...this.tableData[r][c],
            visibility: true,
            spanInfo,
          };
        }
      }
    } else {
      for (
        let r = startRow;
        r <= endRow + (currentCell.spanInfo.rowSpan - 1);
        r++
      ) {
        const rows: any[] = [];
        for (
          let c = startCol;
          c <= endCol + (currentCell.spanInfo.colSpan - 1);
          c++
        ) {
          const cell = this.tableData[r][c];

          if (cell) {
            const { visibility } = cell;
            if (visibility) {
              this.tableData[r][c] = {
                ...this.tableData[r][c],

                spanInfo: {
                  rowSpan: 1,
                  colSpan: 1,
                },
              };
            } else {
              this.tableData[r][c] = {
                ...this.tableData[r][c],
                visibility: true,
              };
            }
          }
        }
      }
    }

    this.cdr.detectChanges();
  }

  onmouseleave() {
    if (this.mouseDown) this.mouseDown = false;
  }

  getColumnHeaders(): string[] {
    const numberOfColumns = this.tableViewSpecs.tableViewSpecs.numberOfColumns;
    const columns = [];
    for (let i = 0; i < numberOfColumns; i++) {
      columns.push(this.numberToColumnLetter(i));
    }
    return columns;
  }

  numberToColumnLetter(index: number): string {
    let letter = '';
    while (index >= 0) {
      letter = String.fromCharCode((index % 26) + 65) + letter;
      index = Math.floor(index / 26) - 1;
    }
    return letter;
  }

  updateCellContent(event: any, row: any, cellIndex: number) {
    row.cells[cellIndex].content = event.target.innerText;
  }
}
