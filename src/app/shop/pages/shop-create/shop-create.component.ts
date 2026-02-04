import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ShopFormComponent } from '../shop-form/shop-form.component';

@Component({
  selector: 'app-shop-create',
  standalone: true,
  imports: [CommonModule, ShopFormComponent],
  template: `<app-shop-form></app-shop-form>`
})
export class ShopCreateComponent {

}
