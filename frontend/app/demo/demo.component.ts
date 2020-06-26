import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../services/navigation.service';

@Component({
    selector: 'app-demo-notice',
    templateUrl: './demo.component.html',
    styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {
    constructor(
        private navigationService: NavigationService
    ) {

    }
    async ngOnInit() {
        this.navigationService.setStatic(true);
    }
}
