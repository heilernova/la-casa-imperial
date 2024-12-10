import { Component, inject, ViewChild } from '@angular/core';
import { ItemFormComponent } from '../../../common/inventory/items/components/item-form/item-form.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-items-create-page',
  standalone: true,
  imports: [
    ItemFormComponent,
    NzButtonModule
  ],
  templateUrl: './items-create-page.component.html',
  styleUrl: './items-create-page.component.scss'
})
export class ItemsCreatePageComponent {
  private readonly _message = inject(NzMessageService);

  @ViewChild(ItemFormComponent)
  private form!: ItemFormComponent;
  
  protected onSave(): void {
    if (this.form.invalid){
      this._message.warning("Faltan campos por completar");
      return;
    }

    this.form.onSave().then(res => {
      console.log(res);
    })
  }
}
