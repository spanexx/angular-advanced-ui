import { Component, ViewChild, ElementRef, AfterViewInit, HostListener, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-sign-pad',
  standalone: true,
  imports: [
    CommonModule, MatButtonModule
  ],
  templateUrl: './sign-pad.html',
  styleUrl: './sign-pad.scss'
})
export class SignPad implements AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @Output() signatureSaved = new EventEmitter<string>();

  private ctx!: CanvasRenderingContext2D;
  private drawing = false;
  private history: ImageData[] = [];
  private resizing = false;
  private lastWidth = 0;
  private lastHeight = 0;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    this.resizeCanvas();
    // Add touch event listeners for mobile/tablet support, mark as passive: false where needed
    canvas.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
    canvas.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
    canvas.addEventListener('touchend', this.onTouchEnd.bind(this));
    canvas.addEventListener('touchcancel', this.onTouchEnd.bind(this));
  }

  @HostListener('window:resize')
  onWindowResize() {
    // Only resize if not currently drawing
    if (!this.drawing) {
      this.resizeCanvas();
    } else {
      this.resizing = true;
    }
  }

  resizeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    // Use clientWidth/clientHeight to ensure non-zero size
    const width = canvas.clientWidth || 320;
    const height = canvas.clientHeight || 150;
    // Only resize if size actually changed
    if (width === this.lastWidth && height === this.lastHeight) return;
    this.lastWidth = width;
    this.lastHeight = height;
    const data = canvas.toDataURL();
    canvas.width = width;
    canvas.height = height;
    const image = new Image();
    image.onload = () => this.ctx.drawImage(image, 0, 0);
    image.src = data;
  }

  onMouseDown(event: MouseEvent) {
    this.drawing = true;
    this.ctx.beginPath();
    this.ctx.moveTo(event.offsetX, event.offsetY);
    this.saveState();
  }

  onMouseMove(event: MouseEvent) {
    if (!this.drawing) return;
    this.ctx.lineTo(event.offsetX, event.offsetY);
    this.ctx.stroke();
  }

  onMouseUp() {
    this.drawing = false;
    // If a resize was requested during drawing, do it now
    if (this.resizing) {
      this.resizing = false;
      this.resizeCanvas();
    }
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
  }

  undo() {
    if (this.history.length > 0) {
      const imageData = this.history.pop()!;
      this.ctx.putImageData(imageData, 0, 0);
    }
  }

  save() {
    const dataURL = this.canvasRef.nativeElement.toDataURL('image/png');
    this.signatureSaved.emit(dataURL);
  }

  private saveState() {
    const imageData = this.ctx.getImageData(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    this.history.push(imageData);
  }

  // Touch event handlers
  private getTouchPos(touch: Touch): { x: number, y: number } {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
  }

  onTouchStart(event: TouchEvent) {
    event.preventDefault();
    if (event.touches.length === 1) {
      const pos = this.getTouchPos(event.touches[0]);
      this.drawing = true;
      this.ctx.beginPath();
      this.ctx.moveTo(pos.x, pos.y);
      this.saveState();
    }
  }

  onTouchMove(event: TouchEvent) {
    event.preventDefault();
    if (this.drawing && event.touches.length === 1) {
      const pos = this.getTouchPos(event.touches[0]);
      this.ctx.lineTo(pos.x, pos.y);
      this.ctx.stroke();
    }
  }

  onTouchEnd(event: TouchEvent) {
    event.preventDefault();
    this.drawing = false;
    // If a resize was requested during drawing, do it now
    if (this.resizing) {
      this.resizing = false;
      this.resizeCanvas();
    }
  }

  verifyWithFingerprint() {
    if (!window.PublicKeyCredential) {
      alert('WebAuthn is not supported in this browser.');
      return;
    }
    // Simple WebAuthn authentication (for demo, not production)
    navigator.credentials.get({
      publicKey: {
        challenge: new Uint8Array(32), // Dummy challenge for demo
        timeout: 60000,
        userVerification: 'required',
        allowCredentials: []
      }
    }).then(() => {
      alert('Fingerprint or biometric authentication successful!');
    }).catch((err) => {
      alert('Authentication failed or cancelled: ' + err);
    });
  }
}