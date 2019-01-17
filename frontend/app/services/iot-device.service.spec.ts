import { TestBed, inject } from '@angular/core/testing';

import { IotDeviceService } from './iot-device.service';

describe('IotDeviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IotDeviceService]
    });
  });

  it('should be created', inject([IotDeviceService], (service: IotDeviceService) => {
    expect(service).toBeTruthy();
  }));
});
