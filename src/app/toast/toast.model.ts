export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  cssClass?: string;
  style?: any;
  action?: { label: string; callback: () => void };
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  progressBar?: boolean;
  icon?: string;
}

export interface ToastOptions {
  cssClass?: string;
  style?: any;
  icon?: string;
  action?: { label: string; callback: () => void };
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  progressBar?: boolean;
}