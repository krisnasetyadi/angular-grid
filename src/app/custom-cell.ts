import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-custom-cell',
  template: `
    <span>{{ params.value }}</span>
    <button (click)="onClick()">Click</button>
  `,
})
export class CustomCellComponent implements ICellRendererAngularComp {
  public params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  onClick() {
    alert(`Clicked on ${this.params.value}`);
  }
}
