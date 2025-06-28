import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InfiniteScrollService {

  constructor(private http: HttpClient) { }

  getData(page: number, size: number): Observable<any> {
    // Use correct API endpoint from backend and environment
    return this.http.get(`${environment.apiUrl}/infinite-scroll-data?page=${page}&size=${size}`);
  }
}
