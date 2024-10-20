export default class TableColumnUtils {
  static deleteColumnByIndex(colIndexToDelete: number, tableData: any) {
    const numberOfRows = tableData.length;

    const cellsToMove = [];

    for (let row = 0; row < numberOfRows; row++) {
      for (let col = 0; col < tableData[row].length; col++) {
        const cell = tableData[row][col];

        if (cell.visibility) {
          if (
            col < colIndexToDelete &&
            col + cell.spanInfo.colSpan > colIndexToDelete
          ) {
            cell.spanInfo.colSpan--;
          } else if (col === colIndexToDelete && cell.spanInfo.colSpan > 1) {
            cellsToMove.push({ row, cell });
          }

          row += cell.spanInfo.rowSpan - 1;
        }
      }
    }

    for (const { row, cell } of cellsToMove) {
      tableData[row][colIndexToDelete + 1] = {
        ...cell,
        spanInfo: {
          ...cell.spanInfo,
          colSpan: cell.spanInfo.colSpan - 1,
        },
      };

      for (let r = 1; r < cell.spanInfo.rowSpan; r++) {
        tableData[row + r][colIndexToDelete + 1] = {
          visibility: false,
          spanInfo: { rowSpan: 1, colSpan: 1 },
        };
      }
    }

    for (let row = 0; row < numberOfRows; row++) {
      tableData[row].splice(colIndexToDelete, 1);
    }
  }

  static insertColumnByIndex(
    colIndexToInsert: number,
    tableData: any,
    defaultCell: any
  ) {
    const numberOfRows = tableData.length;

    // store variable to expand cell
    const spansToExpand = [];

    for (let row = 0; row < numberOfRows; row++) {
      let col = 0;
      while (col <= colIndexToInsert) {
        const cell = tableData[row][col];
        if (cell.visibility) {
          const spanEndCol = col + cell.spanInfo.colSpan - 1;
          if (spanEndCol >= colIndexToInsert && cell.spanInfo.colSpan > 1) {
            spansToExpand.push({ row, col });
          }
          col += cell.spanInfo.colSpan;
        } else {
          col++;
        }
      }
    }

    // expand identified spans and insert new cells
    for (let row = 0; row < numberOfRows; row++) {
      let insertedCell = false;
      for (const { row: spanRow, col: spanCol } of spansToExpand) {
        if (
          row >= spanRow &&
          row < spanRow + tableData[spanRow][spanCol].spanInfo.rowSpan
        ) {
          if (row === spanRow) {
            tableData[spanRow][spanCol].spanInfo.colSpan++;
          }
          tableData[row].splice(colIndexToInsert + 1, 0, {
            ...defaultCell,
            visibility: false,
          });
          insertedCell = true;
          break;
        }
      }
      if (!insertedCell) {
        tableData[row].splice(colIndexToInsert + 1, 0, {
          ...defaultCell,
        });
      }
    }
  }

  static duplicateSingleColumn(colIndexToDuplicate: number, tableData: any) {
    const numberOfRow = tableData.length;

    const copiedTable = [...tableData];
    const columsToDuplicate = [];

    for (let row = 0; row < numberOfRow; row++) {
      const cellToDuplicate = {
        ...copiedTable[row][colIndexToDuplicate],
        visibility: true,
        cellIndex: null,
        spanInfo: {
          rowSpan: 1,
          colSpan: 1,
        },
        cell: {
          id: null,
          ...copiedTable[row][colIndexToDuplicate].cell,
        },
      };

      columsToDuplicate.push(cellToDuplicate);
    }

    for (let row = 0; row < numberOfRow; row++) {
      let currentSpan = null;
      let spanStartRow = -1;
      let spanStartCol = -1;

      for (let col = 0; col <= colIndexToDuplicate; col++) {
        const cell = copiedTable[row][col];

        if (
          cell.visibility &&
          (cell.spanInfo.colSpan > 1 ||
            (cell.spanInfo.rowSpan > 1 && cell.spanInfo.colSpan > 1))
        ) {
          currentSpan = cell;
          spanStartRow = row;
          spanStartCol = col;
        }

        if (col === colIndexToDuplicate && currentSpan) {
          const spanEndRow = spanStartRow + currentSpan.spanInfo.rowSpan - 1;
          const spanEndCol = spanStartCol + currentSpan.spanInfo.colSpan - 1;

          if (spanEndCol >= colIndexToDuplicate) {
            currentSpan.spanInfo.colSpan++;

            for (let r = spanStartRow; r <= spanEndRow; r++) {
              columsToDuplicate[r].visibility = false;
            }
          }
        }
      }
    }

    const insertedColIndex = colIndexToDuplicate + 1;

    for (let row = 0; row < numberOfRow; row++) {
      tableData[row].splice(insertedColIndex, 0, columsToDuplicate[row]);
    }
  }
}
