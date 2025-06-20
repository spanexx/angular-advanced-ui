import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataTableComponent } from './data-table/data-table.component';
import { DataQueryResult, DataTableService } from './data-table/services/data-table.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DataTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-advanced-ui';



    columns = [
    { field: 'name', header: 'Name', sortable: true },
    { field: 'value', header: 'Value', sortable: true },
    { field: 'category', header: 'Category', sortable: true }
  ];

  constructor(private dataTableService: DataTableService<any>) {}

  fetchData = (page: number, size: number, sort: string, filter: any): Observable<DataQueryResult<any>> => {
    return this.dataTableService.fetchData(page, size, sort, filter);
  };
}
