import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BehaviorSubject, fromEvent, map, merge } from 'rxjs';
import { AsideContentComponent } from './aside-content/aside-content.component';
import { UserComponent } from './user/user.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    AsideContentComponent,
    UserComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  private onlineSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(navigator.onLine);

  protected online = signal<boolean>(navigator.onLine);

  constructor(){
    const online$ = fromEvent(window, "online").pipe(map(() =>  true));
    const offline$ = fromEvent(window, "offline").pipe(map(() => false));
    merge(online$, offline$).subscribe(online => this.online.set(online));
  }
  
}
