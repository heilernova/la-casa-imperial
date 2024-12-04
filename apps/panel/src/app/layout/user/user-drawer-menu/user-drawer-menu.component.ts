import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzModalService, NzModalModule } from 'ng-zorro-antd/modal';
import { SessionService } from '../../../authentication/session.service';

@Component({
  selector: 'app-user-drawer-menu',
  standalone: true,
  imports: [
    RouterLink,
    NzButtonModule,
    NzModalModule
  ],
  templateUrl: './user-drawer-menu.component.html',
  styleUrl: './user-drawer-menu.component.scss'
})
export class UserDrawerMenuComponent {
  private readonly _session = inject(SessionService);
  private readonly _modal = inject(NzModalService);
  private readonly _router = inject(Router);
  private readonly _nzDrawerRef = inject(NzDrawerRef);
  
  protected logout(): void {
    this._modal.confirm({
      nzTitle: "¿Cerrar sesión?",
      nzOnOk: () => {
        this._session.logout();
        this._nzDrawerRef.close();
        this._router.navigate(["/login"]);
      }
    })
  }

  public close(): void {
    this._nzDrawerRef.close();
  }
}
