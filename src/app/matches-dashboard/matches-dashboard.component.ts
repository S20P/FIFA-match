import { Component,
   OnInit, 
   ViewChild,
   AfterViewChecked,
   DoCheck,
   AfterContentInit,
   AfterContentChecked,
   AfterViewInit,
   OnDestroy
    } from '@angular/core';
import { MatchesApiService } from '../service/matches-api.service';
import { MatchService } from '../service/match.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

declare var jQuery: any ;
declare var $: any;


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
  
  constructor(private matchesApiService: MatchesApiService,
    private matchService: MatchService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

 

 

  ngOnInit() {

   // var array = ["2018-05-14","2018-05-15","2018-05-01","2018-05-18",];

   var array = this.alldaymatch_list;
  
   $('#datepicker').datepicker({
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
   
   $( "#datepicker" ).datepicker({ dateFormat: "yy-mm-dd" });

   function formatDate(date) {
     var d = new Date(date),
         month = '' + (d.getMonth() + 1),
         day = '' + d.getDate(),
         year = d.getFullYear();

     if (month.length < 2) month = '0' + month;
     if (day.length < 2) day = '0' + day;

     return [year, month, day].join('-');
 }

   // $("#datepicker").on("change",function(){
   //     var selected = $(this).val();
   //     this.paramDate = selected;
   //     this.GetMatchesByDate();
   // });


   this.matchesApiService
     .getMessages()
     .subscribe((data: string) => {
       //console.log("msg-data",data);
       this.messages.push(data['data']);
     });
   //console.log('message_live_data_array', this.messages);

   //var date = new Date('yy-mm-dd');
   //var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
   $('#datepicker').datepicker('setDate', 'today');

   var today = $('#datepicker').val();
   this.paramDate = today;

   
   // var today :any  = new Date();
   // var dd :any= today.getDate();
   
   // var mm :any = today.getMonth()+1; 
   // var yyyy  :any= today.getFullYear();
   // if(dd<10) 
   // {
   //     dd='0'+dd;
   // } 
   
   // if(mm<10) 
   // {
   //     mm='0'+mm;
   // } 
   // today = mm+'-'+dd+'-'+yyyy;
   // console.log(today);
   // today = mm+'/'+dd+'/'+yyyy;
   // console.log(today);
   // today = dd+'-'+mm+'-'+yyyy;
   // console.log(today);
   // today = dd+'/'+mm+'/'+yyyy;
   // console.log(today);
   // today = yyyy+'-'+mm+'-'+dd;
   // this.paramDate = today;


   console.log("today",this.paramDate);
   console.log("date-list",this.alldaymatch_list);

  this.GetAllCompetitions();
    this.GetMatchesByDate(this.paramDate);
    let self=this;
 
    this.GetMatchesByDate(this.paramDate);
    
    $("#datepicker").on("change",function(){
          var selected = $(this).val();
         // this.paramDate = selected;
          self.GetMatchesByDate(selected); 
      });
   
 
  }


  GetMatchesByDate(selected) {

    console.log("today123",selected);


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
        this.match_ground_details.push({
                      "comp_id": item.comp_id,
                      "et_score": item.et_score,
                      "formatted_date": item.formatted_date,
                      "ft_score": item.ft_score,
                      "ht_score": item.ht_score,
                      "localteam_id": item.localteam_id,
                      "localteam_name": item.localteam_name,
                      "localteam_score": item.localteam_score,
                      "penalty_local": item.penalty_local,
                      "penalty_visitor": item.penalty_visitor,
                      "season": item.season,
                      "status": item.status,
                      "time": item.time,
                      "venue": item.venue,
                      "venue_city": item.venue_city,
                      "venue_id": item.venue_id,
                      "visitorteam_id": item.visitorteam_id,
                      "visitorteam_name": item.visitorteam_name,
                      "visitorteam_score": item.visitorteam_score,
                      "week": item.week,
                      "_id": item._id,
                      "id": item.id,
                    });
            }
          }
   });
  
  //result = [];
   console.log("filter-date",this.match_ground_details);
  
   //this.match_ground_details = [];
  }

  sendMessage() {
    //  console.log("message",this.message);
    let msg = this.matchesApiService.sendMessage(this.message);
    //  console.log("msg sent",msg);
    this.message = '';
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

        this.matchService.GetMatchesByCompetition_ById(this.AllCompetitions[i].id).subscribe(data => {
          console.log("GetMatchesByCompetition_ById", data);

          var result = data['data'];

          if (result !== undefined) {
            for (var k = 0; k < result.length; k++) {
              //  console.log("result-length",result[k].localteam_name);

            
              var myString =result[k].formatted_date;
              var arr = myString.split('.');
               let day =  arr[0];
               let month =  arr[1];
               let year = arr[2];
            
               var fulldate = year+"-"+month+"-"+day;
            
            // console.log(":----",fulldate);



               this.alldaymatch_list.push(fulldate);
              
              // this.match_ground_details.push({
              //   "comp_id": result[k].comp_id,
              //   "et_score": result[k].et_score,
              //   "formatted_date": result[k].formatted_date,
              //   "ft_score": result[k].ft_score,
              //   "ht_score": result[k].ht_score,
              //   "localteam_id": result[k].localteam_id,
              //   "localteam_name": result[k].localteam_name,
              //   "localteam_score": result[k].localteam_score,
              //   "penalty_local": result[k].penalty_local,
              //   "penalty_visitor": result[k].penalty_visitor,
              //   "season": result[k].season,
              //   "status": result[k].status,
              //   "time": result[k].time,
              //   "venue": result[k].venue,
              //   "venue_city": result[k].venue_city,
              //   "venue_id": result[k].venue_id,
              //   "visitorteam_id": result[k].visitorteam_id,
              //   "visitorteam_name": result[k].visitorteam_name,
              //   "visitorteam_score": result[k].visitorteam_score,
              //   "week": result[k].week,
              //   "_id": result[k]._id,
              //   "id": result[k].id,
              // });
            }
          }

          // this.AllCompetitions_match.push({
          //  "id":this.AllCompetitions[i]['id'],"name":this.AllCompetitions[i].name,
          //  }
          //  );
        });


      }
    });
    // console.log("length", this.AllCompetitions.length);
    //console.log('AllCompetitions-data', this.AllCompetitions);
    console.log('AllCompetitions_details', this.AllCompetitions_match);
    //   console.log('match_ground_details', this.match_ground_details);




    
  }

  matchdetails(id, comp_id) {

    this.router.navigate([id, { "comp_id": comp_id }], { relativeTo: this.route });

  }

  

}
