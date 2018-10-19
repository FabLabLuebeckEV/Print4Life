import { Component, OnInit } from '@angular/core';
import { UserService } from 'frontend/app/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericService } from 'frontend/app/services/generic.service';
import { ConfigService } from 'frontend/app/config/config.service';
import { User } from 'frontend/app/models/user.model';
import { ModalButton, MessageModalComponent } from 'frontend/app/components/message-modal/message-modal.component';
import { routes } from 'frontend/app/config/routes';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  private config: any;
  private userIsLoggedIn: boolean;
  private userIsAdmin: Boolean;
  editIcon: any;
  disableIcon: any;
  editLink: String;
  user: User = new User(undefined, undefined, '', '', undefined, undefined, undefined, undefined, undefined, undefined, undefined);

  translationFields = {
    labels: {
      username: '',
      firstname: '',
      lastname: '',
      email: '',
      address: {
        title: '',
        street: '',
        city: '',
        country: '',
        zipCode: ''
      },
      activated: '',
      role: '',
      preferredLanguage: ''
    },
    modals: {
      ok: '',
      abort: '',
      deactivateReturnValue: '',
      abortReturnValue: '',
      deleteHeader: '',
      deleteQuestion: '',
      deleteQuestion2: ''
    },
    badges: {
      active: '',
      inactive: ''
    }
  };

  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private genericService: GenericService,
    private translateService: TranslateService,
    private configService: ConfigService,
    private userService: UserService
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
    const modalRef = this._openMsgModal(this.translationFields.modals.deleteHeader,
      'modal-header header-danger',
      `${this.translationFields.modals.deleteQuestion} ${this.user.username} ${this.translationFields.modals.deleteQuestion2}`,
      deleteButton, abortButton);
    modalRef.result.then((result) => {
      if (result === deleteButton.returnValue) {
        this.userService.deleteUser(this.user._id).then(() => {
          this.genericService.back();
        });
      }
    });
  }

  private _openMsgModal(title: String, titleClass: String, msg: String, button1: ModalButton, button2: ModalButton) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.title = title;
    if (titleClass) {
      modalRef.componentInstance.titleClass = titleClass;
    }
    modalRef.componentInstance.msg = msg;
    modalRef.componentInstance.button1 = button1;
    modalRef.componentInstance.button2 = button2;
    return modalRef;
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
      this.translationFields = {
        labels: {
          username: translations['userDetail'].labels.username,
          firstname: translations['userDetail'].labels.firstname,
          lastname: translations['userDetail'].labels.lastname,
          email: translations['userDetail'].labels.email,
          address: {
            title: translations['userDetail'].labels.address.title,
            street: translations['userDetail'].labels.address.street,
            city: translations['userDetail'].labels.address.city,
            country: translations['userDetail'].labels.address.country,
            zipCode: translations['userDetail'].labels.address.zipCode
          },
          activated: translations['userDetail'].labels.activated,
          role: translations['userDetail'].labels.role,
          preferredLanguage: translations['userDetail'].labels.preferredLanguage,
        },
        modals: {
          ok: translations['userDetail'].modals.ok,
          abort: translations['userDetail'].modals.abort,
          deactivateReturnValue: translations['userDetail'].modals.deactivateReturnValue,
          abortReturnValue: translations['userDetail'].modals.abortReturnValue,
          deleteHeader: translations['userDetail'].modals.deleteHeader,
          deleteQuestion: translations['userDetail'].modals.deleteQuestion,
          deleteQuestion2: translations['userDetail'].modals.deleteQuestion2
        },
        badges: {
          active: translations['userDetail'].badges.active,
          inactive: translations['userDetail'].badges.inactive
        }
      };
    });
  }
}
