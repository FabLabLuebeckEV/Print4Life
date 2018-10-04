import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageModalComponent, ModalButton } from '../components/message-modal/message-modal.component';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
    constructor(private modalService: NgbModal) {

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
            const okButton = new ModalButton('Ok', 'btn btn-primary', 'Ok');
            switch (err.status) {
                case 401:
                case 403:
                    // console.log('handled error ' + err.status);
                    this._openMsgModal(`Error - ${err.status} - ${err.statusText}`, 'modal-header header-danger', err.error.error,
                        okButton, undefined);
                    return of(err.message);
                default:
                    throw Error;
            }
        }
        throw Error;
    }

    private _openMsgModal(title: String, titleClass: String, msg: String, button1: ModalButton, button2: ModalButton) {
        const modalRef = this.modalService.open(MessageModalComponent);
        modalRef.componentInstance.title = title;
        modalRef.componentInstance.titleClass = titleClass;
        modalRef.componentInstance.msg = msg;
        modalRef.componentInstance.button1 = button1;
        modalRef.componentInstance.button2 = button2;
        return modalRef;
    }
}
