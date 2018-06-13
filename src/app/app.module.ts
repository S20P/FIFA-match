import { BrowserModule } from '@angular/platform-browser';
import { NgModule ,NO_ERRORS_SCHEMA, } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

import { AppComponent } from './app.component';
import { MatchesApiService } from './service/live_match/matches-api.service';
import { MatchService } from './service/match.service';
import { AppRoutingModule ,routingComponents} from './/app-routing.module';
import {HttpClientModule} from '@angular/common/http';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
      ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    MDBBootstrapModule.forRoot()
  ],
  schemas: [ NO_ERRORS_SCHEMA ],
  providers: [MatchesApiService,MatchService,DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
