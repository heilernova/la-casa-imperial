import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SessionService } from './authentication/session.service';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly _session = inject(SessionService);
  title = 'panel';

  constructor(){
    this._session.init();
  }
}
