import { MachineListComponent } from '../machines/machine-list/machine-list.component';
import { OrderListComponent } from '../orders/order-list/order-list.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { Routes } from '@angular/router';
import { config } from '../config/config';
// import { DeleteModalComponent } from '../orders/delete-modal/delete-modal.component';

export let appRoutes: Routes = [
    {
        path: 'machines',
        component: MachineListComponent
    },
    {
        path: config.paths.orders.root,
        component: OrderListComponent,
        children: [
        //    { path: `deleteOrder/:id`, component: DeleteModalComponent},
        ]
    },
    {
        path: '',
        component: DashboardComponent
    }
];
