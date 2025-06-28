import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FlutterwaveService {
  private apiUrl = environment.apiUrl + '/payments/flutterwave';

  constructor(private http: HttpClient) {}

  // Create a payment link (initial payment)
  createPaymentLink(data: {
    amount: number;
    email: string;
    name: string;
    currency: string;
    tx_ref: string;
    redirect_url: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-payment-link`, data);
  }

  // Charge a saved card token (recurring billing)
  chargeSavedCard(data: {
    userId: string;
    amount: number;
    currency: string;
    tx_ref: string;
    narration?: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/charge-saved-card`, data);
  }

  // Tokenize a card for recurring billing
  tokenizeCard(data: {
    userId: string;
    card_number: string;
    cvv: string;
    expiry_month: string;
    expiry_year: string;
    email: string;
    pin?: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/tokenize-card`, data);
  }

  // Validate OTP for card tokenization
  validateCharge(data: { flw_ref: string; otp: string; userId: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/validate-charge`, data);
  }
}
