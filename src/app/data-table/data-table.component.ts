import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, Input, OnInit, ViewChild, OnChanges, SimpleChanges, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { FilterInputComponent } from './filter/filter';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { delay } from 'rxjs/operators';
import { DataTableService } from './services/data-table.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { debounceTime, Subject } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';

export interface ColumnDefinition {
  header: string;
  field: string;
  sortable?: boolean;
  filterType?: 'text' | 'select' | 'date' | 'range';
  filterOptions?: any[]; // For select dropdowns
  filterable?: boolean;
  cellTemplate?: TemplateRef<any>; // Custom cell template
  cellClass?: (value: any, row: any) => string | string[]; // Conditional class
  cellStyle?: (value: any, row: any) => object; // Conditional style
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
    MatSortModule,
    FilterInputComponent,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTooltipModule,
    ScrollingModule,
    MatMenuModule
  ],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})
export class DataTableComponent<T extends Record<string, any>> implements OnInit, OnChanges {
  @Input() columnDefinitions: ColumnDefinition[] = [];
  @Input() fetchDataService!: (page: number, size: number, sort: string, filter: any) => Observable<{ data: T[]; total: number }>;
  @Input() customFetch?: (page: number, size: number, sort: string, filter: any) => Observable<{ data: T[]; total: number }>;

  @Input() selectionMode: 'single' | 'multiple' | 'none' = 'none';
  @Input() rowActions: Array<{ icon: string; label: string; action: string; color?: string }> = [];

  @Input() rowIdField: string = 'id';

  dataSource = new MatTableDataSource<T>([]);
  isLoading = false;
  errorMessage: string | null = null;
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;
  // Replace single sortKey with multi-column sortKeys
  sortKeys: Array<{ field: string; direction: 'asc' | 'desc' }> = [];
  filterValues: any = {};
  pendingFilterValues: any = {};
  globalSearch: string = '';
  filteredData: T[] = [];

  selectedRows: T[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  editedRow: T | null = null;

  private filterInputSubject = new Subject<{ key: string, value: string }>();

  constructor(public dataTableService: DataTableService<T>) {}

  ngOnInit() {
    // Initialize pendingFilterValues with current filterValues
    this.pendingFilterValues = { ...this.filterValues };
    this.loadPage();
    // Removed debounced filtering
  }

  ngOnChanges(changes: SimpleChanges) {
    // No localData logic
  }

  loadPage() {
    this.isLoading = true;
    this.errorMessage = null;
    // Always use server-side fetching
    const filters = { ...this.filterValues, globalSearch: this.globalSearch };
    const fetchFn = this.customFetch || this.fetchDataService;
    const sortString = this.sortKeys.map(s => `${s.field},${s.direction}`).join(';');
    fetchFn(
      this.pageIndex,
      this.pageSize,
      sortString,
      filters
    )
    .pipe(delay(2000))
    .subscribe({
      next: (result) => {
        this.dataSource.data = result.data;
        this.totalItems = result.total;
        this.isLoading = false;
      },
      error: (error) => {
        if (error.status === 0 || error.message?.includes('Network') || error.message?.includes('Http failure')) {
          this.errorMessage = 'Cannot connect to the server. Please check your network connection or try again later.';
        } else {
          this.errorMessage = 'Failed to load data.';
        }
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

  onPendingFilterInput(key: string, value: string) {
    this.pendingFilterValues[key] = value;
    // No debounced filter trigger here
  }

  applyPendingFilters() {
    this.filterValues = { ...this.pendingFilterValues };
    this.pageIndex = 0;
    this.loadPage();
  }

  // Update onSortChange to support multi-column sorting
  onSortChange(event?: any, colField?: string, eventObj?: MouseEvent) {
    let field: string;
    let direction: 'asc' | 'desc';
    if (event && event.active && event.direction) {
      field = event.active;
      direction = event.direction;
    } else if (colField) {
      field = colField;
      // Toggle direction or set to 'asc' if not present
      const existing = this.sortKeys.find(s => s.field === field);
      if (existing) {
        direction = existing.direction === 'asc' ? 'desc' : 'asc';
      } else {
        direction = 'asc';
      }
    } else {
      return;
    }

    const shiftKey = eventObj?.shiftKey;
    if (shiftKey) {
      // Multi-column sort: add or update
      const idx = this.sortKeys.findIndex(s => s.field === field);
      if (idx > -1) {
        if (direction) {
          this.sortKeys[idx].direction = direction;
        } else {
          this.sortKeys.splice(idx, 1);
        }
      } else {
        this.sortKeys.push({ field, direction });
      }
    } else {
      // Single-column sort: reset others
      if (direction) {
        this.sortKeys = [{ field, direction }];
      } else {
        this.sortKeys = [];
      }
    }
    this.loadPage();
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPage();
  }

  onGlobalSearchChange(value: string) {
    this.globalSearch = value;
    this.pageIndex = 0;
    this.loadPage();
  }

  // Helper to get row id
  private getRowId(row: T): any {
    return (row as any)[this.rowIdField];
  }

  // Selection logic
  toggleRowSelection(row: T) {
    if (this.selectionMode === 'none') return;
    const rowId = this.getRowId(row);
    if (this.selectionMode === 'single') {
      this.selectedRows = [row];
    } else if (this.selectionMode === 'multiple') {
      const idx = this.selectedRows.findIndex(r => this.getRowId(r) === rowId);
      if (idx > -1) {
        this.selectedRows.splice(idx, 1);
      } else {
        this.selectedRows.push(row);
      }
    }
  }

  isRowSelected(row: T): boolean {
    const rowId = this.getRowId(row);
    return this.selectedRows.some(r => this.getRowId(r) === rowId);
  }

  toggleSelectAllRows() {
    if (this.selectedRows.length === this.dataSource.data.length) {
      this.selectedRows = [];
    } else {
      this.selectedRows = [...this.dataSource.data];
    }
  }

  isAllRowsSelected(): boolean {
    return this.selectedRows.length === this.dataSource.data.length && this.dataSource.data.length > 0;
  }

  // Row action handler
  onRowAction(action: string, row: T) {
    // Emit or handle row action here (can use Output if needed)
    // Example: this.rowAction.emit({ action, row });
    console.log('Row action:', action, row);
  }

  // Bulk action handler
  onBulkAction(action: string) {
    // Emit or handle bulk action here (can use Output if needed)
    // Example: this.bulkAction.emit({ action, rows: this.selectedRows });
    console.log('Bulk action:', action, this.selectedRows);
  }

  get displayedColumns(): string[] {
    let cols = this.columnDefinitions.map(c => c.field);
    if (this.selectionMode !== 'none') {
      cols = ['select', ...cols];
    }
    // Always show actions column for built-in edit/delete
    cols = [...cols, 'actions'];
    return cols;
  }

  // Helper to get sort direction for a column
  getSortDirection(field: string): 'asc' | 'desc' | null {
    const found = this.sortKeys.find(s => s.field === field);
    return found ? found.direction : null;
  }

  // Helper to get sort order for a column
  getSortOrder(field: string): number | null {
    const idx = this.sortKeys.findIndex(s => s.field === field);
    return idx > -1 ? idx + 1 : null;
  }

  trackByRowId = (_: number, row: T) => this.getRowId(row);

  editRow(row: T) {
    this.editedRow = { ...row };
  }

  saveEditRow(originalRow: T) {
    if (!this.editedRow) return;
    // Update the original row with edited values
    Object.assign(originalRow, this.editedRow);
    this.editedRow = null;
    // Optionally emit an event or call a service to persist changes
  }

  cancelEditRow() {
    this.editedRow = null;
  }

  deleteRow(row: T) {
    // Remove the row from the data source
    const id = row[this.rowIdField];
    this.dataSource.data = this.dataSource.data.filter((r: T) => r[this.rowIdField] !== id);
    // Optionally, emit an event or call a service to persist deletion
    this.selectedRows = this.selectedRows.filter((r: T) => r[this.rowIdField] !== id);
  }

  // Export current view or all data
  exportTable(type: 'csv' | 'xlsx' = 'csv', all: boolean = false) {
    const columns = this.columnDefinitions.map(col => col.field);
    let data: T[] = [];
    // Only export current view (filteredData) or all currently loaded data
    if (this.filteredData && this.filteredData.length > 0) {
      data = [...this.filteredData];
    } else {
      data = this.dataSource.data;
    }
    this.dataTableService.exportToFile(data, columns, 'datatable_export', type);
  }

  // Import data from file (frontend and/or server)
  async importTable(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.isLoading = true;
    this.errorMessage = null;
    this.dataTableService.uploadFileToServer(file).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.errorMessage = null;
          this.loadPage();
        } else {
          this.errorMessage = 'Import failed on server.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to import data to server.';
      }
    });
  }

  exportSelectedRows() {
    if (!this.selectedRows || this.selectedRows.length === 0) return;
    const columns = this.columnDefinitions.map(col => col.field);
    this.dataTableService.exportToFile(this.selectedRows, columns, 'datatable_selected_export', 'csv');
  }

  deleteSelectedRows() {
    if (!this.selectedRows || this.selectedRows.length === 0) return;
    const selectedIds = this.selectedRows.map(row => this.getRowId(row));
    // Remove from dataSource
    this.dataSource.data = this.dataSource.data.filter(row => !selectedIds.includes(this.getRowId(row)));
    // Clear selection
    this.selectedRows = [];
    // Optionally, call a service to persist deletion on the backend
    // this.dataTableService.deleteRows(selectedIds).subscribe(...)
  }
}
