import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../services/navigation.service';


@Component({
    selector: 'app-privacy',
    templateUrl: './privacy.component.html',
    styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent implements OnInit {

    constructor(
        private navigationService: NavigationService
    ) {

    }

    async ngOnInit() {
        this.navigationService.setStatic(true);
    }
}
