import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
import { ManageAdvertisersService } from '../../manage-advertisers/manage-advertisers.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EpisodeAdInventoryComponent } from 'src/app/shared/episode-ad-inventory/episode-ad-inventory.component';
import { AdAddToCardModalComponent } from 'src/app/shared/ad-add-to-card-modal/ad-add-to-card-modal.component';
import { AdInventoryService } from '../services/ad-inventory.service';
import { takeUntil, Subject, Subscription } from 'rxjs';
const FILTER_PAG_REGEX = /[^0-9]/g;

@Component({
  selector: 'app-ad-table',
  templateUrl: './ad-table.component.html',
  styleUrls: ['./ad-table.component.scss']
})
export class AdTableComponent implements OnInit {
  users = []
  advertisers = [];
  isAlive = new Subject<any>()
  profilePicture: string;
  selectedIndex: any;
  selectedSeason: any;
  selectedEpisode: any;
  episodeId: number
  body: any
  advertiserShows = []
  tableHeadings = [{
    name: "Advertiser",
    order: ""
  }, { name: "Total Products", order: "" }, { name: "Ad Matches", order: "" }, { name: "Ad Postions", order: "" }, { name: "Penetration", order: "" }]
  backendHeadings = ["name", "productCount", "adMatches", "adPosition", "penetration"]
  tempAdvertisers: any = []
  statuses = [];
  selectedItems = [];
  dropdownSettings: any = {};
  isChildActive = false;
  pagination: { pageNo: number, limit: number, offset?: number } = { limit: 100, pageNo: 1 }
  totalCount: any = 0;
  activeChildId: any = null;
  thumbnail: string
  name: string
  advId: number
  seriesName: string
  seriesThumbnail: string
  advertiserStatuses = [
    {
      title: "Active",
      class: "approved"
    },
    {
      title: "Inactive",
      class: "returned"
    },

    {
      title: "Onboarding",
      class: "inprogress"
    },
  ]

  constructor(
    private apiService: ApiService,
    private advertiserService: ManageAdvertisersService,
    public modalService: NgbModal,
    private adInventoryService: AdInventoryService
  ) {

  }
  ngOnInit() {
    this.isAlive.next(true)
    this.body = {
      pageNo: this.pagination.pageNo,
      limit: this.pagination.limit
    }
    const adv = JSON.parse(sessionStorage.getItem('advertiser'));
    console.log(adv, "Adv")
    if(adv){
      this.totalCount=adv.count
      this.pagination.pageNo=adv.page
      this.body={
        ...this.body,
        pageNo:this.pagination.pageNo
      }
      this.fetchAdv(adv)
      sessionStorage.removeItem('advertiser')
    }
    else{
      this.fetchAdv()
    }
    this.profilePicture = "https://storage.googleapis.com/contxtual-dev-bucket/images/ben-sweet-2LowviVHZ-E-unsplash.jpg";
    this.statuses = [
      { item_id: 1, item_text: 'Active' },
      { item_id: 2, item_text: 'Inactive' }
    ];
    this.selectedItems = [];
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 3,
    };

  }

  scrollToElement(id) {
    setTimeout(() => {
      console.log("SERIES ID", id)
      const element = document.getElementById(id + "");
      console.log(element)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }
  onItemSelect(item: any, userId: number) {
    // console.log('onItemSelect', item);
  }

  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(FILTER_PAG_REGEX, '');
  }

  onPageChange(event: any) {
    this.pagination.pageNo = event;
    this.body = {
      ...this.body,
      pageNo: this.pagination.pageNo
    }
    this.fetchAdv();
    // this._fetchUserListing()
  }

  getAdvId() {
    this.advId = JSON.parse(sessionStorage.getItem('advertiser'));
  }

  selectPage(page: string) {
    this.pagination.pageNo = parseInt(page, 10) || 1;
    this.body = {
      ...this.body,
      pageNo: this.pagination.pageNo
    }
    this.fetchAdv();
    // this.getTaggerSceneListing()
  }

  setChild(index: any, id: number, thumbnail: string, name: string) {
    this.thumbnail = thumbnail
    this.name = name
    this.selectedEpisode = null
    this.selectedSeason = null
    this.selectedIndex = index == this.selectedIndex ? null : index;
    this.fetchShowByAdvId(id)
  }

  selectSecondChild(index: any, show?: any) {
    this.seriesName = show?.title
    this.seriesThumbnail = show?.thumbnail
    this.body = {
      ...this.body,
      seriesIds: [show?.id]
    }
    this.selectedEpisode = null
    this.selectedSeason = index == this.selectedSeason ? null : index;
  }

  selectThirdChoice(index: any, key?: any) {
    this.body = {
      ...this.body,
      seasonNo: [key.replace(/^\D+/g, '')]
    }
    console.log(key, "SEASON")
    this.selectedEpisode = index == this.selectedEpisode ? null : index;
  }
  episodeAdInventory(advId,id: number, episodeNo: number) {
    this.episodeId = id
    this.body = {
      ...this.body,
      episodeNo: [episodeNo]
    }
    const activeModal = this.modalService.open(EpisodeAdInventoryComponent, {
      windowClass: "modal-xl",
      backdrop: "static",
      keyboard: true,
      centered: true,
    })
    this.body={
      ...this.body,
      advertiserId:advId
    }
    activeModal.componentInstance.body = this.body
    activeModal.componentInstance.thumbnail = this.thumbnail
    activeModal.componentInstance.retailerName = this.name
    activeModal.componentInstance.retailerId=advId
    activeModal.componentInstance.episodeId = this.episodeId
    activeModal.componentInstance.seriesName = this.seriesName
    activeModal.componentInstance.seriesThumbnail = this.seriesThumbnail
  }
  openAddToCartModal() {
    const activeModal = this.modalService.open(AdAddToCardModalComponent, {
      windowClass: "modal-xl",
      backdrop: "static",
      size: 'lg',
      keyboard: true,
      centered: true,
    })

  }
  sort(order: number, heading: number) {
    this.tableHeadings = [{
      name: "Advertiser",
      order: ""
    }, { name: "Total Products", order: "" }, { name: "Ad Matches", order: "" }, { name: "Ad Postions", order: "" }, { name: "Penetration", order: "" }]
    let sortingOrder = ""
    if (order == 1) {
      sortingOrder = "ASC"
      this.tableHeadings[heading].order = "ASC"
    }
    else {
      sortingOrder = "DESC"
      this.tableHeadings[heading].order = "DESC"

    }
    console.log(this.tableHeadings)
    if (heading != 4) {
      this.body = {
        ...this.body,
        order: [[this.backendHeadings[heading], sortingOrder]]
      }
    }
    else {
      let flag: boolean
      if (order == 1) {
        flag = true
      }
      else {
        flag = false
      }
      this.body = {
        ...this.body,
        sortByPenetrationAsc: flag,
        order: [[this.backendHeadings[heading], sortingOrder]]
      }
    }
    this.fetchAdv()
  }

  fetchAdv(adv?:any) {
    this.selectedEpisode = null
    this.selectedSeason = null
    this.selectedIndex = null
    this.body={
      ...this.body,
      pageNo:this.pagination.pageNo,
      limit:this.pagination.limit
    }
    this.adInventoryService.getAdvertisers(this.body).pipe(takeUntil(this.isAlive)).subscribe((res) => {
      this.advertisers = res.rows
      for(let i =0;i<this.advertisers?.length;i++){
        if(this.advertisers[i]?.id==adv?.id){
          this.setChild(i,adv.id,this.advertisers[i]?.imageUrl,this.advertisers[i].name)
          this.scrollToElement(adv.id)
        }
      }
      this.totalCount = res.count
    })
  }

  fetchShowByAdvId(advId: number) {
    const body = {
      advertiserId: advId
    }
    this.adInventoryService.getShowsByAdvId(body).pipe(takeUntil(this.isAlive)).subscribe((res) => {
      this.advertiserShows = res
    })
  }
  ngOnDestroy() {
    this.isAlive.next(false)
  }
}
