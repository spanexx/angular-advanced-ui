import { Component, OnDestroy, Input, OnChanges, ChangeDetectionStrategy, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast-service';
import { Toast } from './toast.model';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-toast-container',
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastContainerComponent implements OnDestroy, OnChanges {
  @Input() toasts: Toast[] = [];
  @Input() cssClass: string = '';
  @Input() style: any;
  @Input() position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' = 'top-right';

  safeIcons: { [id: string]: any } = {};

  constructor(private toastService: ToastService, private sanitizer: DomSanitizer, private el: ElementRef) {}

  ngOnChanges() {
    this.safeIcons = {};
    for (const toast of this.toasts) {
      if (toast.icon) {
        this.safeIcons[toast.id] = this.sanitizer.bypassSecurityTrustHtml(toast.icon);
      }
    }
  }

  dismiss(id: string) {
    this.toastService.dismiss(id);
  }

  onActionClick(toast: Toast) {
    if (toast.action && typeof toast.action.callback === 'function') {
      toast.action.callback();
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.toasts.length > 0) {
      // Dismiss the most recent toast
      this.dismiss(this.toasts[this.toasts.length - 1].id);
    }
  }

  ngOnDestroy() {}
}
