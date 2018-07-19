import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CredentialsInterceptorService } from './services/credential.interceptor.service';

import { AppComponent } from './app.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { MachineListComponent } from './machines/machine-list/machine-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { appRoutes } from './config/routes';
import { MachineService } from './services/machine.service';

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
        { provide: HTTP_INTERCEPTORS, useClass: CredentialsInterceptorService, multi: true }, // magic for cors
        MachineService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
