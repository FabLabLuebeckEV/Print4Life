import { MachineListComponent } from '../machines/machine-list/machine-list.component';
import { OrderListComponent } from '../orders/order-list/order-list.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { Routes } from '@angular/router';
import { config } from '../config/config';

export let appRoutes: Routes = [
    {
        path: 'machines',
        component: MachineListComponent
    },
    {
        path: config.paths.orders.root,
        component: OrderListComponent,
        children: [
            { path: `${config.paths.orders.deleteOrder}/:id`, component: OrderListComponent},
        ]
    },
    {
        path: '',
        component: DashboardComponent
    }
];
