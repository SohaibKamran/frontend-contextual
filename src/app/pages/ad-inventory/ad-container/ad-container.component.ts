import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ad-container',
  templateUrl: './ad-container.component.html',
  styleUrls: ['./ad-container.component.scss']
})
export class AdContainerComponent implements OnInit{

  breadCrumbItems: ({ label: string; active?: undefined; } | { label: string; active: boolean; })[];
  link:string="https://contxtual.tv/revenues/"
  constructor(

  ){
    this.breadCrumbItems = [
      { label: 'Demo' },
      { label: 'Ad Inventory', active: true }
    ];
  }
  ngOnInit(): void {
      // console.log('');
  }

}
