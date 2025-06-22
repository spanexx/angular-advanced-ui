import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataTableComponent, ColumnDefinition } from './data-table/data-table.component';
import { DataQueryResult, DataTableService } from './data-table/services/data-table.service';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { FilterInputComponent } from './data-table/filter/filter';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DynamicFormComponent, DynamicField } from './dynamic-form/dynamic-form';
import { FormSchemaService } from './dynamic-form/services/dynamic-form.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DataTableComponent, CommonModule, FormsModule, DynamicFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'angular-advanced-ui';
  isSubmitting = false;

  @ViewChild('categoryChip', { static: true }) categoryChip: any;

  columns: ColumnDefinition[] =
  [
    { field: 'name', header: 'Name', sortable: true, filterType: 'text' as const, filterable: true },
    {
      field: 'value',
      header: 'Value',
      sortable: true,
      filterType: 'range' as const,
      filterable: true,
      cellClass: (value: any) => value < 0 ? 'negative-value' : value > 0 ? 'positive-value' : ''
    },
    {
      field: 'category',
      header: 'Category',
      sortable: true,
      filterType: 'select' as const,
      filterable: true,
      filterOptions: ['Alpha', 'Beta', 'Gamma']
      // cellTemplate will be assigned in ngAfterViewInit
    }
  ];

  data: any[] = [];

  constructor() {}

  private formSchemaService = inject(FormSchemaService)
  private dataTableService = inject(DataTableService<any>);

  ngOnInit() {
    // Fetch all data from backend for localData
    this.dataTableService.fetchData(0, 1000, '', {}).subscribe({
      next: (result: DataQueryResult<any>) => {
        this.data = result.data;
      },
      error: (err) => {
        console.error('Failed to load data for localData:', err);
      }
    });

        this.loadFormSchema('registrationForm'); // Load the form schema by name

    
  }

    loadFormSchema(name: string) {
    this.isSubmitting = true;
    this.formSchemaService.getSchemaByName(name).subscribe({
      next: (fields) => {
        this.schema = fields;
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Failed to load form schema:', err);
        this.isSubmitting = false;
      },
    });
  }

  ngAfterViewInit() {
    // Assign the template after view init
    if (Array.isArray(this.columns)) {
      const categoryCol = this.columns.find(col => col.field === 'category');
      if (categoryCol) {
        categoryCol.cellTemplate = this.categoryChip;
      }
    }
  }

  fetchData = (page: number, size: number, sort: string, filter: any): Observable<DataQueryResult<any>> => {
    return this.dataTableService.fetchData(page, size, sort, filter);
  };

schema: DynamicField[] = [
  
  {
    key: 'subscribe',
    label: 'Subscribe to newsletter',
    type: 'checkbox'
  },
  {
    key: 'reason',
    label: 'Why are you subscribing?',
    type: 'text',
    validators: ['required'],
    errorMessages: {
      required: 'Please provide a reason.'
    },
    condition: {
      field: 'subscribe',
      value: true
    }
  },
  {
    key: 'email',
    label: 'Email Address',
    type: 'email',
    validators: ['required', 'email'],
    errorMessages: {
      required: 'Email is required',
      email: 'Enter a valid email address'
    }
  }
];

onFormSubmit(formValue: any) {
  console.log('Form submitted:', formValue);
}

 handleSubmit(data: any) {
    this.isSubmitting = true;
    console.log('Form Submitted:', data);

    // Simulate async submission
    setTimeout(() => {
      this.isSubmitting = false;
      alert('Form submitted!');
    }, 1500);
  }

  // Add preSubmit and postSubmit for DynamicFormComponent
  preSubmit = (formValue: any): Observable<boolean> => {
    // Manipulate: trim all string fields
    const manipulated = { ...formValue };
    Object.keys(manipulated).forEach(key => {
      if (typeof manipulated[key] === 'string') {
        manipulated[key] = manipulated[key].trim();
      }
    });
    console.log('Pre-submit manipulated data:', manipulated);
    // Block submission if email contains 'test'
    if (manipulated.email && manipulated.email.includes('test')) {
      alert('Submission blocked: test emails are not allowed.');
      return of(false);
    }
    // Allow submission
    return of(true).pipe(
      tap(() => console.log('Pre-submit check passed')),
      delay(500)
    );
  };

  postSubmit = (formValue: any): Observable<void> => {
    console.log('Post-submit logic:', formValue);
    // Simulate async post-submit action
    return of(undefined).pipe(
      tap(() => console.log('Post-submit action complete')),
      delay(500)
    );
  };
}
