export default class TableCellUtils {
  static performMerge(
    startRow: number,
    endRow: number,
    startCol: number,
    endCol: number,
    tableData: any
  ) {
    let mergedValue = '';

    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        const cell = tableData[row][col];

        if (row === startRow && col === startCol) {
          // keep the value of the top-left cell
          mergedValue = cell.value || '';
          const spanInfo = {
            rowSpan: endRow - startRow + 1,
            colSpan: endCol - startCol + 1,
          };
          tableData[row][col] = {
            ...cell,
            spanInfo,
            value: mergedValue,
          };
        } else {
          if (
            row === startRow &&
            col === startCol + 1 &&
            cell.value &&
            cell.value.trim() !== ''
          ) {
            mergedValue += ' ' + cell.value.trim();
            tableData[startRow][startCol].value = mergedValue;
          }

          tableData[row][col] = {
            ...tableData[row][col],
            visibility: false,
            value: '',
          };
        }
      }
    }
  }

  static checkExistingValues(
    startRow: number,
    endRow: number,
    startCol: number,
    endCol: number,
    tableData: any
  ): string[] {
    const existingValues: string[] = [];

    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        if (row !== startRow || col !== startCol) {
          const cell = tableData[row][col];
          if (cell.cell.name && cell.cell.name.trim() !== '') {
            existingValues.push(
              `Row ${row + 1}, Column ${col + 1}: ${cell.cell.name}`
            );
          }
        }
      }
    }

    return existingValues;
  }

  static getCellVisibility(selectedRange: any, tableData: any) {
    const { startRow, endRow, startCol, endCol } = selectedRange;
    const startRowRange = Math.min(startRow, endRow);
    const endRowRange = Math.max(startRow, endRow);
    const startColRange = Math.min(startCol, endCol);
    const endColRange = Math.max(startCol, endCol);

    const cells = [];
    for (let row = startRowRange; row <= endRowRange; row++) {
      for (let col = startColRange; col <= endColRange; col++) {
        const cell = tableData[row][col];

        if (cell.visibility) {
          cells.push(cell);
        }
      }
    }

    return cells;
  }

  static findParentCell = (row: number, col: number, tableData: any) => {
    for (let r = row; r >= 0; r--) {
      for (let c = col; c >= 0; c--) {
        const cell = tableData[r][c];
        if (
          cell.visibility &&
          r + cell.spanInfo.rowSpan > row &&
          c + cell.spanInfo.colSpan > col
        ) {
          return { row: r, col: c, cell };
        }
      }
    }
    return null;
  };

  static expandMergedCell = (row: number, col: number, tableData: any) => {
    const cell = tableData[row][col];
    if (!cell.visibility) {
      const parentCell = TableCellUtils.findParentCell(row, col, tableData);
      if (parentCell) {
        return {
          startRow: parentCell.row,
          startCol: parentCell.col,
          endRow: parentCell.row + parentCell.cell.spanInfo.rowSpan - 1,
          endCol: parentCell.col + parentCell.cell.spanInfo.colSpan - 1,
        };
      }
    }
    return {
      startRow: row,
      startCol: col,
      endRow: row + cell.spanInfo.rowSpan - 1,
      endCol: col + cell.spanInfo.colSpan - 1,
    };
  };

  /**
   * This function is for update the cell range each select the cell or move the mouse
   * @param initialStartRow
   * @param initialStartCol
   * @param currentRow
   * @param currentCol
   * @param tableData
   */

  static rangeUpdate(
    initialStartRow: number,
    initialStartCol: number,
    currentRow: number,
    currentCol: number,
    tableData: any
  ) {
    const maxRow = tableData.length - 1;
    const maxCol = tableData[0].length - 1;

    let startRow = Math.min(initialStartRow, currentRow);
    let endRow = Math.max(initialStartRow, currentRow);
    let startCol = Math.min(initialStartCol, currentCol);
    let endCol = Math.max(initialStartCol, currentCol);

    // edge to edge selection
    if (
      startRow === 0 &&
      endRow === maxRow &&
      startCol === 0 &&
      endCol === maxCol
    ) {
      return { startRow: 0, startCol: 0, endRow: maxRow, endCol: maxCol };
    }

    // storing visited cells
    const visitedCells = new Set<string>();
    const queue: [number, number][] = [[startRow, startCol]];

    while (queue.length > 0) {
      const [row, col] = queue.shift()!;
      const cellKey = `${row},${col}`;

      if (visitedCells.has(cellKey)) continue;
      visitedCells.add(cellKey);

      const currentCell = tableData[row][col];

      if (currentCell.visibility) {
        const { rowSpan, colSpan } = currentCell.spanInfo;

        // update range based on merged cells
        if (row <= endRow && col <= endCol) {
          endRow = Math.max(endRow, row + rowSpan - 1);
          endCol = Math.max(endCol, col + colSpan - 1);
        }
        if (row >= startRow && col >= startCol) {
          startRow = Math.min(startRow, row);
          startCol = Math.min(startCol, col);
        }

        // add cells within the merged area to the queue
        for (let r = row; r < row + rowSpan; r++) {
          for (let c = col; c < col + colSpan; c++) {
            if (r >= startRow && r <= endRow && c >= startCol && c <= endCol) {
              queue.push([r, c]);
            }
          }
        }
      } else {
        // for invisible cells, find the parent cell
        const parentCell = this.findParentCell(row, col, tableData);
        if (parentCell) {
          const {
            row: parentRow,
            col: parentCol,
            cell: parentCellData,
          } = parentCell;
          startRow = Math.min(startRow, parentRow);
          startCol = Math.min(startCol, parentCol);
          endRow = Math.max(
            endRow,
            parentRow + parentCellData.spanInfo.rowSpan - 1
          );
          endCol = Math.max(
            endCol,
            parentCol + parentCellData.spanInfo.colSpan - 1
          );
          queue.push([parentRow, parentCol]);
        }
      }

      // check neighboring cells in all directions
      const neighbors = [
        [row - 1, col], // up
        [row + 1, col], // down
        [row, col - 1], // left
        [row, col + 1], // right
      ];

      for (const [nRow, nCol] of neighbors) {
        if (
          nRow >= startRow &&
          nRow <= endRow &&
          nCol >= startCol &&
          nCol <= endCol
        ) {
          queue.push([nRow, nCol]);
        }
      }
    }

    // Handle non-contiguous selections
    const selectedCells = Array.from(visitedCells).map((cell) =>
      cell.split(',').map(Number)
    );

    if (selectedCells.length > 0) {
      startRow = Math.min(...selectedCells.map(([r]) => r));
      startCol = Math.min(...selectedCells.map(([, c]) => c));
      endRow = Math.max(...selectedCells.map(([r]) => r));
      endCol = Math.max(...selectedCells.map(([, c]) => c));
    }

    // ensure the range is within table boundaries
    startRow = Math.max(0, startRow);
    startCol = Math.max(0, startCol);
    endRow = Math.min(maxRow, endRow);
    endCol = Math.min(maxCol, endCol);

    // determine the final start and end based on the initial selection direction
    const finalStartRow = initialStartRow <= currentRow ? startRow : endRow;
    const finalEndRow = initialStartRow <= currentRow ? endRow : startRow;
    const finalStartCol = initialStartCol <= currentCol ? startCol : endCol;
    const finalEndCol = initialStartCol <= currentCol ? endCol : startCol;

    return {
      startRow: finalStartRow,
      startCol: finalStartCol,
      endRow: finalEndRow,
      endCol: finalEndCol,
    };
  }
}
