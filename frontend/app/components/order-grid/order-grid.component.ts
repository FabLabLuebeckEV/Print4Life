import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';

@Component({
    selector: 'app-order-grid',
    templateUrl: './order-grid.component.html',
    styleUrls: ['./order-grid.component.css']
})
export class OrderGridComponent implements OnInit {
    @Input()
    orders: Array<any>;

    async ngOnInit() {

    }
}
