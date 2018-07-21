import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
} from '@angular/common/http/testing';

import {
  Response,
  ResponseOptions,
  XHRBackend
} from '@angular/http';

import { FablabService } from './fablab.service';

import { MockBackend } from '@angular/http/testing';

describe('FablabService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FablabService, { provide: XHRBackend, useClass: MockBackend }],
      imports: [HttpClientTestingModule]
    });
  });

  it('should be created', inject([FablabService], (FablabService) => {
    expect(FablabService).toBeTruthy();
  }));

  it('gets a fablab', inject([FablabService, XHRBackend], (FablabService, mockBackend) => {
    const mockResponse = {
      data: [
        {
          'id': 1,
          'fid': '1',
          'name': 'test',
          'phone': '1234',
          'mail': 'test@test.de',
          'password': '$2y$10$sDebOY1Kx8LZNczsF3XjoOqdZHRJK0J80hc7SdEZ19hKDFmkx0owG'
        }
      ]
    };

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(new ResponseOptions({
        body: JSON.stringify(mockResponse)
      })));
    });

    FablabService.getFablab(1).then((fablab) => {
      expect(fablab).toBeTruthy();
      expect(fablab.fid).toEqual('1');
      expect(fablab.name).toEqual('test');
      expect(fablab.phone).toEqual('1234');
      expect(fablab.mail).toEqual('test@test.de');
      expect(fablab.password).toEqual('$2y$10$sDebOY1Kx8LZNczsF3XjoOqdZHRJK0J80hc7SdEZ19hKDFmkx0owG');
    });

  }));
});
