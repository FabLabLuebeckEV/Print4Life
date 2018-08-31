import { Component, OnInit } from '@angular/core';
import { User, Address, Role } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageModalComponent, ModalButton } from '../../components/message-modal/message-modal.component';
import { routes } from '../../config/routes';
import { TranslateService } from '@ngx-translate/core';
import { GenericService } from '../../services/generic.service';

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

  address: Address = new Address(undefined, undefined, undefined, undefined);
  role: Role = new Role(undefined);
  user: User = new User(undefined, undefined, undefined, undefined, undefined, undefined, undefined, this.address, this.role);
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
      street: '',
      zipCode: '',
      city: '',
      country: '',
      submit: ''
    },
    modals: {
      ok: '',
      okReturnValue: '',
      successHeader: '',
      successMessage: '',
      errorHeader: '',
      errorMessage: ''
    },
    messages: {
      username: '',
      firstName: '',
      secondName: '',
      password: '',
      passwordValidation: '',
      email: '',
      role: '',
      street: '',
      zipCode: '',
      city: '',
      country: ''
    }
  };

  constructor(
    private userService: UserService,
    private router: Router,
    private location: Location,
    private modalService: NgbModal,
    private translateService: TranslateService,
    private genericService: GenericService
  ) {
    this.router.events.subscribe(() => {
      const route = this.location.path();
      this.editView = route.indexOf(`${routes.paths.frontend.users.root}/${routes.paths.frontend.users.update}`) >= 0;
      if (this.editView) {
        const routeArr = route.split('/');
        this.userId = routeArr[routeArr.length - 1];
      }
    });
  }

  async ngOnInit() {
    await this._loadRoles();
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
      this.userService.createUser(userCopy)
        .then(res => {
          this._openSuccessMsg();
        })
        .catch(err => {
          const errorMsg = this.translationFields.modals.errorMessage;
          const okButton = new ModalButton(this.translationFields.modals.ok, 'btn btn-primary', this.translationFields.modals.ok);
          this._openMsgModal(this.translationFields.modals.errorHeader, 'modal-header header-danger', errorMsg, okButton, undefined);
        });
    }));
  }

  // Event handler

  async roleChanged(role) {
    this.user['shownRole'] = role;
    role = await this._translateRole(this.user['shownRole']);
    this.user.role.role = role;
  }

  // Private Functions

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
        title: true
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
          street: translations['userForm'].labels.street,
          zipCode: translations['userForm'].labels.zipCode,
          city: translations['userForm'].labels.city,
          country: translations['userForm'].labels.country,
          submit: true
            ? translations['userForm'].labels.createSubmit
            : translations['userForm'].labels.editSubmit
        },
        modals: {
          ok: translations['userForm'].modals.ok,
          okReturnValue: translations['userForm'].modals.okReturnValue,
          successHeader: true
            ? translations['userForm'].modals.createSuccessHeader
            : translations['userForm'].modals.updateSuccessHeader,
          successMessage: true
            ? translations['userForm'].modals.createSuccess
            : translations['userForm'].modals.updateSuccess,
          errorHeader: translations['userForm'].modals.errorHeader,
          errorMessage: true
            ? translations['userForm'].modals.createError
            : translations['userForm'].modals.updateError
        },
        messages: {
          username: translations['userForm'].messages.username,
          firstName: translations['userForm'].messages.firstName,
          secondName: translations['userForm'].messages.secondName,
          password: translations['userForm'].messages.password,
          passwordValidation: translations['userForm'].messages.passwordValidation,
          email: translations['userForm'].messages.email,
          role: translations['userForm'].messages.role,
          street: translations['userForm'].messages.street,
          zipCode: translations['userForm'].messages.zipCode,
          city: translations['userForm'].messages.city,
          country: translations['userForm'].messages.country
        }
      };
    }));
  }
}
