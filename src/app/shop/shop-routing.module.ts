import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShopComponent } from './shop.component';
import { ShopListComponent } from './pages/shop-list/shop-list.component';
import { ShopFormComponent } from './pages/shop-form/shop-form.component';

const routes: Routes = [
  {
    path: '',
    component: ShopComponent,
    children: [
      { path: '', component: ShopListComponent },
      { path: 'create', component: ShopFormComponent },
      { path: 'edit/:id', component: ShopFormComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
