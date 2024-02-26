import { CommonModule } from '@angular/common';
import { Component, ViewChild, ViewChildren, QueryList, Output, EventEmitter, Input, ElementRef, AfterViewChecked, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { requests } from 'src/app/core/config/config';
import { ApiService } from 'src/app/core/services/api.service';
import addToCartModal from './add-to-cart-Modal';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-ad-add-to-card-modal',
  standalone: true,
  imports: [CommonModule, SlickCarouselModule],
  templateUrl: './ad-add-to-card-modal.component.html',
  styleUrls: ['./ad-add-to-card-modal.component.scss']
})
export class AdAddToCardModalComponent implements AfterViewInit {
  @ViewChild('mainCarousel', { static: true }) mainCarousel: SlickCarouselComponent;
  @ViewChild('thumbnailCarousel', { static: true }) thumbnailCarousel: SlickCarouselComponent;
  @Input() productImageId: number
  @Input() id: number
  @Input() heart: boolean = false
  @Input() caller: string = null
  @Input() sceneId:number
  @Input() showId:number
  @Input() retailerId:number
  @Input() proxyCoordinateId:number
  @Input() retailerName:string
  @Output() refreshListing: EventEmitter<any> = new EventEmitter()
  @Input() actor
  product: addToCartModal
  @Input() scene: any
  @ViewChildren('sliderItem') sliderItems: QueryList<ElementRef>;
  @Input() matchedImageUrl?: any;

  constructor(private modal: NgbActiveModal, private apiService: ApiService, private toastr:ToastrService) {
  }

  ngOnInit() {
    this.product = new addToCartModal()
    // console.log(this.productImageId, this.id)
    this.fetchData()
  }


  zoomedImage = false;
  currentScale = 1;

  zoomIn(i) {

    this.currentScale += 0.1;
    this.applyZoom(i);
  }

  ngAfterViewInit() {
    // console.log(this.sliderItems)
  }

  resetZoom(i) {
    this.currentScale = 1;
    this.applyZoom(i);
  }

  zoomOut(i) {
    this.currentScale -= 0.1;
    this.applyZoom(i);
  }

  zoomAt(event: MouseEvent, i) {
    const imgElement = this.sliderItems.toArray()[i].nativeElement;

    // Calculate the mouse cursor position within the image
    const mouseX = event.offsetX / imgElement.clientWidth;
    const mouseY = event.offsetY / imgElement.clientHeight;

    // Adjust the scale to zoom at the clicked position
    this.currentScale += 0.1;
    this.applyZoom(i);

    // Calculate new image position to center the clicked point
    const newLeft = imgElement.scrollWidth * mouseX - event.offsetX;
    const newTop = imgElement.scrollHeight * mouseY - event.offsetY;

    // Apply the new position
    imgElement.style.transformOrigin = `${mouseX * 100}% ${mouseY * 100}%`;
    imgElement.style.transform = `scale(${this.currentScale})`;
    imgElement.style.left = `${newLeft}px`;
    imgElement.style.top = `${newTop}px`;

    this.zoomedImage = true;
  }

  private applyZoom(i) {
    const imgElement = this.sliderItems.toArray()[i].nativeElement;
    imgElement.style.transform = `scale(${this.currentScale})`;

    if (this.currentScale === 1) {
      this.zoomedImage = false;
    } else {
      this.zoomedImage = true;
    }
  }
  imagesSlider = {
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    cssEase: 'linear',
    fade: true,
    autoplay: false,
    draggable: false,
    centerMode: false,
    prevArrow: '.client-feedback .prev-arrow',
    nextArrow: '.client-feedback .next-arrow',
    asNavFor: ".thumbs",
  };
  thumbnailsSlider = {
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 1,
    cssEase: 'linear',
    autoplay: false,
    draggable: false,
    focusOnSelect: true,
    asNavFor: ".feedback",
    // centerMode:true,
    // centerPadding: 0,
    arrows: true,
    vertical: true
  };

  slides = [
    { img: '../../assets/images/cart.png' },
    { img: '../../assets/images/wishlist-3.jpg' },
    { img: '../../assets/images/cart.png' },
    { img: '../../assets/images/wishlist-2.jpg' }
  ];
  close() {
    // console.log("closed")
    this.modal.close('closed')
    //this.refreshListing.emit('closed')
    // this.closeModal.emit("Vlaue")
  }

  changeCount(operator) {
    if (operator == '+')
      this.product.count += 1
    else if (this.product.count > 1)
      this.product.count -= 1

  }
  fetchData() {
    const body = {
      id: this.id,
      productImageId: this.productImageId,
      caller: this.caller ? this.caller : undefined,
      sceneId: this.scene ? this.scene.id : undefined
    }
    this.apiService.sendRequest(requests.getProductsById, 'post', body).subscribe((res: any) => {
      // console.log(res)
      this.product.title = res?.data?.title
      this.product.images = res?.data?.ProductImages[0]?.reuploadedImages?.images
      if(this.matchedImageUrl)
      {
        this.product.images.sort((a, b) => {
          if (a.includes(this.matchedImageUrl.split('?')[0])) return -1;
          if (b.includes(this.matchedImageUrl.split('?')[0])) return 1;
          return 0;
        });        
      }
      this.product.description = res?.data?.description
      this.product.prices = res?.data?.ProductImages[0]?.prices
      if (this.product.prices?.salePrice == this.product.prices.actualPrice) {
        this.product.prices.salePrice = null
      }
      if (res?.data?.FavouriteProducts.length != 0) {
        this.heart=true
        this.product.addToWishlistBody = {
          ...this.product.addToWishlistBody,
          showId: res?.data?.FavouriteProducts[0]?.showId,
          retailerId: res?.data?.FavouriteProducts[0]?.retailerId,
          sceneId: res?.data?.FavouriteProducts[0]?.sceneId,
          coordinateId: res?.data?.FavouriteProducts[0]?.coordinateId,
          productImageId: res?.data?.FavouriteProducts[0]?.productImageId,
          productId: this.id,
          actorId:this.actor?this.actor?.id:undefined
        }
      }
      else{
        this.heart=false
        this.product.addToWishlistBody = {
          ...this.product.addToWishlistBody,
          showId: this.showId,
          retailerId: this.retailerId,
          sceneId: this.sceneId,
          coordinateId: this.proxyCoordinateId,
          productImageId: this.productImageId,
          productId: this.id,
          actorId:this.actor?this.actor?.id:undefined
        }
      }
    })

  }
  addToWishlist() {
    this.heart=true
    if(this.product?.addToWishlistBody) this.product.addToWishlistBody.matchedImageUrl = this.matchedImageUrl?this.matchedImageUrl:this.product?.images[0];
    const obj = {
      // showId: this.currentEpisode?.id,
      // productId: body?.CoordinateHasProducts[0]?.ProductImage?.productId,
      // ...(body?.actorId ? { actorId: body?.actorId } : null),
      // // actorId: body?.Actor?.id || 1,
      // coordinateId: body?.CoordinateHasProducts[0]?.proxyCoordinateId,
      // retailerId: body?.CoordinateHasProducts[0]?.Retailer?.id,
      // sceneId: this.sceneProductsData?.id,
      // productImageId: body?.CoordinateHasProducts[0]?.ProductImage?.id
    }
    this.apiService.sendRequest(requests.addToWishlist, 'post', this.product.addToWishlistBody).subscribe(
      (response: any) => {
        this.toastr.success(response?.message, "Success")

      },
      (err) => {
        this.toastr.error(err?.error?.message, "Error")
      }
    )
  }
  removeFromWishlist() {
    this.heart=false
    const obj = {
      showId: this.product?.addToWishlistBody?.showId,
      productId: this.product?.addToWishlistBody?.productId,
      coordinateId: this.product?.addToWishlistBody?.proxyCoordinateId,
    }
    this.apiService.sendRequest(requests.removeFromWishList,'post',obj).subscribe(
      (response: any) => {
        this.toastr.success(response?.message, "Success")
      },
      (err) => {
        this.toastr.error(err?.error?.message, "Error")
      }
    )
  }


}

