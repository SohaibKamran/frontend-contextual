import { Component, HostListener, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Inject } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
// import { SharedService } from '../core/services/shared.service';
import { WishlistService } from './wishlist.service';
import { first } from 'rxjs/operators';
import { AdAddToCardModalComponent } from 'src/app/shared/ad-add-to-card-modal/ad-add-to-card-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MyShoppingService } from '../my-shopping.service';
import { UserWatchService } from '../../user.service';
import { ApiService } from 'src/app/core/services/api.service';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-my-wishlist',
  templateUrl: './my-wishlist.component.html',
  styleUrls: ['./my-wishlist.component.scss']
})
export class MyWishlistComponent implements OnInit {

  wishlistIds: []
  showToolbar: boolean;
  isTrending: boolean = false
  @Output() selectTab=new EventEmitter<string>()
  @Output() addProductToWishlist = new EventEmitter<any>();
  @Output() removeProductFromWishlist = new EventEmitter<any>();
  @Input() wishlistData = [];
  @Input() trendingData = [];
  @Input() isWishlistLoaded: boolean = false
  @Input() isTrendingLoaded: boolean = false
  activeTabId: number = 1
  // @Output() showAddToWishlistPopup = new EventEmitter<string>();
  
  constructor(private router: Router,
    private modalService: NgbModal,
    // private sharedService: SharedService, 
    private wishlistService: WishlistService, private toastr: ToastrService,
    private media: MediaObserver, 
    private shoppingService:MyShoppingService,
    private userService:UserWatchService,
    private apiService: ApiService,
    @Inject(DOCUMENT) private document: Document
    ) { }

  ngOnInit(): void {
    this.setScreenSize()
    this.wishlistData.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    });
  }



  @HostListener("window:resize", [])
  private onResize() {
    this.setScreenSize()
  }

  setActive(tabId: number) {
    if (tabId != this.activeTabId) {
      this.shoppingService.selectedTab.next(tabId)
    }
  }
  setScreenSize() {
    if (this.media.isActive('lt-sm')) {
      this.showToolbar = true;
    }
    else {
      this.showToolbar = false;
    }
  }


  switchTrending(value: boolean) {
    this.isTrending = value
    //set the heart in the trending list
    this.refreshListing()
    
  }

  removeProduct(item) {
    const body = {
      "favoriteProductId": item?.id,
      "productId": item?.Product?.id
    }
    this.wishlistService.removeWishlistProduct(body).pipe(first())
      .subscribe({
        next: () => {
          this.toastr.success('Product removed from wishlist')
          this.refreshListing();
          this.wishlistData = this.wishlistData.filter((product) => product?.Product?.id !== item?.Product?.id)
          this.trendingData = this.trendingData.map((product) => {
            if(product?.Product?.id === item?.Product?.id) {
              product.heart = false
            }
            return product
          })
          this.removeProductFromWishlist.emit(item)
        },
        error: (error) => {
          // this.error = error;
          // this.loading = false;
          this.wishlistData = []
        }
      });
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
        this.trendingData = this.trendingData.map((product) => {
          if(product?.Product?.id === item?.Product?.id) {
            product.heart = true
          }
          return product
        })

        item.createdAt = new Date().toISOString();
        this.addProductToWishlist.emit(item)
      },
      error: (error) => {
        this.trendingData = [];
        this.toastr.error(error.message, "Error");
      }
    });
}

  openItemDetailsModal(id: number, productImageIds: number) {
    const activeModal = this.modalService.open(AdAddToCardModalComponent, {
      windowClass: "modal-xl",
      backdrop: "static",
      size: 'lg',
      keyboard: true,
      centered: true,
    })
    activeModal.componentInstance.id = id
    activeModal.componentInstance.productImageId = productImageIds
  }
  
  routeToFavActors(actor: any) {
    console.log(actor)
    this.router['']
    sessionStorage.setItem('actor', JSON.stringify(actor))
    this.shoppingService.selectedTab.next(2)
  }

  refreshListing(){
    //set the heart in the trending list
    this.trendingData = this.trendingData.map((product) => {
      const item = this.wishlistData.find((item) => item?.Product?.id === product?.Product?.id)
      if(item) {
        product.heart = true
      }
      return product
    })
  }
}
