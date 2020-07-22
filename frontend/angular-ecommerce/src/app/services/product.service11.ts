import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {




  private baseUrl = "http://localhost:8080/api/products";
  private categoryUrl = "http://localhost:8080/api/product-category";


  constructor(private httpClient: HttpClient) { }


  //getting the product list based on category id
  getProductList(theCategoryId: number): Observable<Product[]> {

    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
    return this.getProducts(searchUrl);
  }

  getProductListPaginate(thePage:number, 
                        thePageSize:number,
                        theCategoryId:number): Observable<GetResponseProducts> {

    //need to build URL based on category id, page and size
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
                        + `&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductsList(): Observable<Product[]> {
    return this.getProducts(`${this.baseUrl}/?size=100`);
  }


  //searching the product with keyword
  searchProducts(theKeyword: string): Observable<Product[]> {

    const searchProductUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

    return this.getProducts(searchProductUrl);

  }


  //get one individual products
  getProduct(theProductId: number): Observable<Product> {
    const getProductUrl = `${this.baseUrl}/${theProductId}`;

    return this.httpClient.get<Product>(getProductUrl);
  }



  //helper method for searching products
  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  //getting data of ProductCategory
  getProductCategories(): Observable<ProductCategory[]> {

    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );

  }
}


//helper method for extracting data out of JSON of products
interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

//helper method for extracting data out of JSON of product-category
interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}

