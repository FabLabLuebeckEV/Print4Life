import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tap, catchError } from 'rxjs/operators';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {
  private loginData = { username: '', password: '' };
  private message: String = '';
  private response = { success: false, token: '' };

  constructor(
    private userService: UserService,
  ) {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      this.response.success = true;
      this.response.token = token;
    }
  }

  ngOnInit() {
  }

  async login() {
    this.response = (await this.userService.login(this.loginData)).login;
    localStorage.setItem('jwtToken', this.response.token);
  }

  async logout() {
    localStorage.removeItem('jwtToken');
    this.response.success = false;
    this.response.token = '';
  }
}
