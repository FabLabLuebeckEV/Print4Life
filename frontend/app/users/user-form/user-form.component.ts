import { Component, OnInit } from '@angular/core';
import { User, Role, Language } from '../../models/user.model';
import { Address } from '../../models/address.model';
import { UserService } from '../../services/user.service';
import { LanguageService } from '../../services/language.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { routes } from '../../config/routes';
import { TranslateService } from '@ngx-translate/core';
import { GenericService } from '../../services/generic.service';
import { FablabService } from 'frontend/app/services/fablab.service';
import { ChangePasswdModalComponent } from '../change-passwd-modal/change-passwd-modal.component';
import { ModalService } from '../../services/modal.service';
import { ModalButton } from '../../helper/modal.button';

import { TranslationModel } from '../../models/translation.model';
import { ErrorStateMatcher } from '@angular/material';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { Hospital } from 'frontend/app/models/hospital.model';

import { HospitalService } from '../../services/hospital.service';

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

  type: String;

  passwordErrorStateMatcher = new PasswordErrorStateMatcher(this);

  address: Address = new Address(undefined, undefined, undefined, undefined);
  role: Role = new Role('user'); // default on register is user
  preferredLanguage = new Language('de'); // default de/german
  user: User = new User(
    undefined, undefined, undefined, undefined,
    undefined, undefined, undefined, this.address,
    this.role, this.preferredLanguage, false, undefined, undefined);
  hospital: Hospital = new Hospital(
    undefined, undefined, this.address, false, undefined, undefined
  );

  translationFields: TranslationModel.UserForm & TranslationModel.Roles &
    TranslationModel.Languages & TranslationModel.Address &
  {
    title?: String,
    shownRoles?: Array<String>,
    shownLanguages?: Array<String>,
    modals?: {
      successHeader?: String,
      successMessage?: String,
      errorMessage?: String,
    },
    labels?: {
      submit?: String
    }
  };

  constructor(
    private userService: UserService,
    private router: Router,
    private location: Location,
    private modalService: ModalService,
    private translateService: TranslateService,
    private genericService: GenericService,
    private route: ActivatedRoute,
    private fablabService: FablabService,
    private languageService: LanguageService,
    private hospitalService: HospitalService
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
      if (params.type) {
        this.type = params.type;
        if (this.user && this.type === 'maker') {
          this.user.role.role = 'editor';
        }
      }
    });
  }

  public register() {
    // Eingabe überprüfen
    console.log(this.user);
    if (this.user.password !== this.user.passwordValidation || !this.user.password) {
      const okButton = new ModalButton('Ok', 'btn btn-primary', 'Ok');
      this.modalService.openMsgModal(
        'Passwörter prüfen',
        'modal-header',
        ['Die Passwörter stimmen nicht überein.'],
        okButton,
        undefined
      );
    } else if (!this.user.firstname) {
      const okButton = new ModalButton('Ok', 'btn btn-primary', 'Ok');
      this.modalService.openMsgModal(
        'Vornamen prüfen',
        'modal-header',
        ['Bitte geben Sie einen Vornamen ein.'],
        okButton,
        undefined
      );
    } else if (!this.user.lastname) {
      const okButton = new ModalButton('Ok', 'btn btn-primary', 'Ok');
      this.modalService.openMsgModal(
        'Nachname prüfen',
        'modal-header',
        ['Bitte geben Sie einen Nachnamen ein.'],
        okButton,
        undefined
      );
    } else if (!this.user.address.city) {
      const okButton = new ModalButton('Ok', 'btn btn-primary', 'Ok');
      this.modalService.openMsgModal(
        'Stadt prüfen',
        'modal-header',
        ['Bitte geben Sie eine Stadt ein.'],
        okButton,
        undefined
      );
    } else if (!this.user.address.zipCode) {
      const okButton = new ModalButton('Ok', 'btn btn-primary', 'Ok');
      this.modalService.openMsgModal(
        'PLZ prüfen',
        'modal-header',
        ['Bitte geben Sie eine PLZ ein.'],
        okButton,
        undefined
      );
    } else if (!this.user.email || !this.user.email.includes('@')) {
      const okButton = new ModalButton('Ok', 'btn btn-primary', 'Ok');
      this.modalService.openMsgModal(
        'E-Mail-Adresse prüfen',
        'modal-header',
        ['Bitte geben Sie eine gültige E-Mail-Adresse ein.'],
        okButton,
        undefined
      );
    } else {
      if (this.type === 'klinik') {
        this.hospital.address.country = 'N/A';
        this.user.address = this.hospital.address;
      }

      this.userService.createUser(this.user).then(event => {
        if (this.type === 'klinik') {
          console.log(event);
          this.hospital.owner = event.user._id;
          this.hospitalService.createHospital(this.hospital);
        }
        this.router.navigate([`${routes.paths.frontend.users.root}/${routes.paths.frontend.users.signup}/${this.type}/${routes.paths.frontend.users.thankyou}`]);
      });
    }
  }

  async ngOnInit() {
    this.loadingFablabs = true;
    await this._loadRoles();
    await this._loadLanguages();
    this.loggedInUser = await this.userService.getUser();
    if (this.userService.isLoggedIn && this.loggedInUser !== undefined) {
      this.router.navigate([`${routes.paths.frontend.orders.root}/${routes.paths.frontend.orders.unfinishedOrders}`]);
    }
    if (this.profileView) {
      console.log('profile view');
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

    console.log('user is: ', this.user);
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
                  this.modalService.openSuccessMsg(
                    this.translationFields.modals.ok,
                    this.translationFields.modals.okReturnValue,
                    this.translationFields.modals.successHeader,
                    this.translationFields.modals.successMessage);
                }).catch((err) => {
                  const errorMsg = this.translationFields.modals.errorMessage;
                  const okButton = new ModalButton(this.translationFields.modals.ok, 'btn btn-primary', this.translationFields.modals.ok);
                  this.modalService.openMsgModal(this.translationFields.modals.errorHeader,
                    'modal-header header-danger', [errorMsg], okButton, undefined);
                });
              } else {
                this.modalService.openSuccessMsg(
                  this.translationFields.modals.ok,
                  this.translationFields.modals.okReturnValue,
                  this.translationFields.modals.successHeader,
                  this.translationFields.modals.successMessage);
              }
            }
          })
          .catch(err => {
            const errorMsg = this.translationFields.modals.errorMessage;
            const okButton = new ModalButton(this.translationFields.modals.ok, 'btn btn-primary', this.translationFields.modals.ok);
            this.modalService.openMsgModal(
              this.translationFields.modals.errorHeader, 'modal-header header-danger', [errorMsg], okButton, undefined);
          });
      } else {
        if (this.type === 'Klinik') {
          // TODO: Addresse & Kliniknummer in Klinikum auslagern
        }

        this.userService.createUser(userCopy)
          .then(res => {
            if (res) {
              this.modalService.openSuccessMsg(
                this.translationFields.modals.ok,
                this.translationFields.modals.okReturnValue,
                this.translationFields.modals.successHeader,
                this.translationFields.modals.successMessage);
            }
          })
          .catch(err => {
            const errorMsg = this.translationFields.modals.errorMessage;
            const okButton = new ModalButton(this.translationFields.modals.ok, 'btn btn-primary', this.translationFields.modals.ok);
            this.modalService.openMsgModal(
              this.translationFields.modals.errorHeader, 'modal-header header-danger', [errorMsg], okButton, undefined);
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
        console.log('found user ', this.user);
      } catch (err) {

      }
    } else {
      if (this.type === 'maker') {
        console.log('initializing maker');
        this.address = new Address('NA', '', '', 'NA');
        this.user = new User(
          undefined, undefined, undefined, undefined,
          undefined, undefined, undefined, this.address,
          { role: 'editor' }, this.preferredLanguage, false, undefined, undefined);
      } else {
        console.log('initializing klinik');
        this.user = new User(
          undefined, undefined, undefined, undefined,
          undefined, undefined, undefined, this.address,
          { role: 'user' }, this.preferredLanguage, false, undefined, undefined);
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
    this.validLanguages = (await this.languageService.getLanguages()).languages;
    // FIXME: Remove filter if dk is implemented
    this.validLanguages = this.validLanguages.filter((lang) => {
      return lang !== 'da';
    });
    this.loadingLanguages = false;
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
        this.modalService.openSuccessMsg(
          this.translationFields.modals.ok,
          this.translationFields.modals.okReturnValue,
          this.translationFields.modals.successHeader,
          this.translationFields.modals.successMessage);
      }
    }).catch((err) => {
      const okButton = new ModalButton(this.translationFields.modals.ok, 'btn btn-primary', this.translationFields.modals.okReturnValue);
      this.modalService.openMsgModal(this.translationFields.modals.errorHeader, 'modal-header header-danger', err, okButton, undefined);
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


      this.translationFields = TranslationModel.translationUnroll(
        translations,
        {
          zw: {
            shownRoles: shownRoles,
            shownLanguages: shownLanguages,
            modals: {
              successHeader: this.editView || this.profileView
                ? translations['userForm'].modals.updateSuccessHeader
                : translations['userForm'].modals.createSuccessHeader,
              successMessage: this.editView || this.profileView
                ? translations['userForm'].modals.updateSuccess
                : translations['userForm'].modals.createSuccess,
              errorMessage: this.editView || this.profileView
                ? translations['userForm'].modals.updateError
                : translations['userForm'].modals.createError,
            },
            labels: {
              submit: !this.editView && !this.profileView
                ? translations['userForm'].labels.createSubmit
                : translations['userForm'].labels.editSubmit,
            }
          }
        }
      );
      if (!this.editView && !this.profileView) {
        this.translationFields.title = translations['userForm'].createTitle;
      } else {
        this.translationFields.title = translations['userForm'].editTitle;
      }
    }));
  }
}

export class PasswordErrorStateMatcher implements ErrorStateMatcher {
  constructor(private userFormComponent: UserFormComponent) {

  }
  isErrorState(control: FormControl | null,
    form: FormGroupDirective | NgForm | null): boolean {

    return control.touched && this.userFormComponent.user.password !== this.userFormComponent.user.passwordValidation;
  }
}
