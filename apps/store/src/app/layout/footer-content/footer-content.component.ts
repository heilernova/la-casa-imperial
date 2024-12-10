import { Component } from '@angular/core';

@Component({
  selector: 'app-footer-content',
  standalone: true,
  imports: [],
  templateUrl: './footer-content.component.html',
  styleUrl: './footer-content.component.scss'
})
export class FooterContentComponent {
  protected email = "buzon@lacasaimperial.com";
  protected cellphone = "(312) 576-8084";
}
