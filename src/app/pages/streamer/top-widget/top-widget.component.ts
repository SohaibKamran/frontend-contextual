import { Component } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';

@Component({
  selector: 'app-top-widget',
  templateUrl: './top-widget.component.html',
  styleUrls: ['./top-widget.component.scss']
})
export class TopWidgetComponent {

widgetsData?: any
widgets = [
  {
    title: 'Total Revenues',
    amount: '0',
    background: 'bg-light-primary ',
    border: 'border-primary',
    icon: 'ti ti-trending-up',
    content: 'Total revenue in impressions',
    color: 'text-primary',
    number: '3,000'
  },
  {
    title: 'Impressions',
    amount: '0',
    background: 'bg-light-success ',
    border: 'border-success',
    icon: 'ti ti-trending-up',
    content: 'Total scenes in Impressions',
    color: 'text-success',
    number: '8,900'
  },
  {
    title: 'Second Screen Impressions',
    amount: '0',
    background: 'bg-light-warning ',
    border: 'border-warning',
    icon: 'ti ti-trending-down',
    content: 'Total scenes in 2nd Impressions',
    color: 'text-warning',
    number: '1,943'
  },
  {
    title: 'Clicks',
    amount: '0',
    background: 'bg-light-danger ',
    border: 'border-danger',
    icon: 'ti ti-trending-down',
    content: 'Total Clicks in Impressions',
    color: 'text-danger',
    number: '$2,395'
  }
];
constructor(private apiService: ApiService) {}
ngOnInit() {
  this.fetchData();
}
fetchData() {
  this.apiService.sendRequest(requests.streamerTopStats, 'post', {key:"Top Stats"}).subscribe((res: any) => {
    this.widgetsData = res.data.topStats[0].value;
    const updatedWidgets = this.widgets.map(widget => {
      const title = widget.title.replace(/\s+/g, '');
      const key = title.charAt(0).toLowerCase() + title.slice(1);
      // eslint-disable-next-line no-prototype-builtins
      if (this.widgetsData.hasOwnProperty(key)) {
        widget.amount = this.widgetsData[key].toLocaleString();
      }
      return widget;
    });
  })
}

}
