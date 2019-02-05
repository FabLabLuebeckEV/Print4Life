import { Component, OnInit, Input } from '@angular/core';
import { Icon } from '@fortawesome/fontawesome-svg-core';
import { ConfigService } from 'frontend/app/config/config.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-button',
  templateUrl: './add-button.component.html',
  styleUrls: ['./add-button.component.css']
})
export class AddButtonComponent implements OnInit {
  @Input() createLink: String;
  @Input() disable: boolean;
  config: any;
  plusIcon: Icon;
  tooltip: String;
  constructor(private configService: ConfigService,
    private translateService: TranslateService) {
    this.config = this.configService.getConfig();
    this.plusIcon = this.config.icons.add;
  }

  ngOnInit() {
    this.translateService.onLangChange.subscribe(() => {
      this._translate();
    });
    this._translate();
  }

  private _translate() {
    this.translateService.get(
      ['buttons.add']
    ).subscribe((translations => {
      this.tooltip = translations['buttons.add'].tooltip;
    }));
  }

}
