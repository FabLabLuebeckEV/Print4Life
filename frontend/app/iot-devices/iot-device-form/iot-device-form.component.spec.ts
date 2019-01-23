import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { IotDeviceFormComponent } from './iot-device-form.component';

import {
  HttpClientTestingModule
} from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('IotDeviceFormComponent', () => {
  let component: IotDeviceFormComponent;
  let fixture: ComponentFixture<IotDeviceFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IotDeviceFormComponent],
      providers: [TranslateService],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule,
        NgSelectModule,
        FontAwesomeModule,
        TranslateModule.forRoot(),
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
