import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-filter-input',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './filter.html',

  styleUrls: ['./filter.scss'],
})
export class FilterInputComponent {
  @Input() label: string = '';
  @Input() filterType: 'text' | 'select' | 'date' | 'range' = 'text';
  @Input() filterOptions: any[] = [];
  @Input() value: any;
  @Input() minValue: any;
  @Input() maxValue: any;
  @Output() valueChange = new EventEmitter<any>();
  @Output() minChange = new EventEmitter<any>();
  @Output() maxChange = new EventEmitter<any>();

  onValueChange(val: any) {
    this.valueChange.emit(val);
  }
  onMinChange(val: any) {
    this.minChange.emit(val);
  }
  onMaxChange(val: any) {
    this.maxChange.emit(val);
  }
}