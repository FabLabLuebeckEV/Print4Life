import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OctoprintModalComponent } from './octoprint-modal.component';

describe('OctoprintModalComponent', () => {
  let component: OctoprintModalComponent;
  let fixture: ComponentFixture<OctoprintModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OctoprintModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OctoprintModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
