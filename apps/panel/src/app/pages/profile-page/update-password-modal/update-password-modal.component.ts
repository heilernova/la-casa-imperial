import { HttpClient } from '@angular/common/http';
import { Component, inject, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-update-password-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzModalModule,
    NzFormModule,
    NzButtonModule,
    NzInputModule
  ],
  templateUrl: './update-password-modal.component.html',
  styleUrl: './update-password-modal.component.scss'
})
export class UpdatePasswordModalComponent {
  private readonly _modalRef: NzModalRef = inject(NzModalRef);
  private readonly _nzMessage = inject(NzMessageService);
  private readonly _http = inject(HttpClient);

  protected form = new FormGroup({
    current: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    value: new FormControl<string>('', { nonNullable: true, validators: Validators.required })
  })

  constructor(@Inject(NZ_MODAL_DATA) protected type: "password" | "pin") {
    
  }

  protected destroyModal(): void {
    this._modalRef.destroy();
  }

  protected onUpdate(): void {
    if (this.form.invalid){
      this._nzMessage.warning("Faltan campos por completar.");
      return;
    }

    const values = this.form.getRawValue();

    if (this.type == "password"){
      
      this._http.put("profile/password", { password: values.current, newPassword: values.value }).subscribe({
        next: () => {
          this._nzMessage.success("Contraseña actualizada.");
          this._modalRef.destroy();
        },
        error: () => {
          this._nzMessage.error("No se pudo actualizar la contraseña.");
        }
      });
      
    } else {
      
      this._http.put("profile/pin", { password: values.current, pin: values.value }).subscribe({
        next: () => {
          this._nzMessage.success("PIN actualizado correctamente.");
          this._modalRef.destroy();
        },
        error: () => {
          this._nzMessage.error("No se pudo actualizar el PIN.");
        }
      })

    }
  }
}
