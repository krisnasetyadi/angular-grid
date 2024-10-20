interface RangeProperties {
  startRow: number;
  endRow: number;
  startCol: number;
  endCol: number;
  [key: string]: number;
}

interface Span {
  colSpan: number;
  rowSpan: number;
}

interface Cell {
  cellIndex: number | null;
  spanInfo: Span;
  cell: any;
  visibility: boolean;
}

type TableDataType = Cell[][];

export { RangeProperties, TableDataType, Cell };
