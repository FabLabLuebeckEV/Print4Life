import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IotDeviceFormComponent } from './iot-device-form.component';

describe('IotDeviceFormComponent', () => {
  let component: IotDeviceFormComponent;
  let fixture: ComponentFixture<IotDeviceFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IotDeviceFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IotDeviceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
