import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import {
  HttpClientTestingModule
} from '@angular/common/http/testing';

import { OrderDetailComponent } from './order-detail.component';
import { BackButtonComponent } from '../../components/back-button/back-button.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { EditButtonComponent } from 'frontend/app/components/edit-button/edit-button.component';
import { DeleteButtonComponent } from 'frontend/app/components/delete-button/delete-button.component';

describe('OrderDetailComponent', () => {
  let component: OrderDetailComponent;
  let fixture: ComponentFixture<OrderDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        OrderDetailComponent, BackButtonComponent, EditButtonComponent, DeleteButtonComponent
      ],
      providers: [TranslateService],
      imports: [
        NgbModule,
        HttpClientTestingModule,
        RouterTestingModule,
        FontAwesomeModule,
        NgxSpinnerModule,
        TranslateModule.forRoot()
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
