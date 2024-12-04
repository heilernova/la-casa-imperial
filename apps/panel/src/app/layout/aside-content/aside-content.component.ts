import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'app-aside-content',
  standalone: true,
  imports: [
    RouterLink,
    NzMenuModule,
  ],
  templateUrl: './aside-content.component.html',
  styleUrl: './aside-content.component.scss'
})
export class AsideContentComponent {
 
}
