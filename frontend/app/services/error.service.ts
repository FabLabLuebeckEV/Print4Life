import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageModalComponent, ModalButton } from '../components/message-modal/message-modal.component';
import { UserService } from './user.service';
import { Router } from '@angular/router';

export enum ErrorType {
  TOKEN_EXPIRED,
  USER_DEACTIVATED,
  UNAUTHORIZED,
  USERNAME_EXISTS,
  EMAIL_EXISTS
}

export interface Error {
  type: ErrorType;
  status: Number;
  statusText: String;
  stack: String;
  data: any;
}
@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private modalService: NgbModal, private userService: UserService, private router: Router) {
  }

  public showError(err: Error) {
    let secondButton;
    if (err.type && err.type as ErrorType === ErrorType.USER_DEACTIVATED as ErrorType) {
      secondButton = new ModalButton('Send Activate Request', 'btn btn-success', 'Send Activate Request');
    }
    const okButton = new ModalButton('Ok', 'btn btn-primary', 'Ok');
    this._openMsgModal(`Error - ${err.status} - ${err.statusText}`, 'modal-header header-danger', err.stack,
      okButton, secondButton).result.then((result) => {
        if (result === 'Send Activate Request') {
          this.userService.claimActivation(err.data.userId);
        } else if (err.type && err.type as ErrorType === ErrorType.TOKEN_EXPIRED as ErrorType) {
          this.userService.logout();
          this.router.navigate(['/']);
        }
      });
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
