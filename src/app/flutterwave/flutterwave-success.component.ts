import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `
    <h2>Flutterwave Payment Success</h2>
    <p>Your payment was successful. Thank you!</p>
    <a routerLink="/">Go Home</a>
  `
})
export class FlutterwaveSuccessComponent {}
