import { Component } from '@angular/core';
import { FlutterwaveCheckoutComponent, FlutterwaveCheckoutRequest } from './flutterwave';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-flutterwave-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, FlutterwaveCheckoutComponent],
  template: `
    <h2>Flutterwave Demo</h2>
    <app-flutterwave
      [payload]="payload"
      [isRecurring]="isRecurring">
    </app-flutterwave>
    <div style="margin-top:2rem;">
      <label>
        <input type="checkbox" [(ngModel)]="isRecurring" /> Recurring Payment
      </label>
    </div>
  `
})
export class FlutterwaveDemoComponent {
  payload: FlutterwaveCheckoutRequest = {
    amount: 1000,
    email: 'user@example.com',
    name: 'John Doe',
    currency: 'NGN',
    tx_ref: 'tx-' + Date.now(),
    redirect_url: window.location.origin + '/flutterwave-success'
  };
  isRecurring = false;
}
