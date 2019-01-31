import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule
} from '@angular/common/http/testing';
import { OctoprintService } from './octoprint.service';

describe('OctoprintService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OctoprintService],
      imports: [HttpClientTestingModule]
    });
  });

  it('should be created', inject([OctoprintService], (service: OctoprintService) => {
    expect(service).toBeTruthy();
  }));
});
