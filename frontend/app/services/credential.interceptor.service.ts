import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { UserService } from './user.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
    constructor(private userService: UserService) { }
    public intercept(request: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
        // intercept http requests and add with credentials for cors
        const headers = request.headers
            .append('content-type', 'application/json')
            .append('Authorization', this.userService.getToken().toString());
        return handler.handle(request.clone({ headers, withCredentials: true }));
    }
}
