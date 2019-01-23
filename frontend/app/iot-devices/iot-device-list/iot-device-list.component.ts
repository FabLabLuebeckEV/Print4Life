import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { routes } from '../../config/routes';
import { IotDeviceService } from 'frontend/app/services/iot-device.service';
import { ConfigService } from '../../config/config.service';
import { IotDevice } from 'frontend/app/models/iot-device.model';
import { Icon } from '@fortawesome/fontawesome-svg-core';
import { TableItem } from 'frontend/app/components/table/table.component';
import { TranslateService } from '@ngx-translate/core';
import { SpinnerConfig } from 'frontend/app/config/config.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { GenericService } from 'frontend/app/services/generic.service';
import { UserService } from 'frontend/app/services/user.service';

@Component({
  selector: 'app-iot-device-list',
  templateUrl: './iot-device-list.component.html',
  styleUrls: ['./iot-device-list.component.css']
})
export class IotDeviceListComponent implements OnInit {
  @ViewChild('spinnerContainer') spinnerContainerRef: ElementRef;
  private userIsLoggedIn: boolean;
  private userIsAdmin: Boolean;
  private listView: Boolean = false;
  loadingIotDevices: Boolean = false;
  iotDevices: Array<IotDevice> = [];
  visibleIotDevices: Array<TableItem> = [];
  spinnerConfig: SpinnerConfig;
  private config: any;
  plusIcon: Icon;
  createLink: String;

  translationFields = {
    buttons: {
      detailLabel: '',
      deleteLabel: ''
    }
  };

  constructor(
    private router: Router,
    private location: Location,
    private iotDeviceServices: IotDeviceService,
    private translateService: TranslateService,
    private configService: ConfigService,
    private spinner: NgxSpinnerService,
    private genericService: GenericService,
    private userService: UserService,
  ) {
    this.config = this.configService.getConfig();
    this.router.events.subscribe(() => {
      const route = this.location.path();
      if (route === `/${routes.paths.frontend.iotDevices.root}` || route === `/${routes.paths.frontend.iotDevices.root}/`) {
        this.listView = true;
        this.ngOnInit();
      }
    });
    this.spinnerConfig = new SpinnerConfig(
      'Loading IoT Devices', this.config.spinnerConfig.bdColor,
      this.config.spinnerConfig.size, this.config.spinnerConfig.color, this.config.spinnerConfig.type
    );
    this.createLink = `./${routes.paths.frontend.iotDevices}`;
    this.plusIcon = this.config.icons.add;
  }

  async ngOnInit() {
    if (this.listView) {
      this.translateService.onLangChange.subscribe(() => {
        this._translate();
        this.visibleIotDevices = [];
        this.iotDevices = [];
        this.init();
      });
      this.userIsLoggedIn = await this.userService.isLoggedIn();
      this.userIsAdmin = await this.userService.isAdmin();
    }
  }

  async init() {
    this.spinner.show();
    const loggedInUser = await this.userService.getUser();
    this.loadingIotDevices = true;
    this.iotDevices = new Array();
    this.visibleIotDevices = undefined;
    this.genericService.scrollIntoView(this.spinnerContainerRef);
    this.iotDevices = (await this.iotDeviceServices.getAllIotDevices())['iot-devices'];
    const arr = [];
    for (const iotDevice of this.iotDevices) {
      const item = new TableItem();
      item.obj['id'] = { label: iotDevice._id };
      item.obj['Device ID'] = {
        label: iotDevice.deviceId,
        href: (`/${routes.paths.frontend.iotDevices.root}/${routes.paths.frontend.iotDevices.detail}/`)
      };
      item.obj['Type'] = {
        label: iotDevice.deviceType
      };
      if (this.userIsLoggedIn &&
        (loggedInUser.role.role === 'user' || this.userIsAdmin || loggedInUser._id === iotDevice._id)) {
        item.button1.label = this.translationFields.buttons.detailLabel;
        item.button1.href = `/${routes.paths.frontend.iotDevices.root}/${routes.paths.frontend.iotDevices.detail}/${iotDevice._id}`;
        item.button1.class = 'btn btn-warning spacing';
        item.button1.icon = this.config.icons.edit;
        item.button2.label = this.translationFields.buttons.deleteLabel;
        item.button2.eventEmitter = true;
        item.button2.class = 'btn btn-danger spacing';
        item.button2.icon = this.config.icons.delete;
        item.button2.refId = iotDevice._id;
      }
      arr.push(item);
    }

    this.visibleIotDevices = undefined;
    this.visibleIotDevices = JSON.parse(JSON.stringify(arr));
    this.loadingIotDevices = false;
    this.spinner.hide();
  }

  private _translate() {
    this.translateService.get(['iotDeviceList']).subscribe((translations => {
      this.spinnerConfig = new SpinnerConfig(
        translations['iotDeviceList'].spinnerLoadingText, this.config.spinnerConfig.bdColor,
        this.config.spinnerConfig.size, this.config.spinnerConfig.color, this.config.spinnerConfig.type);

      this.translationFields = {
        buttons: {
          detailLabel: translations['iotDeviceList'].buttons.detailLabel,
          deleteLabel: translations['iotDeviceList'].buttons.deleteLabel
        }
      };
    }));
  }
}
