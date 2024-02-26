import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbDropdown, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-media-buys-modal',
  standalone: true,
  imports: [CommonModule, NgbDropdown, NgSelectModule, NgbModule,FormsModule],
  templateUrl: './media-buys-modal.component.html',
  styleUrls: ['./media-buys-modal.component.scss']
})
export class MediaBuysModalComponent {
  @Input() trendingShows
  titles = []
  seasonNumbers = []
  episodeNumbers = []
  showIds = []

  episodeIds = []
  selectedTitle: any;
  selectedSeason: any;
  selectedEpisode: any;
  @Output() videoChange = new EventEmitter<any>();
  selectedShow: any;

  
  constructor(private activeModal: NgbActiveModal, private router: Router, private apiService: ApiService) { }

  ngOnInit() {
    this.trendingShows.forEach(show => {
      this.titles.push(show.title)
      this.showIds.push(show.id)
      show.Episodes.forEach(episode => {
        this.episodeIds.push(episode.id)
      })
    })
  }


  onTitleSelect(selectedTitle) {
    //console.log("Selected Title", this.selectedTitle, selectedTitle)
   
    // Clear selections for season and episode when a different title is selected
    this.selectedSeason = null;
    this.selectedEpisode = null;
    this.seasonNumbers = []; // Clear season numbers
    this.episodeNumbers = []; // Clear episode numbers

    // Update the selectedTitle to the new value
    this.selectedTitle = selectedTitle;

    const selectedShow = this.trendingShows.find(show => show.title === selectedTitle);
    console.log(selectedShow)
    this.selectedShow = selectedShow
    let uniqueSeasons = []
    if(selectedShow){
      selectedShow.Episodes.forEach(episode =>{
        if(uniqueSeasons.includes(episode.seasonNo) == false){
          uniqueSeasons.push(episode.seasonNo)
          this.seasonNumbers.push(episode.seasonNo)
        }
      })
    }
  
  }
  

  onSeasonSelect(event) {
    this.episodeNumbers = []
    let result = []
    this.apiService.sendRequest(requests.getEpisodes, 'post', { "showId": [this.selectedShow.id], seasonNo: [event], limit: 100, pageNo: 1 }).subscribe((res: any) => {
      for (let i = 0; i < res?.data?.rows.length; i++) {
        result.push(res?.data?.rows[i].episodeNo)
      }
      this.episodeNumbers = result
    })
  }
  



  onTaggerScrollEnd(e) {

  }



  CloseModal() {
    this.activeModal.close('close')
  }

  changeVideo() {
    // Find the show object based on the selected title
    const selectedShow = this.trendingShows.find(show => show.title === this.selectedTitle);
    console.log(selectedShow,"SELECTED SHOW")
    // Initialize variables for showId and episodeId
    let showId = null;
    let episodeId = null;
  
    if (selectedShow) {
      // Assign the showId from the found show object
      showId = selectedShow.id; // Replace 'id' with the actual property name for showId
  
      // Find the episode object based on the selected season and episode
      const selectedEpisode = selectedShow.Episodes.find(episode => episode.seasonNo === this.selectedSeason && episode.episodeNo === this.selectedEpisode);
  
      if (selectedEpisode) {
        // Assign the episodeId from the found episode object
        episodeId = selectedEpisode.id; // Replace 'id' with the actual property name for episodeId
      }
    }
    console.log(showId, episodeId)
  
    // Emit the showId and episodeId
    this.videoChange.emit({
      showId: showId,
      episodeId: episodeId,
      seasonNo: this.selectedSeason,
      episodeNo: this.selectedEpisode,
      title: this.selectedTitle
    });
    this.CloseModal()
  }
  
  

}
