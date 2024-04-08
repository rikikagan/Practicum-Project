import { ApplicationConfig, LOCALE_ID, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatNativeDateModule } from '@angular/material/core';

export const appConfig: ApplicationConfig = {
  
  providers: [
    provideRouter(routes),
     provideClientHydration(),
     provideHttpClient(withFetch()), 
     provideAnimationsAsync(),
     {provide: LOCALE_ID, useValue: 'de-AT'},
     importProvidersFrom(MatNativeDateModule)
  ,]

};