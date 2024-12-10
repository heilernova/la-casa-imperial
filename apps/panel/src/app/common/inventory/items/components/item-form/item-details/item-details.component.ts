import { Component, inject, input } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { generateDetailFormGroup, generateDetailItem, ItemDetailControls } from '../item-form-group';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-item-details',
  standalone: true,
  imports: [
    NzInputModule,
    NzButtonModule,
    NzFormModule,
    NzIconModule,
    NzButtonModule,
    NzModalModule,
    ReactiveFormsModule
  ],
  templateUrl: './item-details.component.html',
  styleUrl: './item-details.component.scss'
})
export class ItemDetailsComponent {
  private readonly _nzModal = inject(NzModalService);
  public readonly formArray = input.required<FormArray<FormGroup<ItemDetailControls>>>();

  protected onClickAddSection(): void {
    const form = generateDetailFormGroup();
    form.controls.items.push(generateDetailItem());
    this.formArray().push(form);
  }

  protected onClickAddItem(form: FormGroup<ItemDetailControls>): void {
    form.controls.items.push(generateDetailItem())
  }

  protected onClickDeleteSection(index: number): void {
    this._nzModal.confirm({
      nzTitle: "¿Desea eliminar la sección?",
      nzOnOk: () => {
        this.formArray().removeAt(index);
      }
    })
  }

  protected onDeleteItem(form: FormGroup<ItemDetailControls>, index: number): void {
    this._nzModal.confirm({
      nzTitle: "¿Desea eliminar el item?",
      nzOnOk: () => {
        form.controls.items.removeAt(index);
      }
    })
  }
}
