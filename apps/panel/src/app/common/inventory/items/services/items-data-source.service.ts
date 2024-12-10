import { inject, Injectable } from '@angular/core';
import { ItemsDataClientService } from './items-data-client.service';
import { Item } from '../item.model';

@Injectable({
  providedIn: 'root'
})
export class ItemsDataSourceService {
  private readonly _itemDataClient = inject(ItemsDataClientService);
  private _items: Item[] = [];

  public loadItems(): Promise<Item[]> {
    return new Promise((resolve, reject) => {
      if (this._items.length > 0){
        resolve(this._items.slice());
        return;
      }

      this._itemDataClient.getAll().subscribe({
        next: res => {
          this._items = res;
          resolve(this._items.slice());
        },
        error: err => reject(err)
      })
    })
  }

  public push(item: Item): void {
    this._items.push(item);
  }

  public remove(value: Item): void {
    this._items = this._items.filter(item => item.id !== value.id);
  }
}
