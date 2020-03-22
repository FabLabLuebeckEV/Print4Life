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
import { ModalService } from '../../services/modal.service';
import { ModalButton } from '../../helper/modal.button';
import { Fablab } from 'frontend/app/models/fablab.model';

interface Dropdown {
  name: String;
  elements: Array<Object>;
}

@Component({
  selector: 'app-fablab-form',
  templateUrl: './fablab-form.component.html',
  styleUrls: ['./fablab-form.component.css']
})
export class FablabFormComponent implements OnInit {
  validRoles: Array<String> = [];

  validLanguages: Array<String> = [];
  loggedInUser: User;
  editView: Boolean;
  profileView: Boolean;
  fablabId: String;
  isAdmin: Boolean;
  isOwner: Boolean;
  address: Address = new Address(undefined, undefined, undefined, undefined);
  preferredLanguage = new Language('en'); // default en/english
  fablab: Fablab = new Fablab(
    undefined,
    undefined,
    this.address,
    undefined,
    undefined
  );

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
    private modalService: ModalService,
    private translateService: TranslateService,
    private genericService: GenericService,
    private route: ActivatedRoute,
    private fablabService: FablabService,
    private languageService: LanguageService
  ) {
    this.router.events.subscribe(async () => {
      const route = this.location.path();
      this.editView =
        route.indexOf(
          `${routes.paths.frontend.fablabs.root}/${routes.paths.frontend.fablabs.update}`
        ) >= 0;
      this.profileView =
        route.indexOf(
          `${routes.paths.frontend.fablabs.root}/${routes.paths.frontend.fablabs.profile}`
        ) >= 0;
    });
    this.route.params.subscribe(params => {
      if (params.id) {
        this.fablabId = params.id;
      }
    });
  }

  async ngOnInit() {
    this.loggedInUser = await this.userService.getUser();
    this.isAdmin = await this.userService.isAdmin();
    if (this.profileView) {
      this.fablabId = this.loggedInUser.fablabId;
    }
    await this._initializeFablab(this.fablabId);
    this.isOwner = this.fablab.owner === this.loggedInUser._id;
    if (!this.editView && !this.profileView) {
      this.fablab.owner = this.loggedInUser._id;
    }
    this._translate();
    this.translateService.onLangChange.subscribe(() => {
      this._translate();
    });
    console.log(this.fablab);
  }

  onSubmit() {
    const fablabCopy = JSON.parse(JSON.stringify(this.fablab));
        if (this.editView || this.profileView) {
          this.fablabService
            .updateFablab(fablabCopy)
            .then(async res => {
                  this.modalService.openSuccessMsg(
                    this.translationFields.modals.ok,
                    this.translationFields.modals.okReturnValue,
                    this.translationFields.modals.successHeader,
                    this.translationFields.modals.successMessage
                  );
              }
            )
            .catch(err => {
              const errorMsg = this.translationFields.modals.errorMessage;
              const okButton = new ModalButton(
                this.translationFields.modals.ok,
                'btn btn-primary',
                this.translationFields.modals.ok
              );
              this.modalService.openMsgModal(
                this.translationFields.modals.errorHeader,
                'modal-header header-danger',
                [errorMsg],
                okButton,
                undefined
              );
            });
        } else {
          this.fablabService
            .createFablab(fablabCopy)
            .then(res => {
              if (res) {
                this.modalService.openSuccessMsg(
                  this.translationFields.modals.ok,
                  this.translationFields.modals.okReturnValue,
                  this.translationFields.modals.successHeader,
                  this.translationFields.modals.successMessage
                );
                this.loggedInUser.fablabId = res['fablab']._id;
              }
            })
            .catch(err => {
              const errorMsg = this.translationFields.modals.errorMessage;
              const okButton = new ModalButton(
                this.translationFields.modals.ok,
                'btn btn-primary',
                this.translationFields.modals.ok
              );
              this.modalService.openMsgModal(
                this.translationFields.modals.errorHeader,
                'modal-header header-danger',
                [errorMsg],
                okButton,
                undefined
              );
            });
        }
  }

  // Event handler




  // Private Functions

  private async _initializeFablab(id) {
    if (id !== undefined) {
      try {
        this.fablab = await this.fablabService.getFablab(id);

      } catch (err) {
          this.fablab = new Fablab(
          undefined,
          undefined,
          this.address,
          undefined,
          undefined
        );
      }
    }
  }



  private _translate() {
    this.translateService
      .get(['userForm', 'roles', 'languages', 'address'])
      .subscribe(translations => {
        const shownRoles = [];
        this.validRoles.forEach(role => {
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

        this.translationFields = {
          title:
            !this.editView && !this.profileView
              ? translations['userForm'].createTitle
              : translations['userForm'].editTitle,
          shownRoles: shownRoles,
          shownLanguages: shownLanguages,
          labels: {
            username: translations['userForm'].labels.username,
            firstName: translations['userForm'].labels.firstName,
            secondName: translations['userForm'].labels.secondName,
            password: translations['userForm'].labels.password,
            passwordValidation:
              translations['userForm'].labels.passwordValidation,
            email: translations['userForm'].labels.email,
            role: translations['userForm'].labels.role,
            isActivated: translations['userForm'].labels.isActivated,
            street: translations['address'].street,
            zipCode: translations['address'].zipCode,
            city: translations['address'].city,
            country: translations['address'].country,
            submit:
              !this.editView && !this.profileView
                ? translations['userForm'].labels.createSubmit
                : translations['userForm'].labels.editSubmit,
            fablab: translations['userForm'].labels.fablab,
            changePassword: translations['userForm'].labels.changePassword,
            preferredLanguage: translations['userForm'].labels.preferredLanguage
          },
          modals: {
            ok: translations['userForm'].modals.ok,
            okReturnValue: translations['userForm'].modals.okReturnValue,
            successHeader:
              this.editView || this.profileView
                ? translations['userForm'].modals.updateSuccessHeader
                : translations['userForm'].modals.createSuccessHeader,
            successMessage:
              this.editView || this.profileView
                ? translations['userForm'].modals.updateSuccess
                : translations['userForm'].modals.createSuccess,
            errorHeader: translations['userForm'].modals.errorHeader,
            errorMessage:
              this.editView || this.profileView
                ? translations['userForm'].modals.updateError
                : translations['userForm'].modals.createError,
            updatePasswordSuccessHeader:
              translations['userForm'].modals.updatePasswordSuccessHeader,
            updatePasswordSuccess:
              translations['userForm'].modals.updatePasswordSuccess,
            updatePasswordErrorHeader:
              translations['userForm'].modals.updatePasswordErrorHeader,
            updatePasswordError:
              translations['userForm'].modals.updatePasswordError
          },
          messages: {
            username: translations['userForm'].messages.username,
            firstName: translations['userForm'].messages.firstName,
            secondName: translations['userForm'].messages.secondName,
            password: translations['userForm'].messages.password,
            passwordValidation:
              translations['userForm'].messages.passwordValidation,
            passwordValidationWrong:
              translations['userForm'].messages.passwordValidationWrong,
            email: translations['userForm'].messages.email,
            role: translations['userForm'].messages.role,
            street: translations['userForm'].messages.street,
            zipCode: translations['userForm'].messages.zipCode,
            city: translations['userForm'].messages.city,
            country: translations['userForm'].messages.country,
            notAssigned: translations['userForm'].messages.notAssigned,
            preferredLanguage:
              translations['userForm'].messages.preferredLanguage
          },
          buttons: {
            activatedTrue: translations['userForm'].buttons.activatedTrue,
            activatedFalse: translations['userForm'].buttons.activatedFalse,
            changePassword: translations['userForm'].buttons.changePassword
          }
        };
      });
  }
}
