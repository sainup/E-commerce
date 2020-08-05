import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from './services/product.service';

import { Routes, RouterModule} from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailComponent } from './components/cart-detail/cart-detail.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { from } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductListAdminComponent } from './components/product-list-admin/product-list-admin.component';
import { ProductFormComponent } from './components/product-form/product-form.component';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ProductCategoryAdminComponent } from './components/product-category-admin/product-category-admin.component';
import { CategoryFormComponent } from './components/category-form/category-form.component';
import { UpdateCategoryComponent } from './components/update-category/update-category.component';
const routes: Routes = [
  {path: 'checkout', component: CheckoutComponent},
  {path: 'cart-details', component: CartDetailComponent},
  {path : 'admin/addProduct', component: ProductFormComponent},
  {path : 'admin/updateCategory',component: UpdateCategoryComponent},
  {path : 'admin/addCategory', component: CategoryFormComponent},
  {path: 'products/:id', component: ProductDetailsComponent},
  {path: 'admin/products', component: ProductListAdminComponent},
  {path: 'admin/categories', component: ProductCategoryAdminComponent},
  {path: 'search/:keyword', component: ProductListComponent},
  {path: 'category/:id', component: ProductListComponent},
  {path: 'category', component: ProductListComponent},
  {path: 'products', component: ProductListComponent},
  {path: '', redirectTo: '/products', pathMatch: 'full'},
  {path: '**', redirectTo: '/products', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailComponent,
    CheckoutComponent,
    ProductListAdminComponent,
    ProductFormComponent,
    ProductCategoryAdminComponent,
    CategoryFormComponent,
    UpdateCategoryComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot()
  ],
  providers: [ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }