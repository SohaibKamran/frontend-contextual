import { Component,EventEmitter, Output, Input, NgZone, NgModule, ViewChild } from '@angular/core';
import { AdAddToCardModalComponent } from 'src/app/shared/ad-add-to-card-modal/ad-add-to-card-modal.component';
import { WishlistService } from '../my-wishlist/wishlist.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UserWatchService } from '../../user.service';
import { MyShoppingService } from '../my-shopping.service';
import { CommonModule } from '@angular/common';
import { NgxMasonryComponent } from 'ngx-masonry';
import { requests } from 'src/app/core/config/config';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-wishlist-data',
  templateUrl: './wishlist-data.component.html',
  styleUrls: ['./wishlist-data.component.scss']
})
export class WishlistDataComponent {

  @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;
  @Input() wishlistData = [];
  @Input() isTrending: boolean = false;
  @Output() addProduct=new EventEmitter<string>()
  @Output() removeProduct=new EventEmitter<string>()
  @Output() refreshListing: EventEmitter<any> = new EventEmitter()
  @Input() isWishlistLoaded: boolean = false
  showCards: boolean = false

  constructor(private ngZone: NgZone, 
    private wishlistService:WishlistService, 
    private modalService:NgbModal, 
    private toastr:ToastrService, 
    private router:Router, 
    private userService:UserWatchService, 
    private shoppingService:MyShoppingService, 
    private apiService: ApiService) { }
  setVideoData(scene, showId, proxyCoorddinateId, retailerId, flag?:boolean){
    //console.log(scene, showId, proxyCoorddinateId, flag, "wishlist data component")
    // this.userService
    
    if(flag){
      this.userService.scene.next(scene)
      this.userService.proxyCoorddinateId.next(proxyCoorddinateId)
      localStorage.setItem('retailerId', retailerId)
    }
    this.router.navigate(['user/player/'+showId])
  }

  ngAfterViewInit() {
    
    if(this.isWishlistLoaded){
      this.ngZone.onStable.subscribe(() => {
      
          this.masonry.reloadItems();
          this.masonry.layout();
      
      });
    }
    setTimeout(() => {
      document.querySelector('.masonry-container')['style'].visibility = 'visible';
    }, 200);
}

ngOnChanges(event) {
  if (event.isTrending) {
    this.updateRetargetImpressions(this.isTrending)
  }
}

updateRetargetImpressions(isTrending: boolean = false) {
  const userId = localStorage.getItem('userId');
  const impressions = this.wishlistData?.length;

  // Conditional property name and value
  const impressionsKey = isTrending ? 'discoveryImpressions' : 'retargetImpressions';
  const body = {
    userId,
    [impressionsKey]: impressions
  };

  this.apiService.sendRequest(isTrending ? requests.updateDiscoveryImpressions : requests.updateRetargetImpressions, 'post', body).subscribe(
    (response: any) => {},
    (err) => {
      console.error(err)
    }
  );
}




  openItemDetailsModal(id: number, productImageIds: number, scene:any,retailerName, url) {
    const activeModal = this.modalService.open(AdAddToCardModalComponent, {
      windowClass: "modal-xl",
      backdrop: "static",
      size: 'lg',
      keyboard: true,
      centered: true,
    })

    activeModal.componentInstance.id = id
    activeModal.componentInstance.productImageId = productImageIds
    activeModal.componentInstance.heart=true
    activeModal.componentInstance.caller='viewer'
    activeModal.componentInstance.scene=scene
    activeModal.componentInstance.retailerName=retailerName
    activeModal.componentInstance.matchedImageUrl=url

    activeModal.componentInstance.refreshListing.subscribe((res)=>{
      this.refreshListing.emit('close')
    })

  }

  routeToFavActors(actor: any) {
    //console.log(actor)
    this.router['']
    sessionStorage.setItem('actor', JSON.stringify(actor))
    this.shoppingService.selectedTab.next(2)
  }
  routeToMyFavShows(shows:any){
    shows.title=shows.Series.title
    sessionStorage.setItem('show',JSON.stringify(shows))
    this.shoppingService.selectedTab.next(3)
  }

  add(item){
    this.addProduct.emit(item)
  }

  remove(item){
    this.removeProduct.emit(item)
  }
}
