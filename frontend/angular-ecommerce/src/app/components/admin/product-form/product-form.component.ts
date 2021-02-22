import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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

  errorResponse: HttpErrorResponse = undefined;
  errorMessage: number;
  success: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private productService: ProductService,
    private categoryService: ProductCategoryService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      
      product: this.formBuilder.group({
        sku: new FormControl('', [Validators.required, Validators.minLength(3)]),
        name: new FormControl('', [Validators.required, Validators.minLength(3)]),
        category: this.formBuilder.group({
          id: new FormControl(''),
          categoryName: new FormControl(''),
        }),
        description: [''],
        unitPrice: new FormControl('', [Validators.required]),
        imageUrl: new FormControl(''),
        unitsInStock: new FormControl(''),

      }),
    });

    this.categoryService.getProductCategories().subscribe(
      data => {
        console.log(JSON.stringify(data));
        this.categories = data

      }


    );
  }

  onSubmit() {

    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.saveProduct();

  }
  private saveProduct() {
    this.product.name = this.productForm.get('product').value.name;
    this.product.sku = this.productForm.get('product').value.sku;
    this.product.category = this.productForm.get('product').get('category').value;
    this.product.description = this.productForm.get('product').value.description;
    this.product.unitPrice = this.productForm.get('product').value.unitPrice;
    this.product.imageUrl = this.productForm.get('product').value.imageUrl;
    this.product.unitsInStock = this.productForm.get('product').value.unitsInStock;
    this.productService.addProducts(this.product).subscribe(
      (data) => {
        console.log(data);
        this.success = true;
        this.productForm.reset();
      },
      (error) => {
        this.success = false;
        console.log(error);
      });
  }

  //getter methods for Product

  get sku() {
    return this.productForm.get('product.sku');
  }

  get name() {
    return this.productForm.get('product.name');
  }

  get unitPrice () {
    return this.productForm.get('product.unitPrice');
  }

  showToastr() {

    if (this.success) {
      this.toastr.success("Saved Successfully");
    } else {
      this.toastr.error("Something went wrong");
    }




  }

}
