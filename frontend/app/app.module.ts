import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpInterceptorService } from './services/credential.interceptor.service';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { MachineListComponent } from './machines/machine-list/machine-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { appRoutes } from './config/app.routes';
import { MachineService } from './services/machine.service';
import { FablabService } from './services/fablab.service';
import { TableComponent } from './components/table/table.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MachineFormComponent } from './machines/machine-form/machine-form.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { OrderListComponent } from './orders/order-list/order-list.component';
import { CreateOrderComponent } from './orders/create-order/create-order.component';
import { MessageModalComponent } from './components/message-modal/message-modal.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MachineDetailComponent } from './machines/machine-detail/machine-detail.component';
import { ConfigService } from './config/config.service';
import { OrderDetailComponent } from './orders/order-detail/order-detail.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AuthGuard } from './config/app.routes';

export function translateHttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
import { UserFormComponent } from './users/user-form/user-form.component';
import { UserComponent } from './users/user/user.component';
import { BackButtonComponent } from './components/back-button/back-button.component';
import { LoginModalComponent } from './users/login-modal/login-modal.component';

@NgModule({
    declarations: [
        AppComponent,
        DropdownComponent,
        NavigationComponent,
        MachineListComponent,
        DashboardComponent,
        TableComponent,
        OrderListComponent,
        MachineFormComponent,
        CreateOrderComponent,
        MessageModalComponent,
        MachineDetailComponent,
        OrderDetailComponent,
        UserFormComponent,
        UserComponent,
        BackButtonComponent,
        LoginModalComponent
    ],
    imports: [
        BrowserModule,
        NgxSpinnerModule,
        NgSelectModule,
        FormsModule,
        FontAwesomeModule,
        HttpClientModule,
        NgbModule.forRoot(),
        RouterModule.forRoot(appRoutes, { onSameUrlNavigation: 'reload' }),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: translateHttpLoaderFactory,
                deps: [HttpClient]
            }
        })
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true }, // magic for cors
        MachineService, FablabService, ConfigService, AuthGuard
    ],
    bootstrap: [AppComponent],
    entryComponents: [
        MessageModalComponent,
        LoginModalComponent
    ]
})
export class AppModule { }
