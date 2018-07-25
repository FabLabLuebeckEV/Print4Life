import { MachineListComponent } from '../machines/machine-list/machine-list.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { MachineFormComponent } from '../machines/machine-form/machine-form.component';
import { Routes } from '@angular/router';

export let appRoutes: Routes = [
    {
        path: 'machines',
        component: MachineListComponent,
        children: [
            { path: 'new', component: MachineFormComponent }
            // {path: 'delete/:id', component: ArtistTrackListComponent},
            // {path: 'edit/:id', component: ArtistAlbumListComponent},
        ]
    },

    {
        path: '',
        component: DashboardComponent
    }
];
