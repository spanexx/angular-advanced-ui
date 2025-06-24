import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { FormGroup } from '@angular/forms';

// Extended WizardStep interface for advanced validation
export interface WizardStep {
  label: string;
  optional?: boolean;
  completed?: boolean;
  hasError?: boolean;
  condition?: () => boolean;
  disabled?: boolean;
  // Advanced validation additions:
  validator?: (form: FormGroup, allForms?: FormGroup[]) => Promise<null | string> | null | string; // sync or async
  customErrorMessages?: { [key: string]: string };
}

@Component({
  selector: 'lib-stepper-wizard',
  imports: [CommonModule, MatStepperModule, MatButtonModule],  
  templateUrl: './stepper-wizard.html',
  styleUrl: './stepper-wizard.scss'
})
export class StepperWizard {
  @Input() steps: WizardStep[] = [];
  @Input() linear = true;
  @Input() loading = false;
  @Input() stepForms: FormGroup[] = [];
  // Cross-step validator and error message
  @Input() crossStepValidator?: (forms: FormGroup[]) => Promise<null | string> | null | string;
  @Input() crossStepErrorMessage?: string;

  @Output() finalSubmit = new EventEmitter<void>();
  @Output() stepError = new EventEmitter<{step: number, error: string}>();

  @ViewChild('stepper') stepper!: MatStepper;

  stepErrors: (string | null)[] = [];
  crossStepError: string | null = null;

  async next() {
    const idx = this.stepper.selectedIndex;
    const form = this.stepForms?.[idx];
    const step = this.steps[idx];
    let error: string | null = null;
    if (form && form.invalid) {
      form.markAllAsTouched();
      error = this.getFormErrorMessage(form, step);
      this.setStepError(idx, error);
      return;
    }
    if (step && step.validator) {
      const result = await step.validator(form, this.stepForms);
      if (typeof result === 'string' && result) {
        error = result;
        this.setStepError(idx, error);
        return;
      }
    }
    this.setStepError(idx, null);
    if (this.steps[idx]) {
      this.steps[idx].completed = true;
    }
    this.stepper.next();
  }

  back() {
    this.stepper.previous();
  }

  async submit() {
    for (let i = 0; i < this.steps.length; i++) {
      const step = this.steps[i];
      const form = this.stepForms[i];
      if (form && form.invalid) {
        form.markAllAsTouched();
        this.setStepError(i, this.getFormErrorMessage(form, step));
        this.stepper.selectedIndex = i;
        return;
      }
      if (step && step.validator) {
        const result = await step.validator(form, this.stepForms);
        if (typeof result === 'string' && result) {
          this.setStepError(i, result);
          this.stepper.selectedIndex = i;
          return;
        }
      }
      this.setStepError(i, null);
    }
    if (this.crossStepValidator) {
      const result = await this.crossStepValidator(this.stepForms);
      if (typeof result === 'string' && result) {
        this.crossStepError = this.crossStepErrorMessage || result;
        return;
      }
    }
    this.crossStepError = null;
    this.finalSubmit.emit();
  }

  setStepError(index: number, error: string | null) {
    this.stepErrors[index] = error;
    this.steps[index].hasError = !!error;
    if (error) {
      this.stepError.emit({step: index, error});
    }
  }

  getFormErrorMessage(form: FormGroup, step: WizardStep): string | null {
    if (!form || !form.errors) return null;
    if (step && step.customErrorMessages) {
      for (const key of Object.keys(form.errors)) {
        if (step.customErrorMessages[key]) {
          return step.customErrorMessages[key];
        }
      }
    }
    // Default error
    return 'Please correct the errors in this step.';
  }
}
