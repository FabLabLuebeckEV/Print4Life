import { MachineListComponent } from '../machines/machine-list/machine-list.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { Routes } from '@angular/router';

export let appRoutes: Routes = [
    {
        path: 'machine',
        component: MachineListComponent
    },
    {
        path: '',
        component: DashboardComponent
    }
];
