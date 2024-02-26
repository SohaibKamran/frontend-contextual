import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service';
import { Router } from '@angular/router';
// import { SharedService } from '../core/services/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-videos-grid',
  templateUrl: './videos-grid.component.html',
  styleUrls: ['./videos-grid.component.scss']
})
export class VideosGridComponent implements OnInit {
  breadCrumbItems: ({ label: string; active?: undefined; } | { label: string; active: boolean; })[];

  
  public last = true
  public limit = 1000;
  public favPageNo = 1;
  public favData = [];
  public classicData = [];
  public trendingData = [];
  public trendingPageNo = 1;
  public classicPageNo = 1;
  public keyword = 'name';
  public videoData = [
    {
      id: 1,
      name: 'Georgia'
    },
    {
      id: 2,
      name: 'Usa'
    },
    {
      id: 3,
      name: 'England'
    }
  ];

  trendingLoader:boolean=false
  favouritesLoader:boolean=false
  classicsLoader:boolean=false
  
  constructor(
    private homeService: HomeService,
    private router: Router,
    private sharedService: SharedService,
    private loader: NgxSpinnerService
  ) {
    this.breadCrumbItems = [
      { label: 'Demo' },
      { label: 'Watch a Video', active: true }
    ];
  }

  ngOnInit(): void {
    if (this.router.url == '/home') {
      this.sharedService.showToolbar = false;
    }
    // this.getRecentFavoriteVideos()
    this.getTrendingVideos()
    // this.getClassicVideos()
  }
  
  getRecentFavoriteVideos = () => {
    this.favouritesLoader=true
    this.homeService.getRecentFavoriteVideos({ limit: this.limit, pageNo: this.favPageNo, onlyActive: true })
      .subscribe(
        (response: any) => {
          this.favouritesLoader=false
          this.favData = response.data

          
        },
        (err) => {
          this.favouritesLoader=false
        }
      )
  }
  getTrendingVideos = () => {
    this.trendingLoader=true
    this.homeService.getTrendingVideos({ limit: this.limit, pageNo: this.trendingPageNo, onlyActive: true,onlyBrokenScene:true})
      .subscribe(
        (response: any) => {
          this.trendingData = response.data
          this.trendingLoader=false

        },
        (err) => {
          this.trendingLoader=false
        }
      )
  }
  getClassicVideos = () => {
    this.classicsLoader=true
    this.homeService.getClassicVideos({ limit: this.limit, pageNo: this.classicPageNo, onlyActive: true })
      .subscribe(
        (response: any) => {
          this.classicData = response.data
          this.classicsLoader=false
        },
        (err) => {
          this.classicsLoader=false
        }
      )
  }
  changeInput = (value) => {
    console.log(value);
  }
  selectMovie = (item) => {
    console.log(item);
  }
}

