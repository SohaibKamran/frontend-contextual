import { Component } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';

@Component({
  selector: 'app-top-advertisers',
  templateUrl: './top-advertisers.component.html',
  styleUrls: ['./top-advertisers.component.scss']
})
export class TopAdvertisersComponent {
  advertisers=[];
  constructor(private apiService: ApiService) {}
  ngOnInit() {
    this.fetchData();
  }
  fetchData() {
    this.apiService.sendRequest(requests.streamerPopularShows, 'post', {key:"Top Stats"}).subscribe((res: any) => {
      this.advertisers = res.data.popularShows;
    })
  }
}
