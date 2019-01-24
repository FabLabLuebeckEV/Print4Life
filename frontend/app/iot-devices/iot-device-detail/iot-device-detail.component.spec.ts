import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IotDeviceDetailComponent } from './iot-device-detail.component';

describe('IotDeviceDetailComponent', () => {
  let component: IotDeviceDetailComponent;
  let fixture: ComponentFixture<IotDeviceDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IotDeviceDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IotDeviceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
