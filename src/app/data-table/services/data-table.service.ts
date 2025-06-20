import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'; // Adjust path as needed

export interface DataQueryResult<T> {
  data: T[];
  total: number;
}

@Injectable({ 
  providedIn: 'root' 
})
export class DataTableService<T> {
  private readonly apiUrl = environment.apiUrl; 

  constructor(private http: HttpClient) {}

  /**
   * Fetch paginated, sorted, and filtered data from server.
   * @param page Zero-based page index
   * @param size Number of items per page
   * @param sort Sort parameter (e.g., 'name,asc')
   * @param filter Field-value map for server filtering
   */
  fetchData(
    page: number,
    size: number,
    sort: string,
    filter: Record<string, any>
  ): Observable<DataQueryResult<T>> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size))
      .set('sort', sort || '');

    Object.entries(filter).forEach(([key, value]) => {
      if (value != null && String(value).trim() !== '') {
        params = params.set(`filter[${key}]`, String(value));
      }
    });

    return this.http.get<DataQueryResult<T>>(this.apiUrl + '/data', { params });
  }
}