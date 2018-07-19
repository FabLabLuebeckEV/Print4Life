import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule
} from '@angular/common/http/testing';

import { MachineService } from './machine.service';

describe('MachineService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MachineService],
      imports: [HttpClientTestingModule]
    });
  });

  it('should be created', inject([MachineService], (service: MachineService) => {
    expect(service).toBeTruthy();
  }));
});
