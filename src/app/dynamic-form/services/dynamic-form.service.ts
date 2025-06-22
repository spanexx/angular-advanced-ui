import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DynamicField } from '../dynamic-form'; 
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FormSchemaService {
      private readonly apiUrl = environment.apiUrl + '/form-schema';
    
  constructor(private http: HttpClient) {}

getSchemaByName(name: string): Observable<DynamicField[]> {
  return this.http.get<DynamicField[]>(`${this.apiUrl}/${name}`);
}

}
