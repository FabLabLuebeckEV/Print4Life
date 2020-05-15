import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';


@Injectable({
    providedIn: 'root'
})
export class NavigationService {
    private staticPage: BehaviorSubject<boolean>;
    private lastRoute;

    constructor(
        private router: Router
    ) {
        this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd)  {
                const url = this.router.url.split('#')[0];
                console.log('current url: ', url);
                if (this.lastRoute === undefined || url !== this.lastRoute) {
                    this.staticPage.next(false);
                    this.lastRoute = url;
                }
            }
        });
        this.staticPage = new BehaviorSubject<boolean>(false);
    }

    setStatic(value: boolean) {
        this.staticPage.next(value);
    }

    getValue(): Observable<boolean> {
        return this.staticPage.asObservable();
    }
}
