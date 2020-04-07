import { Component, OnInit, OnChanges, ElementRef, ViewChild, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { routes } from '../../config/routes';

@Component({
    selector: 'app-order-grid',
    templateUrl: './order-grid.component.html',
    styleUrls: ['./order-grid.component.css']
})
export class OrderGridComponent implements OnInit, OnChanges {
    @Input()
    orders: Array<any>;
    locationIcon = faMapMarkerAlt;
    orderAcceptRoute = routes.paths.frontend.orders.root + '/' + routes.paths.frontend.orders.accept;

    constructor(
        public domSanitizer: DomSanitizer
    ) {
    }

    async ngOnInit() {

    }

    async ngOnChanges() {
        if (this.orders) {
            this.orders.forEach(order => {
                const objectURL = 'data:image/jpeg;base64,' + order.blueprint.image;
                order.blueprint.imageURL = this.domSanitizer.bypassSecurityTrustUrl(objectURL);
            });
        }
    }
}
