import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { ErrorService } from './error.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
    constructor(private errorService: ErrorService) {

    }
    public intercept(request: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
        // intercept http requests and add with credentials for cors
        let headers = request.headers
            .append('content-type', 'application/json');
        if (localStorage.getItem('orderManagementJWTToken')) {
            headers = headers.append('Authorization', `${localStorage.getItem('orderManagementJWTToken')}`);
        }
        return handler.handle(request.clone({ headers, withCredentials: true })).pipe(catchError((error, caught) => {
            this.handleError(error);
            return of(error);
        }) as any);
    }

    private handleError(err: HttpErrorResponse): Observable<any> {
        if (err.status && err.message) {
            switch (err.status) {
                case 401:
                case 403:
                    // console.log('handled error ' + err.status);
                    this.errorService.showError({ status: err.status, statusText: err.statusText, stack: err.error.error });
                    return of(err.message);
                default:
                    throw Error;
            }
        }
        throw Error;
    }
}
