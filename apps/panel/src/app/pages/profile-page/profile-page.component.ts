import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { SessionService } from '../../authentication/session.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UpdatePasswordModalComponent } from './update-password-modal/update-password-modal.component';
import { IToken } from '../../common/tokens/token.interface';
import { TokensDataClientService } from '../../common/tokens';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzInputModule,
    NzButtonModule,
    NzFormModule,
    NzModalModule
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent implements OnInit {
  private readonly _session = inject(SessionService);
  private readonly _nzMessage = inject(NzMessageService);
  private readonly _nzModal = inject(NzModalService);
  private readonly _tokensDataClient = inject(TokensDataClientService);
  private baseData: { name: string, lastName: string, sex: "M" | "F" | null, username: string, email: string } | null = null;

  protected readonly edit = signal<boolean>(false);
  protected readonly tokens = signal<IToken[]>([]);

  protected readonly form = new FormGroup({
    name: new FormControl<string>('', { nonNullable: true }),
    lastName: new FormControl<string>('', { nonNullable: true }),
    username: new FormControl<string>('', { nonNullable: true }),
    sex: new FormControl<"M" | "F" | null>(null, { nonNullable: true }),
    email: new FormControl<string>('', { nonNullable: true }),
  });

  constructor(){
    this.form.disable();
  }

  ngOnInit(): void {
    
    const session = this._session.getCurrentSession();
    if (session){
      session.getInfo().then(res => {
        this.baseData = res;
        this.form.setValue({
          name: res.name,
          lastName: res.lastName,
          username: res.username,
          sex: res.sex,
          email: res.email
        });
        this.form.enable();
      })

      this._tokensDataClient.getAll().subscribe({
        next: res => this.tokens.set(res)
      })
    }


  }

  protected onClickEdit(): void {
    const session = this._session.getCurrentSession();
    if (this.edit() && session){
      if (this.form.invalid){
        return;
      }
      const value = this.form.getRawValue();
      session.update(value)
      .then(() => {
        this._nzMessage.success("Todos actualizados correctamente");
      })
      .catch(() => {
        this._nzMessage.error("No se pudo actualizar la información")
      })
    } else {
      this.edit.set(true);
    }
  }

  protected onClickDiscardChanges(): void {
    this.form.setValue({
      name: this.baseData?.name ?? "",
      lastName: this.baseData?.lastName ?? "",
      sex: this.baseData?.sex ?? null,
      email: this.baseData?.email ?? "",
      username: this.baseData?.username ?? ""
    })
    this.edit.set(false);
  }

  protected onUpdatePassword(): void {
    this._nzModal.create({
      nzTitle: "Actualizar contraseña",
      nzContent: UpdatePasswordModalComponent,
      nzData: "password"
    })
  }

  protected onUpdatePIN(): void {
    this._nzModal.create({
      nzTitle: "Actualizar contraseña",
      nzContent: UpdatePasswordModalComponent,
      nzData: "pin"
    })
  }

  protected onClickDeleteToken(index: number){
    const id = this.tokens()[index].id;
    this._tokensDataClient.delete(id).subscribe({
      next: () => {
        this.tokens.update(list => {
          list.splice(index, 1);
          return list;
        })
      }
    })
  }
}
