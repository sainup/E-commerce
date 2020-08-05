import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Product } from '../common/product';
import { Observable, throwError, Subject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  category : Subject<ProductCategory> = new Subject<ProductCategory>();

  private baseUrl = 'http://localhost:8080/api/products';

  private categoryUrl = 'http://localhost:8080/api/product-category';

  constructor(private httpClient: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
      // Return an observable with a user-facing error message.
    return throwError(error);
  }


  updateCategory(currentProductCategory : ProductCategory){
    
    console.log(currentProductCategory.categoryName);
    this.category.next(currentProductCategory);

   
  }

  deleteCategory(theCategoryId : string) : Observable<ProductCategory>{

    const deleteUrl: string = `${this.categoryUrl}/${theCategoryId}`;
    console.log(deleteUrl);
    return this.httpClient.delete<ProductCategory>(deleteUrl).pipe(catchError(this.handleError));
  }
  addCategory(theCategory : ProductCategory) : Observable<ProductCategory>{

    return this.httpClient.post<ProductCategory>(this.categoryUrl,theCategory).pipe(catchError(this.handleError));

  }

  getProduct(theProductId: number): Observable<Product> {

    // need to build URL based on product id
    const productUrl = `${this.baseUrl}/${theProductId}`;

    return this.httpClient.get<Product>(productUrl);
  }

  getFullProductList(thePage: number, 
    thePageSize: number ) : Observable<GetResponseProducts>{

      const searchUrl = `${this.baseUrl}?page=${thePage}&size=${thePageSize}`;
     return this.httpClient.get<GetResponseProducts>(searchUrl);
  }


  //for pagination
  getProductListPaginate(thePage: number, 
                         thePageSize: number, 
                         theCategoryId: number): Observable<GetResponseProducts> {

    // need to build URL based on category id, page and size 
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
                    + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }


  getProductList(theCategoryId: number): Observable<Product[]> {

    // need to build URL based on category id 
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.getProducts(searchUrl);
  }

  searchProducts(theKeyword: string): Observable<Product[]> {

    // need to build URL based on the keyword 
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

    return this.getProducts(searchUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(map(response => response._embedded.products));
    
  }

  addProducts(product: Product) : Observable<Product> {
  
    console.log("at PRODUCT SAVE ");
    console.log("success" + JSON.stringify(product) );
      return this.httpClient.post<Product>(this.baseUrl,product).pipe(catchError(this.handleError));
      
      
      
      console.log("success" + JSON.stringify(product) );
  }

  getProductCategories(): Observable<ProductCategory[]> {

    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  searchProductsPaginate(thePage: number, 
    thePageSize: number, 
    theKeyword: string): Observable<GetResponseProducts> {

// need to build URL based on keyword, page and size 
const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
+ `&page=${thePage}&size=${thePageSize}`;

return this.httpClient.get<GetResponseProducts>(searchUrl);
}


}

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

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}