import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { ValidatorFn } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, of, switchMap } from 'rxjs';

export interface DynamicField {
  title?: string;
  key: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'date' | 'select' | 'checkbox' | 'password';
  defaultValue?: any;
  options?: { value: any; label: string }[];
  validators?: ('required' | 'email' | 'minLength' | 'maxLength')[];
  errorMessages?: { [validator: string]: string };
  condition?: { field: string; value: any };
  crossValidators?: ValidatorFn[];
  asyncValidators?: any[];
}

@Component({
  selector: 'lib-dynamic-form',
  standalone: true,
  templateUrl: './dynamic-form.html',
  styleUrls: ['./dynamic-form.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ]
})
export class DynamicFormComponent implements OnInit, OnChanges {
  @Input() schema: DynamicField[] = [];
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Output() submitForm = new EventEmitter<any>();

  // NEW: Hook to execute before form submit. Returns Observable<boolean>
  @Input() preSubmit?: (formValue: any) => Observable<boolean>;

  // NEW: Hook to execute after form submit. Returns Observable<void>
  @Input() postSubmit?: (formValue: any) => Observable<void>;

  form!: FormGroup;
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['schema'] && !changes['schema'].firstChange) {
      this.buildForm();
    }
  }

  private buildForm() {
    if (!this.schema) return;
    const group: Record<string, any> = {};
    this.schema.forEach(field => {
      const validators = [];
      if (field.validators?.includes('required')) validators.push(Validators.required);
      if (field.validators?.includes('email')) validators.push(Validators.email);
      if (field.validators?.includes('minLength')) validators.push(Validators.minLength(3));
      if (field.validators?.includes('maxLength')) validators.push(Validators.maxLength(100));
      group[field.key] = [{ value: field.defaultValue || '', disabled: this.disabled }, validators];
    });
    this.form = this.fb.group(group);

    // Set async validators and cross validators after form is created
    this.schema.forEach(field => {
      const control = this.form.get(field.key);
      if (field.asyncValidators && control) {
        control.setAsyncValidators(field.asyncValidators);
      }
      if (field.crossValidators) {
        field.crossValidators.forEach(validator => {
          this.form.addValidators(validator);
        });
      }
    });
    this.form.valueChanges.subscribe(() => {
      // triggers re-render for *ngIfs
    });
  }

  getErrorMessage(field: DynamicField): string | null {
    const control = this.form.get(field.key);
    if (!control || control.valid || !control.touched) return null;

    if (control.errors?.['required']) {
      return field.errorMessages?.['required'] || 'This field is required';
    }
    if (control.errors?.['email']) {
      return field.errorMessages?.['email'] || 'Invalid email format';
    }
    if (control.errors?.['minlength']) {
      return field.errorMessages?.['minLength'] || `Minimum ${control.errors['minlength'].requiredLength} characters`;
    }
    if (control.errors?.['maxlength']) {
      return field.errorMessages?.['maxLength'] || `Maximum ${control.errors['maxlength'].requiredLength} characters`;
    }
    // Check for cross-field validation errors
    if (this.form.errors) {
      console.log('form.errors', this.form.errors);
      for (const errorKey in this.form.errors) {
        if (this.form.errors.hasOwnProperty(errorKey)) {
          return field.errorMessages?.[errorKey] || 'Invalid input';
        }
      }
    }

    return 'Invalid input';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;

    // Execute preSubmit hook if provided
    const pre$ = this.preSubmit ? this.preSubmit(formValue) : of(true);

    pre$
      .pipe(
        switchMap((proceed) => {
          if (!proceed) return of(null);
          this.submitForm.emit(formValue);
          return this.postSubmit ? this.postSubmit(formValue) : of();
        })
      )
      .subscribe();
  }

  shouldShowField(field: DynamicField): boolean {
    if (!field.condition) return true;

    const relatedControl = this.form.get(field.condition.field);
    return relatedControl?.value === field.condition.value;
  }

  resetForm(): void {
    const resetValues: Record<string, any> = {};
    this.schema.forEach(field => {
      resetValues[field.key] = field.defaultValue || '';
    });
    this.form.reset(resetValues);
  }
}
