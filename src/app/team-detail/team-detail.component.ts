import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatchService } from '../service/match.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
declare var jQuery: any;
declare var $: any;

import { DatePipe } from '@angular/common';

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
  team_matchs = [];
  team_squad_A = [];  //Attacker
  team_squad_D = [];  //Defender
  team_squad_G = [];  //Goalkeeper
  team_squad_F = [];  //Forward
  team_squad_M = [];  //Midfielder



  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matchService: MatchService,
    public datepipe: DatePipe
  
  ) {

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
    this.team_matchs = [];
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

                let dateTime = fulldate + " " + teams['time'];
                console.log("dayUTC", dateTime);
                var TimeUTC = new Date(dateTime);
                let TimeIST = this.datepipe.transform(TimeUTC, 'hh:mm');
                console.log("IST(local tiem is)", TimeIST);


              //store Team_matches
              this.team_matchs.push({
                "comp_id": teams['comp_id'],
                "localteam_id": teams['localteam_id'],
                "localteam_name": teams['localteam_name'],
                "localteam_score": teams['localteam_score'],
                "status": teams['status'],
                "time": TimeIST,
                "visitorteam_id": teams['visitorteam_id'],
                "visitorteam_name": teams['visitorteam_name'],
                "visitorteam_score": teams['visitorteam_score'],
                "_id": teams['_id'],
                "id": teams['id']
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
    console.log("Team_matches", this.team_matchs);
    console.log("Team_squad_A", this.team_squad_A);
    console.log("Team_squad_D", this.team_squad_D);
    console.log("Team_squad_F", this.team_squad_F);
    console.log("Team_squad_G", this.team_squad_G);
    console.log("Team_squad_M", this.team_squad_M);





  }



  matchdetails(id, comp_id) {
    this.router.navigate(['/matches', id, { "comp_id": comp_id }]);
  }




  public setTimer() {
    this.showloader = true;
    $('#dd').refresh;
    this.timer = Observable.timer(3000);
    this.subscription = this.timer.subscribe(() => {
      this.showloader = false;
    });
  }
}
