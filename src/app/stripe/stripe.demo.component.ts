import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StripeCheckoutComponent } from './stripe';
import { StripeCheckoutRequest } from './stripe.model';
import { Router } from '@angular/router';
import { StripeCheckoutService } from './stripe-service';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-stripe-checkout-demo',
  standalone: true,
  imports: [CommonModule, StripeCheckoutComponent],
  template: `
    <div class="checkout-demo">
      <h2>🛍 Choose a Product</h2>

      <div class="product-list">
        <div 
          class="product-card"
          *ngFor="let product of products"
          (click)="selectProduct(product)"
          [class.selected]="selectedProduct?.name === product.name"
        >
          <h3>{{ product.name }}</h3>
          <p>\${{ product.unit_amount / 100 }}</p>
        </div>
      </div>

      <div class="checkout-action" *ngIf="checkoutPayload">
        <h4>Selected: {{ selectedProduct?.name }}</h4>
        <app-stripe [payload]="checkoutPayload" [isSubscription]="selectedProduct?.isSubscription" />
      </div>
    </div>

  `,
  styles: [`
    .checkout-demo {
      padding: 1rem;
      max-width: 600px;
      margin: auto;
    }

    .product-list {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .product-card {
      border: 2px solid #ccc;
      border-radius: 8px;
      padding: 1rem;
      cursor: pointer;
      width: 160px;
      text-align: center;
      transition: border-color 0.3s;
    }

    .product-card.selected {
      border-color: #3f51b5;
    }

    .checkout-action {
      margin-top: 2rem;
    }
  `]
})
export class StripeCheckoutDemoComponent implements OnInit {
  selectedProduct: {
    name: string;
    unit_amount: number;
    description?: string;
    stripePriceId?: string;
    isSubscription?: boolean;
    image?: string;
    createdAt?: string;
  } | null = null;
  checkoutPayload!: StripeCheckoutRequest;
  success_url = window.location.origin + '/stripe-success';
  cancel_url = window.location.origin + '/stripe-cancel';
  products: Array<{
    name: string;
    unit_amount: number;
    description?: string;
    stripePriceId?: string;
    isSubscription?: boolean;
    image?: string;
    createdAt?: string;
  }> = [];

  private auth = inject(AuthService);

  constructor(private stripeService: StripeCheckoutService) {}

  ngOnInit() {
    this.stripeService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  selectProduct(product: any) {
    this.selectedProduct = product;
    const userId = this.auth.currentUser?._id;
    if (product.isSubscription && product.stripePriceId) {
      // Subscription product: use Stripe priceId
      this.checkoutPayload = {
        line_items: [
          {
            price_data: undefined, // Not needed for subscription
            price: product.stripePriceId,
            quantity: 1
          }
        ],
        success_url: this.success_url,
        cancel_url: this.cancel_url,
        userId
      } as any; // Cast to any to allow price field
    } else {
      // One-time product
      this.checkoutPayload = {
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: { name: product.name },
              unit_amount: product.unit_amount
            },
            quantity: 1
          }
        ],
        success_url: this.success_url,
        cancel_url: this.cancel_url,
        userId
      };
    }
  }

  checkout() {
    if (!this.selectedProduct || !this.checkoutPayload) return;
    if (this.selectedProduct.isSubscription && this.selectedProduct.stripePriceId) {
      this.stripeService.createSubscriptionSession(this.checkoutPayload).subscribe(
        async res => {
          const stripe = await (window as any).Stripe(environment.stripePK);
          stripe?.redirectToCheckout({ sessionId: res.id });
        },
        err => {
          alert('Error starting subscription checkout');
        }
      );
    } else {
      this.stripeService.createCheckoutSession(this.checkoutPayload).subscribe(
        async res => {
          const stripe = await (window as any).Stripe(environment.stripePK);
          stripe?.redirectToCheckout({ sessionId: res.id });
        },
        err => {
          alert('Error starting checkout');
        }
      );
    }
  }

}
