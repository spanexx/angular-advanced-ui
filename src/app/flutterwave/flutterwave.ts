import { Component, inject, Input } from '@angular/core';
import { FlutterwaveService } from './flutterwave.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../toast/toast-service';
import { AuthService } from '../auth/auth.service';

export interface FlutterwaveCheckoutRequest {
  amount: number;
  email: string;
  name: string;
  currency: string;
  tx_ref: string;
  redirect_url: string;
}

@Component({
  selector: 'app-flutterwave',
  standalone: true,
  imports: [CommonModule, MatButtonModule, FormsModule],
  templateUrl: './flutterwave.html',
  styleUrl: './flutterwave.scss'
})
export class FlutterwaveCheckoutComponent {
  loading = false;
  private flutterwaveService = inject(FlutterwaveService);
  private toast = inject(ToastService);
  private authService = inject(AuthService);

  @Input() payload!: FlutterwaveCheckoutRequest;
  @Input() isRecurring?: boolean;
  @Input() userId?: string;

  checkout() {
    if (!this.payload) {
      this.toast.show('Missing checkout payload', 'error');
      return;
    }
    this.loading = true;
    let uid = this.userId;
    if (this.isRecurring && !uid) {
      uid = this.authService.currentUser?.authId || this.authService.currentUser?._id;
    }
    if (this.isRecurring && uid) {
      this.flutterwaveService.chargeSavedCard({
        userId: uid,
        amount: this.payload.amount,
        currency: this.payload.currency,
        tx_ref: this.payload.tx_ref,
        narration: 'Recurring payment'
      }).subscribe({
        next: () => {
          this.loading = false;
          this.toast.show('Recurring charge initiated', 'success');
        },
        error: err => {
          this.loading = false;
          this.toast.show('Error charging card', 'error');
        }
      });
    } else {
      this.flutterwaveService.createPaymentLink(this.payload).subscribe({
        next: res => {
          this.loading = false;
          if (res.data && res.data.link) {
            window.location.href = res.data.link;
          } else {
            this.toast.show('Failed to get payment link', 'error');
          }
        },
        error: err => {
          this.loading = false;
          this.toast.show('Error starting checkout', 'error');
        }
      });
    }
  }
}
