import { Component, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SessionService } from '../authentication/session.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly _nzMessage = inject(NzMessageService);
  private readonly _session = inject(SessionService);
  private readonly _router = inject(Router);

  protected readonly validating = signal<boolean>(false);

  constructor(){
    effect(() => {
      if (this.validating()){
        this.credentials.disable();
      } else {
        this.credentials.enable();
      }
    })
  }
  
  protected credentials = new FormGroup({
    username: new FormControl<string>("", { nonNullable: true, validators: Validators.required }),
    password: new FormControl<string>("", { nonNullable: true, validators: Validators.required }),
  });
  
  protected onSignIn(): void {
    if (this.credentials.invalid) {
      this._nzMessage.warning("Faltan campos por completar");
      return;
    }

    const credentials = this.credentials.getRawValue();
    this.validating.set(true);

    this._session.singIn(credentials).then(() => {
      this._router.navigate(["/"]);
    })
    .catch(() => {
      this.validating.set(false);
      this._nzMessage.error("Credenciales incorrectas.");
    })
  }
}
