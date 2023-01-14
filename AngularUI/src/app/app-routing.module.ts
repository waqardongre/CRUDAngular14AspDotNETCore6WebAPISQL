import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { StateComponent } from './_components/state.component';
import { CountryComponent } from './_components/country.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'countries', component: CountryComponent },
    { path: 'states', component: StateComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }