import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from 'frontend/app/services/user.service';

@Component({
  selector: 'app-user-activation',
  templateUrl: './user-activation.component.html',
  styleUrls: ['./user-activation.component.css']
})
export class UserActivationComponent implements OnInit {
  userId: String;
  activationStatus: boolean;
  status: String = '';

  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private userService: UserService
  ) {
    this.router.events.subscribe(async () => {
      const route = this.location.path();
    });
    this.route.params.subscribe(params => {
      if (params.id) {
        this.userId = params.id;
      }
    });
  }

  ngOnInit() {
    this.init();
  }

  async init() {
    const result = await this.userService.activateUser(this.userId);
    status = result['msg'];
  }
}
