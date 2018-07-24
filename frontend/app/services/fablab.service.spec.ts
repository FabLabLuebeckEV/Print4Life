import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { FablabService } from './fablab.service';

import { config } from '../config/config';

describe('FablabService', () => {
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FablabService],
      imports: [HttpClientTestingModule]
    });
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should be created', inject([FablabService], (FablabService) => {
    expect(FablabService).toBeTruthy();
  }));

  it('should get a fablab', inject([FablabService], (FablabService) => {
    const mockResponse = [{
      'id': 1,
      'name': 'test',
      'phone': '1234',
      'mail': 'test@test.de',
      'password': '$2y$10$sDebOY1Kx8LZNczsF3XjoOqdZHRJK0J80hc7SdEZ19hKDFmkx0owG'
    }];

    FablabService.getFablab(1).then((fablab) => {
      expect(fablab).toBeTruthy();
      expect(fablab.name).toEqual('test');
      expect(fablab.phone).toEqual('1234');
      expect(fablab.mail).toEqual('test@test.de');
      expect(fablab.password).toEqual('$2y$10$sDebOY1Kx8LZNczsF3XjoOqdZHRJK0J80hc7SdEZ19hKDFmkx0owG');
    }, fail);

    const req = httpTestingController.expectOne(config.backendUrl + '/fablab' + '/1');
    expect(req.request.method).toEqual('GET');

    req.flush(mockResponse[0]);
  }));
});
