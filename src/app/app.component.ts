import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataTableComponent, ColumnDefinition } from './data-table/data-table.component';
import { DataQueryResult, DataTableService } from './data-table/services/data-table.service';
import { Observable } from 'rxjs';
import { FilterInputComponent } from './data-table/filter/filter';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DataTableComponent, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'angular-advanced-ui';

  @ViewChild('categoryChip', { static: true }) categoryChip: any;

  columns: ColumnDefinition[] = [
    { field: 'name', header: 'Name', sortable: true, filterType: 'text' as const, filterable: true },
    {
      field: 'value',
      header: 'Value',
      sortable: true,
      filterType: 'range' as const,
      filterable: true,
      cellClass: (value: any) => value < 0 ? 'negative-value' : value > 0 ? 'positive-value' : ''
    },
    {
      field: 'category',
      header: 'Category',
      sortable: true,
      filterType: 'select' as const,
      filterable: true,
      filterOptions: ['Alpha', 'Beta', 'Gamma']
      // cellTemplate will be assigned in ngAfterViewInit
    }
  ];

  data: any[] = [];

  constructor(private dataTableService: DataTableService<any>) {}

  ngOnInit() {
    // Fetch all data from backend for localData
    this.dataTableService.fetchData(0, 1000, '', {}).subscribe({
      next: (result: DataQueryResult<any>) => {
        this.data = result.data;
      },
      error: (err) => {
        console.error('Failed to load data for localData:', err);
      }
    });
  }

  ngAfterViewInit() {
    // Assign the template after view init
    const categoryCol = this.columns.find(col => col.field === 'category');
    if (categoryCol) {
      categoryCol.cellTemplate = this.categoryChip;
    }
  }

  fetchData = (page: number, size: number, sort: string, filter: any): Observable<DataQueryResult<any>> => {
    return this.dataTableService.fetchData(page, size, sort, filter);
  };
}
