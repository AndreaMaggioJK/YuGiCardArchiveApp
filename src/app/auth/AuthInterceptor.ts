import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, from, of, switchMap, tap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

/**
 * Intercepts HTTP requests and adds the access token to the request headers.
 * If the request returns a 401 Unauthorized error, it attempts to refresh the access token and retries the request.
 * Handles errors and performs appropriate actions based on the response status.
 *
 * @param request The HTTP request being intercepted.
 * @param next The next HTTP handler in the chain.
 * @returns An Observable of the HTTP event.
 */  
intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  const accessToken = this.authService.getAccessToken();

  if (accessToken) {
    const modifiedRequest = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${accessToken}`)
    });

    return next.handle(modifiedRequest).pipe(
      catchError((error: any) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          this.authService.removeAccessToken();
          return from(this.authService.refreshToken()).pipe(
            switchMap(() => {
              return next.handle(this.addAccessTokenToRequest(request));
            }),
            catchError((refreshError) => {
              console.error('Error occurred during token refresh:', refreshError);
              alert('The session has expired');
              window.location.reload();
              return throwError(refreshError);
            })
          );
        }
        alert('Resfresh the page');
        window.location.reload();
        return throwError(error);
      })
    );
  }

  return next.handle(request);
}

/**
 * Adds the access token to the request headers.
 *
 * @param request The HTTP request to which the access token is added.
 * @returns The modified HTTP request with the access token.
 */
private addAccessTokenToRequest(request: HttpRequest<any>): HttpRequest<any> {
    const accessToken = this.authService.getAccessToken();
    if (accessToken) {
      return request.clone({
        headers: request.headers.set('Authorization', `Bearer ${accessToken}`)
      });
    }
    return request;
  }
}



export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];