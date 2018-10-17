import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswdModalComponent } from './change-passwd-modal.component';

describe('ChangePasswdModalComponent', () => {
  let component: ChangePasswdModalComponent;
  let fixture: ComponentFixture<ChangePasswdModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangePasswdModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswdModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
