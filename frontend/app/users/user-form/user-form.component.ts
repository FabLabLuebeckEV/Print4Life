import { Component, OnInit } from '@angular/core';
import { User, Role, Language } from '../../models/user.model';
import { Address } from '../../models/address.model';
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

interface Dropdown {
  name: String;
  elements: Array<Object>;
}

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  loadingRoles: Boolean = false;
  validRoles: Array<String> = [];

  loadingLanguages: Boolean = false;
  validLanguages: Array<String> = [];

  editView: Boolean;
  profileView: Boolean;
  userId: String;
  isAdmin: Boolean;
  loadingFablabs: Boolean;
  fablabs: Array<any>;
  loggedInUser: User;

  address: Address = new Address(undefined, undefined, undefined, undefined);
  role: Role = new Role('user'); // default on register is user
  preferredLanguage = new Language('en'); // default en/english
  user: User = new User(
    undefined, undefined, undefined, undefined,
    undefined, undefined, undefined, this.address,
    this.role, this.preferredLanguage, false, undefined);
  translationFields = {
    title: '',
    shownRoles: [],
    shownLanguages: [],
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
      preferredLanguage: ''
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
      notAssigned: '',
      preferredLanguage: ''
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
    this.router.events.subscribe(async () => {
      const route = this.location.path();
      this.editView = route.indexOf(`${routes.paths.frontend.users.root}/${routes.paths.frontend.users.update}`) >= 0;
      this.profileView = route.indexOf(`${routes.paths.frontend.users.root}/${routes.paths.frontend.users.profile}`) >= 0;
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
    await this._loadLanguages();
    this.loggedInUser = await this.userService.getUser();
    if (this.profileView) {
      this.user = this.loggedInUser;
      if (!this.user.hasOwnProperty('address')) {
        this.user.address = new Address('', '', '', '');
      }
    } else {
      await this._initializeUser(this.userId);
    }
    this._loadFablabs();
    this.isAdmin = await this.userService.isAdmin();
    this._translate();
    this.translateService.onLangChange.subscribe(() => {
      this._translate();
    });
  }

  onSubmit() {
    const userCopy = JSON.parse(JSON.stringify(this.user));
    this.translateService.get(['roles', 'languages']).subscribe((translations => {
      this.validLanguages.forEach(lang => {
        const translated = translations['languages'][`${lang}`];
        if (translated) {
          if (userCopy['shownRole'] === translated) {
            userCopy.preferredLanguage = new Language(lang);
          }
        }
      });
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
      if (this.editView || this.profileView) {
        this.userService.updateUser(userCopy)
          .then(async res => {
            if (res && res.user) {
              if (this.loggedInUser._id === userCopy._id) {
                this.translateService.use(res.user.preferredLanguage.language).toPromise().then(() => {
                  this.userService.resetLocalUser();
                  this._openSuccessMsg();
                }).catch((err) => {
                  const errorMsg = this.translationFields.modals.errorMessage;
                  const okButton = new ModalButton(this.translationFields.modals.ok, 'btn btn-primary', this.translationFields.modals.ok);
                  this._openMsgModal(this.translationFields.modals.errorHeader,
                    'modal-header header-danger', [errorMsg], okButton, undefined);
                });
              } else {
                this._openSuccessMsg();
              }
            }
          })
          .catch(err => {
            const errorMsg = this.translationFields.modals.errorMessage;
            const okButton = new ModalButton(this.translationFields.modals.ok, 'btn btn-primary', this.translationFields.modals.ok);
            this._openMsgModal(this.translationFields.modals.errorHeader, 'modal-header header-danger', [errorMsg], okButton, undefined);
          });
      } else {
        this.userService.createUser(userCopy)
          .then(res => {
            if (res) {
              this._openSuccessMsg();
            }
          })
          .catch(err => {
            const errorMsg = this.translationFields.modals.errorMessage;
            const okButton = new ModalButton(this.translationFields.modals.ok, 'btn btn-primary', this.translationFields.modals.ok);
            this._openMsgModal(this.translationFields.modals.errorHeader, 'modal-header header-danger', [errorMsg], okButton, undefined);
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

  async languageChanged(language) {
    this.user['shownLanguage'] = language;
    language = await this._translateLanguage(this.user['shownLanguage']);
    this.user.preferredLanguage.language = language;
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
      try {
        this.user = await this.userService.getProfile(id);
        this.user.address = this.user.hasOwnProperty('address') ? this.user.address : this.address;
        this.user.role = this.user.hasOwnProperty('role') ? this.user.role : this.role;
        this.user.preferredLanguage = this.user.hasOwnProperty('preferredLanguage') ? this.user.preferredLanguage : this.preferredLanguage;
      } catch (err) {
        this.user = new User(
          undefined, undefined, undefined, undefined,
          undefined, undefined, undefined, this.address,
          this.role, this.preferredLanguage, false, undefined);
      }
    }
  }

  private async _loadRoles() {
    this.loadingRoles = true;
    this.validRoles = (await this.userService.getRoles()).roles;
    this.loadingRoles = false;
  }

  private async _loadLanguages() {
    this.loadingLanguages = true;
    this.validLanguages = (await this.userService.getLanguages()).languages;
    // FIXME: Remove filter if dk is implemented
    this.validLanguages = this.validLanguages.filter((lang) => {
      return lang !== 'dk';
    });
    this.loadingLanguages = false;
  }

  private _openSuccessMsg() {
    const okButton = new ModalButton(this.translationFields.modals.ok, 'btn btn-primary', this.translationFields.modals.okReturnValue);
    this._openMsgModal(this.translationFields.modals.successHeader, 'modal-header header-success',
      [this.translationFields.modals.successMessage], okButton, undefined).result.then((result) => {
        this.genericService.back();
      });
  }

  private _openMsgModal(title: String, titleClass: String, messages: Array<String>, button1: ModalButton, button2: ModalButton) {
    const modalRef = this.modalService.open(MessageModalComponent, { backdrop: 'static' });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.titleClass = titleClass;
    modalRef.componentInstance.messages = messages;
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

  private _translateLanguage(language): Promise<String> {
    return new Promise((resolve) => {
      this.translateService.get(['languages']).subscribe((translations) => {
        let retStatus;
        // translation to origin
        this.validLanguages.forEach((vLang) => {
          const l = translations['languages'][`${vLang}`];
          if (l) {
            if (language === l) {
              retStatus = vLang;
            }
          }
        });
        // origin to translation
        if (!retStatus) {
          retStatus = translations['languages'][`${language}`];
        }
        resolve(retStatus);
      });
    });
  }

  private _changePassword() {
    const modalRef = this.modalService.open(ChangePasswdModalComponent, { backdrop: 'static' });
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
    this.translateService.get(['userForm', 'roles', 'languages', 'address']).subscribe((translations => {
      const shownRoles = [];
      this.validRoles.forEach((role) => {
        const translated = translations['roles'][`${role}`];
        if (translated) {
          shownRoles.push(translated);
        }
      });

      const shownLanguages = [];
      this.validLanguages.forEach(lang => {
        const translated = translations['languages'][`${lang}`];
        if (translated) {
          shownLanguages.push(translated);
        }
      });

      if (this.user && this.user.role && this.user.role.role) {
        this._translateRole(this.user.role.role).then((shownRole) => {
          this.user['shownRole'] = shownRole;
        }).catch((error) => {
          console.log(error);
        });
      }

      if (this.user && this.user.preferredLanguage && this.user.preferredLanguage.language) {
        this._translateLanguage(this.user.preferredLanguage.language).then((shownLanguage) => {
          this.user['shownLanguage'] = shownLanguage;
        }).catch((error) => {
          console.log(error);
        });
      }

      this.translationFields = {
        title: !this.editView && !this.profileView
          ? translations['userForm'].createTitle
          : translations['userForm'].editTitle,
        shownRoles: shownRoles,
        shownLanguages: shownLanguages,
        labels: {
          username: translations['userForm'].labels.username,
          firstName: translations['userForm'].labels.firstName,
          secondName: translations['userForm'].labels.secondName,
          password: translations['userForm'].labels.password,
          passwordValidation: translations['userForm'].labels.passwordValidation,
          email: translations['userForm'].labels.email,
          role: translations['userForm'].labels.role,
          isActivated: translations['userForm'].labels.isActivated,
          street: translations['address'].street,
          zipCode: translations['address'].zipCode,
          city: translations['address'].city,
          country: translations['address'].country,
          submit: !this.editView && !this.profileView
            ? translations['userForm'].labels.createSubmit
            : translations['userForm'].labels.editSubmit,
          fablab: translations['userForm'].labels.fablab,
          changePassword: translations['userForm'].labels.changePassword,
          preferredLanguage: translations['userForm'].labels.preferredLanguage
        },
        modals: {
          ok: translations['userForm'].modals.ok,
          okReturnValue: translations['userForm'].modals.okReturnValue,
          successHeader: this.editView || this.profileView
            ? translations['userForm'].modals.updateSuccessHeader
            : translations['userForm'].modals.createSuccessHeader,
          successMessage: this.editView || this.profileView
            ? translations['userForm'].modals.updateSuccess
            : translations['userForm'].modals.createSuccess,
          errorHeader: translations['userForm'].modals.errorHeader,
          errorMessage: this.editView || this.profileView
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
          notAssigned: translations['userForm'].messages.notAssigned,
          preferredLanguage: translations['userForm'].messages.preferredLanguage
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
