import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent implements OnInit {
  private response: Object;
  private loginData: Object = { username: '', password: '' };
  private translationFields: Object = {
    title: '',
    labels: {
      username: '',
      password: '',
      login: ''
    },
  };

  constructor(
    private userService: UserService,
    private activeModal: NgbActiveModal,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.translateService.onLangChange.subscribe(() => {
      this._translate();
    });
    this._translate();
  }

  async login() {
    this.response = await this.userService.login(this.loginData);
    this.activeModal.close(this.response);
  }

  private _translate() {
    this.translateService.get(['loginModal']).subscribe((translations => {

      this.translationFields = {
        title: translations['loginModal'].title,
        labels: {
          username: translations['loginModal'].labels.username,
          password: translations['loginModal'].labels.password,
          login: translations['loginModal'].labels.login
        },
      };
    }));
  }
}
