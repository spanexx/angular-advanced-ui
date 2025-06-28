import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-stripe-success',
  standalone: true,
imports: [RouterModule],
  template: `
    <div class="stripe-success">
      <h2>🎉 Payment Successful!</h2>
      <p>Thank you for your purchase. Your payment has been processed successfully.</p>
      <a routerLink="/stripe">Back to Shop</a>
    </div>
  `,
  styles: [`
    .stripe-success {
      text-align: center;
      margin-top: 3rem;
    }
    .stripe-success h2 {
      color: #4caf50;
    }
    .stripe-success a {
      display: inline-block;
      margin-top: 2rem;
      color: #3f51b5;
      text-decoration: underline;
      cursor: pointer;
    }
  `]
})
export class StripeSuccessComponent {}
