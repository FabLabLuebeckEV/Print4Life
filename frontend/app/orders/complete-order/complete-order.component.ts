import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { routes } from '../../config/routes';

@Component({
    templateUrl: './complete-order.component.html',
    styleUrls: ['./complete-order.component.css']
})
export class CompleteOrderComponent implements OnInit {

    constructor(
        private router: Router,
        private location: Location,
        private route: ActivatedRoute,
    ) {
        this.router.events.subscribe(async () => {
            const route = this.location.path();
        });
    }

    async ngOnInit() {

    }

    back() {
        this.router.navigate([`${routes.paths.frontend.orders.root}/${routes.paths.frontend.orders.acceptedOrders}`]);
    }
}
