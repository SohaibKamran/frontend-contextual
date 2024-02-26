import { Component } from '@angular/core';
import { SharedService } from 'src/app/core/services/shared.service';
import { requests } from 'src/app/core/config/config';
import { ApiService } from 'src/app/core/services/api.service';
@Component({
  selector: 'app-manage-advertisers-container',
  templateUrl: './manage-advertisers-container.component.html',
  styleUrls: ['./manage-advertisers-container.component.scss']
})
export class ManageAdvertisersContainerComponent {
  breadCrumbItems: ({ label: string; active?: undefined; } | { label: string; active: boolean; })[];
  cardHeight='card-height'
  constructor(private apiService:ApiService, private sharedService:SharedService) {
    this.breadCrumbItems = [
      { label: 'Admin' },
      { label: 'Advertisers', active: true }
    ];
  }
  status = [];
  selectedItems = [];
  dropdownSettings: any = {};

  ngOnInit() {
    this.status = [
      { item_id: 1, item_text: 'Active', color:'#FF0000' },
      { item_id: 2, item_text: 'Inactive', color:'#FF0000' }
    ];
    this.selectedItems = [];
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 3,
    };
    this.fetchCountries()
  }
  fetchCountries(){

    this.apiService.sendRequest(requests.getCountries,'post',{pageNo:1,limit:249}).subscribe((res:any)=>{

      // console.log(res)
      this.sharedService.countries.next(res?.data?.countries?.rows)
    })
  }

  onItemSelect(item: any) {
    // console.log('onItemSelect', item);
  }

}
