import { Component, OnInit } from '@angular/core';
import { routes } from '../../config/routes';
import { UserService } from '../../services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginModalComponent } from '../../users/login-modal/login-modal.component';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';

interface Dropdown {
  name: String;
  elements: Array<Object>;
}

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
  machineDropdown: Dropdown = { name: '', elements: [] };
  orderDropdown: Dropdown = { name: '', elements: [] };
  iotDevicesDropdown: Dropdown = { name: '', elements: [] };
  languageDropdown: Dropdown = { name: '', elements: [] };
  userDropdown: Dropdown = { name: '', elements: [] };
  userIsLoggedIn: Boolean;
  userIsAdmin: Boolean;
  user: User;

  constructor(
    private translateService: TranslateService,
    private userService: UserService,
    private modalService: NgbModal,
    private router: Router
  ) {
    this.router.events.subscribe(async () => {
      this._init();
    });
  }

  async ngOnInit() {
    this.userIsAdmin = await this.userService.isAdmin();
    this._init();
  }

  public switchLanguage(language) {
    this.translateService.use(language);
    this._translate();
  }

  private async _init() {
    this.userIsLoggedIn = this.userService.isLoggedIn();
    this.user = await this.userService.getUser();
    this._translate();
  }

  private _translate() {
    this.translateService.get(
      ['navigation', 'languages', 'dropdown.machines', 'dropdown.orders', 'dropdown.users', 'dropdown.iotDevices']
    ).subscribe((translations => {
      this.userIsLoggedIn = this.userService.isLoggedIn();
      this.title = translations['navigation'].title;
      this.login = translations['navigation'].login;
      this.logout = translations['navigation'].logout;
      this.register = translations['navigation'].register;
      const orderDropdownAuthElements = [
        {
          name:
            translations['dropdown.orders'].myOrders,
          routerHref: `${routes.paths.frontend.orders.root}/${routes.paths.frontend.orders.myOrders}`
        },
        {
          name: translations['dropdown.orders'].createOrder,
          routerHref: `${routes.paths.frontend.orders.root}/${routes.paths.frontend.orders.create}`
        }
      ];
      const orderDropdownEditorElements = [
        {
          name:
            translations['dropdown.orders'].unfinishedOrders,
          routerHref: `${routes.paths.frontend.orders.root}/${routes.paths.frontend.orders.unfinishedOrders}`
        }
      ];
      const machineDropdownAuthElements = [
        { name: translations['dropdown.machines'].listMachines, routerHref: routes.paths.frontend.machines.root },
      ];
      const userDropdownAuthElements = [
        { name: translations['dropdown.users'].listUsers, routerHref: routes.paths.frontend.users.root }
      ];
      this.machineDropdown = {
        name: translations['dropdown.machines'].title,
        elements: [
          {
            name: translations['dropdown.machines'].listSuccessfulOrders,
            routerHref: `${routes.paths.frontend.machines.root}/${routes.paths.frontend.machines.successfulOrders}`
          }
        ]
      };

      this.iotDevicesDropdown = {
        name: translations['dropdown.iotDevices'].title,
        elements: []
      };

      this.orderDropdown = {
        name: translations['dropdown.orders'].title,
        elements: [
          {
            name: translations['dropdown.orders'].listOrders,
            routerHref: routes.paths.frontend.orders.root
          },
          {
            name: translations['dropdown.orders'].outstandingOrders,
            routerHref: `${routes.paths.frontend.orders.root}/${routes.paths.frontend.orders.outstandingOrders}`
          },
        ]
      };

      if (!this.userIsLoggedIn) {
        this.orderDropdown.elements.push({
          name: translations['dropdown.orders'].createShared,
          routerHref: routes.paths.frontend.orders.root +
            '/' + routes.paths.frontend.orders.shared.root +
            '/' + routes.paths.frontend.orders.shared.create
        });
      }
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
        elements: []
      };

      if (this.user) {
        this.userDropdown.elements.push({
          name: translations['dropdown.users'].profile,
          routerHref: `${routes.paths.frontend.users.root}/${routes.paths.frontend.users.profile}`
        });
      }

      if (this.userIsLoggedIn) {
        this.iotDevicesDropdown.elements = this.iotDevicesDropdown.elements.concat([{
          name: translations['dropdown.iotDevices'].listIotDevices, routerHref: routes.paths.frontend.iotDevices.root
        }, {
          name: translations['dropdown.iotDevices'].createIotDevice,
          routerHref: `${routes.paths.frontend.iotDevices.root}/${routes.paths.frontend.iotDevices.create}`
        }]);
        this.machineDropdown.elements = this.machineDropdown.elements.concat(machineDropdownAuthElements);
        if (this.user && this.user.role && this.user.role.role && this.user.role.role === 'editor' || this.userIsAdmin) {
          this.orderDropdown.elements = this.orderDropdown.elements.concat(orderDropdownEditorElements);
        }
        this.orderDropdown.elements = this.orderDropdown.elements.concat(orderDropdownAuthElements);
        this.userDropdown.elements = this.userDropdown.elements.concat(userDropdownAuthElements);
        if (this.userIsAdmin) {
          this.machineDropdown.elements = this.machineDropdown.elements.concat({
            name: translations['dropdown.machines'].createMachine,
            routerHref: `${routes.paths.frontend.machines.root}/${routes.paths.frontend.machines.create}`
          });
        }
      }
    }));
  }

  private _login() {
    this.modalService.open(LoginModalComponent, { backdrop: 'static' }).result.then(async (login) => {
      this.userIsLoggedIn = this.userService.isLoggedIn();
      this.user = await this.userService.getUser();
      this.userIsAdmin = await this.userService.isAdmin();
      this.router.navigate([this.router.url]);
      this._translate();
    }).catch((err) => {
      this.userIsLoggedIn = this.userService.isLoggedIn();
      this.user = undefined;
      this.userIsAdmin = false;
    });
  }

  private _logout() {
    this.userService.logout();
    this.userIsLoggedIn = this.userService.isLoggedIn();
    this.user = undefined;
    this.userIsAdmin = false;
    this.router.navigate(['/']);
    this._translate();
  }

  private _register() {
    this.router.navigate([`${routes.paths.frontend.users.root}/${routes.paths.frontend.users.signup}`]);
  }
}
