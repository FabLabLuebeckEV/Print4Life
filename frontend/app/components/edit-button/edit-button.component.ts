import { Component, OnInit, Input } from '@angular/core';
import { Icon } from '@fortawesome/fontawesome-svg-core';
import { ConfigService } from 'frontend/app/config/config.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-button',
  templateUrl: './edit-button.component.html',
  styleUrls: ['./edit-button.component.css']
})
export class EditButtonComponent implements OnInit {
  @Input() editLink: String;
  config: any;
  editIcon: Icon;
  tooltip: String;
  constructor(private configService: ConfigService,
    private translateService: TranslateService) {
    this.config = this.configService.getConfig();
    this.editIcon = this.config.icons.edit;
  }

  ngOnInit() {
    this.translateService.onLangChange.subscribe(() => {
      this._translate();
    });
    this._translate();
  }

  private _translate() {
    this.translateService.get(
      ['buttons.edit']
    ).subscribe((translations => {
      this.tooltip = translations['buttons.edit'].tooltip;
    }));
  }

}
