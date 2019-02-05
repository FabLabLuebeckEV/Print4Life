import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxSpinnerModule } from 'ngx-spinner';
import { IotDeviceListComponent } from './iot-device-list.component';
import { ConfigService } from 'frontend/app/config/config.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TableComponent } from 'frontend/app/components/table/table.component';

import {
  HttpClientTestingModule
} from '@angular/common/http/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MessageModalComponent } from 'frontend/app/components/message-modal/message-modal.component';
import { FormsModule } from '@angular/forms';
import { AddButtonComponent } from 'frontend/app/components/add-button/add-button.component';

describe('IotDeviceListComponent', () => {
  let component: IotDeviceListComponent;
  let fixture: ComponentFixture<IotDeviceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        IotDeviceListComponent,
        TableComponent,
        MessageModalComponent,
        AddButtonComponent
      ],
      imports: [
        NgxSpinnerModule,
        RouterTestingModule,
        NgbModule.forRoot(),
        HttpClientTestingModule,
        FontAwesomeModule,
        FormsModule,
        TranslateModule.forRoot()
      ],
      providers: [
        NgxSpinnerService,
        ConfigService,
        TranslateService
      ]
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
