import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { MachineService } from './machine.service';

import { routes } from '../config/routes';

const machineTypes = ['Printer', 'Lasercutter', 'Milling Machine', 'Other Machine'];

const createPrinterTest = {
  '_id': '5b5368ad9f08d5319db21fea',
  'fablabId': '2',
  'type': 'printer',
  'deviceName': 'createPrinterTest',
  'manufacturer': 'Test',
  'materials': [],
  'camSoftware': 'Test',
  'comment': 'Test'
};

const createLasercutterTest = {
  '_id': '5b5368ad9f08d5319db21ff8',
  'fablabId': '2',
  'type': 'lasercutter',
  'deviceName': 'createLasercutterTest',
  'manufacturer': 'Test',
  'laserTypes': [
    {
      '_id': '5b55f7bf3fe0c8b01713b3e4',
      'laserType': 'CO2'
    }
  ],
  'camSoftware': '',
  'workspaceX': 1220,
  'workspaceY': 610,
  'workspaceZ': 250,
  'laserPower': '75',
  'comment': 'Test'
};

const createMillingMachineTest = {
  '_id': '5b5569ab5cf4a957484aa97f',
  'fablabId': '2',
  'type': 'millingMachine',
  'deviceName': 'createMillingMachineTest',
  'manufacturer': 'Test',
  'camSoftware': '',
  'workspaceX': 500,
  'workspaceY': 500,
  'workspaceZ': 350,
  'movementSpeed': 12000,
  'stepSize': null,
  'comment': 'Test'
};

const createOtherMachineTest = {
  '_id': '5b5368ad9f08d5319db21ffc',
  'fablabId': '2',
  'type': 'otherMachine',
  'deviceName': 'createOtherMachineTest',
  'manufacturer': 'Test',
  'typeOfMachine': 'Cutting Plotter',
  'comment': 'Test'
};

const laserTypes = [
  {
    '_id': '5b55f7bf3fe0c8b01713b3dc',
    'laserType': 'CO2'
  }
];

const printerMaterials = [
  {
    '_id': '5b55f7bf3fe0c8b01713b3e0',
    'material': 'Plaster',
    'type': 'printerMaterial'
  },
  {
    '_id': '5b55f7bf3fe0c8b01713b3dd',
    'material': 'PLA',
    'type': 'printerMaterial'
  },
  {
    '_id': '5b55f7bf3fe0c8b01713b3e1',
    'material': 'Other',
    'type': 'printerMaterial'
  },
  {
    '_id': '5b55f7bf3fe0c8b01713b3de',
    'material': 'ABS',
    'type': 'printerMaterial'
  },
  {
    '_id': '5b55f7bf3fe0c8b01713b3df',
    'material': 'Resin',
    'type': 'printerMaterial'
  }
];

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
    MachineService.getAllMachines().then((machines) => {
      expect(machines).toBeTruthy();
      expect(machines.length).toEqual(8);
    }, fail);

    const req = httpTestingController.expectOne(routes.backendUrl + '/machines' + '/');
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

    const req = httpTestingController.expectOne(routes.backendUrl + '/machines' + '/printers');
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

    const req = httpTestingController.expectOne(routes.backendUrl + '/machines' + '/lasercutters');
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

    const req = httpTestingController.expectOne(routes.backendUrl + '/machines' + '/millingMachines');
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

    const req = httpTestingController.expectOne(routes.backendUrl + '/machines' + '/otherMachines');
    expect(req.request.method).toEqual('GET');

    req.flush(otherMachines);
  }));

  it('should get all machine types', inject([MachineService], (MachineService) => {
    MachineService.getAllMachineTypes().then((machineTypes) => {
      expect(machineTypes).toBeTruthy();
      expect(machineTypes.length).toEqual(4);
      expect(machineTypes[0]).toEqual('Printer');
      expect(machineTypes[1]).toEqual('Lasercutter');
      expect(machineTypes[2]).toEqual('Milling Machine');
      expect(machineTypes[3]).toEqual('Other Machine');
    }, fail);

    const req = httpTestingController.expectOne(routes.backendUrl + '/machines' + '/types');
    expect(req.request.method).toEqual('GET');

    req.flush(machineTypes);
  }));

  it('should get all materials for printers', inject([MachineService], (MachineService) => {
    MachineService.getMaterialsByMachineType('printer').then((materials) => {
      expect(materials).toBeTruthy();
      expect(materials.length).toEqual(5);
      expect(materials[0].material).toEqual('Plaster');
      expect(materials[1].material).toEqual('PLA');
      expect(materials[2].material).toEqual('Other');
      expect(materials[3].material).toEqual('ABS');
      expect(materials[4].material).toEqual('Resin');
    }, fail);

    const req = httpTestingController.expectOne(routes.backendUrl + '/machines/materials' + '/printer');
    expect(req.request.method).toEqual('GET');

    req.flush(printerMaterials);
  }));

  it('should create printer', inject([MachineService], (MachineService) => {
    MachineService.create('printer', createPrinterTest).then((printer) => {
      expect(printer).toBeTruthy();
      expect(printer.deviceName).toEqual('createPrinterTest');
      expect(printer.manufacturer).toEqual('Test');
      expect(printer.comment).toEqual('Test');
      expect(printer.fablabId).toEqual('2');
    }, fail);

    const req = httpTestingController.expectOne(routes.backendUrl + '/machines/printers/');
    expect(req.request.method).toEqual('POST');

    req.flush(createPrinterTest);
  }));

  it('should create lasercutter', inject([MachineService], (MachineService) => {
    MachineService.create('lasercutter', createLasercutterTest).then((lasercutter) => {
      expect(lasercutter).toBeTruthy();
      expect(lasercutter.deviceName).toEqual('createLasercutterTest');
      expect(lasercutter.manufacturer).toEqual('Test');
      expect(lasercutter.comment).toEqual('Test');
      expect(lasercutter.laserTypes[0].laserType).toEqual('CO2');
      expect(lasercutter.fablabId).toEqual('2');
    }, fail);

    const req = httpTestingController.expectOne(routes.backendUrl + '/machines/lasercutters/');
    expect(req.request.method).toEqual('POST');

    req.flush(createLasercutterTest);
  }));

  it('should create milling machine', inject([MachineService], (MachineService) => {
    MachineService.create('millingMachine', createMillingMachineTest).then((millingMachine) => {
      expect(millingMachine).toBeTruthy();
      expect(millingMachine.deviceName).toEqual('createMillingMachineTest');
      expect(millingMachine.manufacturer).toEqual('Test');
      expect(millingMachine.comment).toEqual('Test');
      expect(millingMachine.fablabId).toEqual('2');
    }, fail);

    const req = httpTestingController.expectOne(routes.backendUrl + '/machines/millingMachines/');
    expect(req.request.method).toEqual('POST');

    req.flush(createMillingMachineTest);
  }));

  it('should create other machine', inject([MachineService], (MachineService) => {
    MachineService.create('otherMachine', createOtherMachineTest).then((otherMachine) => {
      expect(otherMachine).toBeTruthy();
      expect(otherMachine.deviceName).toEqual('createOtherMachineTest');
      expect(otherMachine.manufacturer).toEqual('Test');
      expect(otherMachine.comment).toEqual('Test');
      expect(otherMachine.fablabId).toEqual('2');
    }, fail);

    const req = httpTestingController.expectOne(routes.backendUrl + '/machines/otherMachines/');
    expect(req.request.method).toEqual('POST');

    req.flush(createOtherMachineTest);
  }));

  it('should update printer', inject([MachineService], (MachineService) => {
    const updatedMachine = JSON.parse(JSON.stringify(createPrinterTest));
    updatedMachine.deviceName = 'Test Update';
    updatedMachine.manufacturer = 'updated';
    MachineService.update('printer', createPrinterTest._id, createPrinterTest).then((updated) => {
      expect(updated).toBeTruthy();
      expect(updated.deviceName).toEqual(updatedMachine.deviceName);
      expect(updated.manufacturer).toEqual(updatedMachine.manufacturer);
      expect(updated.comment).toEqual(updatedMachine.comment);
      expect(updated.fablabId).toEqual(updatedMachine.fablabId);
    }, fail);

    const req = httpTestingController.expectOne(routes.backendUrl + '/machines/printers/' + updatedMachine._id);
    expect(req.request.method).toEqual('PUT');

    req.flush(updatedMachine);
  }));

  it('should update lasercutter', inject([MachineService], (MachineService) => {
    const updatedMachine = JSON.parse(JSON.stringify(createLasercutterTest));
    updatedMachine.deviceName = 'Test Update';
    updatedMachine.manufacturer = 'updated';
    MachineService.update('lasercutter', createLasercutterTest._id, createLasercutterTest).then((updated) => {
      expect(updated).toBeTruthy();
      expect(updated.deviceName).toEqual(updatedMachine.deviceName);
      expect(updated.manufacturer).toEqual(updatedMachine.manufacturer);
      expect(updated.comment).toEqual(updatedMachine.comment);
      expect(updated.fablabId).toEqual(updatedMachine.fablabId);
    }, fail);

    const req = httpTestingController.expectOne(routes.backendUrl + '/machines/lasercutters/' + updatedMachine._id);
    expect(req.request.method).toEqual('PUT');

    req.flush(updatedMachine);
  }));

  it('should update milling machines', inject([MachineService], (MachineService) => {
    const updatedMachine = JSON.parse(JSON.stringify(createMillingMachineTest));
    updatedMachine.deviceName = 'Test Update';
    updatedMachine.manufacturer = 'updated';
    MachineService.update('millingMachine', createMillingMachineTest._id, createMillingMachineTest).then((updated) => {
      expect(updated).toBeTruthy();
      expect(updated.deviceName).toEqual(updatedMachine.deviceName);
      expect(updated.manufacturer).toEqual(updatedMachine.manufacturer);
      expect(updated.comment).toEqual(updatedMachine.comment);
      expect(updated.fablabId).toEqual(updatedMachine.fablabId);
    }, fail);

    const req = httpTestingController.expectOne(routes.backendUrl + '/machines/millingMachines/' + updatedMachine._id);
    expect(req.request.method).toEqual('PUT');

    req.flush(updatedMachine);
  }));

  it('should update other machines', inject([MachineService], (MachineService) => {
    const updatedMachine = JSON.parse(JSON.stringify(createOtherMachineTest));
    updatedMachine.deviceName = 'Test Update';
    updatedMachine.manufacturer = 'updated';
    MachineService.update('otherMachine', createOtherMachineTest._id, createOtherMachineTest).then((updated) => {
      expect(updated).toBeTruthy();
      expect(updated.deviceName).toEqual(updatedMachine.deviceName);
      expect(updated.manufacturer).toEqual(updatedMachine.manufacturer);
      expect(updated.comment).toEqual(updatedMachine.comment);
      expect(updated.fablabId).toEqual(updatedMachine.fablabId);
    }, fail);

    const req = httpTestingController.expectOne(routes.backendUrl + '/machines/otherMachines/' + updatedMachine._id);
    expect(req.request.method).toEqual('PUT');

    req.flush(updatedMachine);
  }));

  it('should delete other machine', inject([MachineService], (MachineService) => {
    MachineService.deleteMachine('otherMachine', createOtherMachineTest._id).then((result) => {
      expect(result).toBeNull();
    }, fail);

    const req = httpTestingController.expectOne(routes.backendUrl + '/machines/otherMachines/' + createOtherMachineTest._id);
    expect(req.request.method).toEqual('DELETE');

    req.flush(null);
  }));

  it('should delete milling machine', inject([MachineService], (MachineService) => {
    MachineService.deleteMachine('millingMachine', createMillingMachineTest._id).then((result) => {
      expect(result).toBeNull();
    }, fail);

    const req = httpTestingController.expectOne(routes.backendUrl + '/machines/millingMachines/' + createMillingMachineTest._id);
    expect(req.request.method).toEqual('DELETE');

    req.flush(null);
  }));

  it('should delete lasercutter', inject([MachineService], (MachineService) => {
    MachineService.deleteMachine('lasercutter', createLasercutterTest._id).then((result) => {
      expect(result).toBeNull();
    }, fail);

    const req = httpTestingController.expectOne(routes.backendUrl + '/machines/lasercutters/' + createLasercutterTest._id);
    expect(req.request.method).toEqual('DELETE');

    req.flush(null);
  }));

  it('should delete printer', inject([MachineService], (MachineService) => {
    MachineService.deleteMachine('printer', createPrinterTest._id).then((result) => {
      expect(result).toBeNull();
    }, fail);

    const req = httpTestingController.expectOne(routes.backendUrl + '/machines/printers/' + createPrinterTest._id);
    expect(req.request.method).toEqual('DELETE');

    req.flush(null);
  }));

  it('should get printer', inject([MachineService], (MachineService) => {
    MachineService.get('printer', createPrinterTest._id).then((printer) => {
      expect(printer).toBeTruthy();
      expect(printer.deviceName).toEqual('createPrinterTest');
      expect(printer.manufacturer).toEqual('Test');
      expect(printer.comment).toEqual('Test');
      expect(printer.fablabId).toEqual('2');
    }, fail);

    const req = httpTestingController.expectOne(routes.backendUrl + '/machines/printers/' + createPrinterTest._id);
    expect(req.request.method).toEqual('GET');

    req.flush(createPrinterTest);
  }));

  it('should get lasercutter', inject([MachineService], (MachineService) => {
    MachineService.get('lasercutter', createLasercutterTest._id).then((lasercutter) => {
      expect(lasercutter).toBeTruthy();
      expect(lasercutter.deviceName).toEqual('createLasercutterTest');
      expect(lasercutter.manufacturer).toEqual('Test');
      expect(lasercutter.comment).toEqual('Test');
      expect(lasercutter.fablabId).toEqual('2');
    }, fail);

    const req = httpTestingController.expectOne(routes.backendUrl + '/machines/lasercutters/' + createLasercutterTest._id);
    expect(req.request.method).toEqual('GET');

    req.flush(createLasercutterTest);
  }));

  it('should get milling machine', inject([MachineService], (MachineService) => {
    MachineService.get('millingMachine', createMillingMachineTest._id).then((millingMachine) => {
      expect(millingMachine).toBeTruthy();
      expect(millingMachine.deviceName).toEqual('createMillingMachineTest');
      expect(millingMachine.manufacturer).toEqual('Test');
      expect(millingMachine.comment).toEqual('Test');
      expect(millingMachine.fablabId).toEqual('2');
    }, fail);

    const req = httpTestingController.expectOne(routes.backendUrl + '/machines/millingMachines/' + createMillingMachineTest._id);
    expect(req.request.method).toEqual('GET');

    req.flush(createMillingMachineTest);
  }));

  it('should get other machine', inject([MachineService], (MachineService) => {
    MachineService.get('otherMachine', createOtherMachineTest._id).then((otherMachine) => {
      expect(otherMachine).toBeTruthy();
      expect(otherMachine.deviceName).toEqual('createOtherMachineTest');
      expect(otherMachine.manufacturer).toEqual('Test');
      expect(otherMachine.comment).toEqual('Test');
      expect(otherMachine.fablabId).toEqual('2');
    }, fail);

    const req = httpTestingController.expectOne(routes.backendUrl + '/machines/otherMachines/' + createOtherMachineTest._id);
    expect(req.request.method).toEqual('GET');

    req.flush(createOtherMachineTest);
  }));
});
