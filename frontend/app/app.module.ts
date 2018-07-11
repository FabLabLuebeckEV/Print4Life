import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { DropdownComponent } from './dropdown/dropdown.component';

@NgModule({
    declarations: [
        AppComponent, DropdownComponent
    ],
    imports: [
        BrowserModule,
        NgbModule.forRoot()
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
