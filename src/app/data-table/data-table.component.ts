import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DataTableService } from './services/data-table.service';


export interface ColumnDef {
  key: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
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
export class DataTableComponent <T> implements OnInit {
  @Input() columns: ColumnDef[] = [];
  @Input() fetchData!: (page: number, size: number, sort: string, filter: any) => Promise<{ data: T[]; total: number }>;
  displayedColumns: string[] = this.columns.map(c => c.key);

  dataSource = new MatTableDataSource<T>([]);
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;
  sortKey = '';
  filterValues: any = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private service: DataTableService<T>) {}

  ngOnInit() {
    this.loadPage();
  }

  async loadPage() {
    const result = await this.fetchData(
      this.pageIndex,
      this.pageSize,
      this.sortKey,
      this.filterValues
    );
    this.dataSource.data = result.data;
    this.totalItems = result.total;
  }

  applyFilter(key: string, value: string) {
    this.filterValues[key] = value;
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
}

