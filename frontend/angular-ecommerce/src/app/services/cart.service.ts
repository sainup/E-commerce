import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  

  cartItems: CartItem[] = [];
  existingCartItem : CartItem = undefined;

  totalPrice : Subject<number> = new BehaviorSubject<number>(0) ;
  totalQuantity : Subject<number> = new BehaviorSubject<number>(0);

  constructor() { }
  

  addToCart(theCartItem: CartItem){

    //check if we already have the item in our cart
    let alreadyExistsInCart : boolean =false;
    

    if(this.cartItems.length > 0){
    //find the item in the cart based on item id

    this.existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);

    // check if we found it
      // console.log("Existing item :" , existingCartItem.name);
    alreadyExistsInCart = (this.existingCartItem !== undefined);
    }

    if(alreadyExistsInCart){

      //increment the quantity
      this.existingCartItem.quantity++;
    }else{
      this.cartItems.push(theCartItem);
    }
    
    console.log(this.cartItems);
    this.computeCartTotals();
    
    
  }
  computeCartTotals() {
  
    let totalPriceValue : number = 0;
    let totalQuantityValue : number =0;

    for(let currentCartItem of this.cartItems){
      totalPriceValue += currentCartItem.quantity*currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    //publish the new values ... all subscribers will receive the new data

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    //long cart data for debugging purposes

    this.logCartData(totalPriceValue,totalQuantityValue);
  }


  logCartData(totalPriceValue: number, totalQuantityValue: number) {
   
    for(let tempCartItem of this .cartItems){
      const subTotalPrice = tempCartItem.quantity*tempCartItem.unitPrice; 
    }
  }

  decrementFromCart(theCartItem: CartItem) {
    
    theCartItem.quantity--;
    if(theCartItem.quantity === 0){
      this.remove(theCartItem);
    }else{
      this.computeCartTotals();
    }
  }
  remove(theCartItem: CartItem) {
    //get the index of item in the array

    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id);
    //if found , remove the item from the array at the given index
    if(itemIndex > -1){
      this.cartItems.splice(itemIndex,1);
      this.computeCartTotals();
    }
  }
}
