import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpInterceptorService } from './services/credential.interceptor.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { MachineListComponent } from './machines/machine-list/machine-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { appRoutes, AdminGuard, AuthGuard } from './config/app.routes';
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

export function translateHttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
import { UserFormComponent } from './users/user-form/user-form.component';
import { BackButtonComponent } from './components/back-button/back-button.component';
import { LoginModalComponent } from './users/login-modal/login-modal.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { InputModalComponent } from './components/input-modal/input-modal.component';
import { ChangePasswdModalComponent } from './users/change-passwd-modal/change-passwd-modal.component';
import { UserDetailComponent } from './users/user-detail/user-detail.component';
import { UploadComponent } from './components/upload/upload.component';
import { ngfModule } from 'angular-file';
import { DatePickerTranslationService } from './services/datepicker-translation.service';
import { IotDeviceListComponent } from './iot-devices/iot-device-list/iot-device-list.component';
import { IotDeviceFormComponent } from './iot-devices/iot-device-form/iot-device-form.component';
import { IotDeviceDetailComponent } from './iot-devices/iot-device-detail/iot-device-detail.component';
import { OctoprintModalComponent } from './components/octoprint-modal/octoprint-modal.component';
import { AddButtonComponent } from './components/add-button/add-button.component';
import { EditButtonComponent } from './components/edit-button/edit-button.component';
import { DeleteButtonComponent } from './components/delete-button/delete-button.component';
import { UserActivationComponent } from './users/user-activation/user-activation.component';
import { FablabFormComponent } from './fablabs/fablab-form/fablab-form.component';

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
        BackButtonComponent,
        LoginModalComponent,
        UserListComponent,
        InputModalComponent,
        ChangePasswdModalComponent,
        UserDetailComponent,
        UploadComponent,
        IotDeviceListComponent,
        IotDeviceFormComponent,
        IotDeviceDetailComponent,
        OctoprintModalComponent,
        AddButtonComponent,
        EditButtonComponent,
        DeleteButtonComponent,
        UserActivationComponent,
        FablabFormComponent
    ],
    imports: [
        ReactiveFormsModule,
        BrowserModule,
        NgxSpinnerModule,
        NgSelectModule,
        FormsModule,
        FontAwesomeModule,
        HttpClientModule,
        ngfModule,
        NgbModule,
        RouterModule.forRoot(appRoutes, {
            scrollPositionRestoration: 'enabled',
            anchorScrolling: 'enabled',
            onSameUrlNavigation: 'reload'
        }),
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
        MachineService, FablabService, ConfigService, AuthGuard, AdminGuard,
        { provide: NgbDatepickerI18n, useClass: DatePickerTranslationService }
    ],
    bootstrap: [AppComponent],
    entryComponents: [
        MessageModalComponent,
        LoginModalComponent,
        InputModalComponent,
        ChangePasswdModalComponent,
        OctoprintModalComponent
    ]
})
export class AppModule { }
