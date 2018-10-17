import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { InputModalComponent } from 'frontend/app/components/input-modal/input-modal.component';
import { ModalButton, MessageModalComponent } from 'frontend/app/components/message-modal/message-modal.component';

@Component({
  selector: 'app-change-passwd-modal',
  templateUrl: './change-passwd-modal.component.html',
  styleUrls: ['./change-passwd-modal.component.css']
})
export class ChangePasswdModalComponent implements OnInit {
  private response: Object;
  private passwords = { oldPassword: '', password: '', password2: '' };
  @Input() userId: String;
  private translationFields = {
    title: '',
    labels: {
      oldPassword: '',
      password: '',
      password2: '',
    },
    modals: {
      title: '',
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

  async changePassword() {
    this.response = await this.userService.changePassword(this.userId, this.passwords.oldPassword, this.passwords.password);
    this.activeModal.close(this.response);
  }

  private _translate() {
    this.translateService.get(['changePasswdModal']).subscribe((translations => {
      if (translations && translations['changePasswdModal'] && translations['changePasswdModal'].title) {
        this.translationFields = {
          title: translations['changePasswdModal'].title,
          labels: {
            oldPassword: translations['changePasswdModal'].labels.oldPassword,
            password: translations['changePasswdModal'].labels.password,
            password2: translations['changePasswdModal'].labels.password2,
          },
          modals: {
            title: translations['changePasswdModal'].modals.title,
            buttonLabel: translations['changePasswdModal'].modals.buttonLabel,
            successHeader: translations['changePasswdModal'].modals.successHeader,
            successMessage: translations['changePasswdModal'].modals.successMessage,
            errorHeader: translations['changePasswdModal'].modals.errorHeader,
            errorMessage: translations['changePasswdModal'].modals.errorMessage
          }
        };
      }
    }));
  }
}
