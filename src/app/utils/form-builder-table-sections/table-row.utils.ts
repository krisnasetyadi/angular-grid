import { RangeProperties } from '../../type/table-section.model';
import FormBuilderTableSectionUtils from './form-builder-table-section';

type UndoMergeCellCallback = (rangeProperties: RangeProperties) => void;
export default class TableRowUtils {
  static deleteRowByIndex(
    rowIndexToDelete: number,
    tableData: any,
    undoMergeCellCallback: UndoMergeCellCallback
  ) {
    const numberOfColumns = tableData[0].length;

    const cellsToMove = [];

    for (let col = 0; col < numberOfColumns; col++) {
      for (let row = 0; row < tableData.length; row++) {
        const cell = tableData[row][col];

        if (cell.visibility) {
          if (
            row < rowIndexToDelete &&
            row + cell.spanInfo.rowSpan > rowIndexToDelete
          ) {
            cell.spanInfo.rowSpan--;
          } else if (row === rowIndexToDelete && cell.spanInfo.rowSpan > 1) {
            cellsToMove.push({ col, cell });
          }

          if (
            row === rowIndexToDelete &&
            cell.spanInfo.rowSpan === 1 &&
            cell.spanInfo.colSpan > 1
          ) {
            const defineRange = {
              startRow: row,
              endRow: row,
              startCol: col,
              endCol: tableData[row].length,
            };

            undoMergeCellCallback(defineRange);
            col += cell.spanInfo.colSpan - 1;
          }
        }
      }
    }

    for (const { col, cell } of cellsToMove) {
      tableData[rowIndexToDelete + 1][col] = {
        ...cell,
        spanInfo: {
          ...cell.spanInfo,
          rowSpan: cell.spanInfo.rowSpan - 1,
        },
      };

      for (let c = 1; c < cell.spanInfo.colSpan; c++) {
        tableData[rowIndexToDelete + 1][col + c] = {
          visibility: false,
          spanInfo: { rowSpan: 1, colSpan: 1 },
        };
      }
    }

    tableData.splice(rowIndexToDelete, 1);
  }

  static insertRowByIndex(rowIndexToInsert: number, tableData: any) {
    const numberOfColumns = tableData[0].length;

    const newRow = new Array(numberOfColumns).fill(null).map(() => ({
      cell: FormBuilderTableSectionUtils.defaultEmptyCell(),
      cellIndex: null,
      spanInfo: { rowSpan: 1, colSpan: 1 },
      visibility: true,
    }));

    for (let col = 0; col < numberOfColumns; col++) {
      let currentSpan = null;
      let spanStartRow = -1;
      let spanStartCol = -1;

      for (let row = 0; row <= rowIndexToInsert; row++) {
        const cell = tableData[row][col];

        if (
          cell.visibility &&
          (cell.spanInfo.rowSpan > 1 ||
            (cell.spanInfo.rowSpan > 1 && cell.spanInfo.colSpan > 1))
        ) {
          currentSpan = cell;
          spanStartRow = row;
          spanStartCol = col;
        }

        if (row === rowIndexToInsert && currentSpan) {
          const spanEndRow = spanStartRow + currentSpan.spanInfo.rowSpan - 1;
          const spanEndCol = spanStartCol + currentSpan.spanInfo.colSpan - 1;

          if (spanEndRow > rowIndexToInsert) {
            currentSpan.spanInfo.rowSpan++;

            // set visibility to false for all cells in the new row that are part of this span
            for (let c = spanStartCol; c <= spanEndCol; c++) {
              newRow[c].visibility = false;
            }
          }
        }
      }
    }

    const insertedRowIndex = rowIndexToInsert + 1;
    tableData.splice(insertedRowIndex, 0, newRow);
  }

  static duplicateRowByIndex(rowIndexToDuplicate: number, tableData: any) {
    const numberOfColumns = tableData[0].length;

    // deep copy the duplicate data to avoid mutation original object
    const rowToDuplicate = JSON.stringify(tableData[rowIndexToDuplicate]);

    const sanitizeRowToDuplicate = JSON.parse(rowToDuplicate).map(
      (cell: any) => {
        cell.cellIndex = null;
        cell.cell.id = null;
        cell.visibility = true;

        if (cell.spanInfo.rowSpan > 1 || cell.spanInfo.colSpan > 1) {
          cell.spanInfo.rowSpan = 1;
          cell.spanInfo.colSpan = 1;
        }

        return cell;
      }
    );

    for (let col = 0; col < numberOfColumns; col++) {
      let currentSpan = null;
      let spanStartRow = -1;
      let spanStartCol = -1;

      for (let row = 0; row <= rowIndexToDuplicate; row++) {
        const cell = tableData[row][col];

        const itHasSpanRowAndBoth =
          cell.visibility &&
          (cell.spanInfo.rowSpan > 1 ||
            (cell.spanInfo.rowSpan > 1 && cell.spanInfo.colSpan > 1));

        const itHasSingleRowAndColSpan =
          cell.visibility &&
          cell.spanInfo.rowSpan === 1 &&
          cell.spanInfo.colSpan > 1;

        if (itHasSpanRowAndBoth || itHasSingleRowAndColSpan) {
          currentSpan = cell;
          spanStartRow = row;
          spanStartCol = col;
        }

        if (row === rowIndexToDuplicate && currentSpan) {
          const spanEndRow = spanStartRow + currentSpan.spanInfo.rowSpan - 1;
          const spanEndCol = spanStartCol + currentSpan.spanInfo.colSpan - 1;

          // deep copy the current span to avoid directly mutating the original span object
          const deepCopiedCurrentSpan = JSON.stringify(currentSpan);

          if (JSON.parse(deepCopiedCurrentSpan).spanInfo.rowSpan > 1) {
            if (spanEndRow >= rowIndexToDuplicate) {
              currentSpan.spanInfo.rowSpan++;

              for (let c = spanStartCol; c <= spanEndCol; c++) {
                sanitizeRowToDuplicate[c].visibility = false;
              }
            }
          }
          if (
            JSON.parse(deepCopiedCurrentSpan).spanInfo.rowSpan === 1 &&
            JSON.parse(deepCopiedCurrentSpan).spanInfo.colSpan > 1
          ) {
            const spanEndCol = spanStartCol + currentSpan.spanInfo.colSpan - 1;

            if (
              spanEndRow === rowIndexToDuplicate &&
              spanEndCol >= spanStartCol
            ) {
              for (let c = spanStartCol; c <= spanEndCol; c++) {
                if (c === spanStartCol) {
                  sanitizeRowToDuplicate[c].spanInfo.colSpan++;
                } else {
                  sanitizeRowToDuplicate[c].visibility = false;
                }
              }
            }
          }
        }
      }
    }

    const insertedRowIndex = rowIndexToDuplicate + 1;
    tableData.splice(insertedRowIndex, 0, sanitizeRowToDuplicate);
  }

  static updateVisibilityAndSpans(tableData: any) {
    const numRows = tableData.length;
    const numCols = tableData[0].length;

    for (let col = 0; col < numCols; col++) {
      let currentSpan = null;
      let spanStartRow = -1;

      for (let row = 0; row < numRows; row++) {
        const cell = tableData[row][col];

        if (cell.visibility) {
          currentSpan = cell;
          spanStartRow = row;

          col += cell.spanInfo.colSpan - 1;
        } else if (
          currentSpan &&
          row < spanStartRow + currentSpan.spanInfo.rowSpan
        ) {
          cell.visibility = false;
          cell.spanInfo = { rowSpan: 1, colSpan: 1 };
        } else {
          cell.visibility = true;
          cell.spanInfo = { rowSpan: 1, colSpan: 1 };
        }
      }
    }
  }

  showRowActionButton(rowIndex: number, tableData: any): any {
    for (let r = rowIndex; r >= 0; r--) {
      for (let c = 0; c < tableData[r].length; c++) {
        const cell = tableData[r][c];

        if (cell.spanInfo.rowSpan > 1) {
          if (r + cell.spanInfo.rowSpan - 1 > rowIndex) {
            return false;
          }
        }
      }
    }

    return true;
  }
}
