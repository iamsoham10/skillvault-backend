import {Routes} from '@angular/router';
import {authGuard} from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import("./components/landing-page/landing-page.component").then((c) => c.LandingPageComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import("./components/dashboard/dashboard.component").then((c) => c.DashboardComponent),
    canActivate: [authGuard]
  },
];
