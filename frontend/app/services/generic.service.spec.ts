import { TestBed, inject } from '@angular/core/testing';

import { GenericService } from './generic.service';
import { RouterTestingModule } from '@angular/router/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

describe('GenericService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, FontAwesomeModule],
      providers: [GenericService]
    });
  });

  it('should be created', inject([GenericService], (service: GenericService) => {
    expect(service).toBeTruthy();
  }));
});
