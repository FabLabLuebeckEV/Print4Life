import { Component, OnInit } from '@angular/core';
import { User, Address, Role } from '../../models/user.model';
import { ConfigService } from '../../config/config.service';
import { routes } from '../../config/routes';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  config: any;

  backLink: String;
  backArrow: any;

  loadingRoles: Boolean = false;
  validRoles: Array<String> = [];

  address: Address = new Address(undefined, undefined, undefined, undefined);
  role: Role = new Role(undefined);
  user: User = new User(undefined, undefined, undefined, undefined, undefined, undefined, undefined, this.address, this.role);

  constructor(
    private configService: ConfigService,
    private userService: UserService
  ) {
    this.config = this.configService.getConfig();
    this.backArrow = this.config.icons.back;
    this.backLink = `/${routes.paths.frontend.users.root}`;
  }

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
