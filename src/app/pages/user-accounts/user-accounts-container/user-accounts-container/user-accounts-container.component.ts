import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddEditUserDetailsComponent } from '../../add-edit-user-details/add-edit-user-details.component'
import { ApiService } from 'src/app/core/services/api.service';
import { requests } from 'src/app/core/config/config';
import { SharedService } from 'src/app/core/services/shared.service';
import { AddUserModalComponent } from 'src/app/shared/add-user-modal/add-user-modal.component';
import { ProfileService } from 'src/app/pages/tagger/profile/profile.service';
@Component({
  selector: 'app-user-accounts-container',
  templateUrl: './user-accounts-container.component.html',
  styleUrls: ['./user-accounts-container.component.scss']
})
export class UserAccountsContainerComponent implements OnInit {
  titleSeries="Trending Series"
  cardHeight="user-series-card-height"
  seriesCardHeight="user-account-series"
  breadCrumbItems: ({ label: string; active?: undefined; } | { label: string; active: boolean; })[];
  data = [
    { name: 'Onboarding' },
    { name: 'Active' },
    { name: 'Inactive' }
  ]
  cities = [];
  selectedItems = [];
  dropdownSettings: any = {};

  constructor(public modalService:NgbModal, private apiService:ApiService, private sharedService:SharedService, private profileService:ProfileService ) {
    this.breadCrumbItems = [
      { label: 'Admin' },
      { label: 'Users', active: true }
    ];
  }

  onItemSelect(item: any) {
    // console.log('onItemSelect', item);
  }

  ngOnInit() {
    this.cities = [
      { item_id: 1, item_text: 'Onboarding' },
      { item_id: 2, item_text: 'Active' },
      { item_id: 3, item_text: 'Inactive' }
    ];
    this.selectedItems = [];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 1,
    };
    this.fetchCountries()
  }
  openAddUserModal(){

   const activeModal= this.modalService.open(AddUserModalComponent,
      {
        windowClass: "modal-lg",
        backdrop: "static",
        keyboard: false,
        centered: true,
      })
    activeModal.componentInstance.screen=true

  }
  fetchCountries(){

    this.profileService.getCountries().subscribe((res:any)=>{

      console.log(res)
      this.sharedService.countries.next(res?.data?.countries?.rows)
    })
  }
}
