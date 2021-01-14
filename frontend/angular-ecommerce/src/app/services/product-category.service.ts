import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ProductCategory } from '../common/product-category';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {

  category: Subject<ProductCategory> = new Subject<ProductCategory>();

  private categoryUrl = 'http://localhost:8080/api/product-category';

  constructor(private httpClient: HttpClient) { }

  //Method for Error Handling
  private handleError(error: HttpErrorResponse) {
    // Return an observable with a user-facing error message.
    return throwError(error);
  }


  //getting a list of Product-Categories
  getProductCategories(): Observable<ProductCategory[]> {

    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }


  // getting single Product-Category
  getProductCategory(theCategoryId: number): Observable<ProductCategory> {

    //need to build URL based on product category id 
    const categoryUrl = `${this.categoryUrl}/${theCategoryId}`;

    return this.httpClient.get<ProductCategory>(categoryUrl);

  }

  // adding  category
  addCategory(theCategory: ProductCategory): Observable<ProductCategory> {

    return this.httpClient.post<ProductCategory>(this.categoryUrl, theCategory).pipe(catchError(this.handleError));

  }


  //updating cateogry details
  updateCategory(tempCategory: ProductCategory): Observable<ProductCategory> {

    //building URL based on category id
    const updateUrl = `${this.categoryUrl}/${tempCategory.id}`;
    return this.httpClient.put<ProductCategory>(updateUrl, tempCategory).pipe(catchError(this.handleError));

  }


  //deleting Category
  deleteCategory(theCategoryId: string): Observable<ProductCategory> {

    //building URL with category Id
    const deleteUrl: string = `${this.categoryUrl}/${theCategoryId}`;

    return this.httpClient.delete<ProductCategory>(deleteUrl).pipe(catchError(this.handleError));
  }

}


interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
