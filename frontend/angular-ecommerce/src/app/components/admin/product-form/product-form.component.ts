import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ToastrService } from 'ngx-toastr';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ProductCategoryService } from 'src/app/services/product-category.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {


  productForm: FormGroup;
  categories: ProductCategory[] = [];
  product: Product = new Product();

  errorResponse : HttpErrorResponse = undefined;
  errorMessage : number ;
  success: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private productService: ProductService,
    private categoryService: ProductCategoryService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      product: this.formBuilder.group({
        sku: [''],
        name: [''],
        category: [''],
        description: [''],
        unitPrice: [''],
        imageUrl: [''],
        unitsInStock: [''],

      })
    });

    this.categoryService.getProductCategories().subscribe(
      data => {
        console.log(JSON.stringify(data));
        this.categories = data

      }


    );
  }

  onSubmit() {
    console.log("CATEGORY ID = " + this.productForm.get('product').value.category.id);
    console.log("CATEGORY ID = " + this.productForm.get('product').value.category.categoryName);
    console.log("CATEGORY ID = " + this.productForm.get('product').value.name);
    console.log("CATEGORY ID = " + this.productForm.get('product').value.sku);
    console.log("Unit in stock = " + this.productForm.get('product').value.unitsInStock);
    this.product.name = this.productForm.get('product').value.name;
    this.product.sku = this.productForm.get('product').value.sku;
    this.product.category = `http://localhost:8080/category/${this.productForm.get('product').value.category.id}`;
    this.product.description = this.productForm.get('product').value.description;
    this.product.unitPrice = this.productForm.get('product').value.unitPrice;
    this.product.imageUrl = this.productForm.get('product').value.imageUrl;
    this.product.unitsInStock = this.productForm.get('product').value.unitsInStock;
    this.productService.addProducts(this.product).subscribe(
      data => console.log(data),
      error => {this.errorMessage = error.status

        if(this.errorMessage >= 400){
          this.success = false;
        }
         
        console.log(error)
      }
      
     
      

    
      );
      console.log("SUCCESS STATUS : " +this.success);
      console.log("Status Code :" + this.errorMessage);

      console.log("Error",this.errorMessage);
    
   
    

    console.log("Product = " + JSON.stringify(this.product));
    this.productForm.reset();


  }



  showToastr() {

    if(this.success){
      this.toastr.success("Saved Successfully");
    }else{
      this.toastr.error("Something went wrong");
    }
    
   


  }

}
