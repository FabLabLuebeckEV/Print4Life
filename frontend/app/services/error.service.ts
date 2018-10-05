import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageModalComponent, ModalButton } from '../components/message-modal/message-modal.component';


export interface Error {
  status: Number;
  statusText: String;
  stack: String;
}
@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private modalService: NgbModal) {
  }

  public showError(err: Error) {
    const okButton = new ModalButton('Ok', 'btn btn-primary', 'Ok');
    this._openMsgModal(`Error - ${err.status} - ${err.statusText}`, 'modal-header header-danger', err.stack,
      okButton, undefined);
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
