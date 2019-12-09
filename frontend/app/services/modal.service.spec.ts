import { TestBed, inject } from '@angular/core/testing';

import { ModalService } from './modal.service';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';

describe('ModalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModalService],
      imports: [NgbModalModule, RouterTestingModule]
    });
  });

  it('should be created', inject([ModalService], (service: ModalService) => {
    expect(service).toBeTruthy();
  }));
});
