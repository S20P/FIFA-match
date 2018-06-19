import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatchService } from '../service/match.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
declare var jQuery: any;
declare var $: any;


@Component({
  selector: 'app-match-teams',
  templateUrl: './match-teams.component.html',
  styleUrls: ['./match-teams.component.css']
})
export class MatchTeamsComponent implements OnInit {

  public showloader: boolean = false;
  private subscription: Subscription;
  private timer: Observable<any>;

  AllCompetitions = [];
  teams_collection = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matchService: MatchService,
  ) { }

  ngOnInit() {
    this.setTimer();
    this.GetAllCompetitions();
  }


  GetAllCompetitions() {

    this.matchService.GetAllCompetitions().subscribe(data => {
      //console.log("GetAllCompetitions",data);
      this.AllCompetitions = data['data'];
      for (var i = 0; i < this.AllCompetitions.length; i++) {
        //filter group for FIFA 1056 only
        if (this.AllCompetitions[i].id == 1056) {
          this.matchService.GetAllCompetitions_ById(this.AllCompetitions[i].id).subscribe(data => {
            console.log("GetCompetitionStandingById", data);

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
                this.teams_collection.push({
                  "team_id":teams['team_id'],
                  "team_name":teams['team_name'],
                  "team_flag":team_flag
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



    console.log("teams_collection", this.teams_collection);

  }

  
  teamdetails(team_id) {
    this.router.navigate(['/team',team_id]);
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
