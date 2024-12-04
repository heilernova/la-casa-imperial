import { Route } from '@angular/router';
import { loginGuard } from './login/login.guard';
import { layoutGuard } from './layout/layout.guard';

export const appRoutes: Route[] = [
    { path: 'login', canActivate: [loginGuard], loadComponent: () => import('./login/login.component').then(x => x.LoginComponent) },
    {
        path: '',
        canActivate: [layoutGuard],
        loadComponent: () => import('./layout/layout.component').then(x => x.LayoutComponent)
    }
];
