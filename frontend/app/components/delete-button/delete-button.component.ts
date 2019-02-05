import { Component, OnInit, Input } from '@angular/core';
import { Icon } from '@fortawesome/fontawesome-svg-core';
import { TranslateService } from '@ngx-translate/core';
import { ConfigService } from 'frontend/app/config/config.service';

export enum DeleteButtonType {
  Delete,
  ToggleOn,
  ToggleOff
}

@Component({
  selector: 'app-delete-button',
  templateUrl: './delete-button.component.html',
  styleUrls: ['./delete-button.component.css']
})
export class DeleteButtonComponent implements OnInit {
  @Input() disable: boolean;
  @Input() type: DeleteButtonType;
  class: string;
  config: any;
  deleteIcon: Icon;
  tooltip: String;
  constructor(private configService: ConfigService,
    private translateService: TranslateService) {
    this.config = this.configService.getConfig();
  }

  ngOnInit() {
    this.translateService.onLangChange.subscribe(() => {
      this._translate();
    });
    this._translate();
    switch (this.type) {
      case DeleteButtonType.ToggleOn:
        this.deleteIcon = this.config.icons.toggleOn;
        this.class = 'btn btn-success';
        break;
      case DeleteButtonType.ToggleOff:
        this.deleteIcon = this.config.icons.toggleOff;
        this.class = 'btn btn-danger';
        break;
      default:
        this.deleteIcon = this.config.icons.delete;
        this.class = 'btn btn-danger';
    }
  }

  private _translate() {
    this.translateService.get(
      ['buttons.delete']
    ).subscribe((translations => {
      this.tooltip = this.type === undefined || this.type === DeleteButtonType.Delete ?
        translations['buttons.delete'].deleteTooltip :
        translations['buttons.delete'].toggleTooltip;
    }));
  }

}
