import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { MachineService } from './machine.service';

import { config } from '../config/config';

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

let machines = [];
machines = machines.concat(lasercutters, printers, millingMachines, otherMachines);

describe('MachineService', () => {
  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MachineService],
      imports: [HttpClientTestingModule]
    });
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should be created', inject([MachineService], (service: MachineService) => {
    expect(service).toBeTruthy();
  }));

  it('should get all machines', inject([MachineService], (MachineService) => {
    const mockResponse = {
      data: []
    };

    mockResponse.data.concat(lasercutters, millingMachines, printers, otherMachines);

    MachineService.getAllMachines().then((machines) => {
      expect(machines).toBeTruthy();
      expect(machines.length).toEqual(8);
    }, fail);

    const req = httpTestingController.expectOne(config.backendUrl + '/machines' + '/');
    expect(req.request.method).toEqual('GET');

    req.flush(machines);
  }));

  it('should get all printers', inject([MachineService], (MachineService) => {
    MachineService.getAll('printer').then((printers) => {
      expect(printers).toBeTruthy();
      expect(printers.length).toEqual(2);
      expect(printers[0].id).toEqual('5b5368ad9f08d5319db21fea');
      expect(printers[0].deviceName).toEqual('Dimension Elite');
      expect(printers[0].manufacturer).toEqual('Stratasys');
      expect(printers[1].id).toEqual('5b5368ad9f08d5319db21feb');
      expect(printers[1].deviceName).toEqual('MakerBot');
      expect(printers[1].manufacturer).toEqual('Replicator');
    }, fail);

    const req = httpTestingController.expectOne(config.backendUrl + '/machines' + '/printers');
    expect(req.request.method).toEqual('GET');

    req.flush(printers);
  }));

  it('should get all lasercutters', inject([MachineService], (MachineService) => {
    MachineService.getAll('lasercutter').then((lasercutters) => {
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
    }, fail);

    const req = httpTestingController.expectOne(config.backendUrl + '/machines' + '/lasercutters');
    expect(req.request.method).toEqual('GET');

    req.flush(lasercutters);
  }));

  it('should get all milling machines', inject([MachineService], (MachineService) => {
    MachineService.getAll('millingMachine').then((millingMachines) => {
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
    }, fail);

    const req = httpTestingController.expectOne(config.backendUrl + '/machines' + '/millingMachines');
    expect(req.request.method).toEqual('GET');

    req.flush(millingMachines);
  }));

  it('should get all other machines', inject([MachineService], (MachineService) => {
    MachineService.getAll('otherMachine').then((otherMachines) => {
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
    }, fail);

    const req = httpTestingController.expectOne(config.backendUrl + '/machines' + '/otherMachines');
    expect(req.request.method).toEqual('GET');

    req.flush(otherMachines);
  }));
});
