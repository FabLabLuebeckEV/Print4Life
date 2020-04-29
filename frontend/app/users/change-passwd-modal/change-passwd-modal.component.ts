import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { TranslateService } from '@ngx-translate/core';

import { TranslationModel } from '../../models/translation.model';

@Component({
  selector: 'app-change-passwd-modal',
  templateUrl: './change-passwd-modal.component.html',
  styleUrls: ['./change-passwd-modal.component.css']
})
export class ChangePasswdModalComponent implements OnInit {
  private response: Object;
  passwords = { oldPassword: '', password: '', password2: '' };
  @Input() userId: String;
  translationFields: TranslationModel.ChangePasswdModal;

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

  closeModal(closeValue) {
    this.activeModal.close(closeValue);
  }

  private _translate() {
    this.translateService.get(['changePasswdModal']).subscribe((translations => {
      if (translations && translations['changePasswdModal'] && translations['changePasswdModal'].title) {
        this.translationFields = TranslationModel.translationUnroll(translations);
      }
    }));
  }
}
