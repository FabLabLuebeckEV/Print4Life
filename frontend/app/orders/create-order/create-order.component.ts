import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlueprintService } from '../../services/blueprint.service';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from 'frontend/app/services/user.service';
import { Order } from 'frontend/app/models/order.model';
import { Address } from 'frontend/app/models/address.model';
import { OrderService } from 'frontend/app/services/order.service';
import { ModalService } from 'frontend/app/services/modal.service';
import { ModalButton } from 'frontend/app/helper/modal.button';
import { routes } from '../../config/routes';
// comment

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent implements OnInit, OnDestroy {
  order: Order = new Order(
    undefined,
    undefined,
    'N/A',
    [],
    undefined,
    undefined,
    [],
    undefined,
    undefined,
    undefined,
    new Address('', '', '', ''),
    false,
    true,
    undefined,
    '',
    '',
    {
      number : 1,
      accepted: [],
      finished: [],
      acceptedCount: 0,
      finishedCount: 0
    },
    true
  );

  blueprint: any;
  loggedInUser: any;

  agb = false;
  company = false;

  checkboxLabel = false;

  constructor(
    private route: ActivatedRoute,
    private blueprintService: BlueprintService,
    private domSanitizer: DomSanitizer,
    private userService: UserService,
    private orderService: OrderService,
    private modalService: ModalService,
    private router: Router
  ) {

  }

  ngOnDestroy() {
  }

  async ngOnInit() {
    this.loggedInUser = await this.userService.findOwn();
    this.order.shippingAddress = this.loggedInUser.address;
    this.order.owner = this.loggedInUser._id;

    this.route.queryParams.subscribe(async params => {
      console.log(params);

      this.blueprint = (await this.blueprintService.getBlueprint(params.blueprint)).blueprint;
      this.order.blueprintId = this.blueprint._id;
      console.log(this.blueprint);

      const objectURL = 'data:image/jpeg;base64,' + this.blueprint.image;
      this.blueprint.imageURL = this.domSanitizer.bypassSecurityTrustUrl(objectURL);
    });
  }

  createOrder() {
    if (this.agb && this.company) {
      console.log(this.order);
      this.orderService.createOrder(this.order).then(event => {
        const okButton = new ModalButton('Ok', 'neutral', 'Ok');
        const modalRef = this.modalService.openMsgModal('Bestellung erfolgreich angelegt', 'modal-header', [
          'Vielen Dank für Deine Bestellung',
          'Überprüfe den Status gern unter \'Aufträge\''
        ], okButton, undefined);

        modalRef.result.then(() => {
          this.router.navigate([routes.paths.frontend.orders.root + '/'
          + routes.paths.frontend.orders.all.root + '/' + routes.paths.frontend.orders.all.in_progress]);
        });
      });
    } else {
      this.checkboxLabel = true;
    }
  }
}
