import { Component, inject, signal } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../category';
import { CategoriesTreeNodeComponent } from '../categories-tree-node/categories-tree-node.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { CategoryFormModalComponent } from '../category-form-modal/category-form-modal.component';

@Component({
  selector: 'app-categories-tree',
  standalone: true,
  imports: [
    CategoriesTreeNodeComponent,
    NzButtonModule,
    NzModalModule
  ],
  templateUrl: './categories-tree.component.html',
  styleUrl: './categories-tree.component.scss'
})
export class CategoriesTreeComponent {
  private _categoryServices = inject(CategoryService);
  private readonly _nzModal = inject(NzModalService);

  protected list = signal<Category[]>([]);

  constructor(){
    this._categoryServices.loadCategories().then(list => {
      this.list.set(list.filter(x => x.parentId === null));
    });

    this._categoryServices.change.subscribe(list => {
      this.list.update(base => {
        return base.filter(x => list.some(b => b.id == x.id));
      })
    })
  }

  protected onCreateCategory(): void {
    this._nzModal.create({
      nzTitle: "Crear categoría",
      nzContent: CategoryFormModalComponent,
    }).afterClose.subscribe((res: Category | undefined) => {
      if (res){
        this._categoryServices.push(res);
        this.list.update(list => [...list, res]);
      }
    })
  }
}
