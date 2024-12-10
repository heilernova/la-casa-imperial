import { Component, inject, OnInit, signal } from '@angular/core';
import { NzListModule } from 'ng-zorro-antd/list';
import { Item, ItemsDataSourceService } from '../../../common/inventory/items';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

@Component({
  selector: 'app-items-page',
  standalone: true,
  imports: [
    CommonModule,
    NzListModule,
    NzButtonModule,
    NzInputModule,
    NzIconModule,
    NzDropDownModule,
    RouterLink,
  ],
  templateUrl: './items-page.component.html',
  styleUrl: './items-page.component.scss'
})
export class ItemsPageComponent implements OnInit {
  private readonly _itemDataSource = inject(ItemsDataSourceService);

  protected list = signal<Item[]>([]);

  ngOnInit(): void {
    this._itemDataSource.loadItems().then(list => this.list.set(list));
  }
}
