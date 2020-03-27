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

import { TranslationModel } from '../../models/translation.model';

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

  translationFields: TranslationModel.FablabForm & TranslationModel.Address & {
    title?: String,
    labels?: {
      submit?: String
    },
    modals?: {
      successHeader?: String,
      successMessage?: String,
      errorMessage?: String
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
                this.userService.updateUser(this.loggedInUser);
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
        const fablab = await this.fablabService.getFablab(id);
        if (fablab) {
          this.fablab = fablab['fablab'];
        }

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
      .get(['fablabForm', 'address'])
      .subscribe(translations => {
        this.translationFields = TranslationModel.translationUnroll(
          translations,
          {zw: {
            title:
            !this.editView && !this.profileView
              ? translations['fablabForm'].createTitle
              : translations['fablabForm'].editTitle,
            labels: {
              submit: !this.editView && !this.profileView
                ? translations['fablabForm'].labels.createSubmit
                : translations['fablabForm'].labels.editSubmit
            },
            modals: {
              successHeader:
              this.editView || this.profileView
                ? translations['fablabForm'].modals.updateSuccessHeader
                : translations['fablabForm'].modals.createSuccessHeader,
              successMessage:
                this.editView || this.profileView
                  ? translations['fablabForm'].modals.updateSuccess
                  : translations['fablabForm'].modals.createSuccess,
              errorMessage:
                this.editView || this.profileView
                  ? translations['fablabForm'].modals.updateError
                  : translations['fablabForm'].modals.createError
            }
          }}
        );
      console.log(this.translationFields);
    });
  }
}
