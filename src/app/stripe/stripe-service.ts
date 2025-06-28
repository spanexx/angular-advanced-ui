import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StripeCheckoutRequest, StripeCheckoutResponse } from './stripe.model';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class StripeCheckoutService {

 private readonly apiUrl = environment.apiUrl + '/payments';

  constructor(private http: HttpClient) {}

  createCheckoutSession(payload: StripeCheckoutRequest): Observable<StripeCheckoutResponse> {
    return this.http.post<StripeCheckoutResponse>(`${this.apiUrl}/create-checkout-session`, payload);
  }

  createSubscriptionSession(payload: StripeCheckoutRequest): Observable<StripeCheckoutResponse> {
    return this.http.post<StripeCheckoutResponse>(`${this.apiUrl}/create-subscription-session`, payload);
  }

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products`);
  }
}
