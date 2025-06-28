import { Component, Input } from '@angular/core';
import { FlutterwaveService } from './flutterwave.service';
import { AuthService } from '../auth/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-save-card',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './save-card.component.html',
  styleUrls: ['./save-card.component.scss']
})
export class SaveCardComponent {
  @Input() email: string = '';
  card_number = '';
  cvv = '';
  expiry_month = '';
  expiry_year = '';
  pin = '';
  loading = false;
  error = '';
  success = false;
  otpRequired = false;
  otp = '';
  flwRef = '';

  constructor(
    private flutterwave: FlutterwaveService,
    private auth: AuthService
  ) {}

  saveCard() {
    this.loading = true;
    this.error = '';
    this.success = false;
    const userId = this.auth.getUserId();
    if (!userId) {
      this.error = 'User not authenticated.';
      this.loading = false;
      return;
    }
    this.flutterwave.tokenizeCard({
      userId,
      card_number: this.card_number,
      cvv: this.cvv,
      expiry_month: this.expiry_month,
      expiry_year: this.expiry_year,
      email: this.email,
      pin: this.pin
    }).subscribe({
      next: (res) => {
        if (res?.requiresAuth && res.flwRef) {
          this.otpRequired = true;
          this.flwRef = res.flwRef;
          this.loading = false;
          return;
        }
        this.success = true;
        this.loading = false;
      },
      error: err => {
        this.error = err.error?.error || 'Failed to save card';
        this.loading = false;
      }
    });
  }

  submitOtp() {
    this.loading = true;
    this.error = '';
    const userId = this.auth.getUserId();
    if (!userId) {
      this.error = 'User not authenticated.';
      this.loading = false;
      return;
    }
    this.flutterwave.validateCharge({
      flw_ref: this.flwRef,
      otp: this.otp,
      userId
    }).subscribe({
      next: (res) => {
        this.success = true;
        this.loading = false;
        this.otpRequired = false;
      },
      error: err => {
        this.error = err.error?.error || 'Failed to validate OTP';
        this.loading = false;
      }
    });
  }
}
