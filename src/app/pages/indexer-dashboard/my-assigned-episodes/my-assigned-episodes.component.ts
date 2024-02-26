import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';

@Component({
  selector: 'app-my-assigned-episodes',
  templateUrl: './my-assigned-episodes.component.html',
  styleUrls: ['./my-assigned-episodes.component.scss']
})
export class MyAssignedEpisodesComponent implements OnInit {
 
  percentage: number;
  episodesData: any;
  totalEpisodes:number

  constructor(
    private apiService: ApiService,
    private router: Router,
    ){

  }

  ngOnInit(): void {
    this.getTaggerTagsShow();
    
  }

  episodes = [
    {
      poster: 'assets/images/series/s1.jpg',
      name: 'The Big Bang Theory',
      episode: 'S01E06',
      progress: '0% Completed'

    },
    {
      poster: 'assets/images/series/s1.jpg',
      name: 'The Big Bang Theory',
      episode: 'S01E06',
      progress: '0% Completed'

    },
    {
      poster: 'assets/images/series/s1.jpg',
      name: 'The Big Bang Theory',
      episode: 'S01E06',
      progress: '0% Completed'

    }
    ,
    {
      poster: 'assets/images/series/s1.jpg',
      name: 'The Big Bang Theory',
      episode: 'S01E06',
      progress: '0% Completed'

    }
    , {
      poster: 'assets/images/series/s1.jpg',
      name: 'The Big Bang Theory',
      episode: 'S01E06',
      progress: '0% Completed'

    }
    ,
    {
      poster: 'assets/images/series/s1.jpg',
      name: 'The Big Bang Theory',
      episode: 'S01E06',
      progress: '0% Completed'

    },
    {
      poster: 'assets/images/series/s1.jpg',
      name: 'The Big Bang Theory',
      episode: 'S01E06',
      progress: '0% Completed'

    },
    {
      poster: 'assets/images/series/s1.jpg',
      name: 'The Big Bang Theory',
      episode: 'S01E06',
      progress: '0% Completed'

    },
    {
      poster: 'assets/images/series/s1.jpg',
      name: 'The Big Bang Theory',
      episode: 'S01E06',
      progress: '0% Completed'

    },
    {
      poster: 'assets/images/series/s1.jpg',
      name: 'The Big Bang Theory',
      episode: 'S01E06',
      progress: '0% Completed'

    },
    {
      poster: 'assets/images/series/s1.jpg',
      name: 'The Big Bang Theory',
      episode: 'S01E06',
      progress: '0% Completed'

    },
    {
      poster: 'assets/images/series/s1.jpg',
      name: 'The Big Bang Theory',
      episode: 'S01E06',
      progress: '0% Completed'

    },
  ]

 getTaggerTagsShow(){
  this.apiService.sendRequest(requests.getTaggerTagsShow, 'post')
  .subscribe((res: any) => {
    this.episodesData = res?.data;
    // console.log("Data", this.episodesData);
    this.totalEpisodes=this.episodesData.length
    
  })
 }

 routeToAnnotator(id: any){
  sessionStorage.setItem('showId', id)
  sessionStorage.setItem('sceneId', undefined)
  this.router.navigate(['/tagger/tag-video'])
 }
 
}
