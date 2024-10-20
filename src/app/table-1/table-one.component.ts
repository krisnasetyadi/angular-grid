import { Component } from '@angular/core';

interface Cell {
  content: string;
  colspan: number;
  rowspan: number;
  selected?: boolean;
  hidden?: boolean;
}

interface Row {
  cells: Cell[];
}

@Component({
  selector: 'app-table-one',
  templateUrl: './table-one.component.html',
  styleUrls: ['./table-one.component.scss'],
})
export class TableOneComponent {
  columns = [
    { header: 'Column 1' },
    { header: 'Column 2' },
    { header: 'Column 3' },
  ];

  rows: Row[] = [
    {
      cells: [
        { content: 'Cell 1', colspan: 1, rowspan: 1 },
        { content: 'Cell 2', colspan: 1, rowspan: 1 },
        { content: 'Cell 3', colspan: 1, rowspan: 1 },
      ],
    },
    {
      cells: [
        { content: 'Cell 4', colspan: 1, rowspan: 1 },
        { content: 'Cell 5', colspan: 1, rowspan: 1 },
        { content: 'Cell 6', colspan: 1, rowspan: 1 },
      ],
    },
    {
      cells: [
        { content: 'Cell 7', colspan: 1, rowspan: 1 },
        { content: 'Cell 8', colspan: 1, rowspan: 1 },
        { content: 'Cell 9', colspan: 1, rowspan: 1 },
      ],
    },
  ];

  isSelecting = false;
  selectionStart: { row: number; col: number } | null = null;
  selectionEnd: { row: number; col: number } | null = null;

  addColumn() {
    this.columns.push({ header: `Column ${this.columns.length + 1}` });
    this.rows.forEach((row) =>
      row.cells.push({ content: '', colspan: 1, rowspan: 1 })
    );
  }

  addRow() {
    const newRow: Row = {
      cells: this.columns.map(() => ({ content: '', colspan: 1, rowspan: 1 })),
    };
    this.rows.push(newRow);
  }

  removeRow(row: Row) {
    const index = this.rows.indexOf(row);
    if (index > -1) {
      this.rows.splice(index, 1);
    }
  }

  updateCellContent(event: any, row: Row, cellIndex: number) {
    row.cells[cellIndex].content = event.target.innerText;
  }

  startSelection(row: number, col: number) {
    this.isSelecting = true;
    this.selectionStart = { row, col };
    this.selectionEnd = { row, col };
    this.updateSelectedCells();
  }

  extendSelection(row: number, col: number) {
    if (this.isSelecting) {
      this.selectionEnd = { row, col };
      this.updateSelectedCells();
    }
  }

  endSelection() {
    this.isSelecting = false;
  }

  adjustedSelection: any;
  mergedCells: any;
  updateSelectedCells() {
    if (!this.selectionStart || !this.selectionEnd) return;

    const startRow = Math.min(this.selectionStart.row, this.selectionEnd.row);
    const endRow = Math.max(this.selectionStart.row, this.selectionEnd.row);
    const startCol = Math.min(this.selectionStart.col, this.selectionEnd.col);
    const endCol = Math.max(this.selectionStart.col, this.selectionEnd.col);

    const isCellInSelection = (
      rowIndex: number,
      colIndex: number,
      rowspan: number,
      colspan: number
    ): boolean => {
      return (
        rowIndex + rowspan > startRow &&
        rowIndex < endRow + 1 &&
        colIndex + colspan > startCol &&
        colIndex < endCol + 1
      );
    };

    this.rows.forEach((row) =>
      row.cells.forEach((cell) => {
        cell.selected = false;
      })
    );

    this.mergedCells = this.rows.filter(
      (f) => f.cells.length > 0 && f.cells.filter((c) => c.selected)
    );

    console.log('mergedCells', this.mergedCells);

    this.rows.forEach((row, rowIndex) => {
      row.cells.forEach((cell, colIndex) => {
        const cellEndRow = rowIndex + (cell.rowspan || 1) - 1;
        const cellEndCol = colIndex + (cell.colspan || 1) - 1;

        // console.log('cellEndCol', cellEndCol);
        // console.log('cellEndRow', cellEndRow);
        console.log('cell', cell);
        if (
          isCellInSelection(
            rowIndex,
            colIndex,
            cell.rowspan || 1,
            cell.colspan || 1
          )
        ) {
          cell.selected = true;
        }
      });
    });

    // this.updateSelectedCells();
    // this.adjustedSelection = this.adjustSelection(
    //   this.selectionStart.row,
    //   this.selectionStart.col,
    //   this.selectionEnd.row,
    //   this.selectionEnd.col
    // );
  }

  adjustSelection(
    startRow: number,
    startCol: number,
    endRow: number,
    endCol: number
  ) {
    let adjustedStartRow = startRow;
    let adjustedStartCol = startCol;
    let adjustedEndRow = endRow;
    let adjustedEndCol = endCol;

    // Check and adjust for merged cells at the selection start
    if (this.isCellInMergedRange(startRow, startCol)) {
      const range = this.getMergedRange(startRow, startCol) as any;
      adjustedStartRow = range.startRow;
      adjustedStartCol = range.startCol;
    }

    // Check and adjust for merged cells at the selection end
    if (this.isCellInMergedRange(endRow, endCol)) {
      const range = this.getMergedRange(endRow, endCol) as any;
      adjustedEndRow = range.endRow;
      adjustedEndCol = range.endCol;
    }

    return {
      startRow: adjustedStartRow,
      startCol: adjustedStartCol,
      endRow: adjustedEndRow,
      endCol: adjustedEndCol,
    };
  }

  getMergedRange(row: any, col: any) {
    return this.mergedCells.find(
      (range: any) =>
        row >= range.startRow &&
        row <= range.endRow &&
        col >= range.startCol &&
        col <= range.endCol
    );
  }

  isCellInMergedRange(row: any, col: any) {
    return this.mergedCells.some(
      (range: any) =>
        row >= range.startRow &&
        row <= range.endRow &&
        col >= range.startCol &&
        col <= range.endCol
    );
  }

  isCellSelected(row: number, col: number): boolean {
    return this.rows[row].cells[col].selected || false;
  }

  mergeSelectedCells() {
    if (!this.selectionStart || !this.selectionEnd) return;

    const startRow = Math.min(this.selectionStart.row, this.selectionEnd.row);
    const endRow = Math.max(this.selectionStart.row, this.selectionEnd.row);
    const startCol = Math.min(this.selectionStart.col, this.selectionEnd.col);
    const endCol = Math.max(this.selectionStart.col, this.selectionEnd.col);

    // Find the cell to merge into
    const mainCell = this.rows[startRow].cells[startCol];
    mainCell.rowspan = endRow - startRow + 1;
    mainCell.colspan = endCol - startCol + 1;

    // Hide and clear content of the cells being merged
    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        if (row === startRow && col === startCol) continue; // Skip the main cell

        const cell = this.rows[row].cells[col];
        cell.hidden = true;
        cell.content = '';
        cell.colspan = 1;
        cell.rowspan = 1;
      }
    }

    this.clearSelection();
  }

  clearSelection() {
    this.rows.forEach((row) =>
      row.cells.forEach((cell) => {
        cell.selected = false;
      })
    );
    this.selectionStart = null;
    this.selectionEnd = null;
  }
}
