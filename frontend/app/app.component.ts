import { Component } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { routes } from './config/routes';
import { ConfigService } from './config/config.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    version: String;
    softwareName: String;
    privacyPolicy: String;
    imprint: String;
    config;
    constructor(private translateService: TranslateService, private http: HttpClient, private configService: ConfigService) {
        this.config = this.configService.getConfig();
        const promise = this.http.get(`${routes.backendUrl}/version`).toPromise();
        promise.then((result: any) => {
            this.version = result.version;
        });
        if (!localStorage.getItem(this.config.defaultLangStorageName)) {
            localStorage.setItem(this.config.defaultLangStorageName, this.config.defaultLang);
        }
        this.translateService.setDefaultLang(localStorage.getItem(this.config.defaultLangStorageName));
        this._translate();
        this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
            this.translateService.use(event.lang);
            localStorage.setItem(this.config.defaultLangStorageName, event.lang);
            this._translate();
        });
    }

    private _translate() {
        this.translateService.get(['navigation']).subscribe((translations) => {
            this.softwareName = translations['navigation'].title;
            this.privacyPolicy = translations['navigation'].privacyPolicy;
            this.imprint = translations['navigation'].imprint;
        });
    }
}
