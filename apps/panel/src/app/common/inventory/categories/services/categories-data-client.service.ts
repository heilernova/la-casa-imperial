import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Category } from '../category';
import { ICategory, ApiCategoryCreate, ApiCategoryUpdate } from '@la-casa-imperial/schemas/inventory/categories';

@Injectable({
  providedIn: 'root'
})
export class CategoriesDataClientService {
  private readonly _http = inject(HttpClient);

  getAll(): Observable<Category[]> {
    return this._http.get<ICategory[]>("inventory/categories").pipe(map(list => {
      return list.map(x => new Category(x))
    }))
  }

  create(data: ApiCategoryCreate): Observable<Category> {
    return this._http.post<ICategory>("inventory/categories", data).pipe(map(value => new Category(value)));
  }

  update(id: string, data: ApiCategoryUpdate): Observable<Category> {
    return this._http.put<ICategory>(`inventory/categories/${id}`, data).pipe(map(value => new Category(value)));
  }

  delete(id: string): Observable<void> {
    return this._http.delete<void>(`inventory/categories/${id}`);
  }
}
