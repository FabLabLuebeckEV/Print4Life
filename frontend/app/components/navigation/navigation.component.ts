import { Component, OnInit } from '@angular/core';
import { routes } from '../../config/routes';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  title = 'Order Management';
  isNavbarCollapsed: Boolean = false;
  machineDropdown: Object = { name: '', elements: [] };
  orderDropdown: Object = { name: '', elements: [] };
  languageDropdown: Object = { name: '', elements: [] };
  defaultLang = 'de';

  constructor(private translateService: TranslateService) {
    this.translateService.setDefaultLang(this.defaultLang);
    this._translate(this.defaultLang);
  }

  ngOnInit() {
  }

  public switchLanguage(language) {
    this._translate(language);
  }

  private _translate(language) {
    this.translateService.use(language);
    this.translateService.get(['languages', 'dropdown.machines', 'dropdown.orders']).subscribe((translations => {
      this.machineDropdown = {
        name: translations['dropdown.machines'].title,
        elements: [
          { name: translations['dropdown.machines'].listMachines, routerHref: routes.paths.frontend.machines.root }
        ]
      };

      this.orderDropdown = {
        name: translations['dropdown.orders'].title,
        elements: [
          { name: translations['dropdown.orders'].listOrders, routerHref: routes.paths.frontend.orders.root }
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
    }));
  }
}
