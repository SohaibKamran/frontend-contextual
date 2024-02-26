import { Component, Input } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CoreModule } from 'src/app/core/core.module';
import { getTrendigBrands } from 'src/app/core/constants';
import { MyShoppingService } from 'src/app/pages/demo-user/my-shopping/my-shopping.service';

@Component({
  standalone: true,
  selector: 'app-trending-retailers',
  templateUrl: './trending-retailers.component.html',
  styleUrls: ['./trending-retailers.component.scss'],
  imports: [CommonModule, CoreModule],
})
export class TrendingRetailersComponent {

  @Input() screen:string
  trendingRetailers: any=[]
  body: any
  pagination: { pageNo: number, limit: number, offset?: number } = { limit: 10, pageNo: 1 }
  totalCount = 0
  count = 0
  constructor(private apiService: ApiService, private router: Router, private shoppingService:MyShoppingService) {

  }
  ngOnInit() {
    this.body = {
      pageNo: this.pagination.pageNo,
      limit: this.pagination.limit
    }
    this.fetchData();

  }

  setRetailer(retailer?:any) {
    // sessionStorage.setItem('actor', JSON.stringify(actors))
    if(retailer){
      sessionStorage.setItem('retailer', JSON.stringify(retailer))
    }
    this.shoppingService.selectedTab.next(4)
  }



  routeToDatabase() {
    this.router.navigate(['/database/filtered'])
  }

  fetchData() {
    if (this.totalCount != this.count || this.count==0) {
      this.apiService.sendRequest(getTrendigBrands, 'post', this.body).subscribe((res: any) => {
        for (let i = 0; i < res?.data?.rows?.length; i++) {
          this.trendingRetailers[this.totalCount]=res?.data?.rows[i]
          this.totalCount++
        }
      })
    }

  }
  onScrollEnd(e) {
    // console.log(e.endReached);
    console.log(e.endReached);
    if (e.endReached) {
      this.pagination.pageNo++
      this.body = {
        ...this.body, pageNo: this.pagination.pageNo
      }
      this.fetchData()
    }
  }


}


