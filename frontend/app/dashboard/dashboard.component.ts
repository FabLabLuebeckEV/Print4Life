import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  title = '';

  constructor(private translateService: TranslateService) {
    this._translate();
    this.translateService.onLangChange.subscribe(() => {
      this._translate();
    });
  }

  ngOnInit() {
  }

  // Private Functions

  private _translate() {
    this.translateService.get(['dashboard']).subscribe((translations => {
      this.title = translations['dashboard'].title;
    }));
  }

}
