import { Component,
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
declare var jQuery: any ;
declare var $: any;
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-matches-dashboard',
  templateUrl: './matches-dashboard.component.html',
  styleUrls: ['./matches-dashboard.component.css']
})

export class MatchesDashboardComponent implements OnInit {
  message: string;
  messages = [];
  paramDate:any;
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
   public showloader: boolean = false;       
   private subscription: Subscription;
   private timer: Observable<any>;
   date;
  constructor(private matchesApiService: MatchesApiService,
    private matchService: MatchService,
    private router: Router,
    private route: ActivatedRoute,
    public datepipe: DatePipe
  ) {  }
 

  ngOnInit() {


    
    

    this.setTimer();
     
   this.GetAllCompetitions();
   this.dateSchedule_ini();
  
   $('#datepicker').datepicker();
   
    $('#datepicker').datepicker('setDate', 'today');

   var today = $('#datepicker').val();
   this.paramDate = today;

   console.log("today",this.paramDate);
       
    this.GetMatchesByDate(this.paramDate);
    let self=this;
     $("#datepicker").on("change",function(){
          var selected = $(this).val();
          self.GetMatchesByDate(selected); 
      });
    
  //  this.matchesApiService
  //    .getMessages()
  //    .subscribe((data: string) => {
  //      //console.log("msg-data",data);
  //      this.messages.push(data['data']);
  //    });
  }

  
  get_title(title){
    console.log("title is",title);
  }

dateSchedule_ini(){
  
  //this.loadjquery();
 var array = this.alldaymatch_list;
 
 console.log("date-list",this.alldaymatch_list);

   $('#datepicker').datepicker({
        //changeMonth: true,
       // changeYear: true,
       inline: true,
       showOtherMonths: true,
       dateFormat: 'yy-mm-dd' ,
       dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        beforeShowDay: function(date){
       var string = $.datepicker.formatDate('yy-mm-dd', date);
           if(array.indexOf(string) != -1){
             return [true];
           }
           return  [true, "highlight", string ]; 
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

  GetMatchesByDate(selected) {
 
    console.log("selected date is...",selected);

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
        for(let item of result){

          var flag__loal ="https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/teamsNew/"+item.localteam_id+".png";
          var flag_visit ="https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/teamsNew/"+item.visitorteam_id+".png";
       
           
             var localteam_image;
             var visitorteam_image;
            
           var Image_team1 =  isUrlExists(flag__loal);
             
            if(Image_team1==false){
              console.log('Image does not exist');
              localteam_image = "assets/img/avt_flag.jpg"
            }
            else{
              console.log('Image Exists');
              localteam_image = flag__loal;
            }


            var Image_team2 =  isUrlExists(flag_visit);
             
            if(Image_team2==false){
              console.log('Image does not exist');
              visitorteam_image = "assets/img/avt_flag.jpg"
            }
            else{
              console.log('Image Exists');
              visitorteam_image = flag_visit;
            }

    console.log("-----------------------------");
    console.log("localteam_image",localteam_image);
    console.log("visitorteam_image",visitorteam_image);

    //Change UTC timezone to IST(Local)
    let day = selected +" "+ item.time;
    console.log("day",day);
    var TimeUTC =new Date(day);
    let TimeIST =this.datepipe.transform(TimeUTC, 'hh:mm');
    console.log("TimeIST",TimeIST);
  
  



        this.match_ground_details.push({
                      "comp_id": item.comp_id,
                      "et_score": item.et_score,
                      "formatted_date": item.formatted_date,
                      "ft_score": item.ft_score,
                      "ht_score": item.ht_score,
                      "localteam_id": item.localteam_id,
                      "localteam_name": item.localteam_name,
                      "localteam_score": item.localteam_score,
                      "localteam_image":localteam_image,
                      "penalty_local": item.penalty_local,
                      "penalty_visitor": item.penalty_visitor,
                      "season": item.season,
                      "status": item.status,
                      "time":TimeIST,
                      "venue": item.venue,
                      "venue_city": item.venue_city,
                      "venue_id": item.venue_id,
                      "visitorteam_id": item.visitorteam_id,
                      "visitorteam_name": item.visitorteam_name,
                      "visitorteam_score": item.visitorteam_score,
                      "visitorteam_image":visitorteam_image,
                      "week": item.week,
                      "_id": item._id,
                      "id": item.id,
                    });
            }
          }
   });

   function isUrlExists(image_url) {
    var Image_Exists = false;
    $.ajax(  
      {   async: false,
          url:image_url,  
          success: function(data)  
          {  
              Image_Exists = true;
          },  
          error: function(data)  
          {  
              Image_Exists = false; 
          }  
      });  

        return Image_Exists;
    }
    //result = [];
   console.log("filter-date_data",this.match_ground_details);
     //this.match_ground_details = [];
  }
 

  GetAllCompetitions() {
     
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

          if (result !== undefined) {
            for (var k = 0; k < result.length; k++) {
              var myString =result[k].formatted_date;
              var arr = myString.split('.');
               let day =  arr[0];
               let month =  arr[1];
               let year = arr[2];
              var fulldate = year+"-"+month+"-"+day;
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
                $( "#datepicker" ).datepicker("refresh");
              
        }, 1);
    }
  
sendMessage() {
    //  console.log("message",this.message);
    let msg = this.matchesApiService.sendMessage(this.message);
    //  console.log("msg sent",msg);
    this.message = '';
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
