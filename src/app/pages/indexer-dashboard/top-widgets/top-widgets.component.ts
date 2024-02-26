import { Component } from '@angular/core';
import { requests } from 'src/app/core/config/config';
import { ApiService } from 'src/app/core/api.service';

@Component({
  selector: 'app-top-widgets',
  templateUrl: './top-widgets.component.html',
  styleUrls: ['./top-widgets.component.scss']
})
export class TopWidgetsComponent {

  widgets = [
    {
      title: 'Products Records',
      amount: '0',
      background: 'bg-light-primary ',
      border: 'border-primary',
      icon: 'ti ti-trending-up',
      content: "Total products records I've recorded ",
      color: 'text-primary',
      number: '3,000'
    },
    {
      title: 'Scenes Completed',
      amount: '0',
      background: 'bg-light-success ',
      border: 'border-success',
      icon: 'ti ti-trending-up',
      content: "Total scenes I've annotated",
      color: 'text-success',
      number: '8,900'
    },
    {
      title: 'Average VZoT Score',
      amount: '0',
      background: 'third-widget-bg ',
      border: 'third-widget-border',
      icon: 'ti ti-trending-down',
      content: 'The average of my highest VZoT Scores ',
      color: 'third-widget-color',
      number: '1,943'
    },

  ];

  constructor(private apiService:ApiService){}

  ngOnInit(){
    this.apiService.sendRequest(requests.getTaggerStats,'post').subscribe((res:any)=>{

      // console.log(res)
      this.widgets[0].amount=res.data[0].tagCount
      this.widgets[1].amount=res.data[0].taggedScenesCount
      this.widgets[2].amount=res.data[0].averageVzotScore

    })
    
  }
}
