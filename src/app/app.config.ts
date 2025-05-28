import { ApplicationConfig, provideZoneChangeDetection, PLATFORM_ID, Inject, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors, HttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { CartService } from './services/orderItem.service';
import { isPlatformBrowser } from '@angular/common';
import { authInterceptor } from './config/apis';
import { Router } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), 
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    ),
    provideAnimations(),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    {
      provide: CartService,
      useFactory: (httpClient: HttpClient, router: Router, platformId: Object) => {
        if (isPlatformBrowser(platformId)) {
          return new CartService(
            httpClient,
            router,
            platformId
          );
        }
        return null;
      },
      deps: [HttpClient, Router, PLATFORM_ID]
    }
  ]
};
