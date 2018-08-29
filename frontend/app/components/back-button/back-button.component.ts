import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../config/config.service';
import { Location } from '@angular/common';
import { GenericService } from '../../services/generic.service';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.css']
})
export class BackButtonComponent implements OnInit {
  config: any;
  backArrow: any;
  constructor(private configService: ConfigService,
    private genericService: GenericService) {
    this.config = this.configService.getConfig();
    this.backArrow = this.config.icons.back;
  }

  ngOnInit() {
  }

  public back() {
    this.genericService.back();
  }

}
