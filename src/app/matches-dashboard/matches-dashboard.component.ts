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
  selector: 'app-matches-dashboard',
  templateUrl: './matches-dashboard.component.html',
  styleUrls: ['./matches-dashboard.component.css']
})

export class MatchesDashboardComponent implements OnInit {
  message: string;
  messages = [];
  paramDate: any;
  AllCompetitions = [];
  AllCompetitions_match = [];
  match_ground_details = [];
  datepicker_afterview;
  alldaymatch_list = [];
  lastHeightPosted = null;
  loading;
  match_dropdown_title = [
    "TODAY'S MATCHES",
    "All Matches",
    "Group Matches",
    "Round of 16",
    "Quater-Finals",
    "Semi-Finals",
    "For 3rd Place",
    "Final",
  ];

  All_Matches = [];

  status_offon: boolean = false;

  live_matches:boolean;

  l_timer;
  l_visitorteam_score;
  l_localteam_score;

  public showloader: boolean = false;
  private subscription: Subscription;
  private timer: Observable<any>;
  date;
  live_matches_id;



  constructor(private matchesApiService: MatchesApiService,
    private matchService: MatchService,
    private router: Router,
    private route: ActivatedRoute,
    public datepipe: DatePipe,
    private liveMatchesApiService: MatchesApiService
    
  ) { 
    this.status_offon = false;
    this.live_matches = false;
  }


  ngOnInit() {

    // moment.js utc local timezone UTC

    this.liveMatchesApiService.liveMatches().subscribe(data => {
      console.log("Live-Matches-data", data);
      console.log("live data1", data['data']['events']);
      var result = data['data'];
      var events = result.events;
      console.log("live events", events);
      this.status_offon = true;
      this.GetMatchesByCompetition_ById_live();
  });



    this.setTimer();

    this.GetAllCompetitions();
    this.dateSchedule_ini();

    $('#datepicker').datepicker();

    $('#datepicker').datepicker('setDate', 'today');

    var today = $('#datepicker').val();
    this.paramDate = today;

    console.log("today", this.paramDate);


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
 
    // if (this.paramDate == currentdaydate) {
    //   this.status_offon = true;

    // } else {
    //   this.status_offon = false;
    // }

    this.GetMatchesByDate(this.paramDate);

    let self = this;
    $("#datepicker").on("change", function () {
      var selected = $(this).val();
    console.log("date is one",selected);
    console.log("date is currentdaydate",currentdaydate);
      self.GetMatchesByDate(selected);
    });

    //  this.matchesApiService
    //    .getMessages()
    //    .subscribe((data: string) => {
    //      //console.log("msg-data",data);
    //      this.messages.push(data['data']);
    //    });
  }


  get_title(title) {
    console.log("title is", title);
  }

  dateSchedule_ini() {

    //this.loadjquery();
    var array = this.alldaymatch_list;

    console.log("date-list", this.alldaymatch_list);

    $('#datepicker').datepicker({
      //changeMonth: true,
      // changeYear: true,
      inline: true,
      showOtherMonths: true,
      dateFormat: 'yy-mm-dd',
      dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      beforeShowDay: function (date) {
        var string = $.datepicker.formatDate('yy-mm-dd', date);
        if (array.indexOf(string) != -1) {
          return [true];
        }
        return [true, "highlight", string];
      }
    });



    function formatDate(date) {
      var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
      return [year, month, day].join('-');
    }

  }


  GetMatchesByCompetition_ById_live(){

            
    this.liveMatchesApiService.liveMatches().subscribe(data => {
         
      console.log("Live-Matches-data", data);
     
      var result = data['data'];

      console.log("live data", data['data']['events']);

      console.log("Matches is Live", data);
      if (result.events !== undefined) {

         
          this.live_matches= true;
          var result_events = data['data'].events;
          
       
          let current_matchId = result_events['id'];
          // this.GetCommentariesByMatchId(current_matchId);

       
                  this.live_matches_id = result_events['id'];
                  this.l_timer = result_events['timer'];
                  this.l_visitorteam_score = result_events['visitorteam_score'];
                  this.l_localteam_score = result_events['localteam_score'];


      }
    })
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


  GetAllCompetitions() {
    this.All_Matches = [];
    this.matchService.GetAllCompetitions().subscribe(data => {
      //console.log("GetAllCompetitions",data);
      this.AllCompetitions = data['data'];
      for (var i = 0; i < this.AllCompetitions.length; i++) {

        this.AllCompetitions_match.push({
          "id": this.AllCompetitions[i].id, "name": this.AllCompetitions[i].name,
        }
        );

        this.matchService.GetAllCompetitions_ById(this.AllCompetitions[i].id).subscribe(data => {
          console.log("GetCompetitionStandingById", data);
        });


        this.matchService.GetMatchesByCompetition_ById(this.AllCompetitions[i].id).subscribe(data => {
          console.log("GetMatchesByCompetition_ById", data);

          var result = data['data'];

          this.All_Matches.push(result);


          if (result !== undefined) {
            for (var k = 0; k < result.length; k++) {
              var myString = result[k].formatted_date;
              var arr = myString.split('.');
              let day = arr[0];
              let month = arr[1];
              let year = arr[2];
              var fulldate = year + "-" + month + "-" + day;
              this.alldaymatch_list.push(fulldate);
              this.loadjquery();
            }
          }
        });
      }
    });
    console.log('AllCompetitions_details', this.AllCompetitions_match);
  }

  matchdetails(id, comp_id) {
    this.router.navigate([id, { "comp_id": comp_id }], { relativeTo: this.route });
  }

  loadjquery() {
    setTimeout(function () {
      $("#datepicker").datepicker("refresh");

    }, 1);
  }

  sendMessage() {
    //  console.log("message",this.message);
    let msg = this.matchesApiService.sendMessage(this.message);
    //  console.log("msg sent",msg);
    this.message = '';
  }
  public setTimer() {

    // set showloader to true to show loading div on view
    this.showloader = true;

    this.timer = Observable.timer(3000); // 5000 millisecond means 5 seconds
    this.subscription = this.timer.subscribe(() => {
      // set showloader to false to hide loading div from view after 5 seconds
      this.showloader = false;
    });
  }


  filterMatches(val) {
    console.log("filter match for", val);

    let comp_id = "1056";

    this.match_ground_details = [];

    var matches_all = this.All_Matches;

    var array2 = [];

    var array1 = [];  //comp_id = "1056" by filter


    for (let item of matches_all) {

      if (item !== undefined) {

        for (let i = 0; i < item['length']; i++) {

          if (item[i].comp_id == comp_id) {
            array1.push(item[i]);
          }

        }
      }
    }



    this.matchService.GetStaticMatches().subscribe(data => {
      // console.log("StaticMAtches", data);

      for (let i = 0; i < array1.length; i++) {
        //  array1.push(data[i]);
        Object.assign(array1[i], { "match_number": data[i].match_number, "match_type": data[i].match_type });
      }
      for (let i = array1.length; i < data['length']; i++) {
        array1.push(data[i]);
      }

      console.log("array1", array1);



      if (val == 'All Matches') {

        for (let item of array1) {


          var myString = item['formatted_date'];
          var arr = myString.split('.');
          let day = arr[0];
          let month = arr[1];
          let year = arr[2];
          var fulldate = year + "-" + month + "-" + day;

          //Change UTC timezone to IST(Local)
          let timezone = fulldate + " " + item['time'];

          let match_time = calcTime(timezone, '+11');
          // console.log("time ", match_time);


          this.match_ground_details.push({
            "comp_id": item['comp_id'],
            "et_score": item['et_score'],
            "formatted_date": item['formatted_date'],
            "ft_score": item['ft_score'],
            "ht_score": item['ht_score'],
            "localteam_id": item['localteam_id'],
            "localteam_name": item['localteam_name'],
            "localteam_score": item['localteam_score'],
            "match_number": item['match_number'],
            "match_type": item['match_type'],
            "penalty_local": item['penalty_local'],
            "penalty_visitor": item['penalty_visitor'],
            "season": item['season'],
            "status": item['status'],
            "time": match_time,
            "venue": item['venue'],
            "venue_city": item['venue_city'],
            "venue_id": item['venue_id'],
            "visitorteam_id": item['visitorteam_id'],
            "visitorteam_name": item['visitorteam_name'],
            "visitorteam_score": item['visitorteam_score'],
            "week": item['week'],
            "_id": item['_id'],
            "id": item['id'],
          });
        }
      }
    });





    function calcTime(dateto, offset) {
      // create Date object for current location
      let d = new Date(dateto);
      let utc = d.getTime() + (d.getTimezoneOffset() * 60000);
      let nd = new Date(utc + (3600000 * offset));
      return nd.toLocaleString();
    }

    console.log("match_ground_details", this.match_ground_details);

  }








}
