import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IotDevice, Event, DeviceType } from 'frontend/app/models/iot-device.model';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ConfigService } from 'frontend/app/config/config.service';
import { IotDeviceService } from 'frontend/app/services/iot-device.service';
import { User } from 'frontend/app/models/user.model';
import { UserService } from 'frontend/app/services/user.service';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Icon } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-iot-device-form',
  templateUrl: './iot-device-form.component.html',
  styleUrls: ['./iot-device-form.component.css']
})
export class IotDeviceFormComponent implements OnInit {
  config: any;
  eventsAsArray: Array<Event> = [];
  iotDevice: IotDevice = new IotDevice('', '', '', new DeviceType('', '', '', ''), '', '', this.eventsAsArray);
  deviceId: String = 'hello';
  deviceIdAlreadyTaken = true;
  loadingDeviceTypes: boolean;
  deviceTypes: Array<DeviceType> = [];
  loggedInUser: User = new User(
    undefined, '', '', '', undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
  eventFormGroup: FormGroup;
  plusIcon: Icon;
  deleteIcon: Icon;
  dataFormats: Array<any> = ['json', 'txt', 'bin'];

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
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.config = this.configService.getConfig();
    this.plusIcon = this.config.icons.add;
    this.deleteIcon = this.config.icons.delete;
    this._translate();
  }

  ngOnInit() {
    this.translateService.onLangChange.subscribe(() => {
      this._translate();
    });

    this.eventFormGroup = this.fb.group({
      events: this.fb.array([this.fb.group({ topic: '', dataformat: '' })])
    });

    this.init();
  }

  get events() {
    return this.eventFormGroup.get('events') as FormArray;
  }

  addEvent() {
    this.events.push(this.fb.group({ topic: '', dataformat: '' }));
  }

  deleteEvent(index) {
    this.events.removeAt(index);
  }

  async init() {
    this._translate();
    this.loggedInUser = await this.userService.getUser();
    this._loadDeviceTypes();
  }

  async onSubmit() {
    let iotDeviceCopy;
    iotDeviceCopy = JSON.parse(JSON.stringify(this.iotDevice));
    iotDeviceCopy.deviceType = this.iotDevice.deviceType.id;
    iotDeviceCopy.events = this.eventFormGroup.value.events;
    this.iotDeviceService.addDevice(iotDeviceCopy);
  }

  private async _checkDeviceId(id: String) {
    let iotDevice;
    iotDevice = await this.iotDeviceService.getDeviceById(id);
    this.deviceIdAlreadyTaken = iotDevice ? true : false;
  }

  private async _loadDeviceTypes() {
    this.loadingDeviceTypes = true;
    const result = await this.iotDeviceService.getDeviceTypes();
    if (result && result.deviceTypes) {
      this.deviceTypes = [];
      result.deviceTypes.forEach((deviceType: { id: string, classId: string, createdDateTime: string, updatedDateTime: string }) => {
        this.deviceTypes.push(new DeviceType(deviceType.id, deviceType.classId, deviceType.createdDateTime, deviceType.updatedDateTime));
      }
      );
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
