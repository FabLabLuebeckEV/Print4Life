import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
} from '@angular/common/http/testing';

import {
  Response,
  ResponseOptions,
  XHRBackend
} from '@angular/http';

import { MachineService } from './machine.service';

import { MockBackend } from '@angular/http/testing';

const lasercutters = [{
  'id': '5b5368ad9f08d5319db21ff8',
  'fablabId': 2,
  'type': 'lasercutter',
  'deviceName': 'Helix',
  'manufacturer': 'Epilog',
  'laserTypes': [],
  'camSoftware': '',
  'workspaceX': 600,
  'workspaceY': 450,
  'workspaceZ': 350,
  'laserPower': '40',
  'comment': '',
},
{
  'id': '5b5368ad9f08d5319db21ff9',
  'fablabId': 4,
  'type': 'lasercutter',
  'deviceName': 'MARS-130',
  'manufacturer': 'Thunderlaser',
  'laserTypes': [],
  'camSoftware': 'RD-Works',
  'workspaceX': 1500,
  'workspaceY': 900,
  'workspaceZ': 250,
  'laserPower': '100',
  'comment': '',
}];

const millingMachines = [{
  'id': '5b5569ab5cf4a957484aa97f',
  'fablabId': 3,
  'type': 'millingMachine',
  'deviceName': 'High-Z S-720T',
  'manufacturer': 'CNC-Step',
  'camSoftware': '',
  'workspaceX': 720,
  'workspaceY': 420,
  'workspaceZ': 110,
  'movementSpeed': 0,
  'stepSize': null,
  'comment': ''
},
{
  'id': '5b5569c45cf4a957484aa98c',
  'fablabId': 2,
  'type': 'millingMachine',
  'deviceName': 'PRSALPHA',
  'manufacturer': 'SHOPBOT',
  'camSoftware': '',
  'workspaceX': 2550,
  'workspaceY': 1500,
  'workspaceZ': 200,
  'movementSpeed': 12000,
  'stepSize': null,
  'comment': ''
}];

const printers = [{
  'id': '5b5368ad9f08d5319db21fea',
  'fablabId': 2,
  'type': 'printer',
  'deviceName': 'Dimension Elite',
  'manufacturer': 'Stratasys',
  'materials': [],
  'camSoftware': '',
  'printVolumeX': 203,
  'printVolumeY': 203,
  'printVolumeZ': 305,
  'printResolutionX': 0.1,
  'printResolutionY': 0.1,
  'printResolutionZ': 1.75,
  'nozzleDiameter': 0.4,
  'numberOfExtruders': 2,
  'comment': 'Dissolvable support (acidbath)\n'
},
{
  'id': '5b5368ad9f08d5319db21feb',
  'fablabId': 3,
  'type': 'printer',
  'deviceName': 'MakerBot',
  'manufacturer': 'Replicator',
  'materials': [],
  'camSoftware': '',
  'printVolumeX': 295,
  'printVolumeY': 295,
  'printVolumeZ': 165,
  'printResolutionX': null,
  'printResolutionY': null,
  'printResolutionZ': 0.1,
  'nozzleDiameter': 0.4,
  'numberOfExtruders': 1,
  'comment': 'no heatbed'
}];

const otherMachines = [{
  'id': '5b5368ad9f08d5319db21ffc',
  'fablabId': 2,
  'type': 'otherMachine',
  'deviceName': 'na',
  'manufacturer': 'Malcomplast (Italy)',
  'typeOfMachine': 'Acrylic bender',
  'comment': ''
},
{
  'id': '5b5368ad9f08d5319db21ffd',
  'fablabId': 3,
  'type': 'otherMachine',
  'deviceName': 'T-962A',
  'manufacturer': 'puhui',
  'typeOfMachine': 'PCB Reflow Solder Machine',
  'comment': ''
}];

describe('MachineService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MachineService, { provide: XHRBackend, useClass: MockBackend }],
      imports: [HttpClientTestingModule]
    });
  });

  it('should be created', inject([MachineService], (service: MachineService) => {
    expect(service).toBeTruthy();
  }));

  it('should get all machines', inject([MachineService, XHRBackend], (MachineService, mockBackend) => {
    const mockResponse = {
      data: []
    };

    mockResponse.data.concat(lasercutters, millingMachines, printers, otherMachines);

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(new ResponseOptions({
        body: JSON.stringify(mockResponse)
      })));
    });

    MachineService.getAllMachines().then((machines) => {
      expect(machines).toBeTruthy();
      expect(machines.length).toEqual(8);
    });
  }));

  it('should get all printers', inject([MachineService, XHRBackend], (MachineService, mockBackend) => {
    const mockResponse = {
      data: []
    };

    mockResponse.data.concat(printers);

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(new ResponseOptions({
        body: JSON.stringify(mockResponse)
      })));
    });

    MachineService.getAllPrinters().then((printers) => {
      expect(printers).toBeTruthy();
      expect(printers.length).toEqual(2);
      expect(printers[0].id).toEqual('5b5368ad9f08d5319db21fea');
      expect(printers[0].deviceName).toEqual('Dimension Elite');
      expect(printers[0].manufacturer).toEqual('Stratasys');
      expect(printers[1].id).toEqual('5b5368ad9f08d5319db21feb');
      expect(printers[1].deviceName).toEqual('MakerBot');
      expect(printers[1].manufacturer).toEqual('Replicator');
    });
  }));

  it('should get all lasercutters', inject([MachineService, XHRBackend], (MachineService, mockBackend) => {
    const mockResponse = {
      data: []
    };

    mockResponse.data.concat(lasercutters);

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(new ResponseOptions({
        body: JSON.stringify(mockResponse)
      })));
    });

    MachineService.getAllLasercutters().then((lasercutters) => {
      expect(lasercutters).toBeTruthy();
      expect(lasercutters.length).toEqual(2);
      expect(lasercutters[0].id).toEqual('5b5368ad9f08d5319db21ff8');
      expect(lasercutters[0].deviceName).toEqual('Helix');
      expect(lasercutters[0].manufacturer).toEqual('Epilog');
      expect(lasercutters[0].type).toEqual('lasercutter');
      expect(lasercutters[1].id).toEqual('5b5368ad9f08d5319db21ff9');
      expect(lasercutters[1].deviceName).toEqual('MARS-130');
      expect(lasercutters[1].manufacturer).toEqual('Thunderlaser');
      expect(lasercutters[1].type).toEqual('lasercutter');
    });
  }));

  it('should get all milling machines', inject([MachineService, XHRBackend], (MachineService, mockBackend) => {
    const mockResponse = {
      data: []
    };

    mockResponse.data.concat(millingMachines);

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(new ResponseOptions({
        body: JSON.stringify(mockResponse)
      })));
    });

    MachineService.getAllMillingMachines().then((millingMachines) => {
      expect(millingMachines).toBeTruthy();
      expect(millingMachines.length).toEqual(2);
      expect(millingMachines[0].id).toEqual('5b5569ab5cf4a957484aa97f');
      expect(millingMachines[0].deviceName).toEqual('High-Z S-720T');
      expect(millingMachines[0].manufacturer).toEqual('CNC-Step');
      expect(millingMachines[0].type).toEqual('millingMachine');
      expect(millingMachines[1].id).toEqual('5b5569c45cf4a957484aa98c');
      expect(millingMachines[1].deviceName).toEqual('PRSALPHA');
      expect(millingMachines[1].manufacturer).toEqual('SHOPBOT');
      expect(millingMachines[1].type).toEqual('millingMachine');
    });
  }));

  it('should get all other machines', inject([MachineService, XHRBackend], (MachineService, mockBackend) => {
    const mockResponse = {
      data: []
    };

    mockResponse.data.concat(otherMachines);

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(new ResponseOptions({
        body: JSON.stringify(mockResponse)
      })));
    });

    MachineService.getAllOtherMachines().then((otherMachines) => {
      expect(otherMachines).toBeTruthy();
      expect(otherMachines.length).toEqual(2);
      expect(otherMachines[0].id).toEqual('5b5368ad9f08d5319db21ffc');
      expect(otherMachines[0].deviceName).toEqual('na');
      expect(otherMachines[0].manufacturer).toEqual('Malcomplast (Italy)');
      expect(otherMachines[0].type).toEqual('otherMachine');
      expect(otherMachines[1].id).toEqual('5b5368ad9f08d5319db21ffd');
      expect(otherMachines[1].deviceName).toEqual('T-962A');
      expect(otherMachines[1].manufacturer).toEqual('puhui');
      expect(otherMachines[1].type).toEqual('otherMachine');
    });
  }));
});
