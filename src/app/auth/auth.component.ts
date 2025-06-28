import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, RegisterRequest, LoginRequest } from './auth.service';
import { ToastService } from '../toast/toast-service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-container">
      <h2 *ngIf="mode === 'register'">Register</h2>
      <h2 *ngIf="mode === 'login'">Login</h2>

      <form *ngIf="mode === 'register'" (ngSubmit)="onRegister()" #registerForm="ngForm">
        <input type="text" placeholder="Username" [(ngModel)]="registerData.username" name="username" required autocomplete="username" />
        <input type="text" placeholder="First Name" [(ngModel)]="registerData.firstName" name="firstName" required />
        <input type="text" placeholder="Last Name" [(ngModel)]="registerData.lastName" name="lastName" required />
        <input type="email" placeholder="Email" [(ngModel)]="registerData.email" name="email" required autocomplete="email" />
        <input type="password" placeholder="Password" [(ngModel)]="registerData.password" name="password" required autocomplete="new-password" />
        <button type="submit">Register</button>
        <p class="switch-link">Already have an account? <a (click)="mode = 'login'">Login</a></p>
      </form>

      <form *ngIf="mode === 'login'" (ngSubmit)="onLogin()" #loginForm="ngForm">
        <input type="text" placeholder="Email or Username" [(ngModel)]="loginData.emailOrUsername" name="emailOrUsername" required autocomplete="username" />
        <input type="password" placeholder="Password" [(ngModel)]="loginData.password" name="password" required autocomplete="current-password" />
        <button type="submit">Login</button>
        <p class="switch-link">Don't have an account? <a (click)="mode = 'register'">Register</a></p>
      </form>

      <div *ngIf="error" class="error">{{ error }}</div>
      <div *ngIf="success" class="success">{{ success }}</div>
    </div>
  `,
  styles: [`
    .auth-container {
      max-width: 350px;
      margin: 2rem auto;
      padding: 2rem;
      border: 1px solid #ccc;
      border-radius: 8px;
      background: #fff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }
    input {
      display: block;
      width: 100%;
      margin-bottom: 1rem;
      padding: 0.5rem;
      border-radius: 4px;
      border: 1px solid #bbb;
    }
    button {
      width: 100%;
      padding: 0.7rem;
      background: #3f51b5;
      color: #fff;
      border: none;
      border-radius: 4px;
      font-weight: bold;
      cursor: pointer;
    }
    .switch-link {
      text-align: center;
      margin-top: 1rem;
    }
    .switch-link a {
      color: #3f51b5;
      cursor: pointer;
      text-decoration: underline;
    }
    .error {
      color: #f44336;
      margin-top: 1rem;
      text-align: center;
    }
    .success {
      color: #4caf50;
      margin-top: 1rem;
      text-align: center;
    }
  `]
})
export class AuthComponent {
  mode: 'register' | 'login' = 'register';
  registerData: RegisterRequest = { username: '', firstName: '', lastName: '', email: '', password: '' };
  loginData: LoginRequest = { emailOrUsername: '', password: '' };
  error: string = '';
  success: string = '';

  constructor(private auth: AuthService, private toast: ToastService) {}

  onRegister() {
    this.error = '';
    this.success = '';
    this.auth.register(this.registerData).subscribe({
      next: () => {
        this.toast.show(
          'Registration successful! You can now log in.',
          'success',
          3000,
          { cssClass: 'bg-success text-light' }
        );
        this.success = 'Registration successful! You can now log in.';
        this.mode = 'login';
      },
      error: err => {
        this.error = err.error?.error || 'Registration failed.';
      }
    });
  }

  onLogin() {
    this.error = '';
    this.success = '';
    this.auth.login(this.loginData).subscribe({
      next: () => {
        this.success = 'Login successful!';
        // You can add navigation or token storage here
      },
      error: err => {
        this.error = err.error?.error || 'Login failed.';
      }
    });
  }
}
