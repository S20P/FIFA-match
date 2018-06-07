import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatchesDashboardComponent } from './matches-dashboard/matches-dashboard.component';
import { MatchesDetailComponentComponent } from './matches-detail-component/matches-detail-component.component';
import { MatchGroupComponent } from './match-group/match-group.component';
import { MatchStadiumComponent } from './match-stadium/match-stadium.component';


const routes: Routes = [
  { path: '', redirectTo:'matches',pathMatch:'full'},
  { path: 'matches', component: MatchesDashboardComponent },  
  { path: 'matches/:id', component: MatchesDetailComponentComponent },
  { path: 'group', component: MatchGroupComponent },  
  { path: 'stadium', component: MatchStadiumComponent },  
];


@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
export const routingComponents = [MatchesDashboardComponent,MatchesDetailComponentComponent,MatchGroupComponent,MatchStadiumComponent];
