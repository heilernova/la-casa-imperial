import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    { path: "**", loadComponent: () => import('./pages/base-page/base-page.component').then(x => x.BasePageComponent) }
];
