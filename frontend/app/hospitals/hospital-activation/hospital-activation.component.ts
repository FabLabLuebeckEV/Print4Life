import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HospitalService } from 'frontend/app/services/hospital.service';

@Component({
    selector: 'app-hospital-activation',
    templateUrl: './hospital-activation.component.html',
    styleUrls: ['./hospital-activation.component.css']
})
export class HospitalActivationComponent implements OnInit {
    success = false;

    constructor(
        private router: Router,
        private location: Location,
        private route: ActivatedRoute,
        private hospitalService: HospitalService
    ) {
        this.router.events.subscribe(async () => {
            const route = this.location.path();
        });
        this.route.params.subscribe(async params => {
            if (params.id) {
                const result = await this.hospitalService.activateHospital(params.id);
                console.log('result is: ', result);
                this.success = true;
            }
        });
    }

    async ngOnInit() {

    }
}
