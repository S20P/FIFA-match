import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatchService } from '../service/match.service';

import { MatchesApiService } from '../service/live_match/matches-api.service';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
declare var jQuery: any;
declare var $: any;
import { DatePipe } from '@angular/common';


@Component(
    {
        selector: 'app-matches-detail-component',
        templateUrl: './matches-detail-component.component.html',
        styleUrls: ['./matches-detail-component.component.css']
    }
)
export class MatchesDetailComponentComponent implements OnInit {

    public id;
    public comp_id;
    match_detailcollection = [];
    events_collection = [];
    // Line_up_collection = [];
    localteam_player_lineup = [];
    visitorteam_player_lineup = [];
    localteam_player_subs = [];
    visitorteam_player_subs = [];
    Commentary_collection = [];

    ic_event_penalty_scored;
    ic_event_own_goal;
    ic_event_goal;

    match_stats_collection = [];

    public showloader: boolean = false;
    private subscription: Subscription;
    private timer: Observable<any>;

    statsA_min;
    status;
    live_matches:boolean;

    l_timer;
    l_visitorteam_score;
    l_localteam_score;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private matchService: MatchService,
        public datepipe: DatePipe,
        private liveMatchesApiService: MatchesApiService,
    
    ) {

        this.ic_event_penalty_scored = false;
        this.ic_event_own_goal = false;
        this.ic_event_goal = false;
        this.live_matches = false;
        this.route.paramMap.subscribe((params: ParamMap) => {
            let id = parseInt(params.get("id"));
            this.id = id;
            let comp_id = parseInt(params.get("comp_id"));
            this.comp_id = comp_id;
            this.GetMatchesByCompetition_ById();
            this.GetCommentariesByMatchId(this.id);
        });
    }

    ngOnInit() {

        this.liveMatchesApiService.liveMatches().subscribe(data => {
            console.log("Live-Matches-data", data);
            console.log("live data1", data['data']['events']);
            var result = data['data'];
            var events = result.events;
            console.log("live events", events);
            this.GetMatchesByCompetition_ById_live();
            //  this.loading = "none";
            this.GetCommentariesByMatchId_live();
        });

        this.statsA_min = '20';

        this.setTimer();
    

        

    }
    public setTimer() {

        // set showloader to true to show loading div on view
        this.showloader = true;

        this.timer = Observable.timer(2000); // 5000 millisecond means 5 seconds
        this.subscription = this.timer.subscribe(() => {
            // set showloader to false to hide loading div from view after 5 seconds
            this.showloader = false;
        });
    }




    GetMatchesByCompetition_ById_live() {
       // this.match_detailcollection =[];
      
        this.liveMatchesApiService.liveMatches().subscribe(data => {
         
            console.log("Live-Matches-data", data);

            var result = data['data'];

            console.log("live data", data['data']['events']);

            console.log("Matches is Live", data);
            if (result.events !== undefined) {

               
                var result_events = data['data'].events;
                console.log("date is ", result_events.formatted_date);
              
                
                if(this.id==result_events['id'] && this.comp_id==result_events['comp_id']){
                    this.match_detailcollection =[];
                    this.events_collection =[];
                    this.live_matches= true;

                let date_formatted = result_events.formatted_date.replace('.', '/');
                let date = date_formatted.replace('.', '/');

                //Change UTC timezone to IST(Local)
                var myString = result_events['formatted_date'];
                var arr = myString.split('.');
                let day = arr[0];
                let month = arr[1];
                let year = arr[2];
                var fulldate = year + "-" + month + "-" + day;

                //Change UTC timezone to IST(Local)
                let timezone = fulldate + " " + result_events['time'];
                let match_time = calcTime(timezone, '+11');
                console.log("time ", match_time);


                let current_matchId = result_events['id'];
                // this.GetCommentariesByMatchId(current_matchId);

                var flag__loal = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/teamsNew/" + result_events['localteam_id'] + ".png";
                var flag_visit = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/teamsNew/" + result_events['visitorteam_id'] + ".png";

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

                this.match_detailcollection
                    .push({
                        "comp_id": result_events['comp_id'],
                        "et_score": result_events['et_score'],
                        "formatted_date": date,
                        "ft_score": result_events['ft_score'],
                        "ht_score": result_events['ht_score'],
                        "localteam_id": result_events['localteam_id'],
                        "localteam_name": result_events['localteam_name'],
                        "localteam_score": result_events['localteam_score'],
                        "localteam_image": localteam_image,
                        "penalty_local": result_events['penalty_local'],
                        "penalty_visitor": result_events['penalty_visitor'],
                        "season": result_events['season'],
                        "status": result_events['status'],
                        "time": match_time,
                        "timer":result_events['timer'],
                        "venue": result_events['venue'],
                        "venue_city": result_events['venue_city'],
                        "venue_id": result_events['venue_id'],
                        "visitorteam_id": result_events['visitorteam_id'],
                        "visitorteam_name": result_events['visitorteam_name'],
                        "visitorteam_score": result_events['visitorteam_score'],
                        "visitorteam_image": visitorteam_image,
                        "week": result_events['week'],
                        "_id": result_events['_id'],
                        "id": result_events['id']
                    });

                        this.l_timer = result_events['timer'];
                        this.l_visitorteam_score = result_events['visitorteam_score'];
                        this.l_localteam_score = result_events['localteam_score'];


                let events_data = result_events['events'];
                for (var e = 0; e < events_data.length; e++) {

                    let result_pipe_l = events_data[e].result.replace(']', '');
                    let result_pipe = result_pipe_l.replace('[', '');

                    let ic_event_penalty_scored = false;
                    let ic_event_own_goal = false;
                    let ic_event_goal = false;
                    var type = events_data[e].type;

                    if (type == "goal") {

                        let player = events_data[e].player;
                        if (player.includes("(pen.)")) {
                            ic_event_penalty_scored = true;
                        }
                        else if (player.includes("(o.g.)")) {
                            ic_event_own_goal = true;
                        }
                        else {
                            ic_event_goal = true;
                        }

                    }

                    this.events_collection
                        .push({
                            "id": events_data[e].id,
                            "type": events_data[e].type,
                            "minute": events_data[e].minute,
                            "extra_min": events_data[e].extra_min,
                            "team": events_data[e].team,
                            "assist": events_data[e].assist,
                            "assist_id": events_data[e].assist_id,
                            "player": events_data[e].player,
                            "player_id": events_data[e].player_id,
                            "result": result_pipe,
                            "ic_event_penalty_scored": ic_event_penalty_scored,
                            "ic_event_own_goal": ic_event_own_goal,
                            "ic_event_goal": ic_event_goal
                        });
                }
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
    }



    GetMatchesByCompetition_ById() {
        this.match_detailcollection =[];
        this.events_collection =[];
        this.matchService.GetMatchesByCompetition_ById(this.comp_id).subscribe(data => {

            console.log("GetMatchesByCompetition_ById", data);
         
                var result = data['data'];


                if (result !== undefined) {

                    console.log("--------------------");
                    console.log("data", result)

                    this.status = result['status'];

                    for (var k = 0; k < result.length; k++) {


                        if (result[k].id == this.id) {
                            let date_formatted = result[k].formatted_date.replace('.', '/');
                            let date = date_formatted.replace('.', '/');

                            //Change UTC timezone to IST(Local)
                            var myString = result[k].formatted_date;
                            var arr = myString.split('.');
                            let day = arr[0];
                            let month = arr[1];
                            let year = arr[2];
                            var fulldate = year + "-" + month + "-" + day;

                            //Change UTC timezone to IST(Local)
                            let timezone = fulldate + " " + result[k].time;
                            let match_time = calcTime(timezone, '+11');
                            console.log("time ", match_time);


                            //let current_matchId = result[0].id;
                            //  this.GetCommentariesByMatchId(current_matchId);

                            var flag__loal = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/teamsNew/" + result[k].localteam_id + ".png";
                            var flag_visit = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/teamsNew/" + result[k].visitorteam_id + ".png";

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

                            console.log(":Matches tiem:",match_time);
                            var date1 = new Date(match_time);
                            // Sun Dec 17 1995 03:24:00 GMT...
                             
                            var date2 = new Date();
                            // Sun Dec 17 1995 03:24:00 GMT...
                            
                            var status_offon;
                            if(date1 >= date2){
                                  console.log("time is up");
                             status_offon = false;
                            }
                            else{
                              console.log("time is less");
                              status_offon = true;
                            }
          
                            this.match_detailcollection
                                .push({
                                    "comp_id": result[k].comp_id,
                                    "et_score": result[k].et_score,
                                    "formatted_date": date,
                                    "ft_score": result[k].ft_score,
                                    "ht_score": result[k].ht_score,
                                    "localteam_id": result[k].localteam_id,
                                    "localteam_name": result[k].localteam_name,
                                    "localteam_score": result[k].localteam_score,
                                    "localteam_image": localteam_image,
                                    "penalty_local": result[k].penalty_local,
                                    "penalty_visitor": result[k].penalty_visitor,
                                    "season": result[k].season,
                                    "status": result[k].status,
                                    "time": match_time,
                                    "timer":result[k].timer,
                                    "venue": result[k].venue,
                                    "venue_city": result[k].venue_city,
                                    "venue_id": result[k].venue_id,
                                    "visitorteam_id": result[k].visitorteam_id,
                                    "visitorteam_name": result[k].visitorteam_name,
                                    "visitorteam_score": result[k].visitorteam_score,
                                    "visitorteam_image": visitorteam_image,
                                    "week": result[k].week,
                                    "_id": result[k]._id,
                                    "id": result[k].id,
                                    "live_status":status_offon
                                });

                            let events_data = result[k].events;
                            for (var e = 0; e < events_data.length; e++) {

                                let result_pipe_l = events_data[e].result.replace(']', '');
                                let result_pipe = result_pipe_l.replace('[', '');

                                let ic_event_penalty_scored = false;
                                let ic_event_own_goal = false;
                                let ic_event_goal = false;
                                var type = events_data[e].type;

                                if (type == "goal") {

                                    let player = events_data[e].player;
                                    if (player.includes("(pen.)")) {
                                        ic_event_penalty_scored = true;
                                    }
                                    else if (player.includes("(o.g.)")) {
                                        ic_event_own_goal = true;
                                    }
                                    else {
                                        ic_event_goal = true;
                                    }

                                }

                                this.events_collection
                                    .push({
                                        "id": events_data[e].id,
                                        "type": events_data[e].type,
                                        "minute": events_data[e].minute,
                                        "extra_min": events_data[e].extra_min,
                                        "team": events_data[e].team,
                                        "assist": events_data[e].assist,
                                        "assist_id": events_data[e].assist_id,
                                        "player": events_data[e].player,
                                        "player_id": events_data[e].player_id,
                                        "result": result_pipe,
                                        "ic_event_penalty_scored": ic_event_penalty_scored,
                                        "ic_event_own_goal": ic_event_own_goal,
                                        "ic_event_goal": ic_event_goal
                                    });
                            }

                        }
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
        console.log("*********current_detail", this.match_detailcollection);
        console.log("*************current_event", this.events_collection);

    }


    GetCommentariesByMatchId(current_matchId) {

        this.localteam_player_lineup = [];
        this.visitorteam_player_lineup = [];
        this.localteam_player_subs = [];
        this.visitorteam_player_subs = [];
        this.match_stats_collection = [];
        this.Commentary_collection = [];

        //this.match_detailcollection;
        console.log("match_id", current_matchId);

        this.matchService.GetCommentariesByMatchId(current_matchId).subscribe(data => {
            console.log("GetCommentariesByMatchId", data);

            var result = data['data'];
         
                if (result !== undefined) {
                    for (var l = 0; l < result.length; l++) {

                        let lineup = result[l].lineup;
                        let subs = result[l].subs;
                        let comments = result[l].comments;



                        //    localteam_lineup------------------------------------------------------------------------------------
                        let localteam_lineup = lineup['localteam'];

                        for (var lt = 0; lt < localteam_lineup.length; lt++) {

                            var localteamLinePlayer_url = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/players/" + localteam_lineup[lt].id + ".jpg";

                            var localteamLineup_picture;

                            var Image_team1 = isUrlExists(localteamLinePlayer_url);
                            if (Image_team1 == false) {
                                localteamLineup_picture = "assets/img/avt_player.png"
                            }
                            else {
                                localteamLineup_picture = localteamLinePlayer_url;
                            }

                            this.localteam_player_lineup.push({
                                "id": localteam_lineup[lt].id,
                                "name": localteam_lineup[lt].name,
                                "number": localteam_lineup[lt].number,
                                "pos": localteam_lineup[lt].pos,
                                "picture": localteamLineup_picture,

                            });
                        }
                        //   end localteam_lineup-----------------------------------------------------------------------------------


                        //    localteam_subs----------------------------------------------------------------------------------------

                        let localteam_subs = subs['localteam'];

                        for (var lts = 0; lts < localteam_subs.length; lts++) {
                            var localteamSubsPayer_url = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/players/" + localteam_subs[lts].id + ".jpg";

                            var localteamSubs_picture;

                            var Image_team2 = isUrlExists(localteamSubsPayer_url);
                            if (Image_team2 == false) {
                                localteamSubs_picture = "assets/img/avt_player.png"
                            }
                            else {
                                localteamSubs_picture = localteamSubsPayer_url;
                            }

                            this.localteam_player_subs.push({
                                "id": localteam_subs[lts].id,
                                "name": localteam_subs[lts].name,
                                "number": localteam_subs[lts].number,
                                "pos": localteam_subs[lts].pos,
                                "picture": localteamSubs_picture,


                            });
                        }
                        //  end  localteam_subs------------------------------------------------------------------------------------



                        //    visitorteam_lineup------------------------------------------------------------------------------------

                        let visitorteam_lineup = lineup['visitorteam'];

                        for (var vt = 0; vt < visitorteam_lineup.length; vt++) {

                            var visitorteamLinePlayer_url = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/players/" + visitorteam_lineup[vt].id + ".jpg";

                            var visitorteamLineup_picture;

                            var Image_team3 = isUrlExists(visitorteamLinePlayer_url);
                            if (Image_team3 == false) {
                                visitorteamLineup_picture = "assets/img/avt_player.png"
                            }
                            else {
                                visitorteamLineup_picture = visitorteamLinePlayer_url;
                            }

                            this.visitorteam_player_lineup.push({

                                "id": visitorteam_lineup[vt].id,
                                "name": visitorteam_lineup[vt].name,
                                "number": visitorteam_lineup[vt].number,
                                "pos": visitorteam_lineup[vt].pos,
                                "picture": visitorteamLineup_picture,
                            });
                        }
                        //  end visitorteam_lineup--------------------------------------------------------------------------------

                        //    visitorteam_subs------------------------------------------------------------------------------------

                        let visitorteam_subs = subs['visitorteam'];

                        for (var vts = 0; vts < visitorteam_subs.length; vts++) {

                            var visitorteamSubsPayer_url = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/players/" + visitorteam_subs[vts].id + ".jpg";

                            var visitorteamSubs_picture;

                            var Image_team4 = isUrlExists(visitorteamSubsPayer_url);
                            if (Image_team4 == false) {
                                visitorteamSubs_picture = "assets/img/avt_player.png"
                            }
                            else {
                                visitorteamSubs_picture = visitorteamSubsPayer_url;
                            }

                            this.visitorteam_player_subs.push({
                                "id": visitorteam_subs[vts].id,
                                "name": visitorteam_subs[vts].name,
                                "number": visitorteam_subs[vts].number,
                                "pos": visitorteam_subs[vts].pos,
                                "picture": visitorteamSubs_picture,


                            });
                        }
                        //  end visitorteam_subs------------------------------------------------------------------------------------







                        //  comments---------------------------------------------------------------------------------------

                        for (var c = 0; c < comments.length; c++) {


                            let GoalType = false;
                            let isAssist = false;
                            let isSubstitution = false;
                            let downSubstitution = false;
                            let yellowcard = false;
                            let redcard = false;

                            let UpName = "";
                            let DownName = "";
                            let comment_icon = "";

                            let comment = comments[c].comment;
                            let important = comments[c].important;
                            let isgoal = comments[c].isgoal;
                            let minute = comments[c].minute

                            if (important == '1' && isgoal == '1') {

                                GoalType = true;
                                comment_icon = "assets/img/ic_goal.png";

                                let Substring1 = comment.split(".", 2);
                                let Substring2 = Substring1[1].split("-", 2);
                                UpName = Substring2[0];

                                //check 'Assist' is or not in given comment 
                                if (comment.includes("Assist")) {
                                    isAssist = true;
                                    let SubstringAssist = comment.split("Assist -", 2);
                                    let assistName = SubstringAssist[1].split("with", 2);
                                    DownName = assistName[0];
                                }
                            }
                            else {
                                //check 'Substitution' is or not in given comment
                                if (comment.includes("Substitution")) {

                                    isSubstitution = true;
                                    comment_icon = "assets/img/ic_sub_on_off_both2.png";


                                    console.log("Substitution is found.");

                                    let String1 = comment.split(".", 2);
                                    let String2 = String1[1].split("for", 2);
                                    let String3 = String2[1].split("-", 2);

                                    UpName = String2[0];
                                    DownName = String3[0];

                                }
                                if (comment.includes("yellow card")) {

                                    yellowcard = true;
                                    comment_icon = "assets/img/ic_yellow_card.png";

                                    let String1_yc = comment.split("-", 2);

                                    UpName = String1_yc[0];
                                    DownName = "yellow card";

                                }
                                if (comment.includes("red card")) {

                                    redcard = true;
                                    comment_icon = "assets/img/ic_red_card.png";

                                    let String1_rc = comment.split("-", 2);

                                    UpName = String1_rc[0];
                                    DownName = "red card";

                                }



                            }


                            this.Commentary_collection.push({
                                "GoalType": GoalType,
                                "isAssist": isAssist,
                                "isSubstitution": isSubstitution,
                                "downSubstitution": downSubstitution,
                                "yellowcard": yellowcard,
                                "redcard": redcard,
                                "upName": UpName,
                                "downName": DownName,
                                "comment": comment,
                                "minute": minute,
                                "icon": comment_icon
                            });


                       }

                        //  end comments------------------------------------------------------------------------------------



                        //    match_stats------------------------------------------------------------------------------------
                        let match_stats = result[l].match_stats;

                        let localteam_match_stats = match_stats['localteam'];
                        let visitorteam_match_stats = match_stats['visitorteam'];

                        //   lt for localteam && vt for visitorteam

                        for (var st = 0; st < localteam_match_stats.length; st++) {
                            this.match_stats_collection.push({
                                "lt_corners": localteam_match_stats[st].corners,
                                "lt_fouls": localteam_match_stats[st].fouls,
                                "lt_offsides": localteam_match_stats[st].offsides,
                                "lt_possesiontime": localteam_match_stats[st].possesiontime,
                                "lt_redcards": localteam_match_stats[st].redcards,
                                "lt_saves": localteam_match_stats[st].saves,
                                "lt_shots_ongoal": localteam_match_stats[st].shots_ongoal,
                                "lt_shots_total": localteam_match_stats[st].shots_total,
                                "lt_yellowcards": localteam_match_stats[st].yellowcards,
                                "vt_corners": visitorteam_match_stats[st].corners,
                                "vt_fouls": visitorteam_match_stats[st].fouls,
                                "vt_offsides": visitorteam_match_stats[st].offsides,
                                "vt_possesiontime": visitorteam_match_stats[st].possesiontime,
                                "vt_redcards": visitorteam_match_stats[st].redcards,
                                "vt_saves": visitorteam_match_stats[st].saves,
                                "vt_shots_ongoal": visitorteam_match_stats[st].shots_ongoal,
                                "vt_shots_total": visitorteam_match_stats[st].shots_total,
                                "vt_yellowcards": visitorteam_match_stats[st].yellowcards
                            });

                        }
                        //  end  match_stats------------------------------------------------------------------------------------

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

        console.log("localteam_player_lineup", this.localteam_player_lineup);
        console.log("visitorteam_player_lineup", this.visitorteam_player_lineup);
        console.log("localteam_player_subs", this.localteam_player_subs);
        console.log("visitorteam_player_subs", this.visitorteam_player_subs);


        console.log("Commentary_collection", this.Commentary_collection);


    }

    
    GetCommentariesByMatchId_live() {
       
               this.liveMatchesApiService.liveMatches().subscribe(data => {

                console.log("Live-Matches-data", data);
          
                var result = data['data'];
            
            console.log("Matches is Live comments", data);
            if (result.commentaries !== undefined) {
              
                var result_comments = data['data'].commentaries;

                if(this.id==result_comments['match_id']){
                    this.localteam_player_lineup = [];
                    this.visitorteam_player_lineup = [];
                    this.localteam_player_subs = [];
                    this.visitorteam_player_subs = [];
                    this.match_stats_collection = [];
                    this.Commentary_collection = [];

                let lineup = result_comments['lineup'];
                let subs = result_comments['subs'];
                let comments = result_comments['comments'];
                //    localteam_lineup------------------------------------------------------------------------------------
                let localteam_lineup = lineup['localteam'];

                for (var lt = 0; lt < localteam_lineup.length; lt++) {

                    var localteamLinePlayer_url = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/players/" + localteam_lineup[lt].id + ".jpg";

                    var localteamLineup_picture;

                    var Image_team1 = isUrlExists(localteamLinePlayer_url);
                    if (Image_team1 == false) {
                        localteamLineup_picture = "assets/img/avt_player.png"
                    }
                    else {
                        localteamLineup_picture = localteamLinePlayer_url;
                    }

                    this.localteam_player_lineup.push({
                        "id": localteam_lineup[lt].id,
                        "name": localteam_lineup[lt].name,
                        "number": localteam_lineup[lt].number,
                        "pos": localteam_lineup[lt].pos,
                        "picture": localteamLineup_picture,

                    });
                }
                //   end localteam_lineup-----------------------------------------------------------------------------------


                //    localteam_subs----------------------------------------------------------------------------------------

                let localteam_subs = subs['localteam'];

                for (var lts = 0; lts < localteam_subs.length; lts++) {
                    var localteamSubsPayer_url = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/players/" + localteam_subs[lts].id + ".jpg";

                    var localteamSubs_picture;

                    var Image_team2 = isUrlExists(localteamSubsPayer_url);
                    if (Image_team2 == false) {
                        localteamSubs_picture = "assets/img/avt_player.png"
                    }
                    else {
                        localteamSubs_picture = localteamSubsPayer_url;
                    }

                    this.localteam_player_subs.push({
                        "id": localteam_subs[lts].id,
                        "name": localteam_subs[lts].name,
                        "number": localteam_subs[lts].number,
                        "pos": localteam_subs[lts].pos,
                        "picture": localteamSubs_picture,


                    });
                }
                //  end  localteam_subs------------------------------------------------------------------------------------



                //    visitorteam_lineup------------------------------------------------------------------------------------

                let visitorteam_lineup = lineup['visitorteam'];

                for (var vt = 0; vt < visitorteam_lineup.length; vt++) {

                    var visitorteamLinePlayer_url = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/players/" + visitorteam_lineup[vt].id + ".jpg";

                    var visitorteamLineup_picture;

                    var Image_team3 = isUrlExists(visitorteamLinePlayer_url);
                    if (Image_team3 == false) {
                        visitorteamLineup_picture = "assets/img/avt_player.png"
                    }
                    else {
                        visitorteamLineup_picture = visitorteamLinePlayer_url;
                    }

                    this.visitorteam_player_lineup.push({

                        "id": visitorteam_lineup[vt].id,
                        "name": visitorteam_lineup[vt].name,
                        "number": visitorteam_lineup[vt].number,
                        "pos": visitorteam_lineup[vt].pos,
                        "picture": visitorteamLineup_picture,
                    });
                }
                //  end visitorteam_lineup--------------------------------------------------------------------------------

                //    visitorteam_subs------------------------------------------------------------------------------------

                let visitorteam_subs = subs['visitorteam'];

                for (var vts = 0; vts < visitorteam_subs.length; vts++) {

                    var visitorteamSubsPayer_url = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/players/" + visitorteam_subs[vts].id + ".jpg";

                    var visitorteamSubs_picture;

                    var Image_team4 = isUrlExists(visitorteamSubsPayer_url);
                    if (Image_team4 == false) {
                        visitorteamSubs_picture = "assets/img/avt_player.png"
                    }
                    else {
                        visitorteamSubs_picture = visitorteamSubsPayer_url;
                    }

                    this.visitorteam_player_subs.push({
                        "id": visitorteam_subs[vts].id,
                        "name": visitorteam_subs[vts].name,
                        "number": visitorteam_subs[vts].number,
                        "pos": visitorteam_subs[vts].pos,
                        "picture": visitorteamSubs_picture,
                    });
                }
                //  end visitorteam_subs------------------------------------------------------------------------------------




                //  comments---------------------------------------------------------------------------------------

                for (var c = 0; c < comments.length; c++) {


                    let GoalType = false;
                    let isAssist = false;
                    let isSubstitution = false;
                    let downSubstitution = false;
                    let yellowcard = false;
                    let redcard = false;

                    let UpName = "";
                    let DownName = "";
                    let comment_icon = "";

                    let comment = comments[c].comment;
                    let important = comments[c].important;
                    let isgoal = comments[c].isgoal;
                    let minute = comments[c].minute

                    if (important == '1' && isgoal == '1') {

                        GoalType = true;
                        comment_icon = "assets/img/ic_goal.png";

                        let Substring1 = comment.split(".", 2);
                        let Substring2 = Substring1[1].split("-", 2);
                        UpName = Substring2[0];

                        //check 'Assist' is or not in given comment 
                        if (comment.includes("Assist")) {
                            isAssist = true;
                            let SubstringAssist = comment.split("Assist -", 2);
                            let assistName = SubstringAssist[1].split("with", 2);
                            DownName = assistName[0];
                        }
                    }
                    else {
                        //check 'Substitution' is or not in given comment
                        if (comment.includes("Substitution")) {

                            isSubstitution = true;
                            comment_icon = "assets/img/ic_sub_on_off_both2.png";


                            console.log("Substitution is found.");

                            let String1 = comment.split(".", 2);
                            let String2 = String1[1].split("for", 2);
                            let String3 = String2[1].split("-", 2);

                            UpName = String2[0];
                            DownName = String3[0];

                        }
                        if (comment.includes("yellow card")) {

                            yellowcard = true;
                            comment_icon = "assets/img/ic_yellow_card.png";

                            let String1_yc = comment.split("-", 2);

                            UpName = String1_yc[0];
                            DownName = "yellow card";

                        }
                        if (comment.includes("red card")) {

                            redcard = true;
                            comment_icon = "assets/img/ic_red_card.png";

                            let String1_rc = comment.split("-", 2);

                            UpName = String1_rc[0];
                            DownName = "red card";

                        }



                    }


                    this.Commentary_collection.push({
                        "GoalType": GoalType,
                        "isAssist": isAssist,
                        "isSubstitution": isSubstitution,
                        "downSubstitution": downSubstitution,
                        "yellowcard": yellowcard,
                        "redcard": redcard,
                        "upName": UpName,
                        "downName": DownName,
                        "comment": comment,
                        "minute": minute,
                        "icon": comment_icon
                    });




                }

                //  end comments------------------------------------------------------------------------------------


                //    match_stats------------------------------------------------------------------------------------

                let match_stats = result_comments['match_stats'];

                let localteam_match_stats = match_stats['localteam'];
                let visitorteam_match_stats = match_stats['visitorteam'];

                //   lt for localteam && vt for visitorteam

                for (var st = 0; st < localteam_match_stats.length; st++) {
                    this.match_stats_collection.push({
                        "lt_corners": localteam_match_stats[st].corners,
                        "lt_fouls": localteam_match_stats[st].fouls,
                        "lt_offsides": localteam_match_stats[st].offsides,
                        "lt_possesiontime": localteam_match_stats[st].possesiontime,
                        "lt_redcards": localteam_match_stats[st].redcards,
                        "lt_saves": localteam_match_stats[st].saves,
                        "lt_shots_ongoal": localteam_match_stats[st].shots_ongoal,
                        "lt_shots_total": localteam_match_stats[st].shots_total,
                        "lt_yellowcards": localteam_match_stats[st].yellowcards,
                        "vt_corners": visitorteam_match_stats[st].corners,
                        "vt_fouls": visitorteam_match_stats[st].fouls,
                        "vt_offsides": visitorteam_match_stats[st].offsides,
                        "vt_possesiontime": visitorteam_match_stats[st].possesiontime,
                        "vt_redcards": visitorteam_match_stats[st].redcards,
                        "vt_saves": visitorteam_match_stats[st].saves,
                        "vt_shots_ongoal": visitorteam_match_stats[st].shots_ongoal,
                        "vt_shots_total": visitorteam_match_stats[st].shots_total,
                        "vt_yellowcards": visitorteam_match_stats[st].yellowcards
                    });

                }
                //  end  match_stats------------------------------------------------------------------------------------
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
    }

    Playerdetails(player_id) {
        this.router.navigate(['/player', player_id]);
    }


    gotomatch() {
        let selectedId = this.id ? this.id : null;
        this.router.navigate(['../', { id: selectedId }], { relativeTo: this.route })
    }


    teamdetails(team_id) {
        this.router.navigate(['/team',team_id]);
      }
    



}
