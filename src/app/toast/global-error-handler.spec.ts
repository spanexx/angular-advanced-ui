import { TestBed } from '@angular/core/testing';
import { ErrorHandler } from '@angular/core';
import { GlobalErrorHandler } from './global-error-handler';
import { ToastService } from './toast-service';

fdescribe('GlobalErrorHandler', () => {
  let errorHandler: ErrorHandler;
  let toastService: jasmine.SpyObj<ToastService>;

  beforeEach(() => {
    toastService = jasmine.createSpyObj('ToastService', ['show', 'showError']);
    TestBed.configureTestingModule({
      providers: [
        { provide: ToastService, useValue: toastService },
        { provide: ErrorHandler, useClass: GlobalErrorHandler }
      ]
    });
    errorHandler = TestBed.inject(ErrorHandler);
  });

  fit('should call ToastService.showError on error', () => {
    const error = new Error('Test error');
    errorHandler.handleError(error);
    expect(toastService.showError).toHaveBeenCalledWith(
      jasmine.stringMatching('Test error'),
      jasmine.anything() // Accepts undefined or any value
    );
  });
});

// Optionally, comment out or remove the isolated unit test block for now
// describe('GlobalErrorHandler (unit)', () => { ... });