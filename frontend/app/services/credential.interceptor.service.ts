import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { ErrorService } from './error.service';
import { UserService } from './user.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
    constructor(private errorService: ErrorService, private userService: UserService) {

    }
    public intercept(request: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
        // intercept http requests and add with credentials for cors
        let headers = request.headers;
        if (!request.url.includes('upload')) {
            headers = headers
                .append('content-type', 'application/json');
        }

        if (localStorage.getItem(this.userService.getLocalStorageTokenName())) {
            headers = headers.append('authorization', `${localStorage.getItem(this.userService.getLocalStorageTokenName())}`);
        }
        request = request.clone({ headers, withCredentials: false });
        return handler.handle(request).pipe(catchError((error, caught) => {
            this.handleError(error);
            return of(error);
        }) as any);
    }

    private handleError(err: HttpErrorResponse): Observable<any> {
        if (err.status && err.message) {
            switch (err.status) {
                case 400:
                case 401:
                case 403:
                    // console.log('handled error ' + err.status);
                    this.errorService.showError(
                        {
                            type: err.error.type,
                            status: err.status,
                            statusText: err.statusText,
                            stack: err.error.error,
                            data: err.error.data
                        });
                    return of(err.message);
                default:
                    throw Error;
            }
        }
        throw Error;
    }
}
