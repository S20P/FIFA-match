import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';


import { AppComponent } from './app.component';
import { MatchesApiService } from './service/live_match/matches-api.service';
import { MatchService } from './service/match.service';
import { AppRoutingModule ,routingComponents} from './/app-routing.module';
import {HttpClientModule} from '@angular/common/http';

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
    
  ],
  providers: [MatchesApiService,MatchService],
  bootstrap: [AppComponent]
})
export class AppModule { }
