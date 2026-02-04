import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopRoutingModule } from './shop-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ShopComponent } from './shop.component';
import { ShopListComponent } from './pages/shop-list/shop-list.component';
import { ShopFormComponent } from './pages/shop-form/shop-form.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ShopRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ShopComponent,
    ShopListComponent,
    ShopFormComponent
  ]
})
export class ShopModule { }
