import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit {

  categoryForm: FormGroup;
  productCategory : ProductCategory = new ProductCategory();
  constructor(private formBuilder : FormBuilder,
    private productService: ProductService,
    private router:Router) { }

  ngOnInit(): void {

    this.categoryForm = this.formBuilder.group({
      category: this.formBuilder.group({
        categoryName: [''],
      })
    });


   
    
    console.log(this.categoryForm.value);
  }

  onSubmit(){

    this.productCategory.categoryName = this.categoryForm.get('category').value.categoryName;

    console.log(this.productCategory.categoryName);

    this.productService.addCategory(this.productCategory).subscribe();

    this.router.navigateByUrl('/admin/categories');
  }

}
