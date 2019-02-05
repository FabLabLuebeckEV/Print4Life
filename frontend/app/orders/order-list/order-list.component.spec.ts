import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TableComponent } from '../../components/table/table.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageModalComponent } from '../../components/message-modal/message-modal.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TranslateModule, TranslateService } from '@ngx-translate/core';


import {
  HttpClientTestingModule
} from '@angular/common/http/testing';

import { OrderListComponent } from './order-list.component';
import { ConfigService } from '../../config/config.service';
import { ValidationService } from 'frontend/app/services/validation.service';
import { AddButtonComponent } from 'frontend/app/components/add-button/add-button.component';

describe('OrderListComponent', () => {
  let component: OrderListComponent;
  let fixture: ComponentFixture<OrderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        OrderListComponent,
        TableComponent,
        MessageModalComponent,
        AddButtonComponent
      ],
      imports: [
        NgbModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule,
        FontAwesomeModule,
        NgSelectModule,
        FormsModule,
        NgxSpinnerModule,
        TranslateModule.forRoot()
      ],
      providers: [NgxSpinnerService, ConfigService, TranslateService, ValidationService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
