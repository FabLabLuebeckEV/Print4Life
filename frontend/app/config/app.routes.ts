import { MachineListComponent } from '../machines/machine-list/machine-list.component';
import { OrderListComponent } from '../orders/order-list/order-list.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { MachineFormComponent } from '../machines/machine-form/machine-form.component';
import { Routes } from '@angular/router';
import { CreateOrderComponent } from '../orders/create-order/create-order.component';
import { MachineDetailComponent } from '../machines/machine-detail/machine-detail.component';
import { routes } from './routes';
import { OrderDetailComponent } from '../orders/order-detail/order-detail.component';
import { UserFormComponent } from '../users/user-form/user-form.component';
import { UserComponent } from '../users/user/user.component';

export const appRoutes: Routes = [
    {
        path: routes.paths.frontend.machines.root,
        component: MachineListComponent,
        children: [
            { path: routes.paths.frontend.machines.create, component: MachineFormComponent },
            { path: `${routes.paths.frontend.machines.update}/:type/:id`, component: MachineFormComponent },
            { path: `${routes.paths.frontend.machines.getById}`, component: MachineDetailComponent }
        ]
    },

    {
        path: routes.paths.frontend.orders.root,
        component: OrderListComponent,
        children: [
            { path: routes.paths.frontend.orders.create, component: CreateOrderComponent },
            { path: routes.paths.frontend.orders.update + '/:id', component: CreateOrderComponent },
            { path: routes.paths.frontend.orders.detail + '/:id', component: OrderDetailComponent }
        ]
    },

    {
        path: routes.paths.frontend.users.root,
        component: UserComponent,
        children: [
            { path: routes.paths.frontend.users.create, component: UserFormComponent },
            { path: routes.paths.frontend.users.update + '/:id', component: UserFormComponent }
        ]
    },
    {
        path: '',
        component: DashboardComponent
    }
];
