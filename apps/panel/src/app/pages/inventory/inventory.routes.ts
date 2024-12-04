import { Route } from "@angular/router";

export default [
    { path: '', loadComponent: () => import('./inventory-homepage/inventory-homepage.component').then(x => x.InventoryHomepageComponent) },
    { path: 'categorias', loadComponent: () => import('./categories-page/categories-page.component').then(x => x.CategoriesPageComponent) },
    { path: 'items', loadComponent: () => import('./items-page/items-page.component').then(x => x.ItemsPageComponent) },
    { path: 'items/agregar', loadComponent: () => import('./items-create-page/items-create-page.component').then(x => x.ItemsCreatePageComponent) },
    { path: 'items/:id', loadComponent: () => import('./items-edit-page/items-edit-page.component').then(x => x.ItemsEditPageComponent) }
] as Route[]