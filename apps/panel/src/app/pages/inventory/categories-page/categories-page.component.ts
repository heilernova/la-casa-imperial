import { Component, inject, signal } from '@angular/core';
import { Category } from '../../../common/inventory/categories/category';
import { CategoriesDataClientService } from '../../../common/inventory/categories/services/categories-data-client.service';
import { CategoriesTreeComponent } from '../../../common/inventory/categories';

@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [
    CategoriesTreeComponent
  ],
  templateUrl: './categories-page.component.html',
  styleUrl: './categories-page.component.scss'
})
export class CategoriesPageComponent {
  private readonly _categories = inject(CategoriesDataClientService);
  protected readonly list  = signal<Category[]>([]);

  constructor(){
    // this._categories.getAll().subscribe({
    //   next: res => {
    //     this.list.set(res);
    //   }
    // })
  }
}
