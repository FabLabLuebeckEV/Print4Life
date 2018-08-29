import { Component } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { routes } from './config/routes';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    version: String;
    softwareName: String;
    constructor(private translateService: TranslateService, private http: HttpClient) {
        const promise = this.http.get(`${routes.backendUrl}/version`).toPromise();
        promise.then((result: any) => {
            this.version = result.version;
        });
        this.translateService.setDefaultLang('en');
        this._translate();
        this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
            this.translateService.use(event.lang);
            this._translate();
        });
    }

    private _translate() {
        this.translateService.get(['navigation']).subscribe((translations) => {
            this.softwareName = translations['navigation'].title;
        });
    }
}
