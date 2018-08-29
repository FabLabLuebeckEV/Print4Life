import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { MachineFormComponent } from './machine-form.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfigService } from '../../config/config.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BackButtonComponent } from '../../components/back-button/back-button.component';

import {
  HttpClientTestingModule
} from '@angular/common/http/testing';

describe('MachineFormComponent', () => {
  let component: MachineFormComponent;
  let fixture: ComponentFixture<MachineFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MachineFormComponent, BackButtonComponent],
      imports: [
        NgbModule.forRoot(),
        RouterTestingModule,
        HttpClientTestingModule,
        FontAwesomeModule,
        FormsModule,
        NgSelectModule],
      providers: [ConfigService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
