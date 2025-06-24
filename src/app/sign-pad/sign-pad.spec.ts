import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignPad } from './sign-pad';

describe('SignPad', () => {
  let component: SignPad;
  let fixture: ComponentFixture<SignPad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignPad]
    }).compileComponents();

    fixture = TestBed.createComponent(SignPad);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
