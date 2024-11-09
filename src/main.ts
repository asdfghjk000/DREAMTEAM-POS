import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';  // Import the correct router provider
import { routes } from './app/app.routes';  // Your routes configuration
import { MainPageComponent } from './app/main-page/main-page.component';  // Your root component

bootstrapApplication(MainPageComponent, {
  providers: [
    provideRouter(routes)  // Use provideRouter() instead of RouterModule.forRoot()
  ]
});
