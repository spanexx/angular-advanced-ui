import { Routes } from '@angular/router';
import { ToastDemoComponent } from './toast/toast-demo.component';

export const routes: Routes = [
  { path: '', redirectTo: 'data-table', pathMatch: 'full' },
  { path: 'data-table', loadComponent: () => import('./data-table/data-table-demo.component').then(m => m.DataTableDemoComponent) },
  { path: 'dynamic-form', loadComponent: () => import('./dynamic-form/dynamic-form-demo.component').then(m => m.DynamicFormDemoComponent) },
  { path: 'stepper-wizard', loadComponent: () => import('./stepper-wizard/stepper-demo-component').then(m => m.StepperWizardDemoComponent) },
  {path: 'sign-pad', loadComponent: () => import('./sign-pad/sign-pad').then(m => m.SignPad) },
  { path: 'toast-demo', component: ToastDemoComponent },
  {path: 'chat', loadComponent: () => import('./chat-component/chat.component').then(m => m.ChatComponent) },
];
