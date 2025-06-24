import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Toast, ToastOptions } from './toast.model';


@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  maxToasts = 5;
  toasts$ = this.toastsSubject.asObservable();

  show(
    message: string,
    type: Toast['type'] = 'info',
    duration = 3000,
    options?: ToastOptions,
    action?: { label: string; callback: () => void },
    progressBar?: boolean
  ) {
    const toast: Toast = {
      id: uuidv4(),
      message,
      action: options?.action || action,
      type,
      duration,
      cssClass: options?.cssClass || '',
      style: options?.style,
      position: options?.position,
      progressBar: progressBar,
      icon: options?.icon,
    };
    const current = this.toastsSubject.value;
    if (current.length >= this.maxToasts) {
      current.shift();
    }
    this.toastsSubject.next([...current, toast]);
    // Only auto-dismiss if no action or if duration is set and action is not required to keep toast open
    if (!toast.action || (toast.action && duration > 0)) {
      this.dismissToast(toast.id, duration);
    }
    return toast.id;
  }

  dismiss(id: string) {
    this.toastsSubject.next(this.toastsSubject.value.filter(toast => toast.id !== id));
  }

  dismissToast(id: string, duration: number) {
    setTimeout(() => this.dismiss(id), duration);
  }

  clearAll() {
    this.toastsSubject.next([]);
  }

  showError(message: string, duration = 3000) {
    this.show(message, 'error', duration);
  }
}