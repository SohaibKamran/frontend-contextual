import { Component, OnDestroy } from '@angular/core';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { MyShoppingService } from '../my-shopping.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { WishlistService } from '../my-wishlist/wishlist.service';
import { ToastrService } from 'ngx-toastr';
import { requests } from 'src/app/core/config/config';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-shoping-container',
  templateUrl: './shoping-container.component.html',
  styleUrls: ['./shoping-container.component.scss']
})
export class ShopingContainerComponent implements OnDestroy {
  breadCrumbItems: ({ label: string; active?: undefined; } | { label: string; active: boolean; })[];
  showAlert: boolean = true
  activeTabId: number = 1
  favActor: any = null
  series: any = null
  brand: any = null
  wishlistData = [];
  trendingData = [];
  wishlistIds: [];
  isWishlistLoaded: boolean = false
  link="https://contxtual.tv/revenues/"
  refresh: boolean = false;
  isTrendingLoaded: boolean = false;
  constructor(private ngbNav: NgbNav, private shoppingService: MyShoppingService, private router:Router, 
    private wishlistService: WishlistService, private toastr: ToastrService, private apiService: ApiService) {
    this.breadCrumbItems = [
      { label: 'Demo' },
      { label: 'My Shopping', active: false },
      { label: 'My Wishlist', active: true }
    ];
  }

  tabObs: Subscription
  setScreen() {
    const actor = JSON.parse(sessionStorage.getItem('actor'));
    const series = JSON.parse(sessionStorage.getItem('series'));
    const brand = JSON.parse(sessionStorage.getItem('retailer'));
    const show =  JSON.parse(sessionStorage.getItem('show'));
    if (actor) {
      console.log(actor)
      this.favActor = actor
    }
    if(show){ 
      this.series = show
    }
    if (series) {
      this.series = series
    }
    if (brand) {
      this.brand = brand
    }
  }
  ngOnInit() {
    this.getWishlistProducts()
    this.getTrending()
    this.setActiveTab()
  }

  getWishlistProducts() {
    this.isWishlistLoaded = false
    const body = {
      pageNo: 1,
      limit: 100,
      "approvedOnly":true
    }
    this.wishlistService.getWishlistProducts(body).subscribe(
      (response: any) => {
        const uniqueIds = new Set();
        this.wishlistData = response?.data?.rows.filter(item => {
          item.heart = true
          if (!uniqueIds.has(item?.Product?.id)) {
            uniqueIds.add(item?.Product?.id);
              return true;
          }
          return false;
      });
        this.wishlistIds = response?.data?.rows.filter(item => {
          if (!uniqueIds.has(item?.Product?.id)) {
            uniqueIds.add(item?.Product?.id);
            return true;
          }
          return false;
        }).map(item => item?.id);
        this.isWishlistLoaded = true
      },
      (err) => {
        if (err.status !== 404) {
          this.wishlistData = []
          this.toastr.error(err?.message, "Error")
        }
      }
    )
  }

  getTrending(){
    this.trendingData = []
    const body = {
      pageNo: 1,
      limit: 30,
      "approvedOnly":true
    }
    this.shoppingService.getTopProducts(body).subscribe(
      (response: any) => {
        const uniqueIds = new Set();
        this.trendingData = response?.data?.rows.filter(item => {
          
          if (!uniqueIds.has(item?.Product?.id)) {
            uniqueIds.add(item?.Product?.id);
              return true;
          }
          return false;
      });
        this.isTrendingLoaded = true
      },
      (err) => {
        if (err.status !== 404) {
          this.trendingData = []
          this.toastr.error(err?.message, "Error")
        }
      }
    )
  }

  getActorDescription() {

  }
  setActive(tabId: number) {
    if (tabId != this.activeTabId) {
      this.shoppingService.selectedTab.next(tabId)
      this.favActor = null
      this.series = null
      this.brand = null
    }
    else if (!this.refresh){
      this.refresh = true
    }
    else {
      this.refresh = false
    }
  }
  setActiveTab() {
    this.tabObs = this.shoppingService.selectedTab.subscribe(res => {
      console.log(res)
      if (res == 5) {
        res = 5
        this.favActor = null
      }
      if(res==6){
        res=6-3
        this.series=null
      }
      this.activeTabId = parseInt(res);
      this.ngbNav.select(res);
      this.setScreen()
    })
  }
  routeToShow(id){
    this.router.navigate(['user/player/'+id])

  }
  addProductToWishlist(item) {
    this.wishlistData.unshift(item)
    this.trendingData = this.trendingData.map((product) => {
      if(product?.Product?.id === item?.Product?.id) {
        product.heart = true
      }
      return product
    })
  }
  removeProductFromWishlist(item) {
    this.wishlistData = this.wishlistData.filter((product) => product?.Product?.id !== item?.Product?.id)
    this.trendingData = this.trendingData.map((product) => {
      if(product?.Product?.id === item?.Product?.id) {
        product.heart = false
      }
      return product
    })
  }
  ngOnDestroy() {
    this.shoppingService.selectedTab.next(1)
    this.tabObs.unsubscribe()
  }
}
