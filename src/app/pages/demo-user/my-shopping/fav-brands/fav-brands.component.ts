import { Component, OnInit,Input, EventEmitter, Output } from '@angular/core';
import { getFavorite } from 'src/app/core/constants';
import { ApiService } from 'src/app/core/services/api.service';
import { MyShoppingService } from '../my-shopping.service';
import { UserWatchService } from '../../user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../my-wishlist/wishlist.service';
import { first } from 'rxjs';
import { requests } from 'src/app/core/config/config';

@Component({
  selector: 'app-fav-brands',
  templateUrl: './fav-brands.component.html',
  styleUrls: ['./fav-brands.component.scss']
})
export class FavBrandsComponent implements OnInit {
  brands = [];
  loader: boolean = true
  showToolbar: boolean;
  body: any
  favBrand;
  favBrandTrendings: any = [];
  isTrending: boolean = false;
  @Input() trendingData: any = []
  showWishlist:boolean=false
  @Input() isWishlistLoaded: boolean = false
  @Input() wishlistData = [];
  @Input() refresh: boolean = false;
  wishlistIds: any[] = [];
  resultData: any = []
  @Output() addProductToWishlist = new EventEmitter<any>();
  @Output() removeProductFromWishlist = new EventEmitter<any>();
  constructor(
    // private router: Router, 
    // private loader: NgxSpinnerService,
    // private sharedService: SharedService, 
    private apiService: ApiService,
    private shoppingService: MyShoppingService,
    private userService:UserWatchService,
    private router:Router,
    private toastr:ToastrService,
    private wishlistService:WishlistService
    // private toastr: ToastrService
  ) { 
  }

  ngOnInit(): void {
    //this.getWishlistProducts()
    this.showWishlist = false
    this.setBody()
  }

  setBody() {

    const retailer = JSON.parse(sessionStorage.getItem('retailer'));

    this.body = {
      pageNo: 1,
      limit: 1000,
      type: 'retailer',
      
    }
    if(retailer){
      this.body = {
        pageNo: 1,
        limit: 1000,
        retailerId: retailer.id
      }
      
      //this.getTopProductsByBrand()
      this.getWishlistOfBrand(retailer.id)
    }
    else{
      this.getRetailers()
    }

  }

  getWishlistOfBrand(brandId){
    this.resultData = []
    for(let i of this.wishlistData){
      if(i?.Retailer?.id == brandId){
        this.resultData.push(i)
      }
    }
    sessionStorage.removeItem('retailer')
    this.showWishlist = true
  }

  getTopProductsByBrand(showId?: number){
    this.loader = false;
    this.isWishlistLoaded = false;
    if(this.favBrandTrendings.length === 0){
      this.shoppingService.getTopProductsByBrand(this.body).subscribe(
        (response: any) => {
          const uniqueIds = new Set();
          this.favBrandTrendings = response?.data?.rows.filter(item => {
            if (!uniqueIds.has(item?.Product?.id)) {
              uniqueIds.add(item?.Product?.id);
              return true;
            }
            return false;
          });

          this.resultData = this.favBrandTrendings;
          this.loader = false
          this.showWishlist = true
          sessionStorage.removeItem('retailer')
          this.refreshListing()
          //("results", this.resultData)
          //console.log("wishlist",this.wishlistData)
          this.isWishlistLoaded = true
        },
        (err) => {
          this.loader = false
          if (err.status !== 404) {
            this.isWishlistLoaded = true
            this.wishlistData = []
            this.toastr.error(err?.message, "Error")
          }
          sessionStorage.removeItem('retailer')
        }
      )
    }
    else {
      this.resultData = this.favBrandTrendings
    }
  }

  addProduct(item) {
    //console.log("ITEM", item)
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
        this.getWishlistProducts()
        this.refreshListing()
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
          this.refreshListing();
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

  getWishlistProducts() {
    const body = {
      pageNo: 1,
      limit: 1000,
      "approvedOnly":true
    }
    this.wishlistService.getWishlistProducts(body).subscribe(
      (response: any) => {
        
      const uniqueIds = new Set();
        this.wishlistData =response?.data?.rows.filter(item => {
          
          if (!uniqueIds.has(item?.Product?.id)) {
            uniqueIds.add(item?.Product?.id);
            return true;
          }
          return false;
        }).map(item => item?.Product?.id);
      
      this.wishlistIds = response?.data?.rows.filter(item => {
        if (!uniqueIds.has(item?.Product?.id)) {
          uniqueIds.add(item?.Product?.id);
          return true;
        }
        return false;
      }).map(item => item?.id);
      
       
      },
      (err) => {
        if (err.status !== 404) {
          this.wishlistData = []
          this.toastr.error(err?.message, "Error")
        }
      }
    )
  }


  setRetailer(retailer) {
    this.body = {
      pageNo: 1,
      limit: 1000,
      retailerId: retailer ? retailer.id : undefined
    }
    this.favBrand = retailer
    sessionStorage.setItem('retailer', JSON.stringify(retailer))
    this.shoppingService.selectedTab.next(4 + "")
    if(this.isTrending)
      this.getTopProductsByBrand(retailer.id)
    else
      this.getWishlistOfBrand(retailer.id)

    this.showWishlist = true
  }

  getRetailers() {
    const data = this.isTrending ? this.trendingData : this.wishlistData;
    this.brands = data.reduce((brands, item) => {
      const brandId = item?.Retailer?.id;
      if (brandId && !brands.some(brand => brand.id === brandId)) {
        const brand = {
          name: item?.Retailer?.name,
          id: brandId,
          imageUrl: item?.Retailer?.imageUrl,
          FavouriteProducts: [],
          productCount: item?.Retailer?.productCount,
        };
        for(let i of data){
          if(i?.Retailer?.id == brandId){
            brand.FavouriteProducts.push(i)
          }
        }

        brands.push(brand);
      }
      

     // console.log(brands, "brands")

      return brands;
    }, []);


    sessionStorage.removeItem('retailer');
    // this.loader.show();
    this.loader =false
  }
  updateRetargetImpressions() {
    const body = {
      "userId": localStorage.getItem('userId'),
      "retargetImpressions": this.wishlistData?.length
    }
    this.apiService.sendRequest(requests.updateRetargetImpressions, 'post', body).subscribe(
      (response: any) => {},
      (err) => {
        console.error(err)
      }
    )
  }
  setVideoData(scene, showId, flag?:boolean) {
    // this.userService
    if(flag){
      this.userService.scene.next(scene)
      this.userService.proxyCoorddinateId.next(0)
    }
    this.router.navigate(['user/player/' + showId])
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

  getTopFourScenes(brand) {
    return brand?.FavouriteProducts?.slice(0, 4);
  }
  ngOnChanges(event) {
    if(event.refresh && !event.refresh.firstChange)
      this.refreshTab(this.isTrending);
  }
  switchTrending(value=false) {
    this.isTrending = value;
    if(this.favBrand){
      this.setRetailer(this.favBrand)
    }
    else {
      this.getRetailers();
    }
  }

  refreshTab(value) {
    this.resultData = [];
    this.favBrandTrendings = [];
    this.favBrand = undefined;
    sessionStorage.removeItem('retailer');
    this.setBody();
    this.showWishlist = false;
    this.isTrending = value;

    this.getRetailers();
  }
}
