import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { requests } from 'src/app/core/config/config';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-season-details',
  templateUrl: './season-details.component.html',
  styleUrls: ['./season-details.component.scss']
})
export class SeasonDetailsComponent implements OnInit, OnChanges {
  @Input() videoId: string;
  @Input() seasonDetails: Array<any> | any = []
  @Input() allEpisodes: Array<any> | any = [];
  @Input() videoDetails: any;
  selectedEpisode: any
  selectedSeason: any
  showSeasonAndEpisode: boolean = false
  @Output() episodeChange: EventEmitter<any> = new EventEmitter()
  constructor(private apiService: ApiService, public router: Router
  ) {

  }

  ngOnInit(): void {
    if (this.videoDetails) {

      // this.videoDetails.seasonNo=this.videoDetails?.seasonNo==0 ? 1:this.videoDetails?.seasonNo
    }
    if (this.videoDetails) {
      // this.videoDetails.episodeNo=this.videoDetails?.episodeNo==0 ? 1:this.videoDetails?.episodeNo
    }
  }
  getEpisodeOfSeason(event) {
    console.log(event)
    const epi = []
    this.allEpisodes = []
    this.selectedEpisode = null

    this.apiService.sendRequest(requests.getEpisodes, 'post', { "showId": [this.videoDetails?.showId || parseInt(this.videoId)], seasonNo: [event.id], limit: 100, pageNo: 1 ,onlyBrokenScene:true }).subscribe((res: any) => {
      for (let i = 0; i < res?.data?.rows.length; i++) {
        epi.push({
          id: res?.data?.rows[i].id,
          text: "Episode " + res?.data?.rows[i].episodeNo
        })
      }
      this.allEpisodes = this.allEpisodes.concat(epi)
      console.log(this.allEpisodes)
    })
  }

  setEpisode(event) {

    // if(event?.target?.value){
    //   const episode=this.allEpisodes.find(x=>x.episodeNo==parseInt(event.target.value))
    //   // this.router.navigate(['user/player/'+episode.id]);
    //   // setTimeout(() => {
    //   //   window.location.reload();
    //   // }, 200);
    this.episodeChange.emit(event.id);
    // }
  }

  ngOnChanges() {

    if (this.seasonDetails) {
      for (let i = 0; i < this.seasonDetails.length; i++) {
        this.seasonDetails[i] = {
          id: this.seasonDetails[i].seasonNo,
          text: "Season " + this.seasonDetails[i].seasonNo
        }
      }
    }
    if (this.allEpisodes.length != 0) {
      for (let i = 0; i < this.allEpisodes.length; i++) {
        this.allEpisodes[i] = {
          id: this.allEpisodes[i].id,
          text: "Episode " + this.allEpisodes[i].episodeNo
        }
      }

      this.showSeasonAndEpisode = false

    }

    if (this.videoDetails) {
      console.log("episodeDetails", this.videoDetails);

      this.selectedSeason = this.videoDetails?.seasonNo == 0 ? { id: 1, text: "Season " + 1 } : { id: this.videoDetails?.seasonNo, text: "Season " + this.videoDetails?.seasonNo }
    }
    if (this.videoDetails) {
      this.selectedEpisode = this.videoDetails?.episodeNo == 0 ? { id: 1, text: "Episode " + 1 } : { id: this.videoDetails?.episodeNo, text: "Episode " + this.videoDetails?.episodeNo }
    }
  }
}
