import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductCategoryService } from 'src/app/services/product-category.service';

@Component({
  selector: 'app-product-category-admin',
  templateUrl: './product-category-admin.component.html',
  styleUrls: ['./product-category-admin.component.css']
})
export class ProductCategoryAdminComponent implements OnInit {

   productCategory: ProductCategory [] = [] ;
    // new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 10;
  theTotalElements: number = 0;

  categoryForm : FormGroup;

  constructor(private formBuilder : FormBuilder,
    private categoryService : ProductCategoryService,
    private router: Router){
    
  }

  ngOnInit(): void {

    this.listCategories();

   
  }

  listCategories(){
     //getting product categories 
     this.categoryService.getProductCategories().subscribe(data => this.productCategory = data);
  }

  deleteCategory(theProductCategory : ProductCategory){
    console.log(theProductCategory.id);

    this.categoryService.deleteCategory(theProductCategory.id).subscribe((data) => {
      this.listCategories();
      console.log("Successfully deleted")
    },err =>{
      console.log("Error while deleting ")
    }
     
    );
    window.location.reload;
    this.router.navigateByUrl('/admin/categories');
  }

   confirtmation(theProductCategory : ProductCategory){
     const result : boolean = confirm(`Are you sure you want to delete ${theProductCategory.categoryName}?`);
     if(result){
       this.deleteCategory(theProductCategory);
     }
   }


  updateCategory(theProductCategory :ProductCategory){


    this.router.navigateByUrl(`admin/categories/${theProductCategory.id}`);
 
    this.categoryService.updateCategory(theProductCategory);
    

    

  }
}
