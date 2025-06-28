import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { FlutterwaveService } from './flutterwave.service';
import { SaveCardComponent } from './save-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-flutterwave-success-extended',
  template: `
    <h2>Flutterwave Payment Success</h2>
    <p>Your payment was successful. Thank you!</p>
    <ng-container *ngIf="!hasCardChecked">
      <p>Checking for saved card...</p>
    </ng-container>
    <ng-container *ngIf="hasCardChecked && !hasCard">
      <app-save-card [email]="userEmail"></app-save-card>
    </ng-container>
    <ng-container *ngIf="hasCardChecked && hasCard">
      <p>Your card is saved for future payments.</p>
    </ng-container>
    <a routerLink="/">Go Home</a>
  `,
  standalone: true,
  imports: [SaveCardComponent, CommonModule]
})
export class FlutterwaveSuccessExtendedComponent implements OnInit {
  hasCard = false;
  hasCardChecked = false;
  userEmail = '';

  constructor(private auth: AuthService, private flutterwave: FlutterwaveService) {}

  ngOnInit() {
    const user = this.auth.currentUser;
    if (user) {
      this.userEmail = user.email;
      // Assume user.cardTokens is available on user object after login
      this.hasCard = Array.isArray(user.cardTokens) && user.cardTokens.length > 0;
      this.hasCardChecked = true;
    } else {
      this.hasCardChecked = true;
    }
  }
}
