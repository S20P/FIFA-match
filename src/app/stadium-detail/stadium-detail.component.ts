import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatchService } from '../service/match.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
declare var jQuery: any;
declare var $: any;


@Component({
  selector: 'app-stadium-detail',
  templateUrl: './stadium-detail.component.html',
  styleUrls: ['./stadium-detail.component.css']
})
export class StadiumDetailComponent implements OnInit {

    public showloader: boolean = false;       
    private subscription: Subscription;
    private timer: Observable<any>;
    stadium_id;
    stadiumDetail_collecction;


  constructor(
     private route: ActivatedRoute,
     private router: Router,
     private matchService: MatchService,) { }

  ngOnInit() {
    this.setTimer();
     

    this.route.paramMap.subscribe((params: ParamMap) => {
      let id = parseInt(params.get("id"));
      this.stadium_id = id;
   });

   this.getStadiumAll();

  }


  public getStadiumAll(){
    console.log("get Stadium record from json");
    this.stadiumDetail_collecction = [];

    // API for get AllStadium Record
    this.matchService.getStadiumAllFromJson().subscribe(data => {

      console.log("Stadium Record for json ", data['Places']);
      var result = data['Places'];
      if (result !== undefined) {
      for(let place of result){
        if(place.id==this.stadium_id){
        this.stadiumDetail_collecction.push(place);
            }
         }
    }
     });
   console.log("Stadium_Places",this.stadiumDetail_collecction);
   console.log("");
}






  public setTimer(){

    // set showloader to true to show loading div on view
    this.showloader   = true;

    this.timer        = Observable.timer(3000); // 5000 millisecond means 5 seconds
    this.subscription = this.timer.subscribe(() => {
        // set showloader to false to hide loading div from view after 5 seconds
        this.showloader = false;
    });
  }
}
