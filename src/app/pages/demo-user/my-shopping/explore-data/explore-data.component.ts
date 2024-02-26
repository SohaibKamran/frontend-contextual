import { Component,EventEmitter, Output, Input } from '@angular/core';
import { AdAddToCardModalComponent } from 'src/app/shared/ad-add-to-card-modal/ad-add-to-card-modal.component';
import { WishlistService } from '../my-wishlist/wishlist.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UserWatchService } from '../../user.service';
import { MyShoppingService } from '../my-shopping.service';

@Component({
  selector: 'app-explore-data',
  templateUrl: './explore-data.component.html',
  styleUrls: ['./explore-data.component.scss']
})
export class ExploreDataComponent {

  @Input() wishlistData = [];
  @Output() addProduct=new EventEmitter<string>()
  @Output() removeProduct=new EventEmitter<string>()
  @Input() loader
  @Output() refreshListing: EventEmitter<any> = new EventEmitter()

  constructor( private wishlistService:WishlistService, private modalService:NgbModal, private toastr:ToastrService, private router:Router, private userService:UserWatchService, private shoppingService:MyShoppingService){

  }
  setVideoData(scene, showId, flag?:boolean){
    // this.userService
    if(flag)
      this.userService.scene.next(scene)
    this.router.navigate(['user/player/'+showId])
  }

  openItemDetailsModal(id: number, productImageIds: number, scene:any,retailerName, url) {
    const activeModal = this.modalService.open(AdAddToCardModalComponent, {
      windowClass: "modal-xl",
      backdrop: "static",
      size: 'lg',
      keyboard: true,
      centered: true,
    })
    console.log(scene)
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
    console.log(actor)
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
