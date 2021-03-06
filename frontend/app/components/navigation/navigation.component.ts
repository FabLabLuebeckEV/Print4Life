import { Component, OnInit } from '@angular/core';
import { routes } from '../../config/routes';
import { UserService } from '../../services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { LoginModalComponent } from '../../users/login-modal/login-modal.component';
import {NavigationEnd, Router} from '@angular/router';
import { User } from '../../models/user.model';
import { ModalService } from '../../services/modal.service';
import { HostListener } from '@angular/core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { HospitalService } from 'frontend/app/services/hospital.service';
import { Hospital } from 'frontend/app/models/hospital.model';
import { NavigationService } from 'frontend/app/services/navigation.service';

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
  isNavbarCollapsed: Boolean = true;
  machineDropdown: Dropdown = { name: '', elements: [] };
  orderDropdown: Dropdown = { name: '', elements: [] };
  iotDevicesDropdown: Dropdown = { name: '', elements: [] };
  languageDropdown: Dropdown = { name: '', elements: [] };
  userDropdown: Dropdown = { name: '', elements: [] };
  fablabDropdown: Dropdown = {name: '', elements: []};
  userIsLoggedIn: Boolean;
  userIsAdmin: Boolean;
  user: User;
  menuExtra: Boolean = false;
  menuIcon = faBars;
  closeIcon = faTimes;
  sideMenu: Boolean = false;
  aboutUsLink = routes.paths.frontend.aboutus.root;
  faqLink = routes.paths.frontend.faq.root;
  contactLink = routes.paths.frontend.faq.root;
  contactFragment = routes.paths.frontend.faq.contact;
  loginLink = routes.paths.frontend.users.root + '/' + routes.paths.frontend.users.login;
  allOrdersLink = routes.paths.frontend.orders.root + '/'
  + routes.paths.frontend.orders.all.root + '/'
  + routes.paths.frontend.orders.all.all;
  myOrdersLink = routes.paths.frontend.orders.root + '/'
  + routes.paths.frontend.orders.all.root + '/'
  + routes.paths.frontend.orders.all.my;
  openOrdersLink = routes.paths.frontend.orders.root + '/'
  + routes.paths.frontend.orders.all.root + '/' + routes.paths.frontend.orders.all.open;
  closedOrdersLink = routes.paths.frontend.orders.root + '/'
  + routes.paths.frontend.orders.all.root + '/' + routes.paths.frontend.orders.all.closed;
  createOrderLink = routes.paths.frontend.blueprints.root + '/'
  + routes.paths.frontend.blueprints.list;
  userType: String;
  hospital: Hospital;

  static = false;
  startpage = true;

  constructor(
    private translateService: TranslateService,
    private userService: UserService,
    private modalService: ModalService,
    private router: Router,
    private hospitalService: HospitalService,
    private navigationService: NavigationService
  ) {
    this.router.events.subscribe(async (ev) => {
      this._init();

      if (ev instanceof NavigationEnd) {
        const url = this.router.url.split('#')[0];
        this.startpage = url === '/';
      }
    });
  }

  async ngOnInit() {
    this.userIsAdmin = await this.userService.isAdmin();
    this.navigationService.getValue().subscribe(val => {
      this.static = val;
    });
    this._init();
  }


  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event) {
    this.menuExtra = (window.pageYOffset > 1000);
    console.log(this.menuExtra);
  }

  public switchLanguage(language) {
    this.translateService.use(language);
    this._translate();
  }

  private async _init() {
    this.userIsLoggedIn = this.userService.isLoggedIn();
    if (this.userIsLoggedIn) {
      this.user = await this.userService.findOwn();
      console.log('user is ', this.user);

      if (this.user.role.role === 'user') {
        this.userType = 'klinik';
        this.hospital = await this.hospitalService.findOwn();

        console.log(this.hospital);
      } else {
        this.userType = 'maker';
      }
    }
    this._translate();
  }

  private _translate() {
    this.translateService.stream(
      ['navigation', 'languages', 'dropdown.machines', 'dropdown.fablabs', 'dropdown.orders', 'dropdown.users', 'dropdown.iotDevices']
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
            countryCode: 'da',
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

      this.fablabDropdown = {
        name: translations['dropdown.fablabs'].title,
        elements: []
      };


      if (this.userIsLoggedIn) {

        this.fablabDropdown.elements.push({
          name: translations['dropdown.fablabs'].listFablabs,
          routerHref: `${routes.paths.frontend.fablabs.root}/`
        });
        if (!this.user.fablabId) {
          this.fablabDropdown.elements.push({
            name: translations['dropdown.fablabs'].signUp,
            routerHref: `${routes.paths.frontend.fablabs.root}/${routes.paths.frontend.fablabs.register}`
          });
        } else {
          this.fablabDropdown.elements.push({
            name: translations['dropdown.fablabs'].profile,
            routerHref: `${routes.paths.frontend.fablabs.root}/${routes.paths.frontend.fablabs.profile}`
          });
        }
      }


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
        if (this.userIsAdmin) {
          this.userDropdown.elements = this.userDropdown.elements.concat(userDropdownAuthElements);
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
      if (this.user.role.role === 'editor') {
        this.router.navigate([`${routes.paths.frontend.orders.root}/${routes.paths.frontend.orders.unfinishedOrders}`]);
      } else {
        this.router.navigate([`${routes.paths.frontend.orders.root}/${routes.paths.frontend.orders.unfinishedOrders}`]);
      }
      this._translate();
    }).catch((err) => {
      this.userIsLoggedIn = this.userService.isLoggedIn();
      this.user = undefined;
      this.userIsAdmin = false;
    });
  }

  private async _logout() {
    await this.userService.logout();
    this.userIsLoggedIn = false;
    this.user = undefined;
    this.userIsAdmin = false;
    this.router.navigate(['/']);
  }

  private _register() {
    this.router.navigate([`${routes.paths.frontend.users.root}/${routes.paths.frontend.users.signup}`]);
  }

  private _profile() {
    this.router.navigate([`${routes.paths.frontend.users.root}/${this.user._id}`]);
  }

  private _startPage() {
    if (this.userIsLoggedIn) {
      if (this.userType === 'maker') {
        this.router.navigate([`${routes.paths.frontend.orders.root}/${routes.paths.frontend.orders.acceptedOrders}`]);
      } else {
        this.router.navigate([`${routes.paths.frontend.orders.root}/${routes.paths.frontend.orders.myOrders}`]);
      }
    } else {
      this.router.navigate([``]);
    }
  }

  toggleSideMenu() {
    this.sideMenu = !this.sideMenu;
  }
}
