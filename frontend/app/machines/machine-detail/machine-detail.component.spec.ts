import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MachineDetailComponent } from './machine-detail.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfigService } from '../../config/config.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BackButtonComponent } from '../../components/back-button/back-button.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import {
  HttpClientTestingModule
} from '@angular/common/http/testing';

describe('MachineDetailComponent', () => {
  let component: MachineDetailComponent;
  let fixture: ComponentFixture<MachineDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MachineDetailComponent, BackButtonComponent],
      imports: [NgbModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule,
        FontAwesomeModule,
      TranslateModule.forRoot()],
      providers: [ConfigService, TranslateService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
