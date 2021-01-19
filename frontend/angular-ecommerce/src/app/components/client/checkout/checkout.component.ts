import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/common/cart-item';
import { EcommerceFormService } from 'src/app/services/ecommerce-form.service';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CustomValidators } from 'src/app/validators/custom-validators';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Router } from '@angular/router';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { Address } from 'src/app/common/address';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  totalPrice: number = 0;
  totalQuantity: number = 0;
  cartItems: CartItem[] = [];

  checkoutFormGroup: FormGroup;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];



  constructor(private formBuilder: FormBuilder,
    private cartService: CartService,
    private ecommerceFormService: EcommerceFormService,
    private checkoutService: CheckoutService,
    private router: Router) { }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(3), CustomValidators.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(3), CustomValidators.notOnlyWhitespace]),
        email: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
          CustomValidators.notOnlyWhitespace

        ]),
      }),

      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(3), CustomValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(3), CustomValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(3), CustomValidators.notOnlyWhitespace]),

      }),


      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(3), CustomValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(3), CustomValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(3), CustomValidators.notOnlyWhitespace]),
      }),

      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(3), CustomValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: [''],
      })
    });

    this.listCartDetails();

    //populate credit card months

    const startMonth: number = new Date().getMonth() + 1;
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
        this.countries = data;
      }
    );
  }




  onSubmit() {
    console.log("Handing the submit data");

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    //set up order 
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    //get cart items
    const cartItems = this.cartService.cartItems;

    //create orderItems from cartItems
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    //set up purchase
    let purchase = new Purchase();

    //populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    //populate purchase - shipping address

    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));

    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;


    //populate purchase - billing address

    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));

    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;


    //populate purchase - order and orderItems

    purchase.order = order;
    purchase.orderItems = orderItems;

    //call REST API via the CheckoutService

    this.checkoutService.placeOrder(purchase).subscribe(data => {
      console.log("Successfully added a order.", data.orderTrackingNumber);
      this.resetCart();
    }, err => {
      console.log("Error occurred during the placement of order.", err.message);
    })




  }

  resetCart() {
    //reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    //reset the form data
    this.checkoutFormGroup.reset();

    //navigate back to the product page
    this.router.navigateByUrl('/products');
  }

  copyShippingToBilling(event) {

    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress
        .setValue(this.checkoutFormGroup.controls.shippingAddress.value);

      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls.billingAddress.reset();
      this.billingAddressStates = [];
    }

  }

  listCartDetails() {



    //subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    //subsribe to the cart totalQuantity

    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );


  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get("creditCard");

    const currentYear: number = new Date().getFullYear();

    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    //if the current year equals the selected year , then start with the current month

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
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

  //getter methods for customers
  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }


  //getter methods for shipping address
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }

  //getter methods for billing address
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingAddresStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }

  //getter methods for credit card
  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }

  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code :  ${countryCode}`);
    console.log(`${formGroupName} country name :  ${countryName}`);

    this.ecommerceFormService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }

        //select first item by default

        formGroup.get('state').setValue(data[0]);
      }
    );
  }


}
