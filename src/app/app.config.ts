import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

const config: SocketIoConfig = { url: 'http://localhost:5001/', options: {} };


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideCharts(withDefaultRegisterables()),
    provideHttpClient(withFetch()), 
    importProvidersFrom(SocketIoModule.forRoot(config)),  
    provideToastr({
      closeButton: true,
      tapToDismiss: true,
      newestOnTop: true,
      easing: 'ease-in',
      toastClass: 'ngx-toastr',
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true, 
      timeOut: 3000, 
      progressAnimation: 'decreasing' 
    }),
    
  ],
  
};
