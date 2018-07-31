import { MachineListComponent } from '../machines/machine-list/machine-list.component';
import { OrderListComponent } from '../orders/order-list/order-list.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { MachineFormComponent } from '../machines/machine-form/machine-form.component';
import { Routes } from '@angular/router';
import { config } from '../config/config';
// import { DeleteModalComponent } from '../orders/delete-modal/delete-modal.component';

export let appRoutes: Routes = [
    {
        path: config.paths.machines.root,
        component: MachineListComponent,
        children: [
            { path: config.paths.machines.create, component: MachineFormComponent },
            { path: `${config.paths.machines.update}/${config.paths.machines.getById}`, component: MachineFormComponent },
        ]
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
