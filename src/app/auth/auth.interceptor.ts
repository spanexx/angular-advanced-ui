import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private tokenService: TokenService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      console.log('AuthInterceptor initialized');   

    const accessToken = this.tokenService.getAccessToken();
    console.log('Access Token:', accessToken);
    if (accessToken) {
      const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` }
      });
      return next.handle(authReq);
    }
    return next.handle(req);
  }
}
