import { Component, inject, OnInit, signal } from '@angular/core';
import { SessionService } from '../../authentication/session.service';
import { NzDrawerModule, NzDrawerService } from 'ng-zorro-antd/drawer';
import { UserDrawerMenuComponent } from './user-drawer-menu/user-drawer-menu.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    NzDrawerModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
  host: {
    '(click)': 'onClickOpenMenu()'
  }
})
export class UserComponent implements OnInit {
  private readonly _session: SessionService = inject(SessionService);
  private readonly _nzDrawerService = inject(NzDrawerService);

  protected readonly name = signal<string>("");
  
  ngOnInit(): void {
    const session = this._session.getCurrentSession();
    this.name.set(`${session?.name} ${session?.lastName}`);
  }


  protected onClickOpenMenu(): void {
     this._nzDrawerService.create({
      nzTitle: this.name(),
      nzContent: UserDrawerMenuComponent
    })
  }
}
