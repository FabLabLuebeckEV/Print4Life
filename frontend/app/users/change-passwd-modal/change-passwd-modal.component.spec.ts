import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ChangePasswdModalComponent } from './change-passwd-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('ChangePasswdModalComponent', () => {
  let component: ChangePasswdModalComponent;
  let fixture: ComponentFixture<ChangePasswdModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChangePasswdModalComponent],
      imports: [
        NgbModule.forRoot(),
        FormsModule,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        NgbActiveModal,
        TranslateService
      ]
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
