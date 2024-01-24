import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthorizationComponent } from './component/authorization/authorization.component';
import { MainPageComponent } from './component/main-page/main-page.component';
import { RegistrationComponent } from './component/registration/registration.component';
import { VideoComponent } from './component/video/video.component';

export const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'authorization', component: AuthorizationComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'video_conf', component: VideoComponent },
];
