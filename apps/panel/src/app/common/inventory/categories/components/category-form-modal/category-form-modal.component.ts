import { Component, Inject, inject } from '@angular/core';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { Category } from '../../category';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CategoriesDataClientService } from '../../services/categories-data-client.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CategoryService } from '../../services/category.service';
import { definePropertiesOnObject } from '@la-casa-imperial/core';
import { markAllAsDirty } from '../../../../utils';

@Component({
  selector: 'app-category-form-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzModalModule,
    NzFormModule,
    NzButtonModule,
    NzInputModule
  ],
  templateUrl: './category-form-modal.component.html',
  styleUrl: './category-form-modal.component.scss'
})
export class CategoryFormModalComponent {
  private readonly _nzModalRef = inject(NzModalRef);
  private readonly _nzMessage = inject(NzMessageService);
  private readonly _categoriesDataClient = inject(CategoriesDataClientService);
  private readonly _categoriesService = inject(CategoryService);

  protected form = new FormGroup({
    name: new FormControl<string>("", { nonNullable: true, validators: Validators.required }),
    description: new FormControl<string>("", { nonNullable: true }),
  })

  constructor(@Inject(NZ_MODAL_DATA) private data: Category | string | undefined){
    if (data instanceof Category){
      this.form.setValue({
        name: data.name,
        description: data.description ?? ""
      })
    }
  }

  protected onDestroy(){
    this._nzModalRef.destroy();
  }

  protected onSave(): void {
    if (this.form.invalid){
      markAllAsDirty(this.form);
      return;
    }

    const values = this.form.getRawValue();
    this.form.enable();
    if (this.data instanceof Category){
      this._categoriesDataClient.update(this.data.id, {
        name: values.name,
        description: values.description ? values.description : null
      }).subscribe({
        next: res => {
          definePropertiesOnObject(this.data, res);
          this._nzMessage.success("Categoría actualizada correctamente.");
          this.onDestroy();
        },
        error: () => {
          this._nzMessage.error("No se pudo actualizar la categoría.");
        }
      })
    } else {
      this._categoriesDataClient.create({
        name: values.name,
        parentId: this.data,
        description: values.description ? values.description : null
      }).subscribe({
        next: res => {
          this._categoriesService.push(res);
          this._nzModalRef.destroy(res);
        },
        error: () => {
          this._nzMessage.error("No se pudo crear la categoría.");
        }
      })
    }
  }
}
