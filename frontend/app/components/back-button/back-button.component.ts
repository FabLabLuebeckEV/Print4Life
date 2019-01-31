import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../config/config.service';
import { GenericService } from '../../services/generic.service';
import { TranslateService } from '@ngx-translate/core';
import { Icon } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.css']
})
export class BackButtonComponent implements OnInit {
  config: any;
  backArrow: Icon;
  tooltip: String;
  constructor(private configService: ConfigService,
    private genericService: GenericService,
    private translateService: TranslateService) {
    this.config = this.configService.getConfig();
    this.backArrow = this.config.icons.back;
  }

  ngOnInit() {
    this.translateService.onLangChange.subscribe(() => {
      this._translate();
    });
    this._translate();
  }

  public back() {
    this.genericService.back();
  }

  private _translate() {
    this.translateService.get(
      ['buttons.back']
    ).subscribe((translations => {
      this.tooltip = translations['buttons.back'].tooltip;
    }));
  }

}
