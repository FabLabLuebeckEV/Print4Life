import { Component, OnInit } from '@angular/core';

import { BlueprintService } from '../services/blueprint.service';
import { DomSanitizer } from '@angular/platform-browser';

import { routes } from '../config/routes';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blueprints',
  templateUrl: './blueprints.component.html',
  styleUrls: ['./blueprints.component.css']
})
export class BlueprintsComponent implements OnInit {

  blueprints: Array<any>;
  createOrderLink = '/' + routes.paths.frontend.orders.root + '/' + routes.paths.frontend.orders.create;
  unfinishedOrdersLink = `/${routes.paths.frontend.orders.root}/${routes.paths.frontend.orders.all.root}/${routes.paths.frontend.orders.all.all}`;


  constructor(
    private blueprintService: BlueprintService,
    public domSanitizer: DomSanitizer,
    private userService: UserService,
    private router: Router
  ) {

  }

  async ngOnInit() {
    if (!this.userService.isLoggedIn || (await this.userService.findOwn()).role.role === 'editor') {
      this.router.navigate([this.unfinishedOrdersLink]);
    }
    this.blueprints = (await this.blueprintService.getBlueprints()).blueprints;
    this.blueprints.forEach(blueprint => {
      const objectURL = 'data:image/jpeg;base64,' + blueprint.image;
      blueprint.imageURL = this.domSanitizer.bypassSecurityTrustUrl(objectURL);
    });
    console.log('blueprints: ', this.blueprints);
  }
}
