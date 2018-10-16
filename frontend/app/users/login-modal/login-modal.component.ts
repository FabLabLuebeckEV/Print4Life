import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { InputModalComponent } from 'frontend/app/components/input-modal/input-modal.component';
import { ModalButton, MessageModalComponent } from 'frontend/app/components/message-modal/message-modal.component';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent implements OnInit {
  private response: Object;
  private loginData: Object = { username: '', password: '' };
  private translationFields = {
    title: '',
    labels: {
      username: '',
      password: '',
      login: '',
      resetPassword: ''
    },
    modals: {
      title: '',
      inputLabel: '',
      buttonLabel: '',
      successHeader: '',
      successMessage: '',
      errorHeader: '',
      errorMessage: ''
    }
  };

  constructor(
    private userService: UserService,
    private activeModal: NgbActiveModal,
    private translateService: TranslateService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.translateService.onLangChange.subscribe(() => {
      this._translate();
    });
    this._translate();
  }

  async login() {
    this.response = await this.userService.login(this.loginData);
    this.activeModal.close(this.response);
  }

  async resetPassword() {
    const modalRef = this.modalService.open(InputModalComponent);
    modalRef.componentInstance.title = this.translationFields.modals.title;
    modalRef.componentInstance.inputLabel = this.translationFields.modals.inputLabel;
    modalRef.componentInstance.button1 = new ModalButton(this.translationFields.modals.buttonLabel, 'btn btn-primary', 'Ok');
    modalRef.result.then((email) => {
      if (email && email !== 'dismiss') {
        this.userService.resetPassword({ email }).then(() => {
          const msgModalRef = this.modalService.open(MessageModalComponent);
          msgModalRef.componentInstance.title = this.translationFields.modals.successHeader;
          msgModalRef.componentInstance.titleClass = 'modal-header header-success';
          msgModalRef.componentInstance.msg = this.translationFields.modals.successMessage;
          msgModalRef.componentInstance.button1 = new ModalButton('OK', 'btn btn-primary', 'Ok');
        }).catch(() => {
          const msgModalRef = this.modalService.open(MessageModalComponent);
          msgModalRef.componentInstance.title = this.translationFields.modals.errorHeader;
          msgModalRef.componentInstance.titleClass = 'modal-header header-danger';
          msgModalRef.componentInstance.msg = this.translationFields.modals.errorMessage;
          msgModalRef.componentInstance.button1 = new ModalButton('OK', 'btn btn-primary', 'Ok');
        });
      }
    });
  }

  private _translate() {
    this.translateService.get(['loginModal']).subscribe((translations => {
      if (translations && translations['loginModal'] && translations['loginModal'].title) {
        this.translationFields = {
          title: translations['loginModal'].title,
          labels: {
            username: translations['loginModal'].labels.username,
            password: translations['loginModal'].labels.password,
            login: translations['loginModal'].labels.login,
            resetPassword: translations['loginModal'].labels.resetPassword
          },
          modals: {
            title: translations['loginModal'].modals.title,
            inputLabel: translations['loginModal'].modals.inputLabel,
            buttonLabel: translations['loginModal'].modals.buttonLabel,
            successHeader: translations['loginModal'].modals.successHeader,
            successMessage: translations['loginModal'].modals.successMessage,
            errorHeader: translations['loginModal'].modals.errorHeader,
            errorMessage: translations['loginModal'].modals.errorMessage
          }
        };
      }
    }));
  }
}
