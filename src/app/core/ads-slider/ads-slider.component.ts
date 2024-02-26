/* eslint-disable prefer-const */
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
// import { ToastrService } from 'ngx-toastr';
// import { ToastrService } from 'ngx-toastr';
// import { WishlistService } from '../../wishlist/wishlist.service';
import { AddsSliderService } from './ads-slider.service';
import { WishlistService } from 'src/app/pages/demo-user/my-shopping/my-wishlist/wishlist.service';
import { MediaObserver } from '@angular/flex-layout';
import { HostListener } from '@angular/core';
import { interval, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';





@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'cdk-ads-slider',
  templateUrl: './ads-slider.component.html',
  styleUrls: ['./ads-slider.component.scss']
})
export class AddsSliderComponent implements OnInit, AfterViewInit {
  @ViewChild('horizontalScroll') horizontalScroll: ElementRef;
  currentSlide = 0;
  
  

  constructor(
    private sliderService: AddsSliderService,
    public wishlistService: WishlistService,
    private media: MediaObserver
    // public toastr: ToastrService
  ) { }
  @Input() isPlaying;
  @Input() showAdds;
  @Input() addsToShow;
  @Input() isFullScreen;
  @Input() sceneProductsData;
  @Input() currentEpisode;
  @Input() verticalAds;
  @Input() proxyCoordinateId;
  @Output() showAddToWishlistPopup = new EventEmitter<string>();
  limitedProducts: any[];
  favProduct = false;
  @Output() rendered = new EventEmitter<string>();
  isScrolling = false;
  scrollDirection: 'left' | 'right' = 'left';
  isFirstItem = true;
  isLastItem= false;
  private destroy$;
  
  @HostListener('wheel', ['$event'])
  @HostListener('touchmove', ['$event'])
  onScroll(event: TouchEvent | WheelEvent) {
    console.log("verticalAds",this.verticalAds)
    if(!this.verticalAds){
      event.preventDefault();
      if (this.isScrolling) {
        return;
      }
      this.isScrolling = true;
      setTimeout(() => (this.isScrolling = false), 600); // Adjust delay as needed

      if ((event instanceof WheelEvent && event.deltaX > 3) || (event instanceof TouchEvent && event.changedTouches[0].clientX > 3)) {
        this.scrollDirection = 'left'
        this.goToNextSlide();
      } else if ((event instanceof WheelEvent && event.deltaX < -3) || (event instanceof TouchEvent && event.changedTouches[0].clientX < -3)) {
        this.scrollDirection = 'right'
        this.goToPreviousSlide();
        
      }
    }
  }




goToNextSlide() {
  this.resetAndSetupInterval();
  const maxIndex = this.sceneProductsData?.ProxyCoordinates.length;
  this.isFirstItem = false;
  if (this.currentSlide < maxIndex -1) {
    this.scrollDirection = 'left'
    this.currentSlide = this.currentSlide + 1;
  }
  if(this.currentSlide == maxIndex -1){
    this.isLastItem = true;
  }
}

goToPreviousSlide() {
  this.resetAndSetupInterval();
  this.isLastItem = false;
  if (this.currentSlide > 0) {
    this.scrollDirection = 'right'
    this.currentSlide = this.currentSlide - 1;
  }
  if(this.currentSlide == 0){
    this.isFirstItem = true;
  }
}

 /* setProductScrollHeight() {
    let element = document.getElementById("add-list-scroll");
    let adsView = document.getElementById("ads");
    let addProductsScrollElement = document.getElementById("add-products-scroll");
    let wrapVideoElement = document.getElementById("wrap-video");
    let shoppingImages = Array.from(document.querySelectorAll(".shopping"));
    let episodePreviewVideoPlayer = document.getElementById('episode-preview-video-player')
    let numberOfAds = this.sceneProductsData?.ProxyCoordinates?.length;

    if (this.isFullScreen) {
      if(adsView)
        adsView.style['padding-bottom'] = `${numberOfAds > 3 ? (numberOfAds - 3) * 315 : 0}px`;
      if (element)
        element.style.height = "100vh"
      if (addProductsScrollElement)
        addProductsScrollElement.style.height = "96vh";
      if (shoppingImages?.length > 0) {
        for (const img of shoppingImages) {
          img['style'].height = "120px";
          img['style'].width = "100px";
        }
      }
      // else {
      //   if (element) {
      //     const height = wrapVideoElement.getBoundingClientRect().height.toString();
      //     element.style.height = height + "px";
      //   }
      //   if (addProductsScrollElement) {
      //     let height = wrapVideoElement.getBoundingClientRect().height;
      //     height -= 25;
      //     addProductsScrollElement.style.height = height.toString() + "px";
      //   }
      // }
    }
    else if(adsView){
      adsView.style['padding-bottom'] = `${numberOfAds > 2 ? (numberOfAds - 2) * 175 : 0}px`;
      if (episodePreviewVideoPlayer) {
        if (element)
          element.style.height = "320px"
        if (addProductsScrollElement)
          addProductsScrollElement.style.height = "292px";
      }
      else {
        if (element)
          element.style.height = "406px"
        if (addProductsScrollElement)
          addProductsScrollElement.style.height = "378px";
      }
      if (shoppingImages?.length > 0) {
        for (const img of shoppingImages) {
          img['style'].height = "140px";
          img['style'].width = "110px";
        }
      }
    }
  }
*/

  ngOnInit(): void {
    // console.log('adds to show', this.addsToShow)
  
  //  this.setProductScrollHeight()
    this.getLimitedWishlistProduct()

    if (this.media.isActive('lt-sm')) {
      console.log('lt-sm')
    }
    else if (this.media.isActive('gt-sm')) {
      console.log('gt-sm')
    }
    else if (this.media.isActive('gt-xs')) {
      console.log('gt-xs')
    }
    this.currentSlide = 0;

  }

  setCurrentSlide(index: number) {
    this.currentSlide = index;
  }

  goToSlide(index: number): void {
    if(index > this.currentSlide) {
      this.scrollDirection = 'left';
    } else {
      this.scrollDirection = 'right';
    }
    this.currentSlide = index;
  }

  @ViewChild('add-list-scroll')
  set watch(element: ElementRef) {
    //this.setProductScrollHeight()
  }



  addToWishlist(body) {
    const obj = {
      showId: this.currentEpisode?.id,
      productId: body?.CoordinateHasProducts[0]?.ProductImage?.productId,
      ...(body?.actorId ? { actorId: body?.actorId } : null),
      // actorId: body?.Actor?.id || 1,
      coordinateId: body?.CoordinateHasProducts[0]?.proxyCoordinateId,
      retailerId: body?.CoordinateHasProducts[0]?.Retailer?.id,
      sceneId: this.sceneProductsData?.id,
      productImageId: body?.CoordinateHasProducts[0]?.ProductImage?.id,
      matchedImageUrl:body?.CoordinateHasProducts[0]?.matchedImageUrl
    }
    this.wishlistService.addToWishlist(obj).subscribe(
      (response: any) => {
        this.showAddToWishlistPopup.next('showPopup');
        // this.toastr.success(response?.message, "Success")
        this.getLimitedWishlistProduct()
      },
      (err) => {
        // this.toastr.error(err?.error?.message, "Error")
      }
    )
  }

  ngAfterViewInit() {
    this.rendered.emit('Rendered');
  }

  removeFromWishlist(body) {
    const obj = {
      showId: this.currentEpisode?.id,
      productId: body?.CoordinateHasProducts[0].productId,
      actorId: body?.Actor?.id,
      coordinateId: body?.CoordinateHasProducts[0].proxyCoordinateId,
    }
    this.wishlistService.removeWishlistProduct(obj).subscribe(
      (response: any) => {
        // this.toastr.success(response?.message, "Success")
        let selectedItem = this.sceneProductsData?.ProxyCoordinates.findIndex(x => x.id == body?.id);
        if (selectedItem > -1) {
          this.sceneProductsData.ProxyCoordinates[selectedItem].CoordinateHasProducts[0]['favProduct'] = false
        }
        this.getLimitedWishlistProduct()
      },
      (err) => {
        // this.toastr.error(err?.error?.message, "Error")
      }
    )
  }

  getLimitedWishlistProduct() {
    this.wishlistService.getLimitedWishlistProducts({ pageNo: 1, limit: 200 }).subscribe(
      (response: any) => {
        this.limitedProducts = response?.data?.rows;
        this.setFavProduct()
      },
      (err) => {
        // console.log("adds-slider.component.ts:88 ~ getLimitedWishlistProduct ~ err", err)
      }
    )
  }

  dynamicallyChangeFavoriteIcon(body) {
    for (let i = 0; i < this.sceneProductsData.length; i++) {
      let sceneProduct = this.sceneProductsData[i];
      if (sceneProduct.ProxyCoordinates) {
        if (sceneProduct.ProxyCoordinates[0].Products[0].id == body.Products[0].id &&
          this.currentEpisode.id == this.currentEpisode.id &&
          // sceneProduct.ProxyCoordinates[0].Actor.id == body.Actor.id &&
          sceneProduct.ProxyCoordinates[0].id == body.id
        ) {
          sceneProduct.ProxyCoordinates[0].favProduct = !(sceneProduct.ProxyCoordinates[0].favProduct);
        }
      }
    }
  }

  setFavProduct() {
    for (let i = 0; i < this.sceneProductsData?.ProxyCoordinates?.length; i++) {
      const sceneProduct = this.sceneProductsData?.ProxyCoordinates[i];
      if (sceneProduct && sceneProduct?.CoordinateHasProducts[0]) {
        if (this.limitedProducts) {
          for (let j = 0; j < this.limitedProducts.length; j++) {
            const limitedProduct = this.limitedProducts[j];
            if (limitedProduct.productId == sceneProduct?.CoordinateHasProducts[0]?.productId &&
              limitedProduct.showId == this.currentEpisode.id /*&&*/
              // limitedProduct.actorId == sceneProduct.ProxyCoordinates[0].Actor.id &&
              // TODO: temporary fix, in the long run we need to have same coordinateId 
              // limitedProduct.coordinateId == sceneProduct.CoordinateHasProducts[0].proxyCoordinateId
            ) {
              
              sceneProduct.CoordinateHasProducts[0]['favProduct'] = true;
              this.favProduct = true;
            }
          }
        }
        if (!this.favProduct)
          sceneProduct.CoordinateHasProducts[0]['favProduct'] = false;
      }
    }
    // console.log("this.sceneProductsData: ", this.sceneProductsData);
  }
  // setFavProduct() {
  //   for (let i = 0; i < this.sceneProductsData.length; i++) {
  //     const sceneProduct = this.sceneProductsData[i];
  //     if (sceneProduct.ProxyCoordinates && sceneProduct.ProxyCoordinates[0].Products) {
  //       if (this.limitedProducts) {
  //         for (let j = 0; j < this.limitedProducts.length; j++) {
  //           const limitedProduct = this.limitedProducts[j];
  //           if (limitedProduct.productId == sceneProduct.ProxyCoordinates[0].Products[0].id &&
  //             limitedProduct.showId == this.currentEpisode.id &&
  //             limitedProduct.actorId == sceneProduct.ProxyCoordinates[0].Actor.id &&
  //             limitedProduct.coordinateId == sceneProduct.ProxyCoordinates[0].id
  //           ) {
  //             sceneProduct.ProxyCoordinates[0]['favProduct'] = true;
  //             this.favProduct = true;
  //           }
  //         }
  //       }
  //       if (!this.favProduct)
  //         sceneProduct.ProxyCoordinates[0]['favProduct'] = false;
  //     }
  //   }
  //   // console.log("this.sceneProductsData: ", this.sceneProductsData);
  // }

  ngOnChanges() {
    //this.setProductScrollHeight()
    this.currentSlide = 0;  
    if(this.proxyCoordinateId != null){
      if(this.sceneProductsData && this.sceneProductsData.ProxyCoordinates?.length > 0){
        for(let pc of this.sceneProductsData.ProxyCoordinates){
          if(pc.id == this.proxyCoordinateId){
            this.currentSlide = this.sceneProductsData.ProxyCoordinates.indexOf(pc)
          }
        }
      }
    }
    if (!this.verticalAds) {
      this.resetAndSetupInterval();
    }
    
    this.setFavProduct()
  }

  resetAndSetupInterval() {
    if (this.destroy$) {
      this.destroy$.next(null);
      this.destroy$.complete();
    }
    if (this.showAdds) {
      this.destroy$ = new Subject();
      this.setupInterval();
    }
  }

  setupInterval() {
    interval(6000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.currentSlide = (this.currentSlide + 1) % this.sceneProductsData?.ProxyCoordinates?.length;
      });
  }
}
