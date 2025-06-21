import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-filter-input',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    FormsModule
  ],
  template: `
  <div class="filter-input-container">
    <mat-form-field appearance="outline" class="filter-input-field">
      <mat-label>{{ label }}</mat-label>
      <input matInput [placeholder]="label" [value]="value" (input)="onInput($event)">
    </mat-form-field>
  </div>
  `,
  styles: [`
    .filter-input-container {
      display: flex;
      align-items: center;
      margin: 16px 0;
    }
    .filter-input-field {
      min-width: 120px;
      max-width: 180px;
      margin-right: 8px;
      margin-bottom: 0;
      background: #fafbfc;
      border-radius: 4px;
    }
    .filter-input-field.mat-form-field {
      font-size: 0.95rem;
    }
    input[matInput] {
      padding: 4px 8px;
      font-size: 0.95rem;
    }
  `]
})
export class FilterInputComponent {
  @Input() label = '';
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.valueChange.emit(input.value);
  }
}