import { Component, OnInit } from '@angular/core';
import { UserService } from 'frontend/app/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { GenericService } from 'frontend/app/services/generic.service';
import { ConfigService } from 'frontend/app/config/config.service';
import { User } from 'frontend/app/models/user.model';
import { routes } from 'frontend/app/config/routes';
import { FablabService } from 'frontend/app/services/fablab.service';
import { ModalService } from '../../services/modal.service';
import { ModalButton } from '../../helper/modal.button';

import { TranslationModel } from '../../models/translation.model';
@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  private config: any;
  userIsLoggedIn: boolean;
  userIsAdmin: Boolean;
  editIcon: any;
  disableIcon: any;
  editLink: String;
  user: User = new User(
    undefined, undefined, '', '', undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);

  translationFields: TranslationModel.UserDetail;

  constructor(
    private route: ActivatedRoute,
    private modalService: ModalService,
    private genericService: GenericService,
    private translateService: TranslateService,
    private configService: ConfigService,
    private userService: UserService,
    private fablabService: FablabService
  ) {
    this.config = this.configService.getConfig();
    this.editIcon = this.config.icons.edit;
    this.disableIcon = this.config.icons.disable;
  }

  ngOnInit() {

    this.translateService.onLangChange.subscribe(() => {
      this._translate();
    });

    this.route.paramMap.subscribe(async params => {
      if (params && params.get('id')) {
        this.user = await this.userService.getProfile(params.get('id'));
        if (this.user.fablabId) {
          const result = await this.fablabService.getFablab(this.user.fablabId);
          if (result && result.fablab) {
            this.user['fablab'] = result.fablab;
          }
        }
        this._translate();
      }
      this.editLink = `/${routes.paths.frontend.users.root}/${routes.paths.frontend.users.update}/${this.user._id}/`;
    });
    this.userIsLoggedIn = this.userService.isLoggedIn();
    this.init();
  }

  async init() {
    this.userIsAdmin = await this.userService.isAdmin();
    this._translate();
  }

  private disable() {
    const deleteButton = new ModalButton(this.translationFields.modals.ok, 'btn btn-danger',
      this.translationFields.modals.deactivateReturnValue);
    const abortButton = new ModalButton(this.translationFields.modals.abort, 'btn btn-secondary',
      this.translationFields.modals.abortReturnValue);
    const modalRef = this.modalService.openMsgModal(this.translationFields.modals.deleteHeader,
      'modal-header header-danger',
      [`${this.translationFields.modals.deleteQuestion} ${this.user.username} ${this.translationFields.modals.deleteQuestion2}`],
      deleteButton, abortButton);
    modalRef.result.then((result) => {
      if (result === deleteButton.returnValue) {
        this.userService.deleteUser(this.user._id).then(() => {
          this.genericService.back();
        });
      }
    });
  }

  private _translateRole(): Promise<String> {
    return new Promise((resolve) => {
      this.translateService.get(['roles']).subscribe((translations) => {
        resolve(translations['roles'][`${this.user.role.role}`]);
      });
    });
  }

  private _translate() {
    this.translateService.get(['userDetail']).subscribe(translations => {
      if (this.user && this.user.role) {
        this._translateRole().then((shownRole) => {
          this.user['shownRole'] = shownRole;
        });
      }
      if (translations['userDetail'].labels && translations['userDetail'].modals && translations['userDetail'].badges) {
        this.translationFields = TranslationModel.translationUnroll(translations);
      }
    });
  }
}
