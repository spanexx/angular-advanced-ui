export interface StripeCheckoutRequest {
  line_items: Array<{
    price_data: {
      currency: string;
      product_data: { name: string };
      unit_amount: number;
    };
    quantity: number;
    price?: string; // For subscription priceId
  }>;
  success_url: string;
  cancel_url: string;
  userId?: string; // Optional userId for associating user with payment
}

export interface StripeCheckoutResponse {
  id: string;
}