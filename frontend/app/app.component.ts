import { Component } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(private translateService: TranslateService) {
        this.translateService.setDefaultLang('en');
        this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
            this.translateService.use(event.lang);
        });
    }
}
