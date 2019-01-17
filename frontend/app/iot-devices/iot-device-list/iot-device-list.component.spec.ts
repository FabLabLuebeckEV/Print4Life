import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IotDeviceListComponent } from './iot-device-list.component';

describe('IotDeviceListComponent', () => {
  let component: IotDeviceListComponent;
  let fixture: ComponentFixture<IotDeviceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IotDeviceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IotDeviceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
