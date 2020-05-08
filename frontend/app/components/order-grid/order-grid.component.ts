import { Component, OnInit, OnChanges, ElementRef, QueryList, ViewChildren, Input, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { faMapMarkerAlt, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { routes } from '../../config/routes';

import { UserService } from '../../services/user.service';
import { OrderService } from '../../services/order.service';

import { ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { EventEmitter } from '@angular/core';

import Deepcopy from 'rfdc';
import { User } from 'frontend/app/models/user.model';
import { HospitalService } from 'frontend/app/services/hospital.service';

@Component({
  selector: 'app-order-grid',
  templateUrl: './order-grid.component.html',
  styleUrls: ['./order-grid.component.css']
})
export class OrderGridComponent implements OnInit, OnChanges {
  @Input()
  orders: Array<any>;
  @Output()
  reload: EventEmitter<any> = new EventEmitter();

  doughnutChartLabels: Label[] = [
    'Offen',
    'Zugewiesen',
    'Abgeschlossen'
  ];
  doughnutChartColors: Color[] = [
    {
      backgroundColor: ['#DF5A49', '#EFC94C', '#45B29D']
    }
  ];
  doughnutChartType: ChartType = 'doughnut';

  locationIcon = faMapMarkerAlt;
  arrowIcon = faChevronRight;
  orderAcceptRoute = routes.paths.frontend.orders.root + '/' + routes.paths.frontend.orders.accept;

  myBatch = 0;
  deepcopy = new Deepcopy();

  ownUser: User;

  userType = '';
  filterStatus: String = '';

  constructor(
    public domSanitizer: DomSanitizer,
    public userService: UserService,
    public orderService: OrderService,
    public hospitalService: HospitalService
  ) {
  }

  async ngOnInit() {
    this.ownUser = (await this.userService.findOwn());
    this.userType = 'maker';
    if (this.ownUser.role.role === 'user') {
      this.userType = 'klinik';
    }
    console.log(this.ownUser);
  }

  ngAfterViewInit() {
  }

  async ngOnChanges() {
    await this.loadOrders();

    console.log('orders: ', this.orders);
  }

  filter() {
    if (this.filterStatus) {

    }
  }

  async loadOrders() {
    console.log('load orders called');
    const loggedInUser = await this.userService.findOwn();
    if (this.orders) {
      this.orders.forEach(async order => {
        order.participating = false;
        order.finished = false;
        order.myFinishedBatch = 0;
        order.myAcceptedBatch = 0;
        order.showInput = false;

        order.toggleInput = function() {
          order.showInput = !order.showInput;
        };

        console.log('owner: ', order.owner);
        console.log('user id: ', this.ownUser._id);

        if (order.owner === this.ownUser._id) {
          order.own = true;
        } else {
          order.own = false;
        }

        order.hospital = await this.hospitalService.findByOwner(order.owner);

        const objectURL = 'data:image/jpeg;base64,' + order.blueprint.image;
        order.blueprint.imageURL = this.domSanitizer.bypassSecurityTrustUrl(objectURL);
        // order.distance = Math.random() * 10.0;
        if (order.batch && order.batch['number'] && order.batch['number'] > 0) {
          order['isBatched'] = true;
          order.batch['finishedCount'] = 0;
          if (order.batch['finished']) {
            order.batch['finished'].forEach(batch => {
              order.batch.finishedCount += batch.number;

              if (batch.user === loggedInUser._id) {
                order.myFinishedBatch = batch.number;
              }
            });
          } else {
            order.batch['finished'] = [];
          }

          order.batch['acceptedCount'] = 0;
          if (order.batch['accepted']) {
            order.batch['accepted'].forEach(batch => {
              if (batch.user === loggedInUser._id) {
                order.myAcceptedBatch = batch.number;
                order.participating = true;
              }
              order.batch['acceptedCount'] += batch.number;
            });
          } else {
            order.batch['accepted'] = [];
          }
          order.batch['remaining'] = order.batch['number'] - order.batch['acceptedCount'] - order.batch['finishedCount'];
          if (order.batch['remaining'] === 0) {
            order.completed = true;
          }
          order.batchData = [
            order.batch['remaining'],
            order.batch['acceptedCount'],
            order.batch['finishedCount'],
          ];
        }
      });
    }
  }

  public async finishOwnBatch(order) {
    let batch;
    let batchIndex;
    for (let i = 0; i < order.batch.accepted.length; i++) {
      if (order.batch.accepted[i].user === this.ownUser._id) {
        batch = order.batch.accepted[i];
        batchIndex = i;
        break;
      }
    }

    order.batch.accepted.splice(batchIndex, 1);
    order.batch.finished.push(batch);
    delete order.participating;
    delete order.finished;
    delete order.completed;
    delete order.myFinishedBatch;
    delete order.myAcceptedBatch;
    delete order.showInput;
    delete order.blueprint;

    await this.orderService.updateOrder(order);

    this.reload.emit();
  }

  public async support(order) {
    const orderCopy = this.deepcopy(order);
    console.log('orderCopy ', orderCopy);
    const loggedInUser = await this.userService.findOwn();

    const newBatch = parseInt(orderCopy.myNewAcceptedBatch, 10);

    if (newBatch && newBatch > 0) {
      let found = false;
      orderCopy.batch.accepted.forEach(batch => {
        if (batch.user === loggedInUser._id) {
          batch.number += newBatch;
          found = true;
        }
      });

      if (!found) {
        orderCopy.batch.accepted.push({
          number: newBatch,
          user: loggedInUser._id,
          status: 'Angenommen'
        });
      }

      // Clear intermediate fields
      delete orderCopy.participating;
      delete orderCopy.finished;
      delete orderCopy.completed;
      delete orderCopy.myFinishedBatch;
      delete orderCopy.myAcceptedBatch;
      delete orderCopy.showInput;
      delete orderCopy.blueprint;

      console.log('updating order ', orderCopy);

      await this.orderService.updateOrder(orderCopy);
      this.reload.emit();
    } else {
      console.log('not a number');
      // TODO: Error message
    }
  }

  public loadChart() {

    /*
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
                fontFamily: 'Roboto'
            }
          }
        }
      });
    }
    */
  }
}
