import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule
} from '@angular/common/http/testing';

import { FablabService } from './fablab.service';

describe('FablabService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FablabService],
      imports: [HttpClientTestingModule]
    });
  });

  it('should be created', inject([FablabService], (service: FablabService) => {
    expect(service).toBeTruthy();
  }));
});
