import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ModalService } from '../services/modal.service';
import { LoginModalComponent } from '../users/login-modal/login-modal.component';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userIsLoggedIn: Boolean;
  user: User;
  translationFields = {
    title: '',
    order: '',
    management: '',
    system: '',
    accountQuestion: '',
    accountCreation: '',
    buttons: {
      login: ''
    }
  };

  constructor(
    private modalService: ModalService,
    private translateService: TranslateService,
    private userService: UserService,
    private router: Router,
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
      this.translationFields.title = translations['dashboard'].title;
      this.translationFields.order = translations['dashboard'].order;
      this.translationFields.management = translations['dashboard'].management;
      this.translationFields.system = translations['dashboard'].system;
      this.translationFields.accountQuestion = translations['dashboard'].accountQuestion;
      this.translationFields.accountCreation = translations['dashboard'].accountCreation;
      this.translationFields.buttons.login = translations['dashboard']['buttons'] ? translations['dashboard']['buttons'].login : 'f';
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
}
