import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';
import { ProductCategoryService } from 'src/app/services/product-category.service';

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css']
})
export class ProductCategoryMenuComponent implements OnInit {


  productCategories: ProductCategory[];
  constructor(private categoryService: ProductCategoryService) { }

  ngOnInit(): void {
    this.listProductCategories();
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
