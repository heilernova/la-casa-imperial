import { Route } from '@angular/router';
import { loginGuard } from './login/login.guard';

export const appRoutes: Route[] = [
    { path: 'login', canActivate: [loginGuard], loadComponent: () => import('./login/login.component').then(x => x.LoginComponent) }
];
