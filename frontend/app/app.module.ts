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
import { ServiceService } from './services/service.service';
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
import { CompleteOrderComponent } from './orders/complete-order/complete-order.component';
import { OpenOrdersComponent } from './orders/open-orders/open-orders.component';
import { AcceptedOrdersComponent } from './orders/accepted-orders/accepted-orders.component';
import { OrderGridComponent } from './components/order-grid/order-grid.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

export function translateHttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
import { AboutUsComponent } from './about-us/about-us.component';
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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FablabFormComponent } from './fablabs/fablab-form/fablab-form.component';
import { FablabListComponent } from './fablabs/fablab-list/fablab-list.component';

import { MatFormFieldModule, MatInputModule, MatCheckboxModule, MatSelect, MatSelectModule } from '@angular/material';

import { ChartsModule } from 'ng2-charts';
import { FaqComponent } from './faq/faq.component';
import { LoginComponent } from './login/login.component';
import { PrivacyComponent } from './privacy/privacy.component';

import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BlueprintsComponent } from './blueprints/blueprints.component';

import { UserSignupConfirmationComponent } from './users/user-signup-confirmation/user-signup-confirmation.component';
import { MyOrdersComponent } from './orders/my-orders/my-orders.component';
import { ShippingDetailsComponent } from './orders/shipping-details/shipping-details.component';
import { HospitalActivationComponent } from './hospitals/hospital-activation/hospital-activation.component';
import { PressComponent } from './press/press.component';
import { NavigationService } from './services/navigation.service';
import { DemoComponent } from './demo/demo.component';

@NgModule({
    declarations: [
        AppComponent,
        DropdownComponent,
        NavigationComponent,
        MachineListComponent,
        DashboardComponent,
        TableComponent,
        OrderListComponent,
        BlueprintsComponent,
        MachineFormComponent,
        CreateOrderComponent,
        MessageModalComponent,
        MachineDetailComponent,
        OrderDetailComponent,
        CompleteOrderComponent,
        OpenOrdersComponent,
        AcceptedOrdersComponent,
        OrderGridComponent,
        UserFormComponent,
        BackButtonComponent,
        LoginModalComponent,
        UserListComponent,
        InputModalComponent,
        ChangePasswdModalComponent,
        UserDetailComponent,
        UserSignupConfirmationComponent,
        UploadComponent,
        IotDeviceListComponent,
        IotDeviceFormComponent,
        IotDeviceDetailComponent,
        OctoprintModalComponent,
        AddButtonComponent,
        EditButtonComponent,
        DeleteButtonComponent,
        UserActivationComponent,
        FablabFormComponent,
        AboutUsComponent,
        FablabListComponent,
        FaqComponent,
        LoginComponent,
        PrivacyComponent,
        LegalNoticeComponent,
        ShippingDetailsComponent,
        HospitalActivationComponent,
        MyOrdersComponent,
        PressComponent,
        DemoComponent
    ],
    imports: [
        MatFormFieldModule,
        MatInputModule,
        FlexLayoutModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatCheckboxModule,
        MatSelectModule,
        ReactiveFormsModule,
        BrowserModule,
        NgxSpinnerModule,
        NgSelectModule,
        FormsModule,
        FontAwesomeModule,
        HttpClientModule,
        ngfModule,
        NgbModule,
        ChartsModule,
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
        }),
        BrowserAnimationsModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true }, // magic for cors
        MachineService, FablabService, ConfigService, ServiceService, AuthGuard, AdminGuard,
        NavigationService,
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
