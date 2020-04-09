import { Component, OnInit, OnChanges, ElementRef, QueryList, ViewChildren, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { routes } from '../../config/routes';

import { FablabService } from '../../services/fablab.service';
import { UserService } from '../../services/user.service';

import { ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
    selector: 'app-order-grid',
    templateUrl: './order-grid.component.html',
    styleUrls: ['./order-grid.component.css']
})
export class OrderGridComponent implements OnInit, OnChanges {
    @Input()
    orders: Array<any>;

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
    orderAcceptRoute = routes.paths.frontend.orders.root + '/' + routes.paths.frontend.orders.accept;

    myBatch = 0;

    constructor(
        public domSanitizer: DomSanitizer,
        public fablabService: FablabService,
        public userService: UserService
    ) {
    }

    async ngOnInit() {

    }

    ngAfterViewInit()  {
    }

    async ngOnChanges() {
        if (this.orders) {
            this.orders.forEach(async order => {
                const objectURL = 'data:image/jpeg;base64,' + order.blueprint.image;
                order.blueprint.imageURL = this.domSanitizer.bypassSecurityTrustUrl(objectURL);
                // order.distance = Math.random() * 10.0;
                if (order.batch && order.batch['number'] && order.batch['number'] > 0) {
                    order['isBatched'] = true;
                    order.batch['finishedCount'] = 0;
                    if (order.batch['finished']) {
                        order.batch['finished'].forEach(batch => {
                        order.batch.finishedCount += batch.number;
                        this.fablabService.getFablab(batch.fablab).then(result => {
                            batch.fablab = result.fablab;
                        });
                        });
                    } else {
                    order.batch['finished'] = [];
                    }

                    const loggedInUser = await this.userService.findOwn();

                    order.batch['acceptedCount'] = 0;
                    if (order.batch['accepted']) {
                        order.batch['accepted'].forEach(batch => {
                        if (batch.fablab === loggedInUser.fablabId) {
                            this.myBatch = batch.number;
                        }
                        order.batch['acceptedCount'] += batch.number;
                        this.fablabService.getFablab(batch.fablab).then(result => {
                            batch.fablab = result.fablab;
                        });
                        });
                    } else {
                        order.batch['accepted'] = [];
                    }
                    const remaining = order.batch['number'] - order.batch['acceptedCount'] - order.batch['finishedCount'];

                    order.batchData = [
                        remaining,
                        order.batch['acceptedCount'],
                        order.batch['finishedCount'],
                    ];
                }
            });
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
