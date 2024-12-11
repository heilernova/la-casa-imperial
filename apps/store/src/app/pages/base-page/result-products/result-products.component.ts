import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { ApiProductAndService } from '@la-casa-imperial/schemas/store';

@Component({
  selector: 'app-result-products',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './result-products.component.html',
  styleUrl: './result-products.component.scss'
})
export class ResultProductsComponent {
  public readonly products = input<ApiProductAndService[]>([]);
  public readonly type = input<"card" | "list">("card");
}
