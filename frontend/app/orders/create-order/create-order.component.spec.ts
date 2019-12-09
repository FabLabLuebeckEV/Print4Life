import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { CreateOrderComponent } from './create-order.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfigService } from '../../config/config.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BackButtonComponent } from '../../components/back-button/back-button.component';

import {
  HttpClientTestingModule
} from '@angular/common/http/testing';
import { UploadComponent } from 'frontend/app/components/upload/upload.component';
import { ngfModule } from 'angular-file';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ValidationService } from 'frontend/app/services/validation.service';
import { DeleteButtonComponent } from 'frontend/app/components/delete-button/delete-button.component';

describe('CreateOrderComponent', () => {
  let component: CreateOrderComponent;
  let fixture: ComponentFixture<CreateOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateOrderComponent, BackButtonComponent, UploadComponent, DeleteButtonComponent],
      providers: [ConfigService, TranslateService, NgxSpinnerService, ValidationService],
      imports: [
        ngfModule,
        RouterTestingModule,
        FormsModule,
        HttpClientTestingModule,
        NgSelectModule,
        NgbModule,
        FontAwesomeModule,
        TranslateModule.forRoot(),
        NgxSpinnerModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
