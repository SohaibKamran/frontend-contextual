import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';

@Component({
  selector: 'app-top-shows',
  templateUrl: './top-shows.component.html',
  styleUrls: ['./top-shows.component.scss']
})
export class TopShowsComponent implements OnInit{
  topShows=[];
  constructor(private apiService: ApiService) {}
  ngOnInit() {
    this.fetchData();
  }
  fetchData() {
    this.apiService.sendRequest(requests.streamerPopularShows, 'post', {key:"Top Stats"}).subscribe((res: any) => {
      this.topShows = res.data.popularShows;
    })
  }
}
