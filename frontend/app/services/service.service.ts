import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { routes } from '../config/routes';

@Injectable({
    providedIn: 'root'
})
export class ServiceService {
    path: String;

    constructor(
        private http: HttpClient,
    ) {
        this.path = routes.backendUrl + '/' + routes.paths.backend.service.root;
    }

    public sendContactForm(form): Promise<any> {
        return this.http
          .post(`${this.path}/${routes.paths.backend.service.contact}`, form)
          .toPromise();
    }
}
