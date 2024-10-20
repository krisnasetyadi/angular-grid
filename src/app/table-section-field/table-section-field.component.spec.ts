import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableSectionFieldComponent } from './table-section-field.component';

describe('TableSectionFieldComponent', () => {
  let component: TableSectionFieldComponent;
  let fixture: ComponentFixture<TableSectionFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableSectionFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableSectionFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
