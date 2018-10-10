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
    defaultLangStorageName = 'orderManagementLang';
    constructor(private translateService: TranslateService, private http: HttpClient) {
        const promise = this.http.get(`${routes.backendUrl}/version`).toPromise();
        promise.then((result: any) => {
            this.version = result.version;
        });
        if (!localStorage.getItem(this.defaultLangStorageName)) {
            localStorage.setItem(this.defaultLangStorageName, 'en');
        }
        this.translateService.setDefaultLang(localStorage.getItem(this.defaultLangStorageName));
        this._translate();
        this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
            this.translateService.use(event.lang);
            localStorage.setItem(this.defaultLangStorageName, event.lang);
            this._translate();
        });
    }

    private _translate() {
        this.translateService.get(['navigation']).subscribe((translations) => {
            this.softwareName = translations['navigation'].title;
        });
    }
}
