import { Component, inject, input, signal } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Category } from '../../category';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { CategoryFormModalComponent } from '../category-form-modal/category-form-modal.component';
import { CategoryService } from '../../services/category.service';
import { CategoriesDataClientService } from '../../services/categories-data-client.service';

@Component({
  selector: 'app-categories-tree-node',
  standalone: true,
  imports: [
    NzButtonModule,
    NzDropDownModule,
    NzModalModule,
    NzIconModule
  ],
  templateUrl: './categories-tree-node.component.html',
  styleUrl: './categories-tree-node.component.scss'
})
export class CategoriesTreeNodeComponent {
  private readonly _nzModal = inject(NzModalService);
  private readonly _categoryService = inject(CategoryService);
  private readonly _categoriesDataClient = inject(CategoriesDataClientService);
  protected children = signal<Category[]>([]);
  protected showChildren = signal<boolean>(false);
  protected name = signal<string>("");
  public readonly category = input.required<Category>();


  constructor(){
    this._categoryService.change.subscribe(base => {
      this.children.update(list => {
        return list.filter(a => base.some(b => b.id == a.id));
      })
    })
  }

  protected onShowChildren(): void {
    if (this.showChildren()){
      this.showChildren.set(false);
    } else {
      this.showChildren.set(true);
      if (this.showChildren()){
        this._categoryService.loadCategories().then(list => {
          this.children.set(list.filter(x => x.parentId == this.category().id));
        });
      }
    }
  }

  protected onAddSubCategory(): void {
    this._nzModal.create({
      nzTitle: "Crear sub categoría",
      nzContent: CategoryFormModalComponent,
      nzData: this.category().id,
    }).afterClose.subscribe((res: Category | undefined) => {
      if (res){
        this.children.update(list => [...list, res]);
      }
    })
  }

  protected onEdit(): void {
    this._nzModal.create({
      nzTitle: "Editar categoría",
      nzContent: CategoryFormModalComponent,
      nzData: this.category()
    })
  }

  protected onDelete(): void {
    this._nzModal.confirm({
      nzTitle: `Eliminar categoría ${this.category().name} y sus sub categorías?`,
      nzOnOk: () => {
        this._categoriesDataClient.delete(this.category().id).subscribe({
          next: () => {
            this._categoryService.remove(this.category());
          }
        })
      }
    })
  }
}
