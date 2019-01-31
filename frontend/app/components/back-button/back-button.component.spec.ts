import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackButtonComponent } from './back-button.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('BackButtonComponent', () => {
  let component: BackButtonComponent;
  let fixture: ComponentFixture<BackButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BackButtonComponent],
      imports: [FontAwesomeModule, RouterTestingModule, TranslateModule.forRoot()],
      providers: [TranslateService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
