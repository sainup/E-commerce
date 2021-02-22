import { HttpClient } from '@angular/common/http';
import { Injectable, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable, throwError } from 'rxjs';
import { map, repeat, tap } from 'rxjs/operators';
import { LoginRequestPayLoad } from '../components/auth/login/login-request.payload';
import { LoginResponse } from '../components/auth/login/login-response.payload';
import { SignupRequestPayLoad } from '../components/auth/signup/signup-request.payload';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 

  private authUrl = 'http://localhost:8080/api/auth/';
  @Output() loggedIn : EventEmitter<boolean> = new EventEmitter();
  @Output() username : EventEmitter<string> = new EventEmitter();
  @Output() hasRoles : EventEmitter<string[]> = new EventEmitter();

  private refreshTokenPayload = { 
    refreshToken: this.getRefreshToken(),
    username: this.getUserName()

  }

  constructor(private http : HttpClient, private localStorage : LocalStorageService) { }

  signup(signupRequestPayLoad : SignupRequestPayLoad) : Observable<any> {

    return this.http.post(`${this.authUrl}signup`, signupRequestPayLoad,{
      responseType: 'text'
    });
  }

  login(loginRequestPayload: LoginRequestPayLoad) : Observable<boolean> {
    return this.http.post<LoginResponse>(`${this.authUrl}login`, loginRequestPayload)
    .pipe(map(data => {
      console.log("LOGIN DATA : ", data )
      this.localStorage.store('authenticationToken', data.authenticationToken);
      this.localStorage.store('username',data.username);
      this.localStorage.store('refreshToken',data.refreshToken);
      this.localStorage.store('expiresAt',data.expiresAt);
      this.localStorage.store('roles',data.roles);
      this.loggedIn.emit(true);
      this.username.emit(data.username);
      this.hasRoles.emit(data.roles);
      return true;
    }));
  }

  refreshToken(){
    return this.http.post<LoginResponse>(`${this.authUrl}refresh/token`,
    this.refreshTokenPayload)
    .pipe(tap(response => {
      this.localStorage.store('authenticationToken', response.authenticationToken);
      this.localStorage.store('expiresAt',response.expiresAt);
    }))
  }

  logout() {
    this.http.post(`${this.authUrl}logout`,this.refreshTokenPayload ,
    {responseType : 'text'})
    .subscribe(data => {
      console.log(data);
    },err => {
      throwError(err);
    });

    this.localStorage.clear('authenticationToken');
    this.localStorage.clear('username');
    this.localStorage.clear('refreshToken');
    this.localStorage.clear('expiresAt');
    this.localStorage.clear('roles');

  }

  isLoggedIn() : boolean {
    return this.getJwtToken() !== null;
  }

  getJwtToken(){
    return this.localStorage.retrieve('authenticationToken');
  }

  getRefreshToken(){
    return this.localStorage.retrieve('refreshToken');
  }
  getUserName(){
    return this.localStorage.retrieve('username');
  }

  getRoles(){
    return this.localStorage.retrieve('roles');
  }
  
  getExpirationTime(){
    return this.localStorage.retrieve('expiresAt');
  }
}
