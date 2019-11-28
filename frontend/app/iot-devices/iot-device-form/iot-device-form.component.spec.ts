import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BackButtonComponent } from '../../components/back-button/back-button.component';
import { IotDeviceFormComponent } from './iot-device-form.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import {
  HttpClientTestingModule
} from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DeleteButtonComponent } from 'frontend/app/components/delete-button/delete-button.component';
import { AddButtonComponent } from 'frontend/app/components/add-button/add-button.component';

describe('IotDeviceFormComponent', () => {
  let component: IotDeviceFormComponent;
  let fixture: ComponentFixture<IotDeviceFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        IotDeviceFormComponent,
        BackButtonComponent,
        AddButtonComponent,
        DeleteButtonComponent
      ],
      providers: [TranslateService],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        FormsModule,
        NgbModule,
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

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
