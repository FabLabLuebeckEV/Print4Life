import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';

@Injectable()
export class CredentialsInterceptorService implements HttpInterceptor {
    public intercept(request: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
        // intercept http requests and add with credentials for cors
        return handler.handle(request.clone({ withCredentials: true }));
    }
}
