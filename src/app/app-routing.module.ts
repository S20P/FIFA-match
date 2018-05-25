import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatchesDashboardComponent } from './matches-dashboard/matches-dashboard.component';
import { MatchesDetailComponentComponent } from './matches-detail-component/matches-detail-component.component';

const routes: Routes = [
  { path: '', redirectTo:'matches',pathMatch:'full'},
  { path: 'matches', component: MatchesDashboardComponent },  
  { path: 'matches/:id', component: MatchesDetailComponentComponent },
];



@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
export const routingComponents = [MatchesDashboardComponent,MatchesDetailComponentComponent];
