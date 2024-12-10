import { inject, Injectable } from '@angular/core';
import { CategoriesDataClientService } from './categories-data-client.service';
import { Category } from '../category';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesDataSourceService {
  private readonly _client = inject(CategoriesDataClientService);
  private _loaded = false;
  private _data: Category[] = [];
  private readonly _changeData = new BehaviorSubject<Category[]>([]);
  private readonly _event = new Subject<{ type: "add" | "remove", value: Category }>();

  private get data  (){
    return this._data;
  }
  private set data(value: Category[]){
    this._data = value;
    this._changeData.next(value);
  }

  public load(refresh?: boolean): Promise<Category[]>{
    return new Promise((resolve, reject) => {
      if (this._loaded && !refresh){
        resolve(this.data);
        return;
      }

      this._client.getAll().subscribe({
        next: res => {
          this.data = res;
          resolve(this.data);
        },
        error: err => reject(err)
      })
    })
  }

  public get  changeValue(){
    return this._changeData.asObservable();
  }

  public get event(){
    return this._event.asObservable();
  }

  public add(data: Category): void {
    this._data.push(data);
    this._data.sort((a, b) => a.name.localeCompare(b.name));
    this._changeData.next(this.data);
    this._event.next({ type: "add", value: data });
  }

  public remove(data: Category): void {
    const id = data.id;
    this.data = this._data.filter(x => x.id != id && x.parentId != id);
    this._event.next({ type: "remove", value: data });
  }
}
