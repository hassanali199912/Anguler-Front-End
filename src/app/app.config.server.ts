import { mergeApplicationConfig, ApplicationConfig, PLATFORM_ID } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './config/apis';
import { CartService } from './services/orderItem.service';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    {
      provide: CartService,
      useValue: null
    }
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
