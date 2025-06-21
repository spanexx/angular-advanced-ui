import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, throwError, BehaviorSubject, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import * as XLSX from 'xlsx';

export interface DataQueryResult<T> {
  data: T[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataTableService<T> {
  private readonly apiUrl = environment.apiUrl + '/data';

  private dataCache$: BehaviorSubject<DataQueryResult<T> | null> = new BehaviorSubject<DataQueryResult<T> | null>(null);
  private cacheTimestamp: number | null = null;
  private readonly MAX_CACHE_AGE = 5 * 60 * 1000; // 5 minutes

  constructor(private http: HttpClient) {}

  /**
   * Fetch paginated, sorted, and filtered data from server.
   */
  fetchData(page: number, size: number, sort: string, filter: Record<string, any>): Observable<DataQueryResult<T>> {
    const now = Date.now();
    const cacheIsValid =
      this.dataCache$.value !== null &&
      this.cacheTimestamp !== null &&
      now - this.cacheTimestamp < this.MAX_CACHE_AGE &&
      page === 0 && size >= 1000 && !sort && Object.keys(filter || {}).length === 0;
    // Only use cache for the default fetch-all query
    if (cacheIsValid) {
      return of(this.dataCache$.value!);
    } else {
      let params = new HttpParams()
        .set('page', (page + 1).toString())
        .set('size', size.toString())
        .set('sort', sort || 'createdAt');
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
        tap(result => {
          // Only cache the default fetch-all query
          if (page === 0 && size >= 1000 && !sort && Object.keys(filter || {}).length === 0) {
            this.dataCache$.next(result);
            this.cacheTimestamp = Date.now();
          }
        }),
        catchError(error => {
          console.error('Error fetching data:', error);
          return throwError(() => new Error('Failed to fetch data.'));
        })
      );
    }
  }

  clearCache() {
    this.dataCache$.next(null);
    this.cacheTimestamp = null;
  }

  addToCache(newItem: T) {
    const current = this.dataCache$.value?.data || [];
    const updated = [...current, newItem];
    this.dataCache$.next({ data: updated, total: updated.length });
    this.cacheTimestamp = Date.now();
  }

  /**
   * Export data to CSV or Excel
   */
  exportToFile(data: T[], columns: string[], fileName: string, fileType: 'csv' | 'xlsx' = 'csv') {
    const worksheet = XLSX.utils.json_to_sheet(data, { header: columns });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    if (fileType === 'csv') {
      XLSX.writeFile(workbook, fileName + '.csv', { bookType: 'csv' });
    } else {
      XLSX.writeFile(workbook, fileName + '.xlsx', { bookType: 'xlsx' });
    }
  }

  /**
   * Import data from CSV or Excel
   */
  importFromFile(file: File): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        // Use the first row as headers
        const json: T[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        resolve(json);
      };
      reader.onerror = (err) => reject(err);
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Upload a CSV or Excel file to the server and save to DB
   */
  uploadFileToServer(file: File): Observable<{ success: boolean; count: number }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ success: boolean; count: number }>(`${environment.apiUrl}/data/import`, formData);
  }
}