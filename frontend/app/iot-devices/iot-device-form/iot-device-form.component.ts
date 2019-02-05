import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { IotDevice, Event, DeviceType } from 'frontend/app/models/iot-device.model';
import { TranslateService } from '@ngx-translate/core';
import { ConfigService } from 'frontend/app/config/config.service';
import { IotDeviceService } from 'frontend/app/services/iot-device.service';
import { User } from 'frontend/app/models/user.model';
import { UserService } from 'frontend/app/services/user.service';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Icon } from '@fortawesome/fontawesome-svg-core';
import { ModalButton, MessageModalComponent } from 'frontend/app/components/message-modal/message-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericService } from 'frontend/app/services/generic.service';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-iot-device-form',
  templateUrl: './iot-device-form.component.html',
  styleUrls: ['./iot-device-form.component.css']
})
export class IotDeviceFormComponent implements OnInit, OnDestroy {
  @ViewChild('deviceId') deviceIdRef: FormControl;
  config: any;
  eventsAsArray: Array<Event> = [];
  iotDevice: IotDevice = new IotDevice('', '', '', new DeviceType('', '', '', ''), '', '', this.eventsAsArray);
  deviceId: String = '';
  deviceIdAlreadyTaken: boolean;
  deviceIdValid: boolean;
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

  regEx: RegExp = new RegExp('[a-zA-Z0-9\s\.\-\_]{1,36}');

  translationFields = {
    title: '',
    labels: {
      deviceId: '',
      deviceType: '',
      submit: ''
    },
    messages: {
      deviceId: '',
      deviceId2: '',
      deviceId3: '',
      eventsNotValid: ''
    },
    buttons: {
      deleteTooltip: ''
    },
    modals: {
      errorHeader: '',
      successHeader: '',
      ok: '',
      username: '',
      password: '',
      dataformat: '',
      saveHint: ''
    }
  };
  constructor(
    private translateService: TranslateService,
    private configService: ConfigService,
    private iotDeviceService: IotDeviceService,
    private userService: UserService,
    private fb: FormBuilder,
    private modalService: NgbModal,
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

  ngOnInit() {
    this.translateService.onLangChange.subscribe(() => {
      this._translate();
    });

    this.eventFormGroup = this.fb.group({
      events: this.fb.array([this.fb.group({ topic: '', dataformat: '' })])
    });

    this.formSubscription = this.deviceIdRef.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(async (newValue) => {
        this.deviceIdErrorMessage = this.translationFields.messages.deviceId;
        await this.checkDeviceId(newValue);
        if (this.deviceIdAlreadyTaken) {
          this.deviceIdErrorMessage = this.translationFields.messages.deviceId2;
        }
        this.deviceIdValid = this.regEx.test(newValue);
        if (!this.deviceIdValid) {
          this.deviceIdErrorMessage = this.translationFields.messages.deviceId3;
        }
        this.iotDevice.deviceId = newValue;
      });

    this.eventFormGroupSubscription = this.eventFormGroup.valueChanges.pipe(debounceTime(200))
      .subscribe(async (changed) => {
        const invalidEvents = changed.events.filter(event => {
          return !this.regEx.test(event.topic) || !event.dataformat;
        });
        this.eventsValid = !invalidEvents.length;
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
            this._openMsgModal(
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
    this.deviceIdAlreadyTaken = result && result['iot-devices'] && result['iot-devices'].length;
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

  private _openMsgModal(title: String, titleClass: String, messages: Array<String>,
    button1: ModalButton, button2: ModalButton, link?: String) {
    const modalRef = this.modalService.open(MessageModalComponent, { backdrop: 'static' });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.titleClass = titleClass;
    modalRef.componentInstance.messages = messages;
    modalRef.componentInstance.button1 = button1;
    modalRef.componentInstance.button2 = button2;
    if (link) {
      modalRef.componentInstance.link = link;
    }
    return modalRef;
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
        buttons: {
          deleteTooltip: translations['iotDevicesForm'].buttons.deleteTooltip,
        },
        labels: {
          deviceId: translations['iotDevicesForm'].labels.deviceId,
          deviceType: translations['iotDevicesForm'].labels.deviceType,
          submit: translations['iotDevicesForm'].labels.submit
        },
        messages: {
          deviceId: translations['iotDevicesForm'].messages.deviceId,
          deviceId2: translations['iotDevicesForm'].messages.deviceId2,
          deviceId3: translations['iotDevicesForm'].messages.deviceId3,
          eventsNotValid: translations['iotDevicesForm'].messages.eventsNotValid
        },
        modals: {
          errorHeader: translations['iotDevicesForm'].modals.errorHeader,
          ok: translations['iotDevicesForm'].modals.ok,
          successHeader: translations['iotDevicesForm'].modals.successHeader,
          username: translations['iotDevicesForm'].modals.username,
          password: translations['iotDevicesForm'].modals.password,
          dataformat: translations['iotDevicesForm'].modals.dataformat,
          saveHint: translations['iotDevicesForm'].modals.saveHint
        }
      };
    }));
  }
}
