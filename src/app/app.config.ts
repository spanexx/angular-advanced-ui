import { ApplicationConfig, importProvidersFrom, ErrorHandler } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { GlobalErrorHandler } from './toast/global-error-handler';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(BrowserAnimationsModule),
    importProvidersFrom(HttpClientModule),
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ],
};
