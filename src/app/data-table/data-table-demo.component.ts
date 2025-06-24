import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent, ColumnDefinition } from './data-table.component';
import { DataTableService, DataQueryResult } from './services/data-table.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'data-table-demo',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  template: `
    <ng-container *ngIf="columns">
    <ng-template #categoryChip let-value let-row="row">
      <span [ngStyle]="{ 'background': value === 'Alpha' ? '#e3f2fd' : value === 'Beta' ? '#e8f5e9' : '#fff3e0', 'color': value === 'Alpha' ? '#1976d2' : value === 'Beta' ? '#388e3c' : '#f57c00', 'padding': '2px 10px', 'border-radius': '12px', 'font-weight': 'bold', 'font-size': '13px' }">
        {{ value }}
      </span>
    </ng-template>  

    <app-data-table
      [columnDefinitions]="columns"
      [fetchDataService]="fetchData"
      [selectionMode]="'multiple'"
      [rowIdField]="'name'">
    </app-data-table>
  </ng-container>

  `,
})
export class DataTableDemoComponent implements OnInit {
  columns: ColumnDefinition[] = [
    { field: 'name', header: 'Name', sortable: true, filterType: 'text', filterable: true },
    { field: 'value', header: 'Value', sortable: true, filterType: 'text', filterable: true },
    { field: 'category', header: 'Category', sortable: true, filterType: 'select', filterable: true, filterOptions: ['Alpha', 'Beta', 'Gamma'] }
  ];

  constructor(public dataTableService: DataTableService<any>) {}

  ngOnInit() {}

  fetchData = (page: number, size: number, sort: string, filter: any): Observable<DataQueryResult<any>> => {
    return this.dataTableService.fetchData(page, size, sort, filter);
  };
}
