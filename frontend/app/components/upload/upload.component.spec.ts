import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UploadComponent } from './upload.component';
import { ngfModule } from 'angular-file';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

describe('UploadComponent', () => {
  let component: UploadComponent;
  let fixture: ComponentFixture<UploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UploadComponent],
      imports: [ngfModule, RouterTestingModule,
        HttpClientTestingModule, FontAwesomeModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
