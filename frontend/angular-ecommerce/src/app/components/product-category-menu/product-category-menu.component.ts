import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';
import { ProductCategoryService } from 'src/app/services/product-category.service';
import { LocalStorageService } from 'ngx-webstorage';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css']
})
export class ProductCategoryMenuComponent implements OnInit {

  hasRole : string [] = [];
  isAdmin : boolean = false;

  productCategories: ProductCategory[];
  constructor(private categoryService: ProductCategoryService,
    private authService : AuthService,
    )  { }

  ngOnInit(): void {
    this.listProductCategories();
  
    this.authService.hasRoles.subscribe((data : string [] ) => {

      this.hasRole = data;
      console.log("hasRoles : " , this.hasRole)
      if(this.hasRole !== null){
        if(this.hasRole.includes('ROLE_ADMIN')){
          this.isAdmin = true;
        }
      }
    });
  
    this.hasRole = this.authService.getRoles();

    if(this.hasRole !== null){
      if(this.hasRole.includes('ROLE_ADMIN')){
        this.isAdmin = true;
      }
    }
    console.log("IS ADMIN? " , this.isAdmin);
   

  
  
  }
  listProductCategories() {
    this.categoryService.getProductCategories().subscribe(
      data =>{
        console.log("Product Categories = " + JSON.stringify(data));
        this.productCategories = data;
      }
    )
  }

}
