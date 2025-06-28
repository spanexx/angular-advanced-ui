import { Routes } from '@angular/router';
import { ToastDemoComponent } from './toast/toast-demo.component';

export const routes: Routes = [
  { path: '', redirectTo: 'data-table', pathMatch: 'full' },
  { path: 'data-table', loadComponent: () => import('./data-table/data-table-demo.component').then(m => m.DataTableDemoComponent) },
  { path: 'dynamic-form', loadComponent: () => import('./dynamic-form/dynamic-form-demo.component').then(m => m.DynamicFormDemoComponent) },
  { path: 'stepper-wizard', loadComponent: () => import('./stepper-wizard/stepper-demo-component').then(m => m.StepperWizardDemoComponent) },
  { path: 'sign-pad', loadComponent: () => import('./sign-pad/sign-pad').then(m => m.SignPad) },
  { path: 'toast-demo', component: ToastDemoComponent },
  { path: 'chat', loadComponent: () => import('./chat-component/chat.component').then(m => m.ChatComponent) },
  { path: 'stripe', loadComponent: () => import('./stripe/stripe.demo.component').then(m => m.StripeCheckoutDemoComponent) },
  { path: 'stripe-success', loadComponent: () => import('./stripe/stripe-success.component').then(m => m.StripeSuccessComponent) },
  { path: 'stripe-cancel', loadComponent: () => import('./stripe/stripe-cancel.component').then(m => m.StripeCancelComponent) },
  { path: 'auth', loadComponent: () => import('./auth/auth.component').then(m => m.AuthComponent) },
  { path: 'flutterwave', loadComponent: () => import('./flutterwave/flutterwave.demo.component').then(m => m.FlutterwaveDemoComponent) },
  { path: 'flutterwave-success', loadComponent: () => import('./flutterwave/flutterwave-success-extended.component').then(m => m.FlutterwaveSuccessExtendedComponent) },
  { path: 'flutterwave-cancel', loadComponent: () => import('./flutterwave/flutterwave-cancel.component').then(m => m.FlutterwaveCancelComponent) },
  { path: 'infinite-scroll', loadComponent: () => import('./infinite-scroll/infinite-scroll-demo.component').then(m => m.InfiniteScrollDemoComponent) },
];

