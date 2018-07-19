import { MachineListComponent } from '../machine-list/machine-list.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { Routes } from '@angular/router';

export let appRoutes: Routes = [
    {
        path: 'machines',
        component: MachineListComponent
    },
    {
        path: '',
        component: DashboardComponent
    }
];
