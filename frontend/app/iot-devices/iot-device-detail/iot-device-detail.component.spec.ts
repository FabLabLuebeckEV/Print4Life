import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule
} from '@angular/common/http/testing';
import { IotDeviceDetailComponent } from './iot-device-detail.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('IotDeviceDetailComponent', () => {
  let component: IotDeviceDetailComponent;
  let fixture: ComponentFixture<IotDeviceDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IotDeviceDetailComponent],
      imports: [
        HttpClientTestingModule,
        NgbModule.forRoot(),
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
