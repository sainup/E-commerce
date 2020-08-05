import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { ProductCategory } from 'src/app/common/product-category';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.css']
})
export class UpdateCategoryComponent implements OnInit {

  categoryForm: FormGroup;
  productCategory:any;

  tempName : String ="";
  constructor(private productService: ProductService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.productService.category.subscribe(
      data => {
        this.tempName = data.categoryName;
        // this.populate(this.productCategory);

        console.log("from DATA " + this.productCategory.categoryName);

      });


    this.categoryForm = this.formBuilder.group({
      category: this.formBuilder.group({
        categoryName: [''],
      })
    });


    this.populate();





    console.log("ON IT " + this.tempName);


  }

  populate() {


    this.categoryForm.patchValue({
      category: {
        categoryName: 'anup'
      }
    });



  





  }

}
