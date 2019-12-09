import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule
} from '@angular/common/http/testing';
import { IotDeviceDetailComponent } from './iot-device-detail.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BackButtonComponent } from 'frontend/app/components/back-button/back-button.component';
import { DeleteButtonComponent } from 'frontend/app/components/delete-button/delete-button.component';
import { MessageModalComponent } from 'frontend/app/components/message-modal/message-modal.component';

describe('IotDeviceDetailComponent', () => {
  let component: IotDeviceDetailComponent;
  let fixture: ComponentFixture<IotDeviceDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        IotDeviceDetailComponent,
        BackButtonComponent,
        MessageModalComponent,
        DeleteButtonComponent
      ],
      imports: [
        NgbModule,
        HttpClientTestingModule,
        FontAwesomeModule,
        TranslateModule.forRoot(),
        RouterTestingModule
      ]
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
