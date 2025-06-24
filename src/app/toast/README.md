# Toast Notification System (Angular)

A flexible, accessible toast/snackbar notification system for Angular apps. Supports custom types, actions, icons, progress bars, and global injection.

---

## Features

- Global toast service (injectable)
- Multiple toast types: `success`, `error`, `warning`, `info`
- Custom icons, styles, and positions
- Action buttons (with callback)
- Optional progress bar
- Keyboard dismiss (Escape)
- Max visible toasts (FIFO)
- Accessible (ARIA roles, labels)

---

## Usage Example

### 1. Inject the ToastService

```typescript
import { ToastService } from './toast/toast-service';

constructor(private toast: ToastService) {}

showSuccess() {
  this.toast.show('Saved successfully!', 'success');
}

showWithAction() {
  this.toast.show('Undo delete?', 'info', 5000, {
    action: { label: 'Undo', callback: () => this.undoDelete() }
  });
}
```

### 2. Add Toast Container to App Template

```html
<app-toast-container 
[toasts]="toasts$ | async" 
[position]="position"
[cssClass]="cssClass"
[style]="style"

></app-toast-container>
```

### 3. Subscribe to Toasts in Component

```typescript
// In your root/app component
import { ToastService } from './toast/toast-service';
toasts$ = this.toastService.toasts$;
```

---

## API Reference

### ToastService Methods

- `show(message, type?, duration?, options?, action?, progressBar?)`
  - `type`: `'success' | 'error' | 'warning' | 'info'` (default: `'info'`)
  - `duration`: ms (default: 3000)
  - `options`: `ToastOptions` (see below)
  - `action`: `{ label: string, callback: () => void }`
  - `progressBar`: `boolean`
- `dismiss(id)` – Dismiss a toast by id
- `clearAll()` – Remove all toasts
- `showError(message, duration?)` – Quick error toast

### ToastOptions

- `cssClass`, `style`, `icon`, `action`, `position`, `progressBar`

### Toast Model

- `id`, `message`, `type`, `duration`, `cssClass`, `style`, `action`, `position`, `progressBar`, `icon`

---

## Inputs & Outputs

- **Inputs:**
  - `toasts: Toast[]` – Array of toast objects
  - `cssClass: string` – Custom class for container
  - `style: any` – Inline styles
  - `position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'` (default: `'top-right'`)

- **Outputs:**
  - Action button click triggers `action.callback`
  - Dismiss button removes toast

---

## Real-World Examples

- **Multi-step Form:** Show validation errors or success after each step
- **Onboarding:** Welcome message or tips
- **Checkout:** Payment success/failure, undo actions
- **API Errors:** Show error toast on failed HTTP requests

---

## Accessibility

- Uses `role="alert"` and `aria-live="polite"`
- Keyboard dismiss (Escape)
- Action buttons are focusable

---

## Styling

- Customize via `toast.css` or override with `cssClass`/`style`
- Add custom icons via `icon` (SVG string)

---

## License

spanexx
