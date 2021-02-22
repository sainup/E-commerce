import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-detail',
  templateUrl: './cart-detail.component.html',
  styleUrls: ['./cart-detail.component.css']
})
export class CartDetailComponent implements OnInit {

  cartItems: CartItem[] = [] ;
  isDisabled : boolean = false;
  totalPrice : number = 0;
  totalQuantity:number = 0;
  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails() {
    
    // get a handle to the cart items
    this.cartItems = this.cartService.cartItems;

    //subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    //subsribe to the cart totalQuantity

    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    //compute cart total price and quantity

    this.cartService.computeCartTotals();

  }

  incrementQuantity(theCartItem: CartItem){
  
    
    this.cartService.addToCart(theCartItem);
  }

  decrementQuantity(theCartItem : CartItem){
      if(theCartItem.quantity <= 1){
        return;
      }else{
       
        console.log(this.isDisabled)
        this.cartService.decrementFromCart(theCartItem);
      }
      
     
   
   
  }

  remove(theCartItem : CartItem){
    this.cartService.remove(theCartItem);
  }

}
