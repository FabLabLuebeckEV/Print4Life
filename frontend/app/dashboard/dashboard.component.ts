import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ModalService } from '../services/modal.service';
import { ModalButton } from '../helper/modal.button';
import { LoginModalComponent } from '../users/login-modal/login-modal.component';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { TranslationModel } from '../models/translation.model';
import { routes } from '../config/routes';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  userIsLoggedIn: Boolean;
  user: User;
  translationFields: TranslationModel.Dashboard  = {};
  contactLink = routes.paths.frontend.faq.root;
  contactFragment = routes.paths.frontend.faq.contact;
  pressRoute = `/${routes.paths.frontend.press.root}`;

  registrationRoute = `/${routes.paths.frontend.users.root}/${routes.paths.frontend.users.signup}`;
  createOrderRoute = `/${routes.paths.frontend.blueprints.root}/${routes.paths.frontend.blueprints.list}`;

  constructor(
    private modalService: ModalService,
    private translateService: TranslateService,
    private userService: UserService,
    private router: Router,
    private navigationService: NavigationService
  ) {
    this._translate();
    this.translateService.onLangChange.subscribe(() => {
      this._translate();
    });
  }

  ngOnInit() {
    this.userIsLoggedIn = this.userService.isLoggedIn();
  }

  ngAfterViewInit() {

    this.navigationService.setStatic(true);
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

  register(type: String) {

    this.router.navigate([`${this.registrationRoute}/${type}`]);
    /*
    const okButton = new ModalButton('Ok', 'btn btn-primary', 'Ok');
    const newsletterButton = new ModalButton('Zum Newsletter', 'btn primary', 'newsletter');

    this.modalService.openMsgModal(
      'Noch nicht verfügbar',
      'modal-header',
      ['Die Anmeldung ist noch nicht freigeschaltet', 'Um bei Programmstart benachrichtigt zu werden, aboniere unseren Newsletter'],
      okButton,
      newsletterButton
    ).result.then((result) => {
      if (result === newsletterButton.returnValue) {
        window.location.href = '#newsletter';
      }
    }).catch((err) => {
    });*/
  }
}
