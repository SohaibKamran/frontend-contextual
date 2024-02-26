import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { getFavorite } from 'src/app/core/constants';
import { ApiService } from 'src/app/core/services/api.service';
import { MyShoppingService } from '../my-shopping.service';
import { WishlistService } from '../my-wishlist/wishlist.service';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { first, tap, catchError } from 'rxjs/operators';

import { requests } from 'src/app/core/config/config';
@Component({
  selector: 'app-fav-shows',
  templateUrl: './fav-shows.component.html',
  styleUrls: ['./fav-shows.component.scss']
})
export class FavShowsComponent implements OnInit {
  shows = [];
  showToolbar: boolean;
  body: any
  favShow;
  favShowTrendings: any = [];
  isTrending: boolean = false;
  trendingShows: any = [];
  @Input() trendingData: any = []
  @Input() wishlistData = [];
  @Input() isWishlistLoaded: boolean = false
  @Input() refresh: boolean = false;
  wishlistIds: any[] = [];
  resultData: any = [];
  showWishList: boolean
  @Output() addProductToWishlist = new EventEmitter<any>();
  @Output() removeProductFromWishlist = new EventEmitter<any>();
  constructor(
    // private router: Router, 
    // private loader: NgxSpinnerService,
    // private sharedService: SharedService, 
    private apiService: ApiService,
    // private toastr: ToastrService\
    private shoppingService: MyShoppingService,
    private wishlistService: WishlistService,
    private toastr: ToastrService
  ) {
    
   }

  ngOnInit(): void {
    this.showWishList = false
    this.setBody()
  }

    // Method to split the full name into an array with the first name and surname.
  splitName(fullName: string): string[] {
      return fullName.split(' ');
    }

  setBody() {
    // const series = JSON.parse(sessionStorage.getItem('series'));
    const series = JSON.parse(sessionStorage.getItem('series'))
    const show = JSON.parse(sessionStorage.getItem('show'))
    this.body = {
      pageNo: 1,
      limit: 1000,
      type: 'show',
      // seriesId:series?series.id:undefined
    }
    if (show || series) {
      this.body = {
        pageNo: 1,
        limit: 1000,
        approvedOnly:true,
        seriesId:series?.id??undefined,
        showId:show?.id??undefined
        // seriesId:series?series.id:undefined
      }
      //this.getTopProductsInShow()
      this.getWishlistOfShow(show?.id??series?.id)
    }
    else
      this.getShows()
  }

  getWishlistOfShow(showId?: number) {
    this.resultData = []
    for(let i of this.wishlistData){
      if(i?.Show?.id == showId){
        this.resultData.push(i)
      }
    }
    console.log("RESULT")
    console.log(this.resultData)
    sessionStorage.removeItem('show')
    sessionStorage.removeItem('series')
    this.showWishList = true

  }

  addProduct(item) {
    const body = {
      "productId": item?.Product?.id,
      "showId": item?.Show?.id,
      "coordinateId": item?.ProxyCoordinate?.id,
      "retailerId": item?.Retailer?.id,
      "sceneId": item?.Scene?.id,
      "productImageId": item?.ProductImage?.id,
      "actorId": item?.Actor?.id,
      "matchedImageUrl": item?.matchedImageUrl,
    }
    this.wishlistService.addToWishlist(body).pipe(first())
    .subscribe({
      next: () => {
        this.toastr.success('Product added to wishlist');
        //this.refreshListing()
        item.heart= true
        item.createdAt = new Date().toISOString();
        this.addProductToWishlist.emit(item)
      },
      error: (error) => {
        this.resultData = [];
        this.toastr.error(error.message, "Error");
      }
    });
}
removeProduct(item) {
  //console.log(item)
  const body = {
    "favoriteProductId": item?.favoriteProductId,
    "productId": item?.Product?.id
  }
  this.wishlistService.removeWishlistProduct(body).pipe(first())
    .subscribe({
      next: () => {
        this.toastr.success('Product removed from wishlist')
        //this.refreshListing();
        item.heart = false;
        this.removeProductFromWishlist.emit(item)
      },
      error: (error) => {
        // this.error = error;
        // this.loading = false;
        this.resultData = []
      }
    });
}

/*  removeProduct(item) {
    console.log(item)
    if(true){
      this.getProductInShow()
    }
    const body = {
      "favoriteProductId": item?.id || item?.productId,
    }
    this.wishlistService.removeWishlistProduct(body).pipe(first())
      .subscribe({
        next: () => {
          this.toastr.success('Product removed from wishlist')
        },
        error: (error) => {
          // this.error = error;
          // this.loading = false;
          this.wishlistData = []


        },
        complete: () => {
          this.getTopProductsInShow()
        }
      });
  }*/

  getProductInShow(showid?: number){
    //this.loader = true
    
  }

  getTopProductsInShow(showId?: number){
    //this.loader = true;
    this.isWishlistLoaded = false
    //console.log("BODY", this.body)
    if(this.favShowTrendings.length === 0){
      this.shoppingService.getTopProductsByShow(this.body).subscribe(
        (response: any) => {
          const uniqueIds = new Set();
          this.favShowTrendings = response?.data?.rows.filter(item => {
            if (!uniqueIds.has(item?.Product?.id)) {
              uniqueIds.add(item?.Product?.id);
              return true;
            }
            return false;
          });
          
          this.resultData = this.favShowTrendings
          this.showWishList = true
          sessionStorage.removeItem('show')
          sessionStorage.removeItem('series')
          this.refreshListing()
          //console.log("results", this.resultData)
          //console.log("wishlist",this.wishlistData)
          //this.loader = false
          this.isWishlistLoaded = true
        },
        (err) => {
          //this.loader = false
          if (err.status !== 404) {
            this.isWishlistLoaded = true
            this.wishlistData = []
            this.toastr.error(err?.message, "Error")
          }
          sessionStorage.removeItem('show')
          sessionStorage.removeItem('series')
        }
      )
    }
    else {
      this.resultData = this.favShowTrendings
    }
  }



  getShows() {
    const data = this.isTrending ? this.trendingData : this.wishlistData;
    this.shows = data.reduce((shows, item) => {
      const showId = item?.Show?.id;
      if (showId && !shows.some(show => show.id === showId)) {
        const show = {
          title: item?.Show?.Series?.title,
          id: showId,
          thumbnail: item?.Show?.Series?.thumbnail,
          Actors: [],
          actorsId: new Set()
        };
        for (let i of data) {
          if (i?.Show?.id == showId && i?.Actor !== null) {
            if (!show.actorsId.has(i?.Actor?.id)) {
              show.Actors.push(i?.Actor);
              show.actorsId.add(i?.Actor?.id);
            }
          }
        }
        shows.push(show);
      }
      return shows;
    }, []);
  }

  routeToActor(actor) {
    sessionStorage.setItem('actor', JSON.stringify(actor))
    this.shoppingService.selectedTab.next(2)
    //this.shoppingService.getTopProductsByActor(actor.id)
  }

  setWishlist(show?:any){
    if (show) {
      if (show.videoTypeId == 1){
        sessionStorage.setItem('series', JSON.stringify(show))
        this.body={

          ...this.body,seriesId:show.id,
          type:undefined
        } 
      }
      else{
        this.body={
          ...this.body,showId:show.id,
          type:undefined
        }
        sessionStorage.setItem('show', JSON.stringify(show))
      }
      if(this.isTrending)
        this.getTopProductsInShow(show.id)
      else
        this.getWishlistOfShow(show.id)
  
    this.showWishList = true
    }
    this.favShow = show;
    this.shoppingService.selectedTab.next(6)

  }
  refreshListing(){
    //set the heart in the trending list
    this.resultData = this.resultData.map((product) => {
      const item = this.wishlistData.find((item) => item?.Product?.id === product?.Product?.id)
      if(item) {
        product.heart = true
      }
      return product
    })
  }

  ngOnChanges(event) {
    if(event.refresh && !event.refresh.firstChange)
      this.refreshTab(this.isTrending);
  }

  switchTrending(value=false) {
    this.isTrending = value;
    if(this.favShow){
      this.setWishlist(this.favShow)
    }
    else {
      this.getShows();
    }
  }

  refreshTab(value=false) {
    this.resultData = [];
    this.favShowTrendings = [];
    this.favShow = undefined;
    sessionStorage.removeItem('show');
    sessionStorage.removeItem('series');
    this.setBody();
    this.showWishList = false;
    this.isTrending = value;

    this.getShows();
  }
}
