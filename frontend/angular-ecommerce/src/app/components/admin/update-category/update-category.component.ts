import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { ProductCategory } from 'src/app/common/product-category';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CartService } from 'src/app/services/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductCategoryService } from 'src/app/services/product-category.service';

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.css']
})
export class UpdateCategoryComponent implements OnInit {

  categoryForm: FormGroup;
  productCategory: ProductCategory;
  

  tempName: string = 'SSS';
  constructor(private categoryService: ProductCategoryService,
    private route:ActivatedRoute,
    private router:Router,
    private formBuilder: FormBuilder
   ) { }

  ngOnInit(): void {

   this.route.paramMap.subscribe(() => this.handleUpdate());
    
      this.categoryForm = this.formBuilder.group({
       
        category: this.formBuilder.group({
          categoryName: [''],
        })

        
      }
     );

  }

  onSubmit(){

    this.productCategory.id = this.route.snapshot.paramMap.get('id');
    this.productCategory.categoryName = this.categoryForm.get('category').value.categoryName;

    console.log("CATEGORY DETAILS : " + JSON.stringify(this.productCategory));
    this.categoryService.updateCategory(this.productCategory).subscribe(
      data => {console.log("Logging the update status : " + data)
    this.router.navigateByUrl('/admin/categories');
    }
    );
  }


  handleUpdate(){

    const categoryId: number = +this.route.snapshot.paramMap.get('id');

    this.categoryService.getProductCategory(categoryId).subscribe(data => {this.productCategory = data
    this.categoryForm.setValue({category :{
      categoryName : this.productCategory.categoryName
    }})
    });
  }










}


