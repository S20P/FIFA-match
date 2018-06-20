import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatchService } from '../service/match.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
declare var jQuery: any;
declare var $: any;

import { DatePipe } from '@angular/common';
import { MatchesApiService } from '../service/live_match/matches-api.service';

@Component({
  selector: 'app-team-detail',
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.css']
})
export class TeamDetailComponent implements OnInit {

  public showloader: boolean = false;
  private subscription: Subscription;
  private timer: Observable<any>;
  team_id;
  teams_collection = [];
  match_ground_details = [];
  team_squad_A = [];  //Attacker
  team_squad_D = [];  //Defender
  team_squad_G = [];  //Goalkeeper
  team_squad_F = [];  //Forward
  team_squad_M = [];  //Midfielder


// live
l_status;
live_matches_id;
l_timer;
l_visitorteam_score;
l_localteam_score;
live_matches:boolean;








  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matchService: MatchService,
    public datepipe: DatePipe,
    private liveMatchesApiService: MatchesApiService
    

  ) {
 
    this.live_matches = false;
    this.liveMatchesApiService.liveMatches().subscribe(data => {
      console.log("Live-Matches-data", data);
      console.log("live data1", data['data']['events']);
      var result = data['data'];
      var events = result.events;
      console.log("live events", events);
      this.GetMatchesByCompetition_ById_live();
  });
  }

  ngOnInit() {
    this.setTimer();

    this.route.paramMap.subscribe((params: ParamMap) => {
      let id = parseInt(params.get("id"));
      this.team_id = id;
    });


    this.TeamDetails();

  }

  //get Team-Details by TeamID
  TeamDetails() {

    this.teams_collection = [];
    this.match_ground_details = [];
    this.team_squad_A = [];  //Attacker
    this.team_squad_D = [];  //Defender
    this.team_squad_G = [];  //Goalkeeper
    this.team_squad_F = [];  //Forward
    this.team_squad_M = [];  //Midfielder

    let team_id = this.team_id;

    this.matchService.GetTeamById(team_id).subscribe(data => {
      console.log("Team_Details", data);

      var result = data['data'];

      if (result !== undefined) {
        for (let teams of result) {

          var Teamflag = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/teamsNew/" + teams['team_id'] + ".png";
          var team_flag;

          var Image_team = isUrlExists(Teamflag);

          if (Image_team == false) {
            console.log('Image does not exist');
            team_flag = "assets/img/avt_flag.jpg"
          }
          else {
            console.log('Image Exists');
            team_flag = Teamflag;
          }
          //store Team_info
          this.teams_collection.push({
            "team_id": teams['team_id'],
            "team_name": teams['name'],
            "team_flag": team_flag
          });

          var TeamMatch = teams['matchs'];

          if (TeamMatch !== undefined) {
            for (let teams of TeamMatch) {

              //Change UTC timezone to IST(Local)
              var myString = teams['formatted_date'];
              var arr = myString.split('.');
              let day = arr[0];
              let month = arr[1];
              let year = arr[2];
              var fulldate = year + "-" + month + "-" + day;

              //Change UTC timezone to IST(Local)
              let timezone = fulldate + " " + teams['time'];
              let match_time = calcTime(timezone, '+11');
              console.log("time ", match_time);


              this.matchService.GetStaticMatches().subscribe(data => {

                //   console.log("Matches type ang g", data);
                for (let i = 0; i < data['length']; i++) {

                  if (data[i].id == teams['id'] && data[i].comp_id == teams['comp_id']) {


                    var flag__loal = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/teamsNew/" + teams['localteam_id'] + ".png";
                    var flag_visit = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/teamsNew/" + teams['visitorteam_id'] + ".png";


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
                    //store Team_matches
                    var team_w = false;
                    var team_l = false;
                    var team_d = false;


                    if (team_id == teams['localteam_id']) {

                      if (teams['localteam_score'] > teams['visitorteam_score']) {
                        team_w = true;
                      }
                      if (teams['localteam_score'] < teams['visitorteam_score']) {
                        team_l = true;
                      }
                    }

                    if (team_id == teams['visitorteam_id']) {

                      if (teams['visitorteam_score'] > teams['localteam_score']) {
                        team_w = true;
                      }
                      if (teams['visitorteam_score'] < teams['localteam_score']) {
                        team_l = true;
                      }

                    }

                    if (teams['localteam_score'] == teams['visitorteam_score']) {
                             team_d = true;
                    }
                                       


                    this.match_ground_details.push({
                      "comp_id": teams['comp_id'],
                      "localteam_id": teams['localteam_id'],
                      "localteam_name": teams['localteam_name'],
                      "localteam_score": teams['localteam_score'],
                      "localteam_image": localteam_image,
                      "status": teams['status'],
                      "time": match_time,
                      "visitorteam_id": teams['visitorteam_id'],
                      "visitorteam_name": teams['visitorteam_name'],
                      "visitorteam_score": teams['visitorteam_score'],
                      "visitorteam_image": visitorteam_image,
                      "_id": teams['_id'],
                      "id": teams['id'],
                      "match_number": data[i].match_number,
                      "match_type": data[i].match_type,
                      "team_w": team_w,
                      "team_l": team_l,
                      "team_d": team_d
                    });

                  }
                }
              });


            }
          }



          var TeamSquad = teams['squad'];

          if (TeamSquad !== undefined) {
            for (let squad of TeamSquad) {
              //store Team_squad
              // Attacker---------
              if (squad['position'] == "A") {

                var TeamPlayer_url = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/players/" + squad['id'] + ".jpg";
                var player_img;

                var Image_check = isUrlExists(TeamPlayer_url);

                if (Image_check == false) {
                  console.log('Image does not exist');
                  player_img = "assets/img/avt_player.png"
                }
                else {
                  console.log('Image Exists');
                  player_img = TeamPlayer_url;
                }

                this.team_squad_A.push({
                  "id": squad['id'],
                  "age": squad['age'],
                  "appearences": squad['appearences'],
                  "goals": squad['goals'],
                  "name": squad['name'],
                  "number": squad['number'],
                  "position": squad['position'],
                  "picture": player_img
                });
              }
              // Defender----------  
              if (squad.position == "D") {
                var TeamPlayer_url = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/players/" + squad['id'] + ".jpg";
                var player_img;

                var Image_check = isUrlExists(TeamPlayer_url);

                if (Image_check == false) {
                  console.log('Image does not exist');
                  player_img = "assets/img/avt_player.png"
                }
                else {
                  console.log('Image Exists');
                  player_img = TeamPlayer_url;
                }
                this.team_squad_D.push({
                  "id": squad['id'],
                  "age": squad['age'],
                  "appearences": squad['appearences'],
                  "goals": squad['goals'],
                  "name": squad['name'],
                  "number": squad['number'],
                  "position": squad['position'],
                  "picture": player_img
                });
              }
              // Forward----------              
              if (squad.position == "F") {
                var TeamPlayer_url = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/players/" + squad['id'] + ".jpg";
                var player_img;

                var Image_check = isUrlExists(TeamPlayer_url);

                if (Image_check == false) {
                  console.log('Image does not exist');
                  player_img = "assets/img/avt_player.png"
                }
                else {
                  console.log('Image Exists');
                  player_img = TeamPlayer_url;
                }
                this.team_squad_F.push({
                  "id": squad['id'],
                  "age": squad['age'],
                  "appearences": squad['appearences'],
                  "goals": squad['goals'],
                  "name": squad['name'],
                  "number": squad['number'],
                  "position": squad['position'],
                  "picture": player_img
                });
              }
              // Goalkeeper----------                            
              if (squad.position == "G") {
                var TeamPlayer_url = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/players/" + squad['id'] + ".jpg";
                var player_img;

                var Image_check = isUrlExists(TeamPlayer_url);

                if (Image_check == false) {
                  console.log('Image does not exist');
                  player_img = "assets/img/avt_player.png"
                }
                else {
                  console.log('Image Exists');
                  player_img = TeamPlayer_url;
                }
                this.team_squad_G.push({
                  "id": squad['id'],
                  "age": squad['age'],
                  "appearences": squad['appearences'],
                  "goals": squad['goals'],
                  "name": squad['name'],
                  "number": squad['number'],
                  "position": squad['position'],
                  "picture": player_img
                });
              }
              // Midfielder----------                                          
              if (squad.position == "M") {
                var TeamPlayer_url = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/players/" + squad['id'] + ".jpg";
                var player_img;

                var Image_check = isUrlExists(TeamPlayer_url);

                if (Image_check == false) {
                  console.log('Image does not exist');
                  player_img = "assets/img/avt_player.png"
                }
                else {
                  console.log('Image Exists');
                  player_img = TeamPlayer_url;
                }
                this.team_squad_M.push({
                  "id": squad['id'],
                  "age": squad['age'],
                  "appearences": squad['appearences'],
                  "goals": squad['goals'],
                  "name": squad['name'],
                  "number": squad['number'],
                  "position": squad['position'],
                  "picture": player_img
                });
              }




            }
          }


          // });

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
    console.log("Team_matches", this.match_ground_details);
    console.log("Team_squad_A", this.team_squad_A);
    console.log("Team_squad_D", this.team_squad_D);
    console.log("Team_squad_F", this.team_squad_F);
    console.log("Team_squad_G", this.team_squad_G);
    console.log("Team_squad_M", this.team_squad_M);





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
                  this.l_status =  result_events['status'];
                  this.l_timer = result_events['timer'];
                  this.l_visitorteam_score = result_events['visitorteam_score'];
                  this.l_localteam_score = result_events['localteam_score'];
      }
    });
  }

  matchdetails(id, comp_id) {
    this.router.navigate(['/matches', id, { "comp_id": comp_id }]);
  }

  Playerdetails(player_id) {
    this.router.navigate(['/player', player_id]);
  }



  public setTimer() {
    this.showloader = true;
    $('#dd').refresh;
    this.timer = Observable.timer(2000);
    this.subscription = this.timer.subscribe(() => {
      this.showloader = false;
    });
  }
}
