import { Component, OnInit } from '@angular/core';
import { routes } from '../../config/routes';
import { UserService } from '../../services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginModalComponent } from '../../users/login-modal/login-modal.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  title: String = 'Order Management';
  login: String = 'Login';
  logout: String = 'Logout';
  register: String = 'Register';
  isNavbarCollapsed: Boolean = false;
  machineDropdown: Object = { name: '', elements: [] };
  orderDropdown: Object = { name: '', elements: [] };
  languageDropdown: Object = { name: '', elements: [] };
  userDropdown: Object = { name: '', elements: [] };
  private userIsLoggedIn: Boolean;

  constructor(
    private translateService: TranslateService,
    private userService: UserService,
    private modalService: NgbModal,
    private router: Router
  ) {
    this._translate();
  }

  ngOnInit() {
  }

  public switchLanguage(language) {
    this.translateService.use(language);
    this._translate();
  }

  private _translate() {
    this.translateService.get(
      ['navigation', 'languages', 'dropdown.machines', 'dropdown.orders', 'dropdown.users']
    ).subscribe((translations => {
      this.title = translations['navigation'].title;
      this.login = translations['navigation'].login;
      this.logout = translations['navigation'].logout;
      this.register = translations['navigation'].register;
      this.machineDropdown = {
        name: translations['dropdown.machines'].title,
        elements: [
          { name: translations['dropdown.machines'].listMachines, routerHref: routes.paths.frontend.machines.root },
          {
            name: translations['dropdown.machines'].createMachine,
            routerHref: `${routes.paths.frontend.machines.root}/${routes.paths.frontend.machines.create}`
          }
        ]
      };

      this.orderDropdown = {
        name: translations['dropdown.orders'].title,
        elements: [
          { name: translations['dropdown.orders'].listOrders, routerHref: routes.paths.frontend.orders.root },
          {
            name: translations['dropdown.orders'].createOrder,
            routerHref: `${routes.paths.frontend.orders.root}/${routes.paths.frontend.orders.create}`
          }
        ]
      };

      this.languageDropdown = {
        name: translations['languages'].title,
        elements: [
          {
            name: translations['languages'].english,
            isFlag: true,
            class: 'flag-icon flag-icon-gb',
            countryCode: 'en'
          },
          {
            name: translations['languages'].danish,
            isFlag: true,
            class: 'flag-icon flag-icon-dk',
            countryCode: 'dk',
            disabled: true
          },
          {
            name: translations['languages'].german,
            isFlag: true,
            class: 'flag-icon flag-icon-de',
            countryCode: 'de'
          }
        ]
      };

      this.userDropdown = {
        name: translations['dropdown.users'].title,
        elements: [
          {
            name: translations['dropdown.users'].info,
            routerHref: `${routes.paths.frontend.users.root}/:id`
          }
        ]
      };
    }));
  }

  private _login() {
    this.modalService.open(LoginModalComponent, { size: 'sm' }).result.then((login) => {
      this.userIsLoggedIn = this.userService.isLoggedIn();
    }).catch((err) => {
      this.userIsLoggedIn = this.userService.isLoggedIn();
    });
  }

  private _logout() {
    this.userService.logout();
    this.userIsLoggedIn = this.userService.isLoggedIn();
  }

  private _register() {
    this.router.navigate([`${routes.paths.frontend.users.root}/${routes.paths.frontend.users.signup}`]);
  }
}
