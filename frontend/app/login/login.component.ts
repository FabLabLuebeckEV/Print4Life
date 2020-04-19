import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { routes } from '../config/routes';

import { UserService } from '../services/user.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    loginData = {
        username : "",
        password: ""
    };

    constructor (
        public router: Router,
        public userService: UserService
    ) {

    }


    ngOnInit() {
    }

    async login() {
        try {
            await this.userService.login(this.loginData);
            this.router.navigate([`/${routes.paths.frontend.orders.root}/${routes.paths.frontend.orders.myOrders}`]);
        } catch (err) {
        }
    }
}
