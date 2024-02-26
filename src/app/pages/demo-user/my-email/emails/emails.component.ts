import { Component, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MediaObserver } from '@angular/flex-layout';
import { EmailService } from './email.service';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UserWatchService } from '../../user.service';
import { MyShoppingService } from '../../my-shopping/my-shopping.service';

import { Router } from '@angular/router';

import { AdAddToCardModalComponent } from 'src/app/shared/ad-add-to-card-modal/ad-add-to-card-modal.component';

@Component({
  selector: 'app-emails',
  templateUrl: './emails.component.html',
  styleUrls: ['./emails.component.scss']
})
export class EmailsComponent {
  breadCrumbItems: ({ label: string; active?: undefined; } | { label: string; active: boolean; })[];
  link = "https://contxtual.tv/revenues/";
  wishlistData = [];
  isWishlistLoaded: boolean = false;
  showToolbar: boolean;
  @Output() refreshListing: EventEmitter<any> = new EventEmitter()
  constructor(
    // private sharedService: SharedService, 
    private wishlistService: EmailService,
    private toastr: ToastrService,
    private media: MediaObserver,
    private apiService: ApiService,
    private modalService:NgbModal,
    private router:Router,
    private shoppingService:MyShoppingService,
    private userService:UserWatchService,
  ) {
    this.breadCrumbItems = [
      { label: 'Demo' },
      { label: 'My Shopping', active: false },
      { label: 'My Wishlist', active: true }
    ];
  }

  ngOnInit(): void {
    this.getWishlistProducts()
  }

  setVideoData(scene, showId, proxyCoorddinateId, retailerId, flag?:boolean){
    // this.userService
    if(flag){
      this.userService.scene.next(scene)
      this.userService.proxyCoorddinateId.next(proxyCoorddinateId)
      localStorage.setItem('retailerId', retailerId)
    }
    this.router.navigate(['user/player/'+showId])
  }

  routeToFavActors(actor: any) {
    //console.log(actor)
    this.router['']
    sessionStorage.setItem('actor', JSON.stringify(actor))
    this.shoppingService.selectedTab.next(2)
    this.router.navigate(['user/shopping'])
  }

  updateEmailImpressions() {
    const body = {
      userId: localStorage.getItem('userId'),
      emailImpressions: this.wishlistData?.length
    }
    this.apiService.sendRequest(requests.updateEmailImpressions, 'post', body).subscribe(
      (res: any) => { },
      (err) => {
        console.error(err)
      }
    )
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


  getWishlistProducts() {
    const body = {
      pageNo: 1,
      limit: 15
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
        this.updateEmailImpressions();
        this.isWishlistLoaded = true;
      },
      (err) => {
        if (err.status !== 404) {
          
          this.wishlistData = []
          this.toastr.error(err?.message, "Error")
        }
      }
    )
  }

}
