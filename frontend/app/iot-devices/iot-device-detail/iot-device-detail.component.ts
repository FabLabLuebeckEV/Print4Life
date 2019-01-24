import { Component, OnInit } from '@angular/core';
import { UserService } from 'frontend/app/services/user.service';
import { IotDeviceListComponent } from '../iot-device-list/iot-device-list.component';
import { ConfigService } from 'frontend/app/config/config.service';
import { Icon } from '@fortawesome/fontawesome-svg-core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { IotDeviceService } from 'frontend/app/services/iot-device.service';
import { IotDevice } from 'frontend/app/models/iot-device.model';
import { User } from 'frontend/app/models/user.model';

@Component({
  selector: 'app-iot-device-detail',
  templateUrl: './iot-device-detail.component.html',
  styleUrls: ['./iot-device-detail.component.css']
})
export class IotDeviceDetailComponent implements OnInit {
  config: any;
  deleteIcon: Icon;
  iotDevice: IotDevice = new IotDevice(
    undefined, undefined, undefined, undefined, undefined, undefined, undefined
  );
  private loggedInUser: User;
  userIsLoggedIn: boolean;
  translationFields = {

  };

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private iotDeviceService: IotDeviceService,
    private configService: ConfigService,
    private translateService: TranslateService
  ) {
    this.config = this.configService.getConfig();
    this.deleteIcon = this.config.icons.delete;
  }

  async ngOnInit() {
    this.translateService.onLangChange.subscribe(() => {
      this._translate();
    });

    this.route.paramMap
      .subscribe(async (params) => {
        this.iotDeviceService.getDeviceById(params.get('id')).then(async (result) => {
          if (result && result['iot-device']) {
            this.iotDevice = result['iot-device'];
            this.userIsLoggedIn = this.userService.isLoggedIn();
            this.loggedInUser = await this.userService.getUser();
          }
        });
      });
  }


  private _translate() {
    this.translateService.get(['iotDeviceDetail']).subscribe((translations => {
      this.translationFields = {

      };
    }));
  }
}
