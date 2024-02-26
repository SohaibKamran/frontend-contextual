import { Component, Input } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CoreModule } from 'src/app/core/core.module';
@Component({
  standalone:true,
  selector: 'app-largest-ad-inventories',
  templateUrl: './largest-ad-inventories.component.html',
  styleUrls: ['./largest-ad-inventories.component.scss'],
  imports:[CommonModule,CoreModule]
})
export class LargestAdInventoriesComponent {
  pagination: { pageNo: number, limit: number, offset?: number,clickedOnRetailerId?:number,limitOfRetailerListing?:number,order?:any } = { limit: 10, pageNo: 1 }
  advertisers: any=[]
  totalImpressions: number
  activeUsers: any
  profilePicture: string;
  @Input() cardHeight:string;
  count:number=0
  totalAdvertisers:number=0
  constructor(public apiService: ApiService, private router:Router) { }

  ngOnInit(): void {
    this.fetchAdvertisers();
    this.profilePicture = "https://storage.googleapis.com/contxtual-dev-bucket/images/ben-sweet-2LowviVHZ-E-unsplash.jpg";
  }

  fetchAdvertisers() {
    this.pagination={
      ...this.pagination,
      order:[['productCount', 'DESC']]
    }
    if (this.count != this.totalAdvertisers || this.count == 0) {
      this.apiService.sendRequest(requests.getAllAdvertisersForAdmin, 'post', this.pagination).subscribe((res: any) => {
        // this.activeUsers = res
        // console.log("Active Users",this.activeUsers)
        for (let i = 0; i < res?.data?.rows?.length; i++) {
          this.count = res?.data?.count
          this.advertisers[this.totalAdvertisers] = res?.data?.rows[i]
          this.totalAdvertisers++
        }
      })
      console.log(this.advertisers)
    }
  }
  routeToDatabase(){
    this.router.navigate(['/demo'])
  }
  selectAdvertiser(advertiser:any){
    this.pagination.clickedOnRetailerId=advertiser.id
    this.pagination.limitOfRetailerListing=this.pagination.limit
    this.apiService.sendRequest(requests.getAllAdvertisersForAdmin, 'post', this.pagination)
    .subscribe((res: any) => {
      // console.log("advertisers", res);
      const adv={
        id:advertiser?.id,
        count:res?.data?.count,
        page:res?.data?.pageNoOfRetailer
      }
      sessionStorage.setItem("advertiser",JSON.stringify(adv))
      this.routeToDatabase()
    })
  }
  onScrollEnd(e) {
    // console.log(e.endReached);
    console.log(e.endReached);
    if (e.endReached) {
      this.pagination.pageNo++

      this.fetchAdvertisers()
    }
  }
}



