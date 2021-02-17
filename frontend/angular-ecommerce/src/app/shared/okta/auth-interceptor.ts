import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { OktaAuthService } from "@okta/okta-angular";
import { from, Observable } from "rxjs";

@Injectable()
export class AuthInterceptor  implements HttpInterceptor{

    constructor(private oktaAuthService : OktaAuthService){

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return from(this.handleAccess(req,next));
    }

    private async handleAccess(req : HttpRequest<any>, next : HttpHandler) : Promise<HttpEvent<any>>{

        //only add an access token to whitelisted origins
        const allowedOrigins = ['http://localhost'];
        if(allowedOrigins.some(url => req.urlWithParams.includes(url))){
            const accessToken = await this.oktaAuthService.getAccessToken();
            req = req.clone({
                setHeaders : {
                    Authorization : 'Bearer ' + accessToken
                }
               
                
            });
        }

        return next.handle(req).toPromise();
    }


}
