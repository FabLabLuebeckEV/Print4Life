import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CredentialsInterceptorService } from './credential.interceptor.service';

import { AppComponent } from './app.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { NavigationComponent } from './navigation/navigation.component';
import { MachineListComponent } from './machine-list/machine-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { appRoutes } from './config/routes';

@NgModule({
    declarations: [
        AppComponent, DropdownComponent, NavigationComponent, MachineListComponent, DashboardComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        NgbModule.forRoot(),
        RouterModule.forRoot(
            appRoutes,
            { enableTracing: true } // <-- debugging purposes only
        )
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: CredentialsInterceptorService, multi: true } // magic for cors
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
