import { Component, computed, effect, ElementRef, inject, OnInit, Optional, Self, signal } from '@angular/core';
import { FocusMonitor } from '@angular/cdk/a11y';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Category } from '../../../../categories/category';
import { CategoryService } from '../../../../categories';
import { IItemCategory } from '@la-casa-imperial/schemas/inventory/items';
import { AbstractControlDirective, ControlValueAccessor, NgControl } from '@angular/forms';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { CategoryFormModalComponent } from '../../../../categories/components/category-form-modal/category-form-modal.component';

@Component({
  selector: 'app-item-category-form-control',
  standalone: true,
  imports: [
    NzDropDownModule,
    NzIconModule,
    NzModalModule
  ],
  templateUrl: './item-category-form-control.component.html',
  styleUrl: './item-category-form-control.component.scss',
  host: {
    "class": "ant-input",
  }
})
export class ItemCategoryFormControlComponent implements OnInit, ControlValueAccessor {
  private readonly _nzModal = inject(NzModalService);
  private readonly _categoriesDataSource = inject(CategoryService);
  
  protected baseCategories = signal<Category[]>([]);
  protected categories = signal<IItemCategory[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  public onChange = (_: unknown) => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onTouched = () => {};
  public disable = false;
  public ngControl: NgControl | AbstractControlDirective | null = null;
  protected options = computed(() => {
    const baseCategories = this.baseCategories();
    const categories = this.categories();
    const category: IItemCategory | undefined = categories[categories.length - 1];
    if (category){
      return baseCategories.filter(x => x.parentId == category.id);
    } else {
      return baseCategories.filter(x => x.parentId == null);
    }
  });

  constructor(
    private _focusMonitor: FocusMonitor,
    private _elementRef: ElementRef<HTMLElement>,
    @Optional() @Self() ngControl: NgControl
  ){
    if (ngControl){
      ngControl.valueAccessor = this;
      this.ngControl = ngControl;
    }

    effect(() => {
      this.onChange(this.categories());
    })
  }
  
  ngOnInit(): void {
    this._categoriesDataSource.loadCategories().then(x => this.baseCategories.set(x) );
  }

  protected onRemoveCategory(index: number): void {
    const list = this.categories().slice();
    list.splice(index, list.length);
    this.categories.set(list)
  }

  protected onSelect(category: Category): void {
    this.categories.update(list => [...list, { id: category.id, name: category.name, slug: category.slug }]);
  }

  protected onAddCategory(): void {
    const category: IItemCategory | undefined = this.categories()[this.categories().length - 1];
    this._nzModal.create({
      nzTitle: category ? "Crear sub categoría" : "Crear categoría",
      nzContent: CategoryFormModalComponent,
      nzData: category ? category.id : undefined,
    }).afterClose.subscribe((res: Category | undefined) => {
      if (res){
        this.baseCategories.update(list => [...list, res]);
        this.categories.update(list => [...list, { id: res.id, name: res.name, slug: res.slug }]);
      }
    })
  }

  writeValue(obj: IItemCategory[]): void {
    console.log(obj);
    this.categories.set(obj);
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disable = isDisabled;
  }
}
