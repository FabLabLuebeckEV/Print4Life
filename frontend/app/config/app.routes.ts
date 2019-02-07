import { MachineListComponent } from '../machines/machine-list/machine-list.component';
import { OrderListComponent } from '../orders/order-list/order-list.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { MachineFormComponent } from '../machines/machine-form/machine-form.component';
import { Routes, CanActivate } from '@angular/router';
import { CreateOrderComponent } from '../orders/create-order/create-order.component';
import { MachineDetailComponent } from '../machines/machine-detail/machine-detail.component';
import { routes } from './routes';
import { OrderDetailComponent } from '../orders/order-detail/order-detail.component';
import { UserFormComponent } from '../users/user-form/user-form.component';
import { Injectable } from '@angular/core';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs';
import { ErrorService, ErrorType } from '../services/error.service';
import { UserListComponent } from '../users/user-list/user-list.component';
import { UserDetailComponent } from '../users/user-detail/user-detail.component';
import { IotDeviceListComponent } from '../iot-devices/iot-device-list/iot-device-list.component';
import { IotDeviceFormComponent } from '../iot-devices/iot-device-form/iot-device-form.component';
import { IotDeviceDetailComponent } from '../iot-devices/iot-device-detail/iot-device-detail.component';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private userService: UserService, private errorService: ErrorService) { }

    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
        const isLoggedIn = this.userService.isLoggedIn();
        if (!isLoggedIn) {
            this.errorService.showError({
                type: ErrorType.UNAUTHORIZED,
                status: 401,
                statusText: 'Unauthorized',
                stack: 'You need to login to visit this route!',
                data: undefined
            });
        }
        return isLoggedIn;
    }
}

export const appRoutes: Routes = [
    {
        path: routes.paths.frontend.machines.root,
        component: MachineListComponent,
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
            { path: routes.paths.frontend.machines.create, component: MachineFormComponent, canActivate: [AuthGuard], },
            { path: `${routes.paths.frontend.machines.update}/:type/:id`, component: MachineFormComponent, canActivate: [AuthGuard], },
            { path: `${routes.paths.frontend.machines.getById}`, component: MachineDetailComponent }
        ]
    },
    {
        path: `${routes.paths.frontend.machines.root}/${routes.paths.frontend.machines.successfulOrders}`,
        component: MachineListComponent,
        runGuardsAndResolvers: 'always',
    },
    {
        path: routes.paths.frontend.iotDevices.root,
        component: IotDeviceListComponent,
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
            { path: routes.paths.frontend.iotDevices.create, component: IotDeviceFormComponent },
            { path: routes.paths.frontend.iotDevices.detail + '/:id', component: IotDeviceDetailComponent }
        ]
    },
    {
        path: routes.paths.frontend.orders.root,
        component: OrderListComponent,
        runGuardsAndResolvers: 'always',
        children: [
            { path: routes.paths.frontend.orders.create, component: CreateOrderComponent, canActivate: [AuthGuard], },
            { path: routes.paths.frontend.orders.update + '/:id', component: CreateOrderComponent, canActivate: [AuthGuard], },
            { path: routes.paths.frontend.orders.detail + '/:id', component: OrderDetailComponent },
            {
                path:
                    routes.paths.frontend.orders.shared.root + '/' + routes.paths.frontend.orders.shared.create,
                component: CreateOrderComponent
            },
            {
                path:
                    routes.paths.frontend.orders.shared.root + '/' + routes.paths.frontend.orders.shared.update + '/:id',
                component: CreateOrderComponent
            },
            {
                path:
                    routes.paths.frontend.orders.shared.root + '/' + routes.paths.frontend.orders.shared.detail + '/:id',
                component: OrderDetailComponent
            }
        ]
    },
    {
        path: `${routes.paths.frontend.orders.root}/${routes.paths.frontend.orders.outstandingOrders}`,
        component: OrderListComponent,
        runGuardsAndResolvers: 'always'
    },
    {
        path: `${routes.paths.frontend.orders.root}/${routes.paths.frontend.orders.unfinishedOrders}`,
        component: OrderListComponent,
        runGuardsAndResolvers: 'always'
    },
    {
        path: `${routes.paths.frontend.orders.root}/${routes.paths.frontend.orders.myOrders}`,
        component: OrderListComponent,
        runGuardsAndResolvers: 'always'
    },
    {
        path: routes.paths.frontend.users.root,
        component: UserListComponent,
        runGuardsAndResolvers: 'always',
        children: [
            { path: routes.paths.frontend.users.signup, component: UserFormComponent },
            { path: routes.paths.frontend.users.update + '/:id', component: UserFormComponent, },
            { path: routes.paths.frontend.users.profile, component: UserFormComponent },
            { path: ':id', component: UserDetailComponent }
        ]
    },
    {
        path: '',
        component: DashboardComponent,
        runGuardsAndResolvers: 'always'
    }
];
