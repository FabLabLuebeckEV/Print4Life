import { Component, OnInit } from '@angular/core';
import { UserService } from 'frontend/app/services/user.service';
import { IotDeviceListComponent } from '../iot-device-list/iot-device-list.component';
import { ConfigService, SpinnerConfig } from 'frontend/app/config/config.service';
import { Icon } from '@fortawesome/fontawesome-svg-core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { IotDeviceService } from 'frontend/app/services/iot-device.service';
import { IotDevice } from 'frontend/app/models/iot-device.model';
import { User } from 'frontend/app/models/user.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-iot-device-detail',
  templateUrl: './iot-device-detail.component.html',
  styleUrls: ['./iot-device-detail.component.css']
})
export class IotDeviceDetailComponent implements OnInit {
  config: any;
  deleteIcon: Icon;
  spinnerConfig: SpinnerConfig;
  mqttUri: String = environment.mqtt.uri;
  mqttPorts: String = environment.mqtt.ports.join(', ');
  environment = environment;
  iotDevice: IotDevice = new IotDevice(
    undefined, undefined, undefined, undefined, undefined, undefined, undefined
  );
  private loggedInUser: User;
  userIsLoggedIn: boolean;
  translationFields = {
    labels: {
      deviceId: '',
      mqttHeader: '',
      username: '',
      password: '',
      dataformat: '',
      clientId: '',
      deviceType: ''
    }
  };

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private iotDeviceService: IotDeviceService,
    private configService: ConfigService,
    private translateService: TranslateService,
    private spinner: NgxSpinnerService,
  ) {
    this.config = this.configService.getConfig();
    this.deleteIcon = this.config.icons.delete;
    this.spinnerConfig = new SpinnerConfig(
      'Loading IoT Devices', this.config.spinnerConfig.bdColor,
      this.config.spinnerConfig.size, this.config.spinnerConfig.color, this.config.spinnerConfig.type
    );
  }

  async ngOnInit() {
    this._translate();
    this.translateService.onLangChange.subscribe(() => {
      this._translate();
    });

    this.route.paramMap
      .subscribe(async (params) => {
        this.spinner.show();
        this.iotDeviceService.getDeviceById(params.get('id')).then(async (result) => {
          if (result && result['iot-device']) {
            this.iotDevice = result['iot-device'];
            this.userIsLoggedIn = this.userService.isLoggedIn();
            this.loggedInUser = await this.userService.getUser();
          }
          this.spinner.hide();
        });
      });
  }

  userHasDeviceId(id): boolean {
    this.loggedInUser.iot.devices.forEach(device => {
      if (device === id) {
        return true;
      }
    });
    return false;
  }

  private _translate() {
    this.translateService.get(['iotDeviceDetail']).subscribe((translations => {
      this.translationFields = {
        labels: {
          deviceId: translations['iotDeviceDetail'].labels.deviceId,
          mqttHeader: translations['iotDeviceDetail'].labels.deviceId,
          username: translations['iotDeviceDetail'].labels.username,
          password: translations['iotDeviceDetail'].labels.password,
          dataformat: translations['iotDeviceDetail'].labels.dataformat,
          clientId: translations['iotDeviceDetail'].labels.clientId,
          deviceType: translations['iotDeviceDetail'].labels.deviceType,
        }
      };
    }));
  }
}
