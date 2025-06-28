import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-stripe-cancel',
  standalone: true,
  imports: [RouterModule],

  template: `
    <div class="stripe-cancel">
      <h2>❌ Payment Cancelled</h2>
      <p>Your payment was cancelled. You can try again or return to the shop.</p>
      <a routerLink="/stripe">Back to Shop</a>
    </div>
  `,
  styles: [`
    .stripe-cancel {
      text-align: center;
      margin-top: 3rem;
    }
    .stripe-cancel h2 {
      color: #f44336;
    }
    .stripe-cancel a {
      display: inline-block;
      margin-top: 2rem;
      color: #3f51b5;
      text-decoration: underline;
      cursor: pointer;
    }
  `]
})
export class StripeCancelComponent {}
