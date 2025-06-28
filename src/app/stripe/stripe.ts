import { Component, inject, Input } from '@angular/core';
import { StripeCheckoutService } from './stripe-service';
import { StripeCheckoutRequest } from './stripe.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
import { ToastService } from '../toast/toast-service';

@Component({
  selector: 'app-stripe',
  imports: [CommonModule, MatButtonModule, FormsModule],
  templateUrl: './stripe.html',
  styleUrl: './stripe.scss'
})
export class StripeCheckoutComponent {
  loading = false;
  private stripeService = inject(StripeCheckoutService);
  private toast = inject(ToastService); // Assuming you have a ToastService for notifications

  @Input() payload!: StripeCheckoutRequest;
  @Input() isSubscription?: boolean;

  /**
   * Initiates the checkout process by creating a Stripe Checkout session.
   * It uses the provided payload to create the session and redirects the user to Stripe's checkout page.
   */
  checkout() {
    if (!this.payload) {
      alert('Missing checkout payload');
      return;
    }

    this.loading = true;

    const request$ = this.isSubscription
      ? this.stripeService.createSubscriptionSession(this.payload)
      : this.stripeService.createCheckoutSession(this.payload);

    request$.subscribe(
      async res => {
        const stripe = await this.loadStripe();
        stripe?.redirectToCheckout({ sessionId: res.id });
        this.loading = false;
      },
      err => {
        this.loading = false;
        this.toast.show('Error starting checkout', 'error');
      }
    );
  }

  /**
   * Loads the Stripe.js library asynchronously.
   * @returns A promise that resolves to the Stripe object.
   */
  private async loadStripe(): Promise<any> {
    if (!(window as any).Stripe) {
      await this.loadScript('https://js.stripe.com/v3/');
    }
    return (window as any).Stripe(environment.stripePK);
  }



  /** * Loads a script dynamically and returns a promise that resolves when the script is loaded.
   * @param src - The source URL of the script to load.
   * @returns A promise that resolves when the script is loaded.
   * */
    private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject();
      document.body.appendChild(script);
    });
  }


}
