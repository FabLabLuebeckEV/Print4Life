import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { routes } from '../config/routes';

import { UserService } from '../services/user.service';
import { ModalService } from '../services/modal.service';
import { OrderService } from '../services/order.service';
import { MessageModalComponent } from 'frontend/app/components/message-modal/message-modal.component';
import { ModalButton } from '../helper/modal.button';
import { InputModalComponent } from '../components/input-modal/input-modal.component';

import { TranslationModel } from '../models/translation.model';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  translationFields: TranslationModel.LoginModal;

  loginData = {
    email: '',
    password: ''
  };

  registerRoute = '/' + routes.paths.frontend.users.root + '/' + routes.paths.frontend.users.signup + '/';

  constructor(
    public router: Router,
    public userService: UserService,
    public orderService: OrderService,
    public modalService: ModalService,
    private translateService: TranslateService,
  ) {

  }


  ngOnInit() {
    if (this.userService.isLoggedIn()) {
      this.router.navigate([`/${routes.paths.frontend.orders.root}/${routes.paths.frontend.orders.all.root}/${routes.paths.frontend.orders.all.all}`]);
      return;
    }
    this.translateService.onLangChange.subscribe(() => {
      this._translate();
    });
    this._translate();
  }

  async resetPassword() {
    const modalRef = this.modalService.open(InputModalComponent, { backdrop: 'static' });
    modalRef.componentInstance.title = this.translationFields.modals.title;
    modalRef.componentInstance.inputLabel = this.translationFields.modals.inputLabel;
    modalRef.componentInstance.button1 = new ModalButton(this.translationFields.modals.buttonLabel, 'btn btn-primary', 'Ok');
    modalRef.result.then((email) => {
      if (email && email !== 'dismiss') {
        this.userService.resetPassword({ email }).then(() => {
          const msgModalRef = this.modalService.open(MessageModalComponent, { backdrop: 'static' });
          msgModalRef.componentInstance.title = this.translationFields.modals.successHeader;
          msgModalRef.componentInstance.titleClass = 'modal-header';
          msgModalRef.componentInstance.messages = [this.translationFields.modals.successMessage];
          msgModalRef.componentInstance.button1 = new ModalButton('OK', 'btn btn-primary', 'Ok');
        }).catch(() => {
          const msgModalRef = this.modalService.open(MessageModalComponent, { backdrop: 'static' });
          msgModalRef.componentInstance.title = this.translationFields.modals.errorHeader;
          msgModalRef.componentInstance.titleClass = 'modal-header';
          msgModalRef.componentInstance.messages = [this.translationFields.modals.errorMessage];
          msgModalRef.componentInstance.button1 = new ModalButton('OK', 'btn btn-primary', 'Ok');
        });
      }
    });
  }

  async login() {
    try {
      await this.userService.login(this.loginData);
      const user = await this.userService.findOwn();
      if (user.role.role === 'editor') {
        // Maker
        const query = {
          $or: [
              {
                  'batch.accepted': {
                      $elemMatch: {
                          user: user._id
                      }
                  }
              },
              {
                  'batch.finished': {
                      $elemMatch: {
                          user: user._id
                      }
                  }
              }
          ]
        };
        const myOrders = await this.orderService.search(query);
        if (myOrders) {
          this.router.navigate([`/${routes.paths.frontend.orders.root}/${routes.paths.frontend.orders.all.root}/${routes.paths.frontend.orders.all.all}`]);
        } else {
          this.router.navigate([`/${routes.paths.frontend.orders.root}/${routes.paths.frontend.orders.all.root}/${routes.paths.frontend.orders.all.all}`]);
        }
      } else {
        // Suchender
        const query = {owner: user._id};
        const myOrders = await this.orderService.search(query);
        if (myOrders) {
          this.router.navigate([`/${routes.paths.frontend.orders.root}/${routes.paths.frontend.orders.all.root}/${routes.paths.frontend.orders.all.all}`]);
        } else {
          this.router.navigate([`/${routes.paths.frontend.blueprints.root}/${routes.paths.frontend.blueprints.list}`]);
        }
      }
    } catch (err) {
    }
  }


  private _translate() {
    this.translateService.get(['loginModal']).subscribe((translations => {
      if (translations && translations['loginModal'] && translations['loginModal'].title) {
        this.translationFields = TranslationModel.translationUnroll(translations);
      }
    }));
  }
}
