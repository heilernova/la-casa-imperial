import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    { path: 'login', loadComponent: () => import('./login/login.component').then(x => x.LoginComponent) }
];
