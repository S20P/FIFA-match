import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MatchService {

  Apiurl : string = "http://206.189.161.54:8080/MobileAPI/GetAllCompetitions";
  
  GetCompetitionStandingById_API : string = "http://206.189.161.54:8080/MobileAPI/GetCompetitionStandingById";
  GetMatchesByCompetitionById_API :string = "http://206.189.161.54:8080/MobileAPI/GetMatchesByCompetitionId";
  GetMatchesByDate_API :string = "http://206.189.161.54:8080/MobileAPI/GetMatchesByDate";

  constructor(private http: HttpClient) 
   {
           
   }

  GetAllCompetitions(){
   let url = `${this.Apiurl}`;
   return  this.http.get(url);
}

  GetAllCompetitions_ById(comp_id){
     // console.log("comp_id is",comp_id);
      let apiurl = `${this.GetCompetitionStandingById_API + '?comp_id=' + comp_id}`;
      return  this.http.get(apiurl);
  }

  GetMatchesByCompetition_ById(comp_id){
    //console.log("comp_id is",comp_id);
    let apiurl = `${this.GetMatchesByCompetitionById_API + '?comp_id=' + comp_id}`;
    return  this.http.get(apiurl);
  }


  GetMatchesByDate(date){

    let apiurl = `${this.GetMatchesByDate_API + '?date=' + date}`;
    return  this.http.get(apiurl);
  }


}