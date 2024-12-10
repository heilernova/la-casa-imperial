import { Component, effect, inject, Input, input, signal, ViewChild } from '@angular/core';
import { ItemCategoryFormControlComponent } from './item-category-form-control/item-category-form-control.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ReactiveFormsModule } from '@angular/forms';
import { generateItemFromGroup } from './item-form-group';
import { markAllAsDirty } from '../../../../utils';
import { ItemDetailsComponent } from './item-details/item-details.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { definePropertiesOnObject, generateSlug } from '@la-casa-imperial/core';
import { ItemGalleryComponent } from './item-gallery/item-gallery.component';
import { NzInputNumberComponent } from "../../../../../ui/input/nz-input-number/nz-input-number.component";
import { ItemsDataClientService } from '../../services/items-data-client.service';
import { ItemsDataSourceService } from '../../services/items-data-source.service';
import { Item } from '../../item.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { IOpenGraphImage } from '@la-casa-imperial/schemas/inventory/items';

@Component({
  selector: 'app-item-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzTabsModule,
    NzIconModule,
    NzSelectModule,
    NzInputModule,
    ItemCategoryFormControlComponent,
    ItemDetailsComponent,
    ItemGalleryComponent,
    NzInputNumberComponent
],
  templateUrl: './item-form.component.html',
  styleUrl: './item-form.component.scss'
})
export class ItemFormComponent {
  private readonly _itemsDataClient = inject(ItemsDataClientService);
  private readonly _itemsDataSource = inject(ItemsDataSourceService);
  private readonly _nzMessage = inject(NzMessageService);
  protected readonly formGroup = generateItemFromGroup();
  private _data: Item | null = null;

  @ViewChild(ItemGalleryComponent)
  protected gallery!: ItemGalleryComponent;

  protected galleryData = signal<{ openGraph: IOpenGraphImage[], gallery: string[] } | undefined>(undefined);

  @Input()
  public set data(data  : Item | undefined){
    if (data){
      this._data = data;
      this.formGroup.setValue({
        code: data?.code ?? "", 
        barcode: data?.barcode ?? "",
        unspsc: data?.unspsc ?? "",
        name: data.name,
        brand: data.brand ?? "",
        model: data.model ?? "",
        profit: 0,
        price: data.price,
        slug: data.slug,
        seo: {
          title: data.seo.title ?? "",
          description: data.seo.description ?? "",
          keywords: data.seo.keywords
        },
        details: [],
        cost: {
          costBase: 0,
          othersConst: {
            total: 0,
            details: []
          },
          total: 0,
        },
        orderIndex: data.orderIndex,
        categories: data.categories,
      });
      // this.gallery.data = {
      //   openGraph: data.openGraphImages,
      //   gallery: data.gallery
      // }
      this.galleryData.set({
        openGraph: data.openGraphImages,
        gallery: data.gallery
      })
      this.formGroup.controls.code.disable();
    }
  }


  protected onClickRefreshSlug(): void {    
    this.formGroup.controls.slug.setValue(generateSlug(this.formGroup.controls.name.value));
  }

  public get invalid(){
    const invalid = this.formGroup.invalid;
    if (invalid){
      markAllAsDirty(this.formGroup);
    }
    return invalid;
  }
  public get valid(){
    const valid = this.formGroup.invalid;
    if (valid){
      markAllAsDirty(this.formGroup);
    }
    return valid;
  }

  public getRawValue(){
    return this.formGroup.getRawValue();
  }

  public getImages(){
    return this.gallery.getImages();
  }

  public onSave(): Promise<Item | void> {
    return new Promise((resolve, reject ) => {
      if (this.invalid){
        resolve();
        return;
      }
      const formValues = this.formGroup.getRawValue();

      this.formGroup.disable();

      const item = this._data;
      if (item){
        // Actualizar información
        this._itemsDataClient.update(item.id, {
          code: formValues.code ? formValues.code : undefined,
          barcode: formValues.barcode ? formValues.barcode : undefined,
          unspsc: formValues.unspsc ? formValues.unspsc : undefined,
          name: formValues.name,
          brand: formValues.brand ? formValues.brand : undefined,
          model: formValues.model ? formValues.model : undefined,
          price: formValues.price,
          orderIndex: formValues.orderIndex,
          slug: formValues.slug ? formValues.slug : undefined,
          seo: {
            title: formValues.seo.title ? formValues.seo.title : null,
            description: formValues.seo.description ? formValues.seo.description : null,
            keywords: formValues.seo.keywords
          },
          categoryId: formValues.categories[formValues.categories.length - 1].id,
          details: formValues.details
        }).subscribe({
          next: res => {
            definePropertiesOnObject(this._data, res);

            const images = this.gallery.getImages();
            if (images){
              this._itemsDataClient.updateImages(item.id, images).subscribe({
                next: res => {
                  definePropertiesOnObject(item, {
                    gallery: res.gallery,
                    openGraphImages: res.openGraphImages
                  })
                  this._nzMessage.success("Producto actualizado correctamente.");
                  this.formGroup.enable();
                  resolve();
                },
                error: err => {
                  this._nzMessage.success("Producto actualizado correctamente.");
                  this._nzMessage.warning("No se pudo guardar las imágenes.");
                  this.formGroup.enable();
                  resolve(err);
                }
              })
            } else {
              this._nzMessage.success("Producto actualizado correctamente.");
              this.formGroup.enable();
              resolve();
            }
            
          },
          error: err => {
            this._nzMessage.error("No se pudo actualizar la información del producto.")
            reject(err);
          }
        })
        return;
      }

      this._itemsDataClient.create({
        type: "product",
        code: formValues.code ? formValues.code : undefined,
        barcode: formValues.barcode ? formValues.barcode : undefined,
        unspsc: formValues.unspsc ? formValues.unspsc : undefined,
        name: formValues.name,
        brand: formValues.brand ? formValues.brand : undefined,
        model: formValues.model ? formValues.model : undefined,
        price: formValues.price,
        orderIndex: formValues.orderIndex,
        slug: formValues.slug ? formValues.slug : undefined,
        seo: {
          title: formValues.seo.title ? formValues.seo.title : null,
          description: formValues.seo.description ? formValues.seo.description : null,
          keywords: formValues.seo.keywords
        },
        categoryId: formValues.categories[formValues.categories.length - 1].id,
        details: formValues.details
      }).subscribe({
        next: item => {
          const images = this.gallery.getImages();
          if (images){
            this._itemsDataClient.updateImages(item.id, images).subscribe({
              next: res => {
                definePropertiesOnObject(item, {
                  gallery: res.gallery,
                  openGraphImages: res.openGraphImages
                })
                this._nzMessage.success("Producto creado correctamente.", );
                this.formGroup.enable();
                resolve(item);
              },
              error: err => {
                this._nzMessage.success("Producto creado correctamente.");
                this._nzMessage.warning("No se pudo guardar las imágenes.");
                this.formGroup.enable();
                resolve(item);
              }
            })
          } else {
            this._itemsDataSource.push(item);
            this._nzMessage.success("Producto creado correctamente.");
            this.formGroup.enable();
            resolve(item);
          }

        },
        error: err => {
          this.formGroup.enable();
          this._nzMessage.error("No se pudo crear el item.");
          reject(err);
        }
      })
    })
  }
}
