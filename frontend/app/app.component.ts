import { Component } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { routes } from './config/routes';
import { ConfigService } from './config/config.service';
import { LanguageService } from './services/language.service';
import { faTwitter, faFacebook, faGithub} from '@fortawesome/free-brands-svg-icons';



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
    twitterIcon = faTwitter;
    facebookIcon = faFacebook;
    githubIcon = faGithub;

    legalNoticeRoute = `/${routes.paths.frontend.legal_notice.root}`;
    privacyRoute = `/${routes.paths.frontend.privacy.root}`;

    constructor(private translateService: TranslateService, private http: HttpClient,
            private configService: ConfigService, private languageService: LanguageService) {
        this.config = this.configService.getConfig();
        const promise = this.http.get(`${routes.backendUrl}/version`).toPromise();
        promise.then((result: any) => {
            this.version = result.version;
        });

        this.setupLanguage();
    }

    private async setupLanguage() {
        let lang = localStorage.getItem(this.config.defaultLangStorageName);
        if (!lang) {
            const validLanguages = await this.languageService.getLanguages();

            if (validLanguages.languages.includes(navigator.language)) {
                lang = navigator.language.trim();
            }
        }
        if (!lang || lang === '') {
            lang = this.config.defaultLang;
        }
        this.translateService.setDefaultLang(lang);
        localStorage.setItem(this.config.defaultLangStorageName, lang);
        this.translateService.use(lang);

        this._translate();
        this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
            this.translateService.use(event.lang);
            localStorage.setItem(this.config.defaultLangStorageName, event.lang);
            this._translate();
        });
    }

    private _translate() {
        this.translateService.stream(['navigation']).subscribe((translations) => {
            this.softwareName = translations['navigation'].title;
            this.privacyPolicy = translations['navigation'].privacyPolicy;
            this.imprint = translations['navigation'].imprint;
        });
    }
}
