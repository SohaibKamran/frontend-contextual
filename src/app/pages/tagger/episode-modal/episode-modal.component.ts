import { Component, Inject, OnInit, EventEmitter, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxUiLoaderService } from 'ngx-ui-loader';


@Component({
  selector: 'app-episode-modal',
  templateUrl: './episode-modal.component.html',
  styleUrls: ['./episode-modal.component.scss']
})
export class EpisodeModalComponent implements OnInit {


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public modalService: NgbModal, private apiService: ApiService,
    public ngxService: NgxUiLoaderService,
    private dialogRef: MatDialogRef<EpisodeModalComponent>

  ) { }
  currentShowSelected: any;
  currentTagger: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  seasons = []
  showId: number
  episodes = []
  seasonNo = []

  ngOnInit(): void {
    // console.log(this.data);
    this.currentShowSelected = this.data.currentShow
    this.currentTagger = this.data.currentTagger
    this.showId = this?.data?.currentShow?.Series?.Episodes[0]?.showId
    this.fetchSeasons()
  }

  fetchSeasons() {
    this.ngxService.startLoader('searchLoader')
    this.apiService.sendRequest(requests.getAllSeasonofSeries, 'post', { showIds: [this.showId], taggerId: this.currentTagger?.id, pageNo: 1, limit: 50 }).subscribe((res: any) => {
      // console.log(res, 'Seasons fetched')
      this.seasons = res?.data?.rows;

      for (const value of this.seasons) {
        // console.log(value)
        this.seasonNo = value.seasonNo;
      }
      // console.log("Season NO:",this.seasonNo)
      this.fetchEpisodes(this.seasonNo)
      // this.fetchEpisodes(this.seasons.seasonNo)
    })
  }
  fetchEpisodes(seasonId: any) {

    // console.log("Fetch episodes called", seasonId)
    this.apiService.sendRequest(requests.getAllEpisodesofSeason, 'post', {

      showId: [this.showId],
      seasonNo: [seasonId],
      taggerIds: [this.currentTagger?.id],
      pageNo: 1,
      limit: 50

    }).subscribe((res: any) => {

      // console.log(res)
      this.episodes = res?.data?.rows
      this.ngxService.stopLoader('searchLoader')
    })

  }

  passBack(id: number) {
    sessionStorage.setItem('showId', JSON.stringify(id))
    sessionStorage.setItem('sceneId', undefined)
    this.passEntry.emit(id);
    this.dialogRef.close();

  }

}
