import { Toast } from './toast.model';
import { ToastService } from './toast-service';
import { FormsModule } from '@angular/forms';
import { ToastContainerComponent } from './toast';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-toast-demo',
    standalone: true,
    imports: [FormsModule, ToastContainerComponent, CommonModule],
  template: `
      <div class="container">
      <h1>Toast Demo</h1>

      <button class="btn btn-success" (click)="showSuccess()">Show Success</button>
      <button class="btn btn-danger" (click)="showError()">Show Error</button>
      <button class="btn btn-info" (click)="showInfo()">Show Info</button>
      <button class="btn btn-primary" (click)="simulateAsyncOperation()">Simulate Async</button>
      <button class="btn btn-primary" (click)="showCustomStyledToast()">Show Custom Styled Toast</button>
      <button class="btn btn-warning" (click)="showActionToast()">Show Action Toast</button>
      <button class="btn btn-danger" (click)="showRetryToast()">Show Retry Toast</button>
      <button class="btn btn-danger" (click)="simulateDeleteUser()">Simulate Delete User</button>
      <button class="btn btn-info" (click)="showProgressBarToast()">Show Progress Bar Toast</button>

      <label for="position">Position:</label>
      <select id="position" [(ngModel)]="position">
        <option value="top-left">Top Left</option>
        <option value="top-right">Top Right</option>
        <option value="bottom-left">Bottom Left</option>
        <option value="bottom-right">Bottom Right</option>
      </select>

  <app-toast-container [toasts]="toasts" [position]="position"></app-toast-container>
      <button class="btn btn-primary" (click)="clearToasts()">Clear Toasts</button>

      <div class="user-card" *ngIf="user">
        <h2>User Details</h2>
        <p><strong>Name:</strong> {{ user.name }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <button class="btn btn-danger" (click)="deleteUser()" *ngIf="!user.deleted">Delete User</button>
        <button class="btn btn-success" (click)="restoreUser()" *ngIf="user.deleted">Restore User</button>
      </div>
    </div>
  `,
  styles: `
    .container {
    margin: 20px;

    button {
      margin-right: 10px;
    }
}
.user-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  background: #fafafa;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  max-width: 350px;
}
.user-card h3 {
  margin: 0 0 8px 0;
}
.user-card .deleted-label {
  color: #f44336;
  font-weight: bold;
  margin-left: 10px;
}
`
})
export class ToastDemoComponent implements OnInit {
  @Input() position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' = 'top-right';
  toasts: Toast[] = [];
  safeIcons: { [id: string]: SafeHtml } = {};

  user: { id: number; name: string; email: string; deleted: boolean } | null = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    deleted: false
  };
  deleteAttempted = false;

  constructor(private toastService: ToastService, private cdr: ChangeDetectorRef, private sanitizer: DomSanitizer) {
    this.toastService.toasts$.subscribe(toasts => {
      this.toasts = [...toasts];
      // Sanitize SVG icons for each toast
      this.safeIcons = {};
      for (const toast of toasts) {
        if (toast.icon) {
          this.safeIcons[toast.id] = this.sanitizer.bypassSecurityTrustHtml(toast.icon);
        }
      }
      this.cdr.markForCheck();
    });
  }

  ngOnInit(): void {
  }

  showSuccess() {
    this.toastService.show('Success message', 'success', 3000, {
      icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" fill="#4caf50"/><path d="M6 10.5L9 13.5L14 8.5" stroke="white" stroke-width="2"/></svg>`
    });
  }

  showError() {
    this.toastService.show('Error message', 'error', 3000, {
      icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" fill="#f44336"/><path d="M7 7L13 13M13 7L7 13" stroke="white" stroke-width="2"/></svg>`
    });
  }

  showInfo() {
    this.toastService.show('Info message', 'info', 3000, {
      icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" fill="#2196f3"/><text x="10" y="15" text-anchor="middle" fill="white" font-size="12" font-family="Arial" dy="-2">i</text></svg>`
    });
  }

  simulateAsyncOperation() {
    console.log('Simulating an async operation...');
    // this.toastService.show: Displays a toast message.
    const loadingToastId = this.toastService.show('Loading...', 'info');
    // this.toastService.clearAll(): Can be used to clear all toasts at once,
    // for example, when navigating away from the component or when the user
    // explicitly requests to clear all toasts.

    setTimeout(() => {
      // this.toastService.dismiss: Dismisses the toast with the given id.
      this.toastService.dismiss(loadingToastId);

      const success = Math.random() > 0.5;
      // this.toastService.show: Displays a success or error toast based on the outcome of the operation.
      if (success) {
        this.toastService.show('Operation successful', 'success', 3000,
          { cssClass: 'success-toast', style: { backgroundColor: 'lightgreen', color: 'white' }, icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" fill="#4caf50"/><path d="M6 10.5L9 13.5L14 8.5" stroke="white" stroke-width="2"/></svg>` }
        );
      } else {
        this.toastService.show('Operation failed', 'error', 3000,
          { cssClass: 'error-toast', style: { backgroundColor: 'lightcoral', color: 'darkred' }, icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" fill="#f44336"/><path d="M7 7L13 13M13 7L7 13" stroke="white" stroke-width="2"/></svg>` });
      }
    }, 2000);
  }

  clearToasts() {
    this.toastService.clearAll();
  }
  showCustomStyledToast() {
    this.toastService.show(
      'Custom styled toast message',
      'info',
      3000,
      {
        cssClass: 'custom-toast',
        style: {
          backgroundColor: 'gold',
          color: 'purple',
          border: '1px solid #ccc',
        },
        icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" fill="#FFD700"/><text x="10" y="15" text-anchor="middle" fill="purple" font-size="12" font-family="Arial" dy="-2">★</text></svg>`
      }
    );
  }
  showActionToast() {
    this.toastService.show(
      'Undo delete?',
      'warning',
      5000,
      {
        action: {
          label: 'Undo',
          callback: () => {
            this.toastService.show('Delete undone!', 'success', 2000, {
              icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" fill="#4caf50"/><path d="M6 10.5L9 13.5L14 8.5" stroke="white" stroke-width="2"/></svg>`
            });
          }
        },
        icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" fill="#ff9800"/><text x="10" y="15" text-anchor="middle" fill="white" font-size="12" font-family="Arial" dy="-2">!</text></svg>`
      }
    );
  }
  showRetryToast() {
    this.toastService.show(
      'Failed to save changes.',
      'error',
      4000,
      {
        action: {
          label: 'Retry',
          callback: () => {
            this.toastService.show('Retrying...', 'info', 1500, {
              icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" fill="#2196f3"/><text x="10" y="15" text-anchor="middle" fill="white" font-size="12" font-family="Arial" dy="-2">i</text></svg>`
            });
            // Simulate retry logic here
          }
        },
        icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" fill="#f44336"/><path d="M7 7L13 13M13 7L7 13" stroke="white" stroke-width="2"/></svg>`
      }
    );
  }
  deleteUser() {
    if (!this.deleteAttempted && this.user) {
      this.deleteAttempted = true;
      this.toastService.show(
        `Failed to delete ${this.user.name}.`,
        'error',
        5000,
        {
          action: {
            label: 'Retry',
            callback: () => this.deleteUser()
          },
          icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" fill="#f44336"/><path d="M7 7L13 13M13 7L7 13" stroke="white" stroke-width="2"/></svg>`
        }
      );
    } else if (this.user) {
      // Actually remove the user
      this.user = null;
      this.toastService.show(
        `User deleted successfully!`,
        'success',
        2000,
        { icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" fill="#4caf50"/><path d="M6 10.5L9 13.5L14 8.5" stroke="white" stroke-width="2"/></svg>` }
      );
      this.deleteAttempted = false;
    }
  }

  restoreUser() {
    this.user = {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      deleted: false
    };
    this.toastService.show(
      `User restored!`,
      'info',
      2000,
      { icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" fill="#2196f3"/><text x="10" y="15" text-anchor="middle" fill="white" font-size="12" font-family="Arial" dy="-2">i</text></svg>` }
    );
  }
  simulateDeleteUser() {
    const userName = 'John Doe';
    let deleted = false;
    // Simulate deleting a user
    deleted = true;
    const toastId = this.toastService.show(
      `User ${userName} deleted.`,
      'warning',
      0, // Persistent until action or close
      {
        action: {
          label: 'Undo',
          callback: () => {
            if (deleted) {
              deleted = false;
              this.toastService.show(`User ${userName} restored!`, 'success', 2000);
            }
            this.toastService.clearAll(); // Optionally clear the undo toast
          }
        },
        icon: 'fa fa-user-times'
      }
    );
  }
  showProgressBarToast() {
    const duration = 5000;
    this.toastService.show(
      'Uploading file...',
      'info',
      duration,
      {
        progressBar: true,
        icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" fill="#2196f3"/><text x="10" y="15" text-anchor="middle" fill="white" font-size="12" font-family="Arial" dy="-2">%</text></svg>`
      }
    );
  }

}
