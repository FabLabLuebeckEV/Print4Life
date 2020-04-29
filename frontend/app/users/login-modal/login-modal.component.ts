import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { InputModalComponent } from 'frontend/app/components/input-modal/input-modal.component';
import { MessageModalComponent } from 'frontend/app/components/message-modal/message-modal.component';
import { ModalButton } from '../../helper/modal.button';
import { Router } from '@angular/router';
import { routes } from '../../config/routes';

import { TranslationModel } from '../../models/translation.model';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent implements OnInit {
  response: Object;
  loginData = { username: '', password: '' };
  translationFields: TranslationModel.LoginModal;

  constructor(
    private userService: UserService,
    private activeModal: NgbActiveModal,
    private translateService: TranslateService,
    private modalService: NgbModal,
    private router: Router
  ) { }

  ngOnInit() {
    this.translateService.onLangChange.subscribe(() => {
      this._translate();
    });
    this._translate();
  }

  async login() {
    try {
      this.response = await this.userService.login(this.loginData);
      this.activeModal.close(this.response);
      this.router.navigate([`/${routes.paths.frontend.orders.root}/${routes.paths.frontend.orders.myOrders}`]);
    } catch (err) {
      this.activeModal.close(err);
    }
  }

  async resetPassword() {
    const modalRef = this.modalService.open(InputModalComponent, { backdrop: 'static' });
    modalRef.componentInstance.title = this.translationFields.modals.title;
    modalRef.componentInstance.inputLabel = this.translationFields.modals.inputLabel;
    modalRef.componentInstance.button1 = new ModalButton(this.translationFields.modals.buttonLabel, 'btn btn-primary', 'Ok');
    modalRef.result.then((email) => {
      if (email && email !== 'dismiss') {
        this.userService.resetPassword({ email }).then(() => {
          const msgModalRef = this.modalService.open(MessageModalComponent, { backdrop: 'static' });
          msgModalRef.componentInstance.title = this.translationFields.modals.successHeader;
          msgModalRef.componentInstance.titleClass = 'modal-header header-success';
          msgModalRef.componentInstance.messages = [this.translationFields.modals.successMessage];
          msgModalRef.componentInstance.button1 = new ModalButton('OK', 'btn btn-primary', 'Ok');
        }).catch(() => {
          const msgModalRef = this.modalService.open(MessageModalComponent, { backdrop: 'static' });
          msgModalRef.componentInstance.title = this.translationFields.modals.errorHeader;
          msgModalRef.componentInstance.titleClass = 'modal-header header-danger';
          msgModalRef.componentInstance.messages = [this.translationFields.modals.errorMessage];
          msgModalRef.componentInstance.button1 = new ModalButton('OK', 'btn btn-primary', 'Ok');
        });
      }
    });
  }

  public closeModal(closeValue) {
    this.activeModal.close(closeValue);
  }

  private _translate() {
    this.translateService.get(['loginModal']).subscribe((translations => {
      if (translations && translations['loginModal'] && translations['loginModal'].title) {
        this.translationFields = TranslationModel.translationUnroll(translations);
      }
    }));
  }
}
