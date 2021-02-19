import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/client/product-list/product-list.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ProductService } from './services/product.service';

import { Routes, RouterModule, Router } from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/client/product-details/product-details.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CartStatusComponent } from './components/client/cart-status/cart-status.component';
import { CartDetailComponent } from './components/client/cart-detail/cart-detail.component';
import { CheckoutComponent } from './components/client/checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductListAdminComponent } from './components/admin/product-list-admin/product-list-admin.component';
import { ProductFormComponent } from './components/admin/product-form/product-form.component';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ProductCategoryAdminComponent } from './components/admin/product-category-admin/product-category-admin.component';
import { CategoryFormComponent } from './components/admin/category-form/category-form.component';
import { UpdateCategoryComponent } from './components/admin/update-category/update-category.component';
import { LoginComponent } from './components/auth/login/login.component';
import { TokenInterceptor } from './TokenInterceptor';

import { NgxWebstorageModule } from 'ngx-webstorage';
import { HeaderComponent } from './components/header/header.component';
import { SignupComponent } from './components/auth/signup/signup.component';




//Adding routes to specific page
const routes: Routes = [
  { path: 'checkout', component: CheckoutComponent },
  { path: 'cart-details', component: CartDetailComponent },
  { path: 'admin/addProduct', component: ProductFormComponent },
  { path: 'admin/updateCategory', component: UpdateCategoryComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'admin/addCategory', component: CategoryFormComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  { path: 'admin/products', component: ProductListAdminComponent },
  { path: 'admin/categories', component: ProductCategoryAdminComponent },
  { path: 'search/:keyword', component: ProductListComponent },
  { path: 'category/:id', component: ProductListComponent },
  { path: 'category', component: ProductListComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'admin/categories/:id', component: UpdateCategoryComponent },
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: '**', redirectTo: '/products', pathMatch: 'full' }
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
    UpdateCategoryComponent,
    LoginComponent,
    HeaderComponent,
    SignupComponent


  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(),
    NgxWebstorageModule.forRoot(),

  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  },
  {
    provide: ToastrService, useClass: ToastrService
  }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
