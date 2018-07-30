import { MachineListComponent } from '../machines/machine-list/machine-list.component';
import { OrderListComponent } from '../orders/order-list/order-list.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { MachineFormComponent } from '../machines/machine-form/machine-form.component';
import { Routes } from '@angular/router';
import { config } from './config';
import { CreateOrderComponent } from '../orders/create-order/create-order.component';
// import { DeleteModalComponent } from '../orders/delete-modal/delete-modal.component';

export let appRoutes: Routes = [
    {
        path: 'machines',
        component: MachineListComponent,
        children: [
            { path: 'new', component: MachineFormComponent },
            // {path: 'delete/:id', component: ArtistTrackListComponent},
            {path: 'edit/:id', component: MachineFormComponent},
        ]
    },

    {
        path: config.paths.orders.root,
        component: OrderListComponent,
        children: [
            { path: 'new', component: CreateOrderComponent }
        ]
    },
    {
        path: '',
        component: DashboardComponent
    }
];
