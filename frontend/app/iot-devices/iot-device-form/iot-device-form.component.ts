import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IotDevice, Event } from 'frontend/app/models/iot-device.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-iot-device-form',
  templateUrl: './iot-device-form.component.html',
  styleUrls: ['./iot-device-form.component.css']
})
export class IotDeviceFormComponent implements OnInit {
  events: Event[] = [];
  iotDevice: IotDevice = new IotDevice(undefined, undefined, undefined, undefined, undefined, undefined, this.events);

  constructor(
    private router: Router,
    private location: Location,
  ) {
  }

  ngOnInit() {
  }

}
