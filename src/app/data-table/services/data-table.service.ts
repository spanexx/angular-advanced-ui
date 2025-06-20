import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DataQueryResult<T> {
  data: T[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataTableService<T> {
  private readonly apiUrl = environment.apiUrl + '/data';

  constructor(private http: HttpClient) {}

  /**
   * Fetch paginated, sorted, and filtered data from server.
   */
  fetchData(page: number, size: number, sort: string, filter: Record<string, any>): Observable<DataQueryResult<T>> {
    let params = new HttpParams()
      .set('page', (page + 1).toString()) // backend expects 1-based page
      .set('size', size.toString())
      .set('sort', sort || 'createdAt');

    // Add filter params
    Object.entries(filter || {}).forEach(([key, value]) => {
      if (value != null && String(value).trim() !== '') {
        params = params.set(`filter[${key}]`, String(value));
      }
    });

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map(res => ({
        data: res.items,
        total: res.totalItems
      })),
      catchError(error => {
        console.error('Error fetching data:', error);
        return throwError(() => new Error('Failed to fetch data.'));
      })
    );
  }
}