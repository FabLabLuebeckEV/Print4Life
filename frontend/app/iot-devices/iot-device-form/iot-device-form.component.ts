import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IotDevice, Event, DeviceType } from 'frontend/app/models/iot-device.model';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ConfigService, SpinnerConfig } from 'frontend/app/config/config.service';
import { IotDeviceService } from 'frontend/app/services/iot-device.service';
import { User } from 'frontend/app/models/user.model';
import { UserService } from 'frontend/app/services/user.service';

@Component({
  selector: 'app-iot-device-form',
  templateUrl: './iot-device-form.component.html',
  styleUrls: ['./iot-device-form.component.css']
})
export class IotDeviceFormComponent implements OnInit {
  config: any;
  events: Array<Event> = [];
  iotDevice: IotDevice = new IotDevice('', '', '', new DeviceType(''), '', '', this.events);
  deviceId: String = 'hello';
  deviceIdAlreadyTaken = true;
  loadingDeviceTypes: boolean;
  deviceTypes: Array<DeviceType> = [];
  loggedInUser: User = new User(
    undefined, '', '', '', undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
  translationFields = {
    title: '',
    labels: {
      deviceId: '',
      deviceType: '',
      submit: ''
    },
    messages: {
      deviceId: '',
      deviceId2: ''
    }
  };
  constructor(
    private router: Router,
    private location: Location,
    private translateService: TranslateService,
    private configService: ConfigService,
    private iotDeviceService: IotDeviceService,
    private userService: UserService
  ) {
    this.config = this.configService.getConfig();
    this._translate();
  }

  async ngOnInit() {
    this.translateService.onLangChange.subscribe(() => {
      this._translate();
    });
    this.init();
  }

  async init() {
    this._translate();
    this.loggedInUser = await this.userService.getUser();
    this._loadDeviceTypes();
  }

  async onSubmit() {
    let iotDeviceCopy;
    iotDeviceCopy = JSON.parse(JSON.stringify(this.iotDevice));
    this.iotDeviceService.addDevice(iotDeviceCopy);
  }

  private async _checkDeviceId(id: String) {
    let iotDevice;
    iotDevice = await this.iotDeviceService.getDevice(id);
    this.deviceIdAlreadyTaken = iotDevice ? true : false;
  }

  private async _loadDeviceTypes() {
    this.loadingDeviceTypes = true;
    const result = await this.iotDeviceService.getDeviceTypes();
    if (result && result.deviceTypes) {
      this.deviceTypes = result.deviceTypes;
    }
    this.loadingDeviceTypes = false;
  }

  private _translate() {
    this.translateService.get(['iotDevicesForm']).subscribe((translations => {
      this.translationFields = {
        title: translations['iotDevicesForm'].createTitle,
        labels: {
          deviceId: translations['iotDevicesForm'].labels.deviceId,
          deviceType: translations['iotDevicesForm'].labels.deviceType,
          submit: translations['iotDevicesForm'].labels.submit
        },
        messages: {
          deviceId: translations['iotDevicesForm'].messages.deviceId,
          deviceId2: translations['iotDevicesForm'].messages.deviceId2
        }
      };
    }));
  }
}
