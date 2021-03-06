import { Component, OnInit } from '@angular/core';
import { ConfigService, SpinnerConfig } from '../../config/config.service';
import { routes } from '../../config/routes';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { MachineService } from '../../services/machine.service';
import { Icon } from '@fortawesome/fontawesome-svg-core';
import { FablabService } from '../../services/fablab.service';
import { GenericService } from '../../services/generic.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../services/user.service';
import { User } from 'frontend/app/models/user.model';
import { Schedule } from 'frontend/app/models/schedule.model';
import { ScheduleService } from 'frontend/app/services/schedule.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalService } from '../../services/modal.service';
import { ModalButton } from '../../helper/modal.button';
import { Chart } from 'chart.js';
import { ViewChild, ElementRef } from '@angular/core';

import { TranslationModel } from '../../models/translation.model';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  @ViewChild('chartCanvas', {static: false}) chartCanvas: ElementRef;
  private config: any;
  userIsLoggedIn: boolean;
  loggedInUser: User;
  loadingOrder: boolean;
  userCanDownload: boolean;
  printFilesAvailable: boolean;
  myBatch: Number = 0;
  editIcon: Icon;
  deleteIcon: Icon;
  processIcon: Icon;
  toggleOnIcon: Icon;
  toggleOffIcon: Icon;
  spinnerConfig: SpinnerConfig;
  editLink: String;
  chart: Chart;
  editor: User = new User(
    undefined, undefined, '', '', undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
  editorLink: String;
  owner: User = new User(
    undefined, undefined, '', '', undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
  ownerLink: String;
  order: Order = new Order(
    undefined,
    undefined,
    undefined,
    [],
    undefined,
    undefined,
    [],
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    false,
    undefined,
    undefined,
    undefined,
    {number: 0, accepted: [], acceptedCount: 0, finished: [], finishedCount: 0},
    false
  );
  schedule: Schedule;
  machine: any;
  fablab: any;

  translationFields: TranslationModel.OrderDetail & TranslationModel.DeviceTypes & TranslationModel.Status & TranslationModel.Date;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private machineService: MachineService,
    private fablabService: FablabService,
    private configService: ConfigService,
    private modalService: ModalService,
    private genericService: GenericService,
    private translateService: TranslateService,
    private userService: UserService,
    private scheduleService: ScheduleService,
    private spinner: NgxSpinnerService
  ) {
    this.config = this.configService.getConfig();
    this.editIcon = this.config.icons.edit;
    this.deleteIcon = this.config.icons.delete;
    this.toggleOnIcon = this.config.icons.toggleOn;
    this.toggleOffIcon = this.config.icons.toggleOff;
    this.processIcon = this.config.icons.processIcon;
    this.spinnerConfig = new SpinnerConfig(
      'Loading Order', this.config.spinnerConfig.bdColor,
      this.config.spinnerConfig.size, this.config.spinnerConfig.color, this.config.spinnerConfig.type);
  }

  async ngOnInit() {
    this.translateService.onLangChange.subscribe(() => {
      this._translate();
    });
    this.loggedInUser = await this.userService.getUser();
    console.log(this.loggedInUser);

    this.route.paramMap
      .subscribe(async (params) => {
        if (params && params.get('id')) {
          this.spinner.show();
          this.orderService.getOrderById(params.get('id')).then(async (result) => {
            if (result && result.order) {
              this.order = result.order;
              if (this.order.batch && this.order.batch['number'] && this.order.batch['number'] > 0) {
                this.order['isBatched'] = true;
              }
              this.order.batch['finishedCount'] = 0;
              if (this.order.batch['finished']) {
                this.order.batch['finished'].forEach(batch => {
                  result.order.batch.finishedCount += batch.number;
                  this.fablabService.getFablab(batch.fablab).then(result => {
                    batch.fablab = result.fablab;
                  });
                });
              } else {
                this.order.batch['finished'] = [];
              }

              const loggedInUser = await this.userService.findOwn();

              this.order.batch['acceptedCount'] = 0;
              if (this.order.batch['accepted']) {
                this.order.batch['accepted'].forEach(batch => {
                  if (batch.fablab === loggedInUser.fablabId) {
                    this.myBatch = batch.number;
                  }
                  this.order.batch['acceptedCount'] += batch.number;
                  this.fablabService.getFablab(batch.fablab).then(result => {
                    batch.fablab = result.fablab;
                  });
                });
              } else {
                this.order.batch['accepted'] = [];
              }

              this.loadChart();
              console.log('result is', this.order);

              this.userIsLoggedIn = this.userService.isLoggedIn();
              this.loggedInUser = await this.userService.getUser();
              this.userCanDownload = this.order.shared as boolean || (this.loggedInUser && this.loggedInUser.role &&
                this.loggedInUser.role.role && (this.loggedInUser.role.role === 'editor' || this.loggedInUser.role.role === 'admin'
                  || this.loggedInUser._id === this.order.owner));
              result.order.comments.forEach(async comment => {
                const author = await this.userService.getNamesOfUser(comment.author);
                comment['link'] = `/${routes.paths.frontend.users.root}/${author._id}`;
              });
              result.order.files.forEach(async file => {
                file['link'] = `${routes.backendUrl}/` +
                  `${routes.paths.backend.orders.root}/` +
                  (this.order.shared ? `${routes.paths.backend.orders.shared}/` : ``) +
                  `${this.order._id}/` +
                  `${routes.paths.backend.orders.files}/${file.id}?token=${this.userService.getToken()}`;
              });
              // sort files to show deprecated last
              this.orderService.sortFilesByDeprecated(result.order.files);
              this.owner = await this.userService.getNamesOfUser(this.order.owner);
              this.owner['fullname'] = this.owner.firstname + ' ' + this.owner.lastname;
              this.ownerLink = `/${routes.paths.frontend.users.root}/${this.owner._id}`;
              if (this.order.editor) {
                this.editor = await this.userService.getNamesOfUser(this.order.editor);
                this.editor['fullname'] = this.editor.firstname + ' ' + this.editor.lastname;
                this.editorLink = `/${routes.paths.frontend.users.root}/${this.editor._id}`;
              }
              this.order.comments.forEach(async (comment) => {
                const author = await this.userService.getNamesOfUser(comment.author);
                comment['authorName'] = author.firstname + ' ' + author.lastname;
              });
              try {
                const res = await this.orderService.getSchedule(this.order._id as string);
                if (res) {
                  const schedule: Schedule = res.schedule;
                  this.schedule = this.scheduleService.decompressScheduleDates(schedule);
                }
              } catch (err) {
                this.schedule = undefined;
              }

              this.editLink = `/${routes.paths.frontend.orders.root}/${routes.paths.frontend.orders.update}/${this.order._id}/`;
              this.editLink = this.order.shared
                ? `/${routes.paths.frontend.orders.root}/${routes.paths.frontend.orders.shared.root}/`
                + `${routes.paths.frontend.orders.shared.update}/${this.order._id}/`
                : `/${routes.paths.frontend.orders.root}/${routes.paths.frontend.orders.update}/${this.order._id}/`;
              this.fablabService.getFablab(this.order.fablabId).then(async result => {
                this.fablab = result.fablab;
                if (this.order.machine.type.toLowerCase() !== 'unknown' && this.order.machine._id !== 'unknown') {
                  const result = await this.machineService.get(this.order.machine.type, this.order.machine._id);
                  const type = this.machineService.camelCaseTypes(this.order.machine.type);
                  this.machine = result[`${type}`];
                  if (this.machine !== null && typeof this.machine !== 'undefined') {
                    this.machine['detailView'] = `/${routes.paths.frontend.machines.root}/${type}s/${this.machine._id}/`;
                  }
                } else if (this.order.machine.type.toLowerCase() !== 'unknown' && this.order.machine._id === 'unknown') {
                  this.machine = { type: this.order.machine.type, deviceName: this.translationFields.labels.machineNotSet };
                } else {
                  this.machine = { type: this.order.machine.type };
                }
                this.printFilesAvailable = this.order.files.filter((file) => file.contentType === 'text/x.gcode'
                  || file.filename.split('.')[1] === 'gcode').length > 0;
                this._translate();
                this.spinner.hide();
              });
            }
          });
        }
      });
  }

  public async submitBatch() {
    const orderButton = new ModalButton(
      this.translationFields.modals.batchOrderAccept,
      'btn btn-primary',
      this.translationFields.modals.deleteReturnValue);

    const abortButton = new ModalButton(
      this.translationFields.modals.batchOrderAbort,
      'btn btn-secondary',
      this.translationFields.modals.abortReturnValue);

    const modalRef = this.modalService.openMsgModal(
      this.translationFields.modals.batchOrderQuestion,
      'modal-header header-danger',
      [`${this.translationFields.modals.batchOrderWarning}`],
      orderButton, abortButton);
    modalRef.result.then(async (result) => {
      if (result === orderButton.returnValue) {
        if (this.myBatch > 0) {
          let found = false;

          const loggedInUser = await this.userService.findOwn();
          this.order.batch['accepted'].forEach( element => {
            if (element.fablab._id === loggedInUser.fablabId) {
              element.number = this.myBatch;
              found = true;
            }
          });

          if (!found) {
            console.log(this.order.batch['accepted']);
            this.order.batch['accepted'].push({
              fablab: loggedInUser.fablabId,
              number: this.myBatch,
              status: 'zugewiesen'
            });
          }

          await this.orderService.updateOrder(this.order);
          window.location.reload();
        }
      }
    });



  }

  public loadChart() {
    if (this.chartCanvas && this.translationFields) {
      const remaining = this.order.batch['number'] - this.order.batch['acceptedCount'] - this.order.batch['finishedCount'];
      this.chart = new Chart(this.chartCanvas.nativeElement.getContext('2d'), {
        type: 'doughnut',
        data: {
          labels: [
            this.translationFields.labels.batchFinished + ' : ' + this.order.batch['finishedCount'],
            this.translationFields.labels.batchAssigned + ' : ' + this.order.batch['acceptedCount'],
            this.translationFields.labels.batchOpen + ' : ' + remaining
          ],
          datasets: [
            {
              data: [
                this.order.batch['finishedCount'],
                this.order.batch['acceptedCount'],
                remaining
              ],
              backgroundColor: [
                '#45B29D',
                '#EFC94C',
                '#DF5A49'
              ]
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          tooltips: {
            enabled: false
          },
          legend: {
            labels: {
              fontSize: 20,
              fontFamily: 'Roboto Condensed'
            }
          }
        }
      });
    }
  }

  public startPrintJob() {
    const startButton = new ModalButton(this.translationFields.modals.printHeader, 'btn btn-success', '');
    const cancelButton = new ModalButton(this.translationFields.modals.cancel, 'btn btn-secondary',
      this.translationFields.modals.cancelReturnValue);
    this.modalService.openOctoprintModal(this.translationFields.modals.printHeader,
      'modal-header header-primary', this.translationFields.modals.addressLabel, this.translationFields.modals.apiKeyLabel,
      this.translationFields.modals.fileSelectLabel, this.order.files.filter((file) => file.contentType === 'text/x.gcode'
        || file.filename.split('.')[1] === 'gcode'),
      startButton, cancelButton);
  }

  public delete() {
    const deleteButton = new ModalButton(this.translationFields.modals.ok, 'btn btn-danger',
      this.translationFields.modals.deleteReturnValue);
    const abortButton = new ModalButton(this.translationFields.modals.abort, 'btn btn-secondary',
      this.translationFields.modals.abortReturnValue);
    const modalRef = this.modalService.openMsgModal(this.translationFields.modals.deleteHeader,
      'modal-header header-danger',
      [`${this.translationFields.modals.deleteQuestion} ${this.order.projectname} ${this.translationFields.modals.deleteQuestion2}`,
      `${this.translationFields.modals.deleteWarning}`],
      deleteButton, abortButton);
    modalRef.result.then((result) => {
      if (result === deleteButton.returnValue) {
        this.orderService.deleteOrder(this.order._id).then(() => {
          this.genericService.back();
        });
      }
    });
  }

  // Private Functions

  private _translateStatus(): Promise<String> {
    return new Promise((resolve) => {
      this.translateService.get(['status']).subscribe((translations) => {
        resolve(translations['status'][`${this.order.status}`]);
      });
    });
  }

  private _translateMachineType(): Promise<String> {
    return new Promise((resolve) => {
      this.translateService.get(['deviceTypes']).subscribe((translations => {
        resolve(translations['deviceTypes'][`${this.machine.type}`]);
      }));
    });
  }

  private _translate() {
    const currentLang = this.translateService.currentLang || this.translateService.getDefaultLang();
    this.translateService.get(['orderDetail', 'deviceTypes', 'status', 'date']).subscribe((translations => {
      if (this.order) {
        if (this.schedule) {
          this.schedule['shownStartDate'] = this.genericService.translateDate(
            this.schedule.startDate, currentLang, translations['date'].dateTimeFormat);
          this.schedule['shownEndDate'] = this.genericService.translateDate(
            this.schedule.endDate, currentLang, translations['date'].dateTimeFormat);
        }

        this.order['shownCreatedAt'] = this.genericService.translateDate(
          this.order.createdAt, currentLang, translations['date'].dateTimeFormat);
        this.order.files.forEach((file) => {
          file['shownCreatedAt'] = this.genericService.translateDate(
            file.createdAt, currentLang, translations['date'].dateTimeFormat);
        });
      }
      if (this.order && this.order.status) {
        this._translateStatus().then((shownStatus) => {
          this.order['shownStatus'] = shownStatus;
        });
      }

      if (this.machine && this.machine.type) {
        this._translateMachineType().then((shownType) => {
          this.machine['shownType'] = shownType;
        });
      }

      if (this.order && this.order.comments) {
        this.order.comments.forEach((comment) => {
          if (comment.createdAt) {
            comment['shownCreatedAt'] = this.genericService.translateDate(
              comment.createdAt, currentLang, translations['date'].dateTimeFormat);
          }
        });
      }

      this.translationFields = TranslationModel.translationUnroll(translations);

      this.loadChart();
    }));
  }
}
