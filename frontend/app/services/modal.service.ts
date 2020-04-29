import { Injectable, Component } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { MessageModalComponent } from '../components/message-modal/message-modal.component';
import { GenericService } from './generic.service';
import { OctoprintModalComponent } from '../components/octoprint-modal/octoprint-modal.component';
import { ModalButton } from '../helper/modal.button';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private modalService: NgbModal, private genericService: GenericService) { }

  public openMsgModal(title: String, titleClass: String, messages: Array<String>,
    button1: ModalButton, button2: ModalButton, link?: String) {
    const modalRef = this.modalService.open(MessageModalComponent, { backdrop: 'static' });
    modalRef.componentInstance.title = title;
    if (titleClass) {
      modalRef.componentInstance.titleClass = titleClass;
    }
    modalRef.componentInstance.messages = messages;
    modalRef.componentInstance.button1 = button1;
    modalRef.componentInstance.button2 = button2;
    if (link) {
      modalRef.componentInstance.link = link;
    }
    return modalRef;
  }

  public openOctoprintModal(title: String, titleClass: String, addressLabel: String,
    apiKeyLabel: String, fileSelectLabel: String, selectItems: Array<any>, button1: ModalButton, button2: ModalButton) {
    const modalRef = this.modalService.open(OctoprintModalComponent, { backdrop: 'static' });
    modalRef.componentInstance.title = title;
    if (titleClass) {
      modalRef.componentInstance.titleClass = titleClass;
    }
    modalRef.componentInstance.addressLabel = addressLabel;
    modalRef.componentInstance.apiKeyLabel = apiKeyLabel;
    modalRef.componentInstance.fileSelectLabel = fileSelectLabel;
    modalRef.componentInstance.selectItems = selectItems;
    modalRef.componentInstance.button1 = button1;
    modalRef.componentInstance.button2 = button2;
  }

  public open(comp: any, settings: NgbModalOptions) {
    return this.modalService.open(comp, settings);
  }

  public openSuccessMsg(okLabel: String, okReturnValue: String, successHeader: String, successMessage: String, ) {
    const okButton = new ModalButton(okLabel, 'btn btn-primary', okReturnValue);
    this.openMsgModal(successHeader, 'modal-header header-success',
      [successMessage], okButton, undefined).result.then(() => {
        this.genericService.back();
      });
  }

  public openErrMsg(errHeader: String, errMessage: String, okLabel: String, okReturnValue: String) {
    const okButton = new ModalButton(okLabel, 'btn btn-primary', okReturnValue);
    this.openMsgModal(errHeader, 'modal-header header-danger', [errMessage],
      okButton, undefined);
  }
}
