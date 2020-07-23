import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/common/cart-item';
import { EcommerceFormService } from 'src/app/services/ecommerce-form.service';
import { ɵELEMENT_PROBE_PROVIDERS__POST_R3__ } from '@angular/platform-browser';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  totalPrice : number = 0;
  totalQuantity: number = 0;
  cartItems: CartItem[] = [] ;

  checkoutFormGroup: FormGroup;

  creditCardYears:number[]=[];
  creditCardMonths:number[]=[];

  countries:Country[] = [];

  shippingAddressStates:State[] = [];
  billingAddressStates:State[] = [];



  constructor(private formBuilder: FormBuilder,
              private cartService: CartService,
              private ecommerceFormService: EcommerceFormService) { }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({
      customer:this.formBuilder.group({
        firstName:[''],
        lastName:[''],
        email:[''],
      }),

      shippingAddress: this.formBuilder.group({
        street:[''],
        city:[''],
        state:[''],
        country:[''],
        zipCode:[''],

      }),


      billingAddress: this.formBuilder.group({
        street:[''],
        city:[''],
        state:[''],
        country:[''],
        zipCode:[''],
      }),

      creditCard: this.formBuilder.group({
        cardType:[''],
        nameOnCard:[''],
        cardNumber:[''],
        securityCode:[''],
        expirationMonth:[''],
        expirationYear:[''],
      })
    });

    this.listCartDetails();

    //populate credit card months

    const startMonth: number = new Date().getMonth()+1;
    console.log("start month : " + startMonth);


    this.retrieveMonths(startMonth);

   

    //populate credit card years

    this.ecommerceFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card years : " + JSON.stringify(data));
        this.creditCardYears = data;
      }
      
    );
    

    //populate the countries

      this.ecommerceFormService.getCountries().subscribe(
        data => {
          console.log("Retrieved Countries : " + JSON.stringify(data));
          this.countries=data;
        }
      );
  }


 

  onSubmit(){
    console.log("Handing the submit data");
    console.log(this.checkoutFormGroup.get("customer").value);

    console.log("The Shipping address country is " + this.checkoutFormGroup.get('shippingAddress').value.country.name);
    console.log("The Shipping address state is " + this.checkoutFormGroup.get('shippingAddress').value.state.name);

   

  }

  copyShippingToBilling(event){

    if(event.target.checked){
      this.checkoutFormGroup.controls.billingAddress
      .setValue(this.checkoutFormGroup.controls.shippingAddress.value);

      this.billingAddressStates = this.shippingAddressStates;
    }else{
      this.checkoutFormGroup.controls.billingAddress.reset();
      this.billingAddressStates = [];
    }

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

  handleMonthsAndYears(){
    const creditCardFormGroup = this.checkoutFormGroup.get("creditCard");

    const currentYear: number = new Date().getFullYear();

    const selectedYear : number = Number(creditCardFormGroup.value.expirationYear);

    //if the current year equals the selected year , then start with the current month

    let startMonth:number;

    if(currentYear === selectedYear){
      startMonth = new Date().getMonth()+1;
    }
    else{
      startMonth =1;
    }
     this.retrieveMonths(startMonth);
      
    

  }

   //helper Method for Months
   private retrieveMonths(startMonth: number) {
    this.ecommerceFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months : " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }

  getStates(formGroupName : string){

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code :  ${countryCode}`);
    console.log(`${formGroupName} country name :  ${countryName}`);

    this.ecommerceFormService.getStates(countryCode).subscribe(
      data=>{
        if(formGroupName === 'shippingAddress'){
            this.shippingAddressStates = data;
        }else{
          this.billingAddressStates = data;
        }

        //select first item by default

        formGroup.get('state').setValue(data[0]);
      }
    );
  }


}
