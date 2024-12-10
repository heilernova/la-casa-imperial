import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Item, ItemsDataClientService, ItemsDataSourceService } from '../../../common/inventory/items';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ItemFormComponent } from '../../../common/inventory/items/components/item-form/item-form.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { definePropertiesOnObject } from '@la-casa-imperial/core';

@Component({
  selector: 'app-items-edit-page',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    ItemFormComponent
  ],
  templateUrl: './items-edit-page.component.html',
  styleUrl: './items-edit-page.component.scss'
})
export class ItemsEditPageComponent {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _itemsDataSource = inject(ItemsDataSourceService);
  private readonly _itemDataClient = inject(ItemsDataClientService);
  private readonly _nzMessage = inject(NzMessageService);

  @ViewChild(ItemFormComponent)
  protected formItem!: ItemFormComponent

  protected readonly edit = signal<boolean>(false);
  protected item = signal<Item | null>(null)
  protected image = computed(() => {
    const img = this.item()?.gallery[0];
    return img ? `${img}?size=small` : ""
  })

  constructor(){
    this._activatedRoute.params.subscribe(values => {
      const id: string = values["id"];
      this._itemsDataSource.loadItems().then(list => {
        const item = list.find(x => x.id == id);
        this.item.set(item ?? null)
      })
    })
  }

  protected onClickEdit(): void {
    this.edit.set(true);
  }

  protected onClickDiscardChanges(): void {
    this.edit.set(false);
  }

  protected onClickOnSave(): void {
    this.formItem.onSave().then(()  => {
      this.edit.set(false);
    });
  }

  protected onClickPublish(): void {
    const item  = this.item();
    if (item){
      if (item.publish){
        this._itemDataClient.unpublish(item.id).subscribe({
          next: () => {
            this._nzMessage.success("Se ha retirado de la tienda online.");
            definePropertiesOnObject(item, { publish: false });
          },
          error: () => {
            this._nzMessage.error("No de pudo retirar el producto de la tienda online.");
          }
        })
      } else {
        this._itemDataClient.publish(item.id).subscribe({
          next: () => {
            this._nzMessage.success("Publicado en la tienda online.");
            definePropertiesOnObject(item, { publish: true });
          },
          error: () => {
            this._nzMessage.error("No se pudo publicar en la tienda online.")
          }
        })
      }
    }
  }
}
