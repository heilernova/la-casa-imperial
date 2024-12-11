import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiProductAndService } from '@la-casa-imperial/schemas/store';

@Injectable({
  providedIn: 'root'
})
export class ProductsDataSourceService {
  private readonly _http = inject(HttpClient);
  
  public getAll(filter?: { categories?: string[] }): Promise<ApiProductAndService[]>{
    return new Promise((resolve, reject) => {

      const params: { [key: string]: string } = {}

      if (filter && filter.categories){
        params["category"] = filter.categories.join(",")
      }

      this._http.get<ApiProductAndService[]>("products-and-services", { params }).subscribe({
        next: res => {
          resolve(res);
        },
        error: err => reject(err)
      })
    })
  }
}
