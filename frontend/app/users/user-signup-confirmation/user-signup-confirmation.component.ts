import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-signup-confirmation',
  templateUrl: './user-signup-confirmation.component.html',
  styleUrls: ['./user-signup-confirmation.component.css']
})
export class UserSignupConfirmationComponent implements OnInit {

  type = '';

  constructor(
    private route: ActivatedRoute,
  ) {
    this.route.params.subscribe(params => {
      if (params.type) {
        this.type = params.type;
      }
    });
  }

  async ngOnInit() {
  }
}
