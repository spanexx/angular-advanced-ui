import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';

@Component({
  selector: 'stepper-wizard-demo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    MatStepperModule
  ],
  template: `
    <mat-horizontal-stepper [linear]="true" #stepper>
      <mat-step [stepControl]="basicForm" label="Basic Info">
        <mat-card>
          <form [formGroup]="basicForm">
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Name</mat-label>
              <input matInput formControlName="name" />
            </mat-form-field>
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" />
            </mat-form-field>
          </form>
        </mat-card>
        <div class="step-controls">
          <button mat-button matStepperNext [disabled]="basicForm.invalid">Next</button>
        </div>
      </mat-step>
      <mat-step [stepControl]="preferencesForm" label="Preferences">
        <mat-card>
          <form [formGroup]="preferencesForm">
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Role</mat-label>
              <mat-select formControlName="role">
                <mat-option value="user">User</mat-option>
                <mat-option value="admin">Admin</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-checkbox formControlName="subscribe">Subscribe to newsletter</mat-checkbox>
          </form>
        </mat-card>
        <div class="step-controls">
          <button mat-button matStepperPrevious>Back</button>
          <button mat-button matStepperNext [disabled]="preferencesForm.invalid || (preferencesForm.value.role === 'admin' && !preferencesForm.value.subscribe)">Next</button>
        </div>
      </mat-step>
      <mat-step label="Confirmation">
        <mat-card>
          <h3>Confirm Your Details</h3>
          <p><strong>Name:</strong> {{ basicForm.value.name }}</p>
          <p><strong>Email:</strong> {{ basicForm.value.email }}</p>
          <p><strong>Role:</strong> {{ preferencesForm.value.role }}</p>
          <p><strong>Newsletter:</strong> {{ preferencesForm.value.subscribe ? 'Yes' : 'No' }}</p>
        </mat-card>
        <div class="step-controls">
          <button mat-button matStepperPrevious>Back</button>
          <button mat-raised-button color="accent" (click)="onSubmit()">Finish</button>
        </div>
      </mat-step>
    </mat-horizontal-stepper>
  `,
  styles: `
    mat-card {
      margin: 20px auto;
      max-width: 600px;
      padding: 20px;
    }
    .full-width {
      width: 100%;
    }
  `
})
export class StepperWizardDemoComponent {
  // Form for Step 1
  basicForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  // Form for Step 2
  preferencesForm = this.fb.group({
    role: ['user'],
    subscribe: [false],
  });

  constructor(private fb: FormBuilder) {}

  // Collect values from both forms on submit
  onSubmit() {
    const result = {
      ...this.basicForm.value,
      ...this.preferencesForm.value
    };
    alert(JSON.stringify(result, null, 2));
  }
}
