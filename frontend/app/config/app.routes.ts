import { MachineListComponent } from '../machines/machine-list/machine-list.component';
import { OrderListComponent } from '../orders/order-list/order-list.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { MachineFormComponent } from '../machines/machine-form/machine-form.component';
import { Routes } from '@angular/router';
import { CreateOrderComponent } from '../orders/create-order/create-order.component';
import { MachineDetailComponent } from '../machines/machine-detail/machine-detail.component';
import { routes } from './routes';

export const appRoutes: Routes = [
    {
        path: routes.paths.machines.root,
        component: MachineListComponent,
        children: [
            { path: routes.paths.machines.create, component: MachineFormComponent },
            { path: `${routes.paths.machines.update}/:id`, component: MachineFormComponent },
            { path: `${routes.paths.machines.getById}`, component: MachineDetailComponent }
        ]
    },

    {
        path: routes.paths.orders.root,
        component: OrderListComponent,
        children: [
            { path: routes.paths.orders.createOrder, component: CreateOrderComponent },
            { path: `${routes.paths.orders.updateOrder}/:id`, component: CreateOrderComponent }
        ]
    },
    {
        path: '',
        component: DashboardComponent
    }
];
