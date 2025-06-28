import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `
    <h2>Flutterwave Payment Cancelled</h2>
    <p>Your payment was cancelled or failed. Please try again.</p>
    <a routerLink="/">Go Home</a>
  `
})
export class FlutterwaveCancelComponent {}
