import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
// import { NgxSpinnerService } from 'ngx-spinner/lib/ngx-spinner.service';
// import { ToastrService } from 'ngx-toastr/toastr/toastr.service';
import { ApiService } from 'src/app/core/services/api.service';
import { getFavorite } from 'src/app/core/constants';
import { MyShoppingService } from '../my-shopping.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdAddToCardModalComponent } from 'src/app/shared/ad-add-to-card-modal/ad-add-to-card-modal.component';
import { UserWatchService } from '../../user.service';
import { WishlistService } from '../my-wishlist/wishlist.service';
import { first } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { requests } from 'src/app/core/config/config';
@Component({
  selector: 'app-fav-actors',
  templateUrl: './fav-actors.component.html',
  styleUrls: ['./fav-actors.component.scss']
})
export class FavActorsComponent implements OnInit {

  actors = [];
  showToolbar: boolean;
  loader: boolean = false
  body: any
  favActor;
  favActorTrendings: any = [];
  showWishList: boolean = false
  isTrending: boolean = false;
  @Input() trendingData: any = []
  wishlistIds: any[] = [];
  resultData: any = []
  @Input() isWishlistLoaded: boolean = false
  @Input() wishlistData = [];
  @Input() refresh: boolean = false;
  @Output() addProductToWishlist = new EventEmitter<any>();
  @Output() removeProductFromWishlist = new EventEmitter<any>();

  constructor(private router: Router,
    // private loader: NgxSpinnerService,
    // private sharedService: SharedService, 
    private apiService: ApiService,
    private shoppingService: MyShoppingService,
    private modalService: NgbModal,
    private userService: UserWatchService,
    private wishlistService: WishlistService,
    private toastr: ToastrService
    // private toastr: ToastrService
  ) { 
  }

  ngOnInit(): void {
    this.showWishList = false
    this.setBody()
  }


  setActor(actor) {
    this.favActor = actor
    this.body = {
      pageNo: 1,
      limit: 1000,
      actorId: actor ? actor.id : undefined
    }
    this.actors = []
    sessionStorage.setItem('actor', JSON.stringify(actor))
    this.shoppingService.selectedTab.next(2 + "")
    if(this.isTrending)
      this.getTopProductsByActor(actor.id)
    else
      this.getWishlistOfActor(actor.id)
    
    this.showWishList = true
  }

  setBody(flag?: boolean) {
    this.actors = []
    const actor = JSON.parse(sessionStorage.getItem('actor'));
    if (actor) {
      this.favActor = actor
      this.showWishList = true
    }
    this.body = {
      pageNo: 1,
      limit: 1000,
      type: 'actor',
      
      
    }
    if (actor){
      this.body = {
        pageNo: 1,
        limit: 1000,
        actorId: actor.id
      }
      //this.getTopProductsByActor()
      this.getWishlistOfActor(actor.id)
    }
    else{
      this.getActors()
    }
    if (flag)
      this.shoppingService.selectedTab.next(5)
   
  }

  getWishlistOfActor(actorId?: number) {
    const data = this.isTrending ? this.trendingData : this.wishlistData;
    this.resultData = []
    for(let i of data){
      if(i?.Actor?.id == actorId){
        this.resultData.push(i)
      }
    }
    sessionStorage.removeItem('actor')
    this.showWishList = true
  }

  getTopProductsByActor(actorId?: number){
    this.isWishlistLoaded = false
    this.loader = true;
    //console.log("BODY", this.body)
    if(this.favActorTrendings.length === 0){
      this.shoppingService.getTopProductsByActor(this.body).subscribe(
        (response: any) => {
          const uniqueIds = new Set();
          this.favActorTrendings = response?.data?.rows.filter(item => {
            if (!uniqueIds.has(item?.Product?.id)) {
              uniqueIds.add(item?.Product?.id);
              return true;
            }
            return false;
          });
          this.resultData = this.favActorTrendings
          this.showWishList = true
          sessionStorage.removeItem('actor')
          this.refreshListing()
          this.loader = false
          this.isWishlistLoaded = true
          
          //("results", this.resultData)
          //console.log("wishlist",this.wishlistData)
        },
        (err) => {
          this.loader = false
          this.isWishlistLoaded = true
          if (err.status !== 404) {
          // this.wishListData = []
            this.toastr.error(err?.message, "Error")
          }
          sessionStorage.removeItem('actor')
        }
      )
    }
    else {
      this.resultData = this.favActorTrendings
    }
  }


  openItemDetailsModal(id: number, productImageIds: number, retailerId, retailerName, sceneId: number, proxyId: number, showId, actor, url) {
    const activeModal = this.modalService.open(AdAddToCardModalComponent, {
      windowClass: "modal-xl",
      backdrop: "static",
      size: 'lg',
      keyboard: true,
      centered: true,
    })
    activeModal.componentInstance.id = id
    activeModal.componentInstance.productImageId = productImageIds
    activeModal.componentInstance.proxyCoordinateId = proxyId
    activeModal.componentInstance.retailerId = retailerId
    activeModal.componentInstance.showId = showId
    activeModal.componentInstance.sceneId = sceneId
    activeModal.componentInstance.retailerName = retailerName
    activeModal.componentInstance.actor = actor
    activeModal.componentInstance.matchedImageUrl = url
    activeModal.componentInstance.refreshListing.subscribe((res) => {
      this.actors = []
      //this.refreshListing()
    })
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

  getActors() {
    const data = this.isTrending ? this.trendingData : this.wishlistData;
    this.actors = data.reduce((actors, item) => {
      const actorId = item?.Actor?.id;
      if (actorId && !actors.some(actor => actor.id === actorId)) {
        const actor = {
          name: item?.Actor?.name,
          id: actorId,
          imageUrl: item?.Actor?.imageUrl,
          FavouriteProducts: [],
          likes: 0,
        };
        for(let i of data){
          if(i?.Actor?.id == actorId){
            actor.likes++
            actor.FavouriteProducts.push(i)
          }
        }

        actors.push(actor);
      }

      return actors;
    }, []).sort((a, b) => b.FavouriteProducts?.length - a.FavouriteProducts?.length);
    sessionStorage.removeItem('actor');
    this.loader = false;
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



  setVideoData(scene, showId,proxyCoordinateId, flag?: boolean) {
    
    // this.userService
    if(flag){
      this.userService.scene.next(scene)
      this.userService.proxyCoorddinateId.next(proxyCoordinateId)
     
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


  getTopThreeFavoriteProducts(actor) {
    return actor?.FavouriteProducts?.slice(0, 3);
  }

  ngOnChanges(event) {
    if(event.refresh && !event.refresh.firstChange)
      this.refreshTab(this.isTrending);
  }

  switchTrending(value=false) {
    this.isTrending = value;
    if(this.favActor){
      this.setActor(this.favActor)
    }
    else {
      this.getActors();
    }
  }

  refreshTab(value=false) {
    sessionStorage.removeItem('actor');
    this.favActorTrendings = [];
    this.actors = [];
    this.resultData = [];
    this.favActor = undefined;
    this.setBody();
    this.showWishList = false;
    this.isTrending = value;

    this.getActors();
  }
}
