import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TableComponent } from '../../components/table/table.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import {
  HttpClientTestingModule
} from '@angular/common/http/testing';

import { MachineListComponent } from './machine-list.component';
import { ConfigService } from '../../config/config.service';
import { MachineService } from '../../services/machine.service';
import { FablabService } from '../../services/fablab.service';
import { MachineFormComponent } from '../machine-form/machine-form.component';
import { MachineDetailComponent } from '../machine-detail/machine-detail.component';

describe('MachineListComponent', () => {
  let component: MachineListComponent;
  let fixture: ComponentFixture<MachineListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MachineListComponent, MachineFormComponent, MachineDetailComponent, TableComponent],
      imports: [
        NgSelectModule,
        FormsModule,
        NgxSpinnerModule,
        HttpClientTestingModule,
        RouterTestingModule,
        FontAwesomeModule,
        NgbModule.forRoot()],
      providers: [NgxSpinnerService, ConfigService, MachineService, FablabService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
