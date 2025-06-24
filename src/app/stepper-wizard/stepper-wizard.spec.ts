import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperWizard } from './stepper-wizard';

describe('StepperWizard', () => {
  let component: StepperWizard;
  let fixture: ComponentFixture<StepperWizard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepperWizard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepperWizard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
