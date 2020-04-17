import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ModalService } from '../services/modal.service';
import { ModalButton } from '../helper/modal.button';
import { LoginModalComponent } from '../users/login-modal/login-modal.component';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { ServiceService } from '../services/service.service';
import { MessageModalComponent } from '../components/message-modal/message-modal.component';
import { TranslationModel } from '../models/translation.model';
import { routes } from '../config/routes';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userIsLoggedIn: Boolean;
  user: User;
  translationFields: TranslationModel.Dashboard  = {};

  contactData = {
    name : '',
    email : '',
    subject: '',
    message: ''
  };

  constructor(
    private modalService: ModalService,
    private translateService: TranslateService,
    private userService: UserService,
    private router: Router,
    private serviceService: ServiceService
  ) {
    this._translate();
    this.translateService.onLangChange.subscribe(() => {
      this._translate();
    });
  }

  ngOnInit() {
    this.userIsLoggedIn = this.userService.isLoggedIn();
  }

  // Private Functions

  private _translate() {
    this.translateService.get(['dashboard']).subscribe((translations => {
      /*
      this.translationFields.title = translations['dashboard'].title;
      this.translationFields.order = translations['dashboard'].order;
      this.translationFields.management = translations['dashboard'].management;
      this.translationFields.system = translations['dashboard'].system;
      this.translationFields.accountQuestion = translations['dashboard'].accountQuestion;
      this.translationFields.accountCreation = translations['dashboard'].accountCreation;
      this.translationFields.buttons.login = translations['dashboard']['buttons'] ? translations['dashboard']['buttons'].login : 'f';
      */
      this.translationFields = translations.dashboard;
      console.log('translation fields: ', this.translationFields);
    }));
  }

  login() {
    this.modalService.open(LoginModalComponent, { backdrop: 'static' }).result.then(async (login) => {
      this.userIsLoggedIn = this.userService.isLoggedIn();
      this.user = await this.userService.getUser();
      this.router.navigate([this.router.url]);
      this._translate();
    }).catch((err) => {
      this.userIsLoggedIn = this.userService.isLoggedIn();
      this.user = undefined;
    });
  }

  async sendContactMessage() {
    const okButton = new ModalButton('Ok', 'btn btn-primary', 'Ok');

    console.log(this.contactData);
    this.serviceService.sendContactForm({contact: this.contactData}).catch();
    this.modalService.openMsgModal(
      'Erfolgreich verschickt',
      'modal-header header-success',
      ['Du erhältst eine Kopie deiner Nachricht per Email', 'Unser Team wird sich bald bei dir melden'],
      okButton,
      undefined
    ).result.then(async (login) => {
    }).catch((err) => {
    });
  }

  register(type: String) {

    this.router.navigate([`${routes.paths.frontend.users.root}/${routes.paths.frontend.users.signup}/${type}`]);
    /*
    const okButton = new ModalButton('Ok', 'btn btn-primary', 'Ok');
    const newsletterButton = new ModalButton('Zum Newsletter', 'btn primary', 'newsletter');

    this.modalService.openMsgModal(
      'Noch nicht verfügbar',
      'modal-header header-warning',
      ['Die Anmeldung ist noch nicht freigeschaltet', 'Um bei Programmstart benachrichtigt zu werden, abboniere unseren Newsletter'],
      okButton,
      newsletterButton
    ).result.then((result) => {
      if (result === newsletterButton.returnValue) {
        window.location.href = '#cta';
      }
    }).catch((err) => {
    });*/
  }
}
