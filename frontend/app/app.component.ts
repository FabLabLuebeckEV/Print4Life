import { Component } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { routes } from './config/routes';
import { ConfigService } from './config/config.service';
import { UserService } from './services/user.service';

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
    constructor(private translateService: TranslateService, private http: HttpClient, 
            private configService: ConfigService, private userService:UserService) {
        this.config = this.configService.getConfig();
        const promise = this.http.get(`${routes.backendUrl}/version`).toPromise();
        promise.then((result: any) => {
            this.version = result.version;
        });
        this.setupLanguage();
        if (!localStorage.getItem(this.config.defaultLangStorageName)) {
            this.userService.getLanguages().then(data=> {
                if (data.languages.includes(navigator.language)) {
                    this.translateService.use(navigator.language.trim());
                    //localStorage.setItem(this.config.defaultLangStorageName, navigator.language.trim());
                } else {
                    this.translateService.use(this.config.defaultLang);
                    localStorage.setItem(this.config.defaultLangStorageName, this.config.defaultLang);
                }
            });
        }
        
    }

    private setupLanguage() {
        let lang = localStorage.getItem(this.config.defaultLangStorageName);
        if (!lang || lang === '') {
            lang = this.config.defaultLang;
        }
        this.translateService.setDefaultLang(lang);

        //console.log("setup language, value is ", localStorage.getItem(this.config.defaultLangStorageName))
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
