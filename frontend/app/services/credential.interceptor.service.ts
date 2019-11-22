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
        if (!request.url.includes('files') || request.method !== 'POST') {
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
        let stackMessage = '';
        if (err.status === 406) {
            // Dont show error messages, as this message is handled separately
            throw err;
        }
        if (err.status && err.message) {
            stackMessage = '';
            if (err && err.error && err.error.error) {
                stackMessage = err.error.error;
            } else if (err && err.error && err.error.stack && err.error.stack.message) {
                stackMessage = err.error.stack.message;
            } else if (err && err.error && err.error.message) {
                stackMessage = err.error.message;
            }

            this.errorService.showError(
                {
                    type: err.error.type,
                    status: err.status,
                    statusText: err.statusText,
                    stack: stackMessage,
                    data: err.error.data
                });
            throw err;
        }
        throw err;
    }
}
