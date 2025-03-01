import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', loadComponent: () => import("./components/landing-page/landing-page.component").then((c) => c.LandingPageComponent) },
];
