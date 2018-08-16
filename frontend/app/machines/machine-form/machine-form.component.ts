import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MachineService } from '../../services/machine.service';
import { FablabService } from '../../services/fablab.service';
import { Machine, Printer, MillingMachine, OtherMachine, Lasercutter, Material, Lasertype } from '../../models/machines.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageModalComponent, ModalButton } from '../../components/message-modal/message-modal.component';
import { ConfigService } from '../../config/config.service';
import { routes } from '../../config/routes';

@Component({
  selector: 'app-machine-form',
  templateUrl: './machine-form.component.html',
  styleUrls: ['./machine-form.component.css']
})
export class MachineFormComponent implements OnInit {
  config: any;
  backArrow: any;
  machineTypes: Array<String> = [];
  selectedType: String;
  editView: Boolean;
  submitted: Boolean = false;
  model: Machine;
  fablabs: Array<any>;
  materialsArr: Array<Material>;
  laserTypesArr: Array<Lasertype>;
  loadingFablabs: Boolean;
  loadingMaterials: Boolean;
  loadingLaserTypes: Boolean;

  constructor(private machineService: MachineService, private fablabService: FablabService,
    private router: Router, private location: Location, private route: ActivatedRoute,
    private modalService: NgbModal, private configService: ConfigService) {
    this.config = this.configService.getConfig();
    this.backArrow = this.config.icons.back;
    this.route.params.subscribe(params => {
      if (params.type && params.id) {
        const type = params.type.substr(0, params.type.length - 1);
        this.machineService.get(type, params.id).then((result) => {
          this.model = result[type];
          this.selectedType = this.machineService._uncamelCase(type);
          this._loadFablabs();
          this._loadMaterials(this.selectedType);
          this._loadLaserTypes();
        });
      }
    });
    this.router.events.subscribe(() => {
      const route = this.location.path();
      if (route.indexOf('/update') >= 0 && !this.editView) {
        this.editView = true;
      } else {
        if (this.editView) {
        }
        this.editView = false;
      }
      this._loadMachineTypes();
    });
  }

  public back() {
    this.location.back();
  }

  ngOnInit() {
    this._selectType('');
    this.loadingFablabs = true;
    this._loadFablabs();
    this._loadMaterials(this.selectedType);
    this._loadLaserTypes();
  }

  onSubmit() {
    if (!this.editView) {
      this.machineService.create(this.machineService.camelCaseTypes(this.selectedType), this.model).then((result) => {
        if (result) {
          this._openSuccessMsg();
        } else {
          this._openErrMsg(undefined);
        }
        this.submitted = true;
      }).catch((err) => {
        this._openErrMsg(err);
      });
    } else {
      this.machineService.update(this.machineService.camelCaseTypes(this.selectedType), this.model._id, this.model).then((result) => {
        if (result) {
          this._openSuccessMsg();
        } else {
          this._openErrMsg(undefined);
        }
        this.submitted = true;
      }).catch((err) => {
        this._openErrMsg(err);
      });
    }

  }

  private _openSuccessMsg() {
    const okButton = new ModalButton('Ok', 'btn btn-primary', 'Ok');
    let msgHeader;
    let msg;
    this.editView ? msgHeader = 'Machine updated successfully' : msgHeader = 'Machine created successfully';
    this.editView ? msg = 'Updating the machine was successful!' : msg = 'The creation of a new machine was successful!';
    this._openMsgModal(msgHeader, 'modal-header header-success',
      msg, okButton, undefined).result.then(() => {
        this.back();
      });
  }

  private _openErrMsg(err) {
    let errorMsg;
    this.editView ? errorMsg = 'Something went wrong while updating the machine'
      : errorMsg = `Something went wrong while creating the new machine.`;
    if (err) {
      errorMsg += ` Error: ${err}`;
    }
    const okButton = new ModalButton('Ok', 'btn btn-primary', 'Ok');
    this._openMsgModal('Error', 'modal-header header-danger', errorMsg,
      okButton, undefined);
  }

  private _openMsgModal(title: String, titleClass: String, msg: String, button1: ModalButton, button2: ModalButton) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.titleClass = titleClass;
    modalRef.componentInstance.msg = msg;
    modalRef.componentInstance.button1 = button1;
    modalRef.componentInstance.button2 = button2;
    return modalRef;
  }

  private async _loadLaserTypes() {
    this.loadingLaserTypes = true;
    this.laserTypesArr = (await this.machineService.getLaserTypes()).laserTypes;
    this.loadingLaserTypes = false;
  }

  private _selectType(type) {
    this.selectedType = type;
    this.model = this._initModel(this.selectedType);
    this.loadingMaterials = true;
    this._loadMaterials(this.selectedType);
  }

  private async _loadMachineTypes() {
    this.machineTypes = (await this.machineService.getAllMachineTypes()).types;
  }

  private async _loadFablabs() {
    this.fablabs = (await this.fablabService.getFablabs()).fablabs;
    this.loadingFablabs = false;
  }

  private async _loadMaterials(type) {
    if (type && type !== '') {
      this.materialsArr = (await this.machineService.getMaterialsByMachineType(this.machineService.camelCaseTypes(type))).materials;
      this.loadingMaterials = false;
    }
  }

  private _initModel(type) {
    switch (type) {
      case 'Printer':
        return new Printer(undefined, undefined, undefined,
          this.machineService.camelCaseTypes(type), undefined, undefined, undefined, undefined, undefined,
          undefined, undefined, undefined, undefined, undefined, undefined,
          undefined, undefined);
      case 'Milling Machine':
        return new MillingMachine(undefined, undefined, undefined, this.machineService.camelCaseTypes(type),
          undefined, undefined, undefined, undefined, undefined, undefined,
          undefined, undefined, undefined);
      case 'Other Machine':
        return new OtherMachine(undefined, undefined, undefined, this.machineService.camelCaseTypes(type),
          undefined, undefined, undefined, undefined);
      case 'Lasercutter':
        return new Lasercutter(undefined, undefined, undefined, this.machineService.camelCaseTypes(type),
          undefined, undefined, undefined, undefined, undefined, undefined,
          undefined, undefined, undefined, undefined);
      default:
        return new Machine(undefined, undefined, undefined, undefined, this.machineService.camelCaseTypes(type), undefined);
    }
  }

}
