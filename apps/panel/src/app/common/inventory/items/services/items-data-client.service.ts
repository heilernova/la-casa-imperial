import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiItem, ApiItemCreate, ApiItemUpdate, IItem, parseApiItemToObjectItem } from '@la-casa-imperial/schemas/inventory/items';
import { map, Observable } from 'rxjs';
import { Item } from '../item.model';
import { definePropertiesOnObject } from '@la-casa-imperial/core';

@Injectable({
  providedIn: 'root'
})
export class ItemsDataClientService {
  private readonly _http = inject(HttpClient);

  public getAll(): Observable<Item[]> {
    return this._http.get<ApiItem[]>("inventory/items").pipe(map(list => {
      return list.map(x => {
        const item = new Item();
        definePropertiesOnObject(item, x);
        return item;
      });
    }));
  }

  public get(id: string): Observable<Item> {
    return this._http.get<ApiItem>(`inventory/items/${id}`).pipe(map(x => {
      const item = new Item();
      definePropertiesOnObject(item, x);
        return item;
    }))
  }

  public create(data: ApiItemCreate): Observable<Item> {
    return this._http.post<ApiItem>("inventory/items", data).pipe(map(res => {
      const item = new Item();
      definePropertiesOnObject(item, res);
      return item; 
    }))
  }

  public update(id: string, data: ApiItemUpdate): Observable<IItem> {
    return this._http.put<ApiItem>(`inventory/items/${id}`, data).pipe(map(x => {
      return parseApiItemToObjectItem(x);
    }))
  }

  public delete(id: string): Observable<void> {
    return this._http.delete<void>(`inventory/items/${id}`);
  }

  public updateImages(id: string, data: { delete?: string[], gallery?: File[], openGraph?: { type: "sms" | "facebook", file: File }[] }): Observable<{ gallery: string, openGraphImages: unknown[] }>{
    const formData = new FormData();
    if (data.delete){
      formData.append("delete", data.delete.join(","));
    }

    data.gallery?.forEach(file => {
      formData.append("gallery", file);
    });

    data.openGraph?.forEach(val => {
      formData.append(`og-${val.type}`, val.file);
    });

    return this._http.put<{ gallery: string, openGraphImages: unknown[] }>(`inventory/items/${id}/images`, formData);
  }

  public publish(id: string): Observable<void> {
    return this._http.put<void>(`inventory/items/${id}/publish`, undefined);
  }
  public unpublish(id: string): Observable<void> {
    return this._http.put<void>(`inventory/items/${id}/unpublish`, undefined);
  }
}
