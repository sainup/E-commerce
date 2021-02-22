import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { SignupRequestPayLoad } from './signup-request.payload';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm : FormGroup;
  signupRequestPayload : SignupRequestPayLoad;

  constructor(private authService : AuthService,
    private router : Router,
    private toastr : ToastrService) {

      this.signupRequestPayload = {
        username : '',
        email : '' ,
        password  : ''
      };
     }

  ngOnInit(): void {

    this.signupForm = new FormGroup ( {
      username :new FormControl('', Validators.required),
      email : new FormControl('', Validators.required),
      password : new FormControl('', Validators.required)
    });
  }

  signup(){
    this.signupRequestPayload.username = this.signupForm.get('username').value;
    this.signupRequestPayload.email = this.signupForm.get('email').value;
    this.signupRequestPayload.password = this.signupForm.get('password').value;

    this.authService.signup(this.signupRequestPayload)
    .subscribe(()=> {
     console.log("Signup Successful")
     this.router.navigateByUrl("/login")
     this.toastr.success("Registration Successful!")
    }, () => {
      this.toastr.error("Registration Failed! Please try again");
    })

  }

}
