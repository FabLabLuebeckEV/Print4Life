import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
    public intercept(request: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
        // intercept http requests and add with credentials for cors
        const headers = request.headers
            .append('content-type', 'application/json')
            .append('Authorization', 'Bearer bla'); // FIXME: Add correct user token from local storage
        return handler.handle(request.clone({ headers, withCredentials: true }));
    }
}
