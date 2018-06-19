import {
  Component,
  OnInit,
  ViewChild,
  OnChanges,
  AfterViewChecked,
  DoCheck,
  AfterContentInit,
  AfterContentChecked,
  AfterViewInit,
  OnDestroy,
  NgZone,
} from '@angular/core';
import { MatchesApiService } from '../service/live_match/matches-api.service';
import { MatchService } from '../service/match.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
declare var jQuery: any;
declare var $: any;
import { DatePipe } from '@angular/common';

import * as moment from 'moment';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  match_ground_details = [];

  slive_matches:boolean;

  sstatus_offon:boolean;
  sl_timer;
  sl_visitorteam_score;
  sl_localteam_score;
  slive_matches_id;
  sl_status;

  constructor(private matchesApiService: MatchesApiService,
    private matchService: MatchService,
    private router: Router,
    private route: ActivatedRoute,
    public datepipe: DatePipe,
    private liveMatchesApiService: MatchesApiService) {
      this.liveMatchesApiService.liveMatches().subscribe(data => {
        console.log("Live-Matches-data", data);
        console.log("live data1", data['data']['events']);
        var result = data['data'];
        var events = result.events;
        console.log("live events", events);
        this.sstatus_offon = true;
        this.GetMatchesByCompetition_ById_live();
        this.slive_matches= true;
    });
  
     }

  ngOnInit() {
    this.sstatus_offon = false;
    var dateofday = Date();
    
    var currentdaydate = formatDate(dateofday);
    function formatDate(date) {
      var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
      return [year, month, day].join('-');
    }
     console.log("today side bar",currentdaydate);

     this.GetMatchesByDate(currentdaydate);
    
  }
  GetMatchesByCompetition_ById_live(){
            
    this.liveMatchesApiService.liveMatches().subscribe(data => {
         
      console.log("Live-Matches-data", data);
     
      var result = data['data'];

      console.log("live data", data['data']['events']);

      console.log("Matches is Live", data);
      if (result.events !== undefined) {
         
          this.slive_matches= true;
          var result_events = data['data'].events;
       
          let current_matchId = result_events['id'];
          // this.GetCommentariesByMatchId(current_matchId);
       
                  this.slive_matches_id = result_events['id'];
                  this.sl_status =  result_events['status'];
                  this.sl_timer = result_events['timer'];
                  this.sl_visitorteam_score = result_events['visitorteam_score'];
                  this.sl_localteam_score = result_events['localteam_score'];
      }
    });
  }
  GetMatchesByDate(selected) {

    console.log("selected date is...", selected);

    let result = [];
    this.match_ground_details = [];

    //  console.log("dddddd",paramDate);
    // parameter: date (Date Format Must be YYYY-MM-DD)-------------
    // let date = paramDate;
    this.matchService.GetMatchesByDate(selected).subscribe(data => {
      console.log("GetMatchesByDate", data);
      // this.match_ground_details.push(data['data']);

      var result = data['data'];
      if (result !== undefined) {
        for (let item of result) {


          //Change UTC timezone to IST(Local)
          let timezone = selected + " " + item.time;

          let match_time = calcTime(timezone, '+11');
          console.log("time ", match_time);
          this.matchService.GetStaticMatches().subscribe(data => {

            console.log("Matches type ang g", data);
            for (let i = 0; i < data['length']; i++) {

              if (data[i].id == item.id && data[i].comp_id == item.comp_id) {


                var flag__loal = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/teamsNew/" + item.localteam_id + ".png";
                var flag_visit = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/teamsNew/" + item.visitorteam_id + ".png";


                var localteam_image;
                var visitorteam_image;

                var Image_team1 = isUrlExists(flag__loal);

                if (Image_team1 == false) {
                  console.log('Image does not exist');
                  localteam_image = "assets/img/avt_flag.jpg"
                }
                else {
                  console.log('Image Exists');
                  localteam_image = flag__loal;
                }


                var Image_team2 = isUrlExists(flag_visit);

                if (Image_team2 == false) {
                  console.log('Image does not exist');
                  visitorteam_image = "assets/img/avt_flag.jpg"
                }
                else {
                  console.log('Image Exists');
                  visitorteam_image = flag_visit;
                }
                var date1 = new Date(match_time);
                // Sun Dec 17 1995 03:24:00 GMT...
                 
                var date2 = new Date();
                // Sun Dec 17 1995 03:24:00 GMT...
               
                  if(date1 >= date2){
                        console.log("time is up");
                        this.sstatus_offon = true;
                  }
                  else{
                    console.log("time is less");
                    this.sstatus_offon = false;
                  }

                console.log("Matches type ang g1", data[i]);
                this.match_ground_details.push({
                  "comp_id": item.comp_id,
                  "et_score": item.et_score,
                  "formatted_date": item.formatted_date,
                  "ft_score": item.ft_score,
                  "ht_score": item.ht_score,
                  "localteam_id": item.localteam_id,
                  "localteam_name": item.localteam_name,
                  "localteam_score": item.localteam_score,
                  "localteam_image": localteam_image,
                  "penalty_local": item.penalty_local,
                  "penalty_visitor": item.penalty_visitor,
                  "season": item.season,
                  "status": item.status,
                  "time": match_time,
                  "venue": item.venue,
                  "venue_city": item.venue_city,
                  "venue_id": item.venue_id,
                  "visitorteam_id": item.visitorteam_id,
                  "visitorteam_name": item.visitorteam_name,
                  "visitorteam_score": item.visitorteam_score,
                  "visitorteam_image": visitorteam_image,
                  "week": item.week,
                  "_id": item._id,
                  "id": item.id,
                  "match_number": data[i].match_number,
                  "match_type": data[i].match_type
                });

              }
            }

          });

        }
      }
    });

    function isUrlExists(image_url) {
      var Image_Exists = false;
      $.ajax(
        {
          async: false,
          url: image_url,
          success: function (data) {
            Image_Exists = true;
          },
          error: function (data) {
            Image_Exists = false;
          }
        });

      return Image_Exists;
    }
    function calcTime(dateto, offset) {
      // create Date object for current location
      let d = new Date(dateto);
      let utc = d.getTime() + (d.getTimezoneOffset() * 60000);
      let nd = new Date(utc + (3600000 * offset));
      return nd.toLocaleString();
    }
    //result = [];
    console.log("filter-date_data", this.match_ground_details);
    //this.match_ground_details = [];
  }


  
  matchdetails(id, comp_id) {
    this.router.navigate(['/matches', id, { "comp_id": comp_id }]);
  }
}
