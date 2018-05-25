import {Component, OnInit,Pipe, PipeTransform } from '@angular/core';
import {ActivatedRoute, Router, ParamMap} from '@angular/router';
import {MatchService} from '../service/match.service';

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

    constructor(
        private route : ActivatedRoute,
        private router : Router,
        private matchService : MatchService,
    ) {}

    ngOnInit() {
        this.route.paramMap.subscribe((params : ParamMap) => {
                let id = parseInt(params.get("id"));
                this.id = id;
                let comp_id = parseInt(params.get("comp_id"));
                this.comp_id = comp_id;
            });

        this.GetMatchesByCompetition_ById();

    }

    GetMatchesByCompetition_ById() {
        this.matchService.GetMatchesByCompetition_ById(this.comp_id).subscribe(data => {
                console.log("GetMatchesByCompetition_ById", data);

                var result = data['data'];

                if (result !== undefined) {

                    console.log("--------------------");
                    console.log("data", result)
                    for (var k = 0; k < result.length; k++) {
                        if (result[k].id == this.id) {
                            let date_formatted = result[k].formatted_date.replace('.', '/');
                            let date =  date_formatted.replace('.', '/');

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
                                    "penalty_local": result[k].penalty_local,
                                    "penalty_visitor": result[k].penalty_visitor,
                                    "season": result[k].season,
                                    "status": result[k].status,
                                    "time": result[k].time,
                                    "venue": result[k].venue,
                                    "venue_city": result[k].venue_city,
                                    "venue_id": result[k].venue_id,
                                    "visitorteam_id": result[k].visitorteam_id,
                                    "visitorteam_name": result[k].visitorteam_name,
                                    "visitorteam_score": result[k].visitorteam_score,
                                    "week": result[k].week,
                                    "_id": result[k]._id,
                                    "id": result[k].id
                                });

                            let events_data = result[k].events;
                            for (var e = 0; e < events_data.length; e++) {
                                
                                let result_pipe_l =  events_data[e].result.replace(']', '');
                                let result_pipe = result_pipe_l.replace('[', '');

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
                                        "result":result_pipe
                                    });
                            }

                        }
                    }
                }
            });

        console.log("*********current_detail", this.match_detailcollection);
        console.log("*************current_event", this.events_collection);

    }

    gotomatch() {
        let selectedId = this.id ? this.id : null;
        this.router.navigate(['../', { id: selectedId } ], {relativeTo: this.route})
      }
}
