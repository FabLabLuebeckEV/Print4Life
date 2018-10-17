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
  isOpen = false;
  constructor(private modalService: NgbModal, private userService: UserService, private router: Router) {
  }

  public showError(err: Error) {
    let secondButton;
    let modalRef;
    const okButton = new ModalButton('Ok', 'btn btn-primary', 'Ok');
    if (!this.isOpen) {
      if (err.hasOwnProperty('type') && err.type as ErrorType === ErrorType.TOKEN_EXPIRED as ErrorType) {
        this.userService.logout();
        this.router.navigate(['/']);
        modalRef = this._openMsgModal(`Error - ${err.status} - ${err.statusText}`, 'modal-header header-danger', err.stack,
          okButton, secondButton);
        this.isOpen = true;
        modalRef.result.then(() => {
          this.isOpen = false;
        });
      } else {
        if (err.hasOwnProperty('type') && err.type as ErrorType === ErrorType.USER_DEACTIVATED as ErrorType) {
          secondButton = new ModalButton('Send Activate Request', 'btn btn-success', 'Send Activate Request');
        }
        modalRef = this._openMsgModal(`Error - ${err.status} - ${err.statusText}`, 'modal-header header-danger', err.stack,
          okButton, secondButton);
        this.isOpen = true;
        modalRef.result.then((result) => {
          if (result === 'Send Activate Request') {
            this.userService.claimActivation(err.data.userId).then(() => {
              this._openMsgModal(`Activation Request sent!`, 'modal-header header-success',
                'An Admin was informed that you wish an activation of your user account!', okButton, undefined);
            });
          }
          this.isOpen = false;
        });
      }
    }
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
