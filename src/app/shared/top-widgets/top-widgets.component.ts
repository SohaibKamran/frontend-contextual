import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
import { NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

@Component({
  standalone:true,
  imports:[CommonModule, NgbTooltipModule],
  selector: 'app-top-widgets',
  templateUrl: './top-widgets.component.html',
  styleUrls: ['./top-widgets.component.scss']
})
export class TopWidgetsComponent implements OnInit {
  widgetsData?: any
  widgets = [
    {
      title: 'Total Scenes',
      amount: '0',
      background: 'bg-light-primary ',
      border: 'border-primary',
      icon: 'ti ti-trending-up',
      content: 'Total scenes in video library',
      color: 'text-primary',
      number: '3,000'
    },
    {
      title: 'Scenes Indexed',
      amount: '0',
      background: 'bg-light-success ',
      border: 'border-success',
      icon: 'ti ti-trending-up',
      content: 'Total scenes Indexed in database',
      color: 'text-success',
      number: '8,900'
    },
    {
      title: 'Ad Positions',
      amount: '0',
      background: 'bg-light-warning ',
      border: 'border-warning',
      icon: 'ti ti-trending-down',
      content: 'Total in-scene products indexed ',
      color: 'text-warning',
      number: '1,943'
    },
    {
      title: 'Ad Matches',
      amount: '0',
      background: 'bg-light-danger ',
      border: 'border-danger',
      icon: 'ti ti-trending-down',
      content: 'Total of ads matching in-scene products',
      color: 'text-danger',
      number: '$2,395'
    }
  ];
  constructor(private apiService: ApiService) {

  }
  ngOnInit() {

    this.fetchData();
    // console.log(this.widgetsData)
  }
  fetchData() {
    this.apiService.sendRequest(requests.getAllStats, 'post', {
      "slug": [
        "total_scenes",
        "scenes_indexed",
        "ad_matches",
        "ad_postions"
      ]
    }).subscribe((res: any) => {
      this.widgetsData = res.data;

      // console.log(this.widgetsData)
      for (let i = 0; i < this.widgetsData.length; i++) {

        this.widgets[i].amount = res.data[i].value.count?.toLocaleString("en-US");
        //this.widgets[i].title = res.data[i].key;
      }
      // console.log(this.widgets)
    })
  }

}
