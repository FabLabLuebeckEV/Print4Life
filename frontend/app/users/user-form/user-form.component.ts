import { Component, OnInit } from '@angular/core';
import { User, Address, Role } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  loadingRoles: Boolean = false;
  validRoles: Array<String> = [];

  address: Address = new Address(undefined, undefined, undefined, undefined);
  role: Role = new Role(undefined);
  user: User = new User(undefined, undefined, undefined, undefined, undefined, undefined, undefined, this.address, this.role);

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this._loadRoles();
  }

  private async _loadRoles() {
    this.loadingRoles = true;
    this.validRoles = (await this.userService.getRoles()).roles;
    this.loadingRoles = false;
  }

  onSubmit() {
    this.userService.createUser(this.user)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  }
}
