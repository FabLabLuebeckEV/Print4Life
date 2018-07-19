import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule
} from '@angular/common/http/testing';

import { MachineListComponent } from './machine-list.component';

describe('MachineListComponent', () => {
  let component: MachineListComponent;
  let fixture: ComponentFixture<MachineListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MachineListComponent],
      imports: [HttpClientTestingModule]
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
