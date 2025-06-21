import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

export interface ColumnDefinition {
  header: string;
  field: string;
  sortable?: boolean;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})
export class DataTableComponent<T> implements OnInit {
  @Input() columnDefinitions: ColumnDefinition[] = [];
  @Input() fetchDataService!: (page: number, size: number, sort: string, filter: any) => Observable<{ data: T[]; total: number }>;
  @Input() customFetch?: (page: number, size: number, sort: string, filter: any) => Observable<{ data: T[]; total: number }>;

  dataSource = new MatTableDataSource<T>([]);
  isLoading = false;
  errorMessage: string | null = null;
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;
  sortKey = '';
  filterValues: any = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.loadPage();
  }

  loadPage() {
    this.isLoading = true;
    this.errorMessage = null;
    (this.customFetch || this.fetchDataService)(
      this.pageIndex,
      this.pageSize,
      this.sortKey,
      this.filterValues
    ).subscribe({
      next: (result) => {
        this.dataSource.data = result.data;
        this.totalItems = result.total;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load data.';
        this.isLoading = false;
        console.error(error);
      }
    });
  }

  applyFilter(key: string, value: string) {
    this.filterValues[key] = value;
    console.log('Current filterValues:', this.filterValues); // Debug log
    this.pageIndex = 0;
    this.loadPage();
  }

  onSortChange() {
    const sortState = this.sort.active ? `${this.sort.active},${this.sort.direction}` : '';
    this.sortKey = sortState;
    this.loadPage();
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPage();
  }

  get displayedColumns(): string[] {
    return this.columnDefinitions.map(c => c.field);
  }
}
