import { Component, OnInit } from '@angular/core';
import { User, Address, Role } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageModalComponent, ModalButton } from '../../components/message-modal/message-modal.component';
import { routes } from '../../config/routes';
import { TranslateService } from '@ngx-translate/core';
import { GenericService } from '../../services/generic.service';
import { FablabService } from 'frontend/app/services/fablab.service';
import { ChangePasswdModalComponent } from '../change-passwd-modal/change-passwd-modal.component';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  loadingRoles: Boolean = false;
  validRoles: Array<String> = [];

  editView: Boolean;
  userId: String;
  isAdmin: Boolean;
  loadingFablabs: Boolean;
  fablabs: Array<any>;

  address: Address = new Address(undefined, undefined, undefined, undefined);
  role: Role = new Role('user'); // default on register is user
  user: User = new User(undefined, undefined, undefined, undefined, undefined, undefined, undefined, this.address, this.role, false);
  translationFields = {
    title: '',
    shownRoles: [],
    labels: {
      username: '',
      firstName: '',
      secondName: '',
      password: '',
      passwordValidation: '',
      email: '',
      role: '',
      isActivated: '',
      street: '',
      zipCode: '',
      city: '',
      country: '',
      submit: '',
      fablab: '',
      changePassword: '',
    },
    modals: {
      ok: '',
      okReturnValue: '',
      successHeader: '',
      successMessage: '',
      errorHeader: '',
      errorMessage: '',
      updatePasswordSuccessHeader: '',
      updatePasswordSuccess: '',
      updatePasswordErrorHeader: '',
      updatePasswordError: ''
    },
    messages: {
      username: '',
      firstName: '',
      secondName: '',
      password: '',
      passwordValidation: '',
      passwordValidationWrong: '',
      email: '',
      role: '',
      street: '',
      zipCode: '',
      city: '',
      country: '',
      notAssigned: ''
    },
    buttons: {
      activatedTrue: '',
      activatedFalse: '',
      changePassword: ''
    }
  };

  constructor(
    private userService: UserService,
    private router: Router,
    private location: Location,
    private modalService: NgbModal,
    private translateService: TranslateService,
    private genericService: GenericService,
    private route: ActivatedRoute,
    private fablabService: FablabService
  ) {
    this.router.events.subscribe(() => {
      const route = this.location.path();
      this.editView = route.indexOf(`${routes.paths.frontend.users.root}/${routes.paths.frontend.users.update}`) >= 0;
    });
    this.route.params.subscribe(params => {
      if (params.id) {
        this.userId = params.id;
      }
    });
  }

  async ngOnInit() {
    this.loadingFablabs = true;
    await this._loadRoles();
    await this._initializeUser(this.userId);
    this._loadFablabs();
    this.isAdmin = await this.userService.isAdmin();
    this._translate();
    this.translateService.onLangChange.subscribe(() => {
      this._translate();
    });
  }

  onSubmit() {
    const userCopy = JSON.parse(JSON.stringify(this.user));
    this.translateService.get(['roles']).subscribe((translations => {
      this.validRoles.forEach((role) => {
        const translated = translations['roles'][`${role}`];
        if (translated) {
          if (userCopy['shownRole'] === translated) {
            userCopy.role = new Role(role);
          }
        }
      });
      if (!userCopy.address || !userCopy.address.city || !userCopy.address.country
        || !userCopy.address.street || !userCopy.address.zipCode) {
        delete userCopy.address;
      }
      if (this.editView) {
        this.userService.updateUser(userCopy)
          .then(res => {
            if (res) {
              this._openSuccessMsg();
            }
          })
          .catch(err => {
            const errorMsg = this.translationFields.modals.errorMessage;
            const okButton = new ModalButton(this.translationFields.modals.ok, 'btn btn-primary', this.translationFields.modals.ok);
            this._openMsgModal(this.translationFields.modals.errorHeader, 'modal-header header-danger', errorMsg, okButton, undefined);
          });
      } else {
        this.userService.createUser(userCopy)
          .then(res => {
            this._openSuccessMsg();
          })
          .catch(err => {
            const errorMsg = this.translationFields.modals.errorMessage;
            const okButton = new ModalButton(this.translationFields.modals.ok, 'btn btn-primary', this.translationFields.modals.ok);
            this._openMsgModal(this.translationFields.modals.errorHeader, 'modal-header header-danger', errorMsg, okButton, undefined);
          });
      }
    }));
  }

  // Event handler

  async roleChanged(role) {
    this.user['shownRole'] = role;
    role = await this._translateRole(this.user['shownRole']);
    this.user.role.role = role;
  }

  // Private Functions

  private async _loadFablabs() {
    try {
      this.fablabs = (await this.fablabService.getFablabs()).fablabs;
    } finally {
      this.loadingFablabs = false;
    }
  }

  private async _initializeUser(id) {
    if (id !== undefined) {
      this.user = await this.userService.getProfile(id);
      this.user.address = this.user.hasOwnProperty('address') ? this.user.address : this.address;
      this.user.role = this.user.hasOwnProperty('role') ? this.user.role : this.role;
    }
  }
  private async _loadRoles() {
    this.loadingRoles = true;
    this.validRoles = (await this.userService.getRoles()).roles;
    this.loadingRoles = false;
  }

  private _openSuccessMsg() {
    const okButton = new ModalButton(this.translationFields.modals.ok, 'btn btn-primary', this.translationFields.modals.okReturnValue);
    this._openMsgModal(this.translationFields.modals.successHeader, 'modal-header header-success',
      this.translationFields.modals.successMessage, okButton, undefined).result.then((result) => {
        this.genericService.back();
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

  private _translateRole(role): Promise<String> {
    return new Promise((resolve) => {
      this.translateService.get(['roles']).subscribe((translations) => {
        let retStatus;
        // translation to origin
        this.validRoles.forEach((vRole) => {
          const r = translations['roles'][`${vRole}`];
          if (r) {
            if (role === r) {
              retStatus = vRole;
            }
          }
        });
        // origin to translation
        if (!retStatus) {
          retStatus = translations['roles'][`${role}`];
        }
        resolve(retStatus);
      });
    });
  }

  private _changePassword() {
    const modalRef = this.modalService.open(ChangePasswdModalComponent);
    modalRef.componentInstance.userId = this.user._id;
    modalRef.result.then((result) => {
      if (result.msg) {
        this._openSuccessMsg();
      }
    }).catch((err) => {
      const okButton = new ModalButton(this.translationFields.modals.ok, 'btn btn-primary', this.translationFields.modals.okReturnValue);
      this._openMsgModal(this.translationFields.modals.errorHeader, 'modal-header header-danger', err, okButton, undefined);
    });
  }

  private _translate() {
    this.translateService.get(['userForm', 'roles']).subscribe((translations => {
      const shownRoles = [];
      this.validRoles.forEach((role) => {
        const translated = translations['roles'][`${role}`];
        if (translated) {
          shownRoles.push(translated);
        }
      });

      if (this.user && this.user.role && this.user.role.role) {
        this._translateRole(this.user.role.role).then((shownRole) => {
          this.user['shownRole'] = shownRole;
        }).catch((error) => {
          console.log(error);
        });
      }

      this.translationFields = {
        title: !this.editView
          ? translations['userForm'].createTitle
          : translations['userForm'].editTitle,
        shownRoles: shownRoles,
        labels: {
          username: translations['userForm'].labels.username,
          firstName: translations['userForm'].labels.firstName,
          secondName: translations['userForm'].labels.secondName,
          password: translations['userForm'].labels.password,
          passwordValidation: translations['userForm'].labels.passwordValidation,
          email: translations['userForm'].labels.email,
          role: translations['userForm'].labels.role,
          isActivated: translations['userForm'].labels.isActivated,
          street: translations['userForm'].labels.street,
          zipCode: translations['userForm'].labels.zipCode,
          city: translations['userForm'].labels.city,
          country: translations['userForm'].labels.country,
          submit: !this.editView
            ? translations['userForm'].labels.createSubmit
            : translations['userForm'].labels.editSubmit,
          fablab: translations['userForm'].labels.fablab,
          changePassword: translations['userForm'].labels.changePassword
        },
        modals: {
          ok: translations['userForm'].modals.ok,
          okReturnValue: translations['userForm'].modals.okReturnValue,
          successHeader: this.editView
            ? translations['userForm'].modals.updateSuccessHeader
            : translations['userForm'].modals.createSuccessHeader,
          successMessage: this.editView
            ? translations['userForm'].modals.updateSuccess
            : translations['userForm'].modals.createSuccess,
          errorHeader: translations['userForm'].modals.errorHeader,
          errorMessage: this.editView
            ? translations['userForm'].modals.updateError
            : translations['userForm'].modals.createError,
          updatePasswordSuccessHeader: translations['userForm'].modals.updatePasswordSuccessHeader,
          updatePasswordSuccess: translations['userForm'].modals.updatePasswordSuccess,
          updatePasswordErrorHeader: translations['userForm'].modals.updatePasswordErrorHeader,
          updatePasswordError: translations['userForm'].modals.updatePasswordError
        },
        messages: {
          username: translations['userForm'].messages.username,
          firstName: translations['userForm'].messages.firstName,
          secondName: translations['userForm'].messages.secondName,
          password: translations['userForm'].messages.password,
          passwordValidation: translations['userForm'].messages.passwordValidation,
          passwordValidationWrong: translations['userForm'].messages.passwordValidationWrong,
          email: translations['userForm'].messages.email,
          role: translations['userForm'].messages.role,
          street: translations['userForm'].messages.street,
          zipCode: translations['userForm'].messages.zipCode,
          city: translations['userForm'].messages.city,
          country: translations['userForm'].messages.country,
          notAssigned: translations['userForm'].messages.notAssigned
        },
        buttons: {
          activatedTrue: translations['userForm'].buttons.activatedTrue,
          activatedFalse: translations['userForm'].buttons.activatedFalse,
          changePassword: translations['userForm'].buttons.changePassword
        }
      };
    }));
  }
}
