import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent } from './dynamic-form';
import { FormSchemaService } from './services/dynamic-form.service';
import { DynamicField } from './dynamic-form';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'dynamic-form-demo',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent],
  template: `
    <ng-container *ngIf="schema">
    <h2>🧠 Dynamic Form Demo</h2>
    <lib-dynamic-form
      [schema]="schema"
      [loading]="isSubmitting"
      [preSubmit]="preSubmit"
      [postSubmit]="postSubmit"
      (submitForm)="handleSubmit($event)"
    ></lib-dynamic-form>
  </ng-container>
`,
})
export class DynamicFormDemoComponent implements OnInit {
  schema: DynamicField[] = [];
  isSubmitting = false;

  constructor(private schemaService: FormSchemaService) {}

  ngOnInit() {
    // Example: fetch a schema named 'demoForm' from the service
    this.schemaService.getSchemaByName('registrationForm').subscribe(schema => {
      this.schema = schema;
    });
  }

  preSubmit = (formValue: any): Observable<boolean> => {
    // Add pre-submit logic here if needed
    return of(true);
  };

  postSubmit = (formValue: any): Observable<void> => {
    // Add post-submit logic here if needed
    return of();
  };

  handleSubmit(event: any) {
    this.isSubmitting = true;
    // Simulate async submit
    setTimeout(() => {
      this.isSubmitting = false;
      alert('Form submitted!');
    }, 1000);
  }
}
