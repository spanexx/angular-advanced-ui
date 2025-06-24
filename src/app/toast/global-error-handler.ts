import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { ToastService } from './toast-service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: any): void {
    const toastService = this.injector.get(ToastService);
    toastService.showError(error.message || 'An unexpected error occurred.', 5000);
    console.error('Error: ', error);
  }
}