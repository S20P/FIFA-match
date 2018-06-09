import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatchService } from '../service/match.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
declare var jQuery: any;
declare var $: any;


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
  teams_collection=[];
  team_matchs = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matchService: MatchService,) {
    
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
   TeamDetails(){

    this.teams_collection=[];
    this.team_matchs = [];

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
                  "team_id":teams['team_id'],
                  "team_name":teams['name'],
                  "team_flag":team_flag
                });
               
                var TeamMatch = teams['matchs'];

                if (TeamMatch !== undefined) {
                  for (let teams of TeamMatch) {
                //store Team_matches
                this.team_matchs.push(teams);
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
console.log("Team_matches",this.team_matchs);
   }



   matchdetails(id, comp_id) {
    this.router.navigate(['/matches',id, { "comp_id": comp_id }]);
  }




  public setTimer(){
    this.showloader   = true;
    $('#dd').refresh;
    this.timer        = Observable.timer(3000); 
    this.subscription = this.timer.subscribe(() => {
    this.showloader = false;
    });
  }
}
