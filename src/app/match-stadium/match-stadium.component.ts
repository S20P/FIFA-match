
import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatchService } from '../service/match.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-match-stadium',
  templateUrl: './match-stadium.component.html',
  styleUrls: ['./match-stadium.component.css']
})
export class MatchStadiumComponent implements OnInit {


  public showloader: boolean = false;      
  private subscription: Subscription;
  private timer: Observable<any>;

   
  StadiumAll_collecction = [];



  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matchService: MatchService,
  ) { }

  ngOnInit() {
    this.setTimer();
    this.getStadiumAll();
  }


   public getStadiumAll(){
        console.log("get Stadium record from json");
        this.StadiumAll_collecction = [];
        this.matchService.getStadiumAllFromJson().subscribe(data => {
          console.log("Stadium Record for json ", data['Places']);
          
          var result = data['Places'];

          if (result !== undefined) {
          for(let place of result){
            this.StadiumAll_collecction.push(place); 
          }
        }

         });
       console.log("Stadium_Places",this.StadiumAll_collecction);
   }











  public setTimer(){
    this.showloader   = true;
    this.timer        = Observable.timer(3000); 
    this.subscription = this.timer.subscribe(() => {
    this.showloader = false;
    });
  }

}
