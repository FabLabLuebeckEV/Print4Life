import { TestBed, inject } from '@angular/core/testing';

import { IotDeviceService } from './iot-device.service';

import {
  HttpClientTestingModule
} from '@angular/common/http/testing';


describe('IotDeviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IotDeviceService],
      imports: [HttpClientTestingModule]
    });
  });

  it('should be created', inject([IotDeviceService], (service: IotDeviceService) => {
    expect(service).toBeTruthy();
  }));
});
