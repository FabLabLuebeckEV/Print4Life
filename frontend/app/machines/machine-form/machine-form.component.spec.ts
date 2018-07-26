import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { MachineFormComponent } from './machine-form.component';
import { NgSelectModule } from '@ng-select/ng-select';

import {
  HttpClientTestingModule
} from '@angular/common/http/testing';

describe('MachineFormComponent', () => {
  let component: MachineFormComponent;
  let fixture: ComponentFixture<MachineFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineFormComponent],
      imports: [RouterTestingModule, HttpClientTestingModule, FormsModule, NgSelectModule]
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
