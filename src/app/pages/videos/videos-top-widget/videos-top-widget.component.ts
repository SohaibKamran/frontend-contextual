import { Component } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';

@Component({
  selector: 'app-videos-top-widget',
  templateUrl: './videos-top-widget.component.html',
  styleUrls: ['./videos-top-widget.component.scss']
})
export class VideosTopWidgetComponent {


  widgetsData?: any
  widgets = [
    {
      title: 'Series',
      amount: '0',
      background: 'bg-light-primary ',
      border: 'border-primary',
      icon: 'ti ti-trending-up',
      percentage: '50.3%',
      color: 'text-primary',
      number: '3,000'
    },
    {
      title: 'Episodes',
      amount: '0',
      background: 'bg-light-success ',
      border: 'border-success',
      icon: 'ti ti-trending-up',
      percentage: '70.5%',
      color: 'text-success',
      number: '8,900'
    },
    {
      title: 'Total Scenes',
      amount: '0',
      background: 'bg-light-warning ',
      border: 'border-warning',
      icon: 'ti ti-trending-down',
      percentage: '27.4%',
      color: 'text-warning',
      number: '1,943'
    }

  ];
  constructor(private apiService: ApiService) {

  }
  ngOnInit() {

    this.fetchData();
    // console.log(this.widgetsData)
  }
  fetchData() {
    this.apiService.sendRequest(requests.getAllStats, 'post',{"slug":["series_stats","episodes_stats","total_scenes"]}).subscribe((res: any) => {
      this.widgetsData = res.data;

      // console.log(res)
      for (let i = 0; i < this.widgetsData.length; i++) {

        // this.widgets[i].amount = res.data[i].value.count;
        this.widgets[2].amount = this.widgetsData[0].value.count?.toLocaleString("en-US");
        this.widgets[0].amount = this.widgetsData[1].value.count?.toLocaleString("en-US");
        this.widgets[1].amount = this.widgetsData[2].value.count?.toLocaleString("en-US");
        // this.widgets[1].amount = res.data[1].value.count;
        // this.widgets[2].amount = res.data[2].value.count;
        // this.widgets[i].title = res.data[i].key;
        // this.widgets[1].title = res.data[1].key;
        // this.widgets[2].title = res.data[2].key;
        

      }
      // console.log("Widgets Data",this.widgetsData)
      // console.log("widgets", this.widgets)
    })
  }
  ngOnDestroy(): void {
    // console.log("asdae")
  }
}
