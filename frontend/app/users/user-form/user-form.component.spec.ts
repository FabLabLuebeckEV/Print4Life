import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFormComponent } from './user-form.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { BackButtonComponent } from '../../components/back-button/back-button.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import {
  HttpClientTestingModule
} from '@angular/common/http/testing';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UserFormComponent, BackButtonComponent
      ],
      providers: [TranslateService],
      imports: [
        NgbModule,
        RouterTestingModule,
        FontAwesomeModule,
        FormsModule,
        NgSelectModule,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
