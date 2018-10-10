import { TestBed, inject } from '@angular/core/testing';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorService } from './error.service';
import { RouterTestingModule } from '@angular/router/testing';

import {
  HttpClientTestingModule
} from '@angular/common/http/testing';

describe('ErrorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgbModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      providers: [NgbActiveModal, ErrorService]
    });
  });

  it('should be created', inject([ErrorService], (service: ErrorService) => {
    expect(service).toBeTruthy();
  }));
});
