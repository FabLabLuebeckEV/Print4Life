import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from 'rxjs';
import { Router, NavigationEnd } from "@angular/router";


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
                if (this.lastRoute === undefined || this.router.url !== this.lastRoute) {
                    this.staticPage.next(false);
                    this.lastRoute = this.router.url;
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