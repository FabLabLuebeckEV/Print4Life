import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import {
  HttpClientTestingModule
} from '@angular/common/http/testing';

import { OrderDetailComponent } from './order-detail.component';
import { BackButtonComponent } from '../../components/back-button/back-button.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';

describe('OrderDetailComponent', () => {
  let component: OrderDetailComponent;
  let fixture: ComponentFixture<OrderDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        OrderDetailComponent, BackButtonComponent
      ],
      imports: [
        NgbModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule,
        FontAwesomeModule
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
