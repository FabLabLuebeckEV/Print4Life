import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../services/navigation.service';

@Component({
    selector: 'app-legal-notice',
    templateUrl: './legal-notice.component.html',
    styleUrls: ['./legal-notice.component.css']
})
export class LegalNoticeComponent implements OnInit {
    constructor(
        private navigationService: NavigationService
    ) {

    }
    async ngOnInit() {
        this.navigationService.setStatic(true);
    }
}
