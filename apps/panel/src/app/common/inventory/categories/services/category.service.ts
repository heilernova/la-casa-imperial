import { inject, Injectable } from '@angular/core';
import { CategoriesDataClientService } from './categories-data-client.service';
import { Category } from '../category';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly _dataClient = inject(CategoriesDataClientService);
  private _categories: Category[] = [];

  private _changeValues = new BehaviorSubject<Category[]>([]);

  loadCategories(): Promise<Category[]> {
    return new Promise((resolve, reject) => {
      if (this._categories.length > 0){
        resolve(this._categories);
        return;
      }
      
      this._dataClient.getAll().subscribe({
        next: list  => {
          this._categories = list;
          resolve(this._categories.slice());
        },
        error: err => reject(err)
      })
    })
  }

  public get change() {
    return this._changeValues.asObservable()
  }

  push(data: Category): void {
    this._categories.push(data);
  }

  remove(category: Category): void {
    this._categories = this._categories.filter(x => x.id != category.id && category.parentId != category.id);
    this._changeValues.next(this._categories.slice());
  }
}
