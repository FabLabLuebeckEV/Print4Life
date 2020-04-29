import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { IotDevice, Event, DeviceType } from 'frontend/app/models/iot-device.model';
import { TranslateService } from '@ngx-translate/core';
import { ConfigService } from 'frontend/app/config/config.service';
import { IotDeviceService } from 'frontend/app/services/iot-device.service';
import { User } from 'frontend/app/models/user.model';
import { UserService } from 'frontend/app/services/user.service';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Icon } from '@fortawesome/fontawesome-svg-core';
import { GenericService } from 'frontend/app/services/generic.service';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ModalService } from '../../services/modal.service';
import { ModalButton } from '../../helper/modal.button';

import { TranslationModel } from '../../models/translation.model';

@Component({
  selector: 'app-iot-device-form',
  templateUrl: './iot-device-form.component.html',
  styleUrls: ['./iot-device-form.component.css']
})
export class IotDeviceFormComponent implements OnInit, OnDestroy {
  @ViewChild('deviceId', { static: false }) deviceIdRef: FormControl;
  config: any;
  eventsAsArray: Array<Event> = [];
  iotDevice: IotDevice = new IotDevice('', '', '', new DeviceType('', '', '', ''), '', '', this.eventsAsArray);
  deviceId: String = '';
  deviceIdAlreadyTaken: boolean;
  deviceIdValid = true;
  deviceIdErrorMessage: String;
  eventsValid: boolean;
  loadingDeviceTypes: boolean;
  deviceTypes: Array<DeviceType> = [];
  loggedInUser: User = new User(
    undefined, '', '', '', undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
  eventFormGroup: FormGroup;
  eventFormGroupSubscription: Subscription;
  plusIcon: Icon;
  deleteIcon: Icon;
  dataFormats: Array<any> = ['json', 'txt', 'bin'];
  formSubscription: Subscription;

  paginationObj: any = {
    page: 1,
    totalItems: 0,
    perPage: 20,
    maxSize: 10,
    boundaryLinks: true,
    rotate: true,
    maxPages: 0,
    jumpToPage: undefined
  };

  regEx: RegExp = new RegExp('^[a-zA-Z0-9\s\.\-\_]+$');

  translationFields: TranslationModel.IotDevicesForm;

  constructor(
    private translateService: TranslateService,
    private configService: ConfigService,
    private iotDeviceService: IotDeviceService,
    private userService: UserService,
    private fb: FormBuilder,
    private modalService: ModalService,
    private genericService: GenericService
  ) {
    this.config = this.configService.getConfig();
    this.plusIcon = this.config.icons.add;
    this.deleteIcon = this.config.icons.delete;
    this._translate();
  }
  ngOnDestroy() {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }

  ngAfterViewChecked() {
    this.formSubscription = this.deviceIdRef.valueChanges
    .pipe(debounceTime(1000))
    .subscribe(async (newValue) => {
      let deviceIdValid = true;
      if (!newValue.length) {
        this.deviceIdErrorMessage = this.translationFields.messages.deviceId;
      }
      await this.checkDeviceId(newValue);
      if (this.deviceIdAlreadyTaken) {
        this.deviceIdErrorMessage = this.translationFields.messages.deviceId2;
      }
      deviceIdValid = this.regEx.test(newValue);
      if (!deviceIdValid || !(newValue.length > 0 && newValue.length < 37)) {
        this.deviceIdErrorMessage = this.translationFields.messages.deviceId3;
      }
      this.deviceIdValid = this.deviceIdRef.pristine ? true : !this.deviceIdAlreadyTaken &&
        deviceIdValid && newValue.length > 0 && newValue.length < 37;
      this.iotDevice.deviceId = newValue;
    });

    this.eventFormGroupSubscription = this.eventFormGroup.valueChanges.pipe(debounceTime(200))
    .subscribe(async (changed) => {
      const invalidEvents = changed.events.filter(event => {
        return !this.regEx.test(event.topic) || !event.dataformat;
      });
      this.eventsValid = !invalidEvents.length;
    });
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
    if (this.eventsValid) {
      this.events.push(this.fb.group({ topic: '', dataformat: '' }));
      this.eventsValid = undefined;
      this.eventsValid = false;
    }
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
    const okButton = new ModalButton(this.translationFields.modals.ok, 'btn btn-primary', this.translationFields.modals.ok);
    let iotDeviceCopy;
    iotDeviceCopy = JSON.parse(JSON.stringify(this.iotDevice));
    iotDeviceCopy.deviceType = this.iotDevice.deviceType.id;
    iotDeviceCopy.events = this.eventFormGroup.value.events;
    if (!this.deviceIdAlreadyTaken && this.eventsValid) {
      this.iotDeviceService.addDevice(iotDeviceCopy)
        .then((result) => {
          if (result && result['iot-device']) {
            const device = result['iot-device'];
            const message = [
              `${this.translationFields.modals.saveHint}`,
              `Client ID ${device.clientId}`,
              `${this.translationFields.modals.username}: ${device.username}`,
              `${this.translationFields.modals.password}: ${device.password}`
            ];
            device.events.forEach(event => {
              message.push(`Event: Topic: ${event.topic}, ${this.translationFields.modals.dataformat}: ${event.dataformat}`);
            });
            this.modalService.openMsgModal(
              this.translationFields.modals.successHeader,
              'modal-header header-success', message, okButton, undefined).result.then((result) => {
                this.genericService.back();
              });
          }
        })
        .catch(err => {

        });
    }
  }

  async checkDeviceId(deviceId: String) {
    const noWhiteSpaceDeviceId = deviceId.split(/\s/g).join('-');
    const result = await this.iotDeviceService.getAllIotDevices({ deviceId: noWhiteSpaceDeviceId });
    this.deviceIdAlreadyTaken = result && result['iot-devices'] && result['iot-devices'].length ? true : false;
  }

  public validateEvents() {
    let valid = true;
    this.eventFormGroup.value.events.forEach(event => {
      valid = (event.dataformat && event.topic) && valid;
    });
    if (this.eventFormGroup.value.events.length === 0) {
      valid = false;
    }
    this.eventsValid = valid;
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
      this.translationFields = TranslationModel.translationUnroll(translations);
    }));
  }
}
