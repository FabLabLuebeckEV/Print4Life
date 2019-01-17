import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { IotDeviceFormComponent } from './iot-device-form.component';

import {
  HttpClientTestingModule
} from '@angular/common/http/testing';

describe('IotDeviceFormComponent', () => {
  let component: IotDeviceFormComponent;
  let fixture: ComponentFixture<IotDeviceFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IotDeviceFormComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ]
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
