import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ResultProductsComponent } from "./result-products/result-products.component";
import { ProductsDataSourceService } from '../../common/products';
import { ApiProductAndService } from '@la-casa-imperial/schemas/store';

@Component({
  selector: 'app-base-page',
  standalone: true,
  imports: [ResultProductsComponent],
  templateUrl: './base-page.component.html',
  styleUrl: './base-page.component.scss'
})
export class BasePageComponent implements OnInit, OnDestroy {
  private readonly _activatedRoute =  inject(ActivatedRoute);
  private readonly _productsDataSource = inject(ProductsDataSourceService);
  private readonly _router = inject(Router);
  private routerSubscription: Subscription;

  protected products = signal<ApiProductAndService[]>([]);
  
  constructor(){
    this.routerSubscription = this._router.events.subscribe(event => {
      if (event instanceof NavigationEnd){
        const url = event.urlAfterRedirects.substring(1);
        if (url.length == 1 && url != "televisores"){
          console.log("Buscar Producto por slug");
        } else {
          console.log("Cargar lista de productos");
          this._productsDataSource.getAll({ categories: url.split("/") })
          .then(res => {
            this.products.set(res);
          })
          .catch(() => {
            console.log("Error con la culta de los productos")
          })
        }
      }
    })
  }
  

  ngOnInit(): void {
    console.log("Iniciado");
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }
}
