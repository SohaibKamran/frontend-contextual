import { Component, OnInit } from '@angular/core';
import { requests } from 'src/app/core/config/config';
import { ApiService } from 'src/app/core/services/api.service';
@Component({
  selector: 'app-ad-stats',
  templateUrl: './ad-stats.component.html',
  styleUrls: ['./ad-stats.component.scss']
})
export class AdStatsComponent implements OnInit {

  widgetsData?: any
  widgets = [

    {
      title: 'Ad Matches',
      amount: '0',
      background: 'bg-light-primary ',
      border: 'border-primary',
      icon: 'ti ti-trending-up',
      content: 'Total ads matching in-scene products',
      color: 'text-primary',
      number: '3,000'
    },
    {
      title: 'Total Products',
      amount: '0',
      background: 'bg-light-danger ',
      border: 'border-danger',
      icon: 'ti ti-trending-down',
      content: 'Total products in data feed',
      color: 'text-danger',
      number: '$2,395'
    },
    {
      title: 'Total Video Scenes',
      amount: '0',
      background: 'bg-light-warning ',
      border: 'border-warning',
      icon: 'ti ti-trending-down',
      content: 'Total scenes indexed in catalog',
      color: 'text-warning',
      number: '1,943'
    },
    {
      title: 'Avg. Advertiser Penetration',
      amount: '0%',
      background: 'bg-light-success ',
      border: 'border-success',
      icon: 'ti ti-trending-up',
      content: '% of scenes with matched ads',
      color: 'text-success',
      number: '8,900'
    },


  ];

  constructor(private apiService: ApiService) {

  }
  ngOnInit() {

    this.fetchData()
    // console.log(this.widgetsData)
    
  }
  fetchData() {
    this.apiService.sendRequest(requests.getAllStats, 'post', {
      "slug": ["total_video_scenes", "total_products", "ad_matches", "avg_penetration"]
    }).subscribe((res: any) => {
      this.widgetsData = res.data;

      // console.log(this.widgetsData)
      for (let i = 0; i < this.widgetsData.length; i++) {

        if (res.data[i].value.count?.toLocaleString("en-US"))
          this.widgets[i].amount = res.data[i].value.count?.toLocaleString("en-US");
        else{
          this.widgets[i].amount = res.data[i].value.toLocaleString("en-US")+'%';

        }
        //this.widgets[i].title = res.data[i].key;
      }
       console.log(this.widgets)
    })
  
  }

}
