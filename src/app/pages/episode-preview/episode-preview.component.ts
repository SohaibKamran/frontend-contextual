import { Location } from '@angular/common';
import { Component, ElementRef, Input, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VgApiService } from '@videogular/ngx-videogular/core';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
import { SharedService } from 'src/app/core/services/shared.service';
import { FilterAdvertisersComponent } from '../videos/filter-advertisers/filter-advertisers.component';
import { Options } from '@angular-slider/ngx-slider';
import { getAllScenesOfShow } from 'src/app/core/constants';
import { Subject, debounceTime, switchMap, take } from 'rxjs';
import { AdAddToCardModalComponent } from 'src/app/shared/ad-add-to-card-modal/ad-add-to-card-modal.component';
import { ChangeDetectorRef } from '@angular/core';
import { UserWatchService } from '../demo-user/user.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({

  selector: 'app-episode-preview',
  templateUrl: './episode-preview.component.html',
  styleUrls: ['./episode-preview.component.scss']
})
export class EpisodePreviewComponent implements OnInit, OnDestroy {
  @Input() isDemo: boolean;
  episodePreviewForm: FormGroup;
  showAdds = false;
  isPlaying = false;
  isFullScreen = false;
  currentEpisode = null;
  sceneProductsData = [];
  addsFetched: any;
  episodePreviewDetails: any;
  public observeable;
  idForEpisode: any;
  selectedScene: any
  sceneCount = 0
  minValue = 50;
  maxValue = 200;
  value = 0;
  advertiserFilterProducts: any = []
  options: Options = {
    floor: 1,
    ceil: 100,
    translate: (value: number): string => {
      return "Scene " + value;
    },
    hideLimitLabels: true
  };
  timePaused
  episodeLoader: boolean = false
  @ViewChild('videoFileContainer', { static: false }) videoFileContainer;
  pagination: { scenePageNo: number; sceneLimit: number; offset?: number } = { sceneLimit: 15, scenePageNo: 1 };
  imagesArray = [];
  objArray = {};
  currentScene = 0
  currentSceneData: any;
  products = []
  allScenes = []
  coordinatesList = []
  showId: number;
  showWishlistSuccess: boolean = false
  retailerProductImages = []
  private endClick$ = new Subject<void>();
  episodeLoaderr = false;
  hideVideo = false;
  constructor(
    public modalService: NgbModal,
    public modal: NgbActiveModal,
    public api: VgApiService,
    private media: MediaObserver,
    private location: Location,
    public sharedService: SharedService,
    private apiService: ApiService,
    private cdref: ChangeDetectorRef,
    private userService: UserWatchService,
    private toastrService: ToastrService,
    public ngxService: NgxUiLoaderService,

  ) {
    this.endClick$
      .pipe(
        debounceTime(300), // Adjust the debounce time as needed
        switchMap(() => {
          const body = {
            showId: this.showId,
            relativeSceneNo: this.currentPage
          };
          return this.apiService.sendRequest(requests.getSceneByIdAndTopAds, 'post', body);
        })
      )
      .subscribe((res: any) => {
        this.adServedObjArray = [];
        if (res.data) {
          this.currentScene = res?.data?.id;
          this.currentSceneData = res?.data;
          this.sceneProductsData = []

          if (this.currentSceneData.ProxyCoordinates && this.currentSceneData.ProxyCoordinates.length > 0) this.currentSceneData.ProxyCoordinates = this.currentSceneData.ProxyCoordinates.filter(obj => obj.CoordinateHasProducts.length > 0);
          const video: any = document.getElementById('videoPlayerId');
          video.currentTime = (res?.data?.startTime / 1000);
          this.userService.scene.next(res.data);
        }
      });
  }
  ngOnDestroy(): void {
    this.observeable.unsubscribe();
  }
  currentPage = 1;
  flag: boolean = true
  ngOnInit(): void {
    this.showId = JSON.parse(sessionStorage.getItem('showId'))
    this.setProductScrollHeight()
    this.sharedService.sceneId.pipe(take(1)).subscribe((data) => {
      if (data !== null) {
        this.currentScene = data;
        this.autoPlay = false;
        this.hideVideo = true;

      }
      else {
        this.sharedService.seasonId.pipe(take(1)).subscribe((data) => {
          if (data !== null) {
          }
          else {
            this.toastrService.error('No Video Available')
            this.modalService.dismissAll()
          }
        })
      }
    });
    this.observeable = this.sharedService.videoData.subscribe((data) => {
      if (data !== null) {
        this.idForEpisode = data;
        this.fetchSceneData()
      }
    });
  }
  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
  @ViewChild('add-list-scroll')
  set watch(element: ElementRef) {
    this.setProductScrollHeight()
  }

  toggleFullScreen($event: any) {
    this.isFullScreen = !(this.isFullScreen)
  }
  showAddToWishlistPopup(event) {
    this.showWishlistSuccess = true;
    setTimeout(() => {
      this.showWishlistSuccess = false;
    }, 2000);
  }
  autoPlay = true;
  async pauseVideo($event?: any) {
    if (!this.autoPlay) this.hideVideo = false;
    this.sceneProductsData = []
    this.timePaused = parseFloat($event) * 1000
    this.isPlaying = !this.isPlaying
    this.showAdds = true;
    await this.getAdds(this.timePaused);
    console.log(this.sceneProductsData, "Scene Product Data")
  }
  setProductScrollHeight() {
    let element = document.getElementById("add-list-scroll");
    let addProductsScrollElement = document.getElementById("add-products-scroll");
    let wrapVideoElement = document.getElementById("wrap-video");
    if (this.isFullScreen) {
      if (element)
        element.style.height = "100vh"
      if (addProductsScrollElement)
        addProductsScrollElement.style.height = "97vh";
    }
    else {
      if (element) {
        const height = wrapVideoElement?.getBoundingClientRect()?.height.toString();
        element.style.height = height + "px";
      }
      if (addProductsScrollElement) {
        let height = wrapVideoElement?.getBoundingClientRect()?.height;
        height -= 25;
        addProductsScrollElement.style.height = height.toString() + "px";
      }
    }
  }

  openAddToCartModal(product) {
    const activeModal = this.modalService.open(AdAddToCardModalComponent, {
      animation: true,
      windowClass: "modal-xl",
      backdrop: "static",
      size: 'lg',
      keyboard: true,
      centered: true,
    });
    console.log(product);
    
    if (product.superProxyProduct) {
      activeModal.componentInstance.id = product?.superProxyProduct?.productId;
      activeModal.componentInstance.productImageId = product?.superProxyProduct?.productImageId;
      activeModal.componentInstance.proxyCoordinateId = product?.CoordinateHasProducts[0]?.ProxyCoordinateIdAdded?product?.CoordinateHasProducts[0]?.ProxyCoordinateIdAdded:product?.CoordinateHasProducts[0]?.proxyCoordinateId
      activeModal.componentInstance.retailerId = product?.CoordinateHasProducts[0]?.retailerId
      activeModal.componentInstance.showId = product?.CoordinateHasProducts[0]?.showId
      activeModal.componentInstance.sceneId = product?.CoordinateHasProducts[0]?.sceneId
      activeModal.componentInstance.retailerName = product?.CoordinateHasProducts[0]?.Retailer?.name
      activeModal.componentInstance.matchedImageUrl = product?.superProxyProduct?.matchedImageUrl
    }
    else {
      activeModal.componentInstance.id = product?.Product?.id;
      activeModal.componentInstance.productImageId = product?.ProductImage?.id;
      activeModal.componentInstance.retailerId = product?.Retailer?.id
      activeModal.componentInstance.showId = product?.showId
      activeModal.componentInstance.proxyCoordinateId = product?.proxyCoordinateId;
      activeModal.componentInstance.sceneId = product?.sceneId
      activeModal.componentInstance.retailerName = product?.Retailer?.name
      activeModal.componentInstance.matchedImageUrl = product?.matchedImageUrl
      activeModal.componentInstance.matchedImageUrl = product?.matchedImageUrl
    }
  }
  roundOffValues(value: any) {
    return Math.round(value)
  }

  fetchData(loader?: boolean, fromInitial?: boolean) {
    this.episodeLoaderr = true;
    const body = {
      episodeId: this.idForEpisode,
      sceneId: this.currentScene,
      approvedOnly: false
    };
    this.adServedObjArray = []
    if (!loader) this.episodeLoader = true
    this.apiService.sendRequest(requests.episodePreview, 'post', body).subscribe((res: any) => {
      if (!loader) this.episodeLoader = false
      this.retailerProductImages = []
      this.advertiserFilterProducts = []
      if (this.flag)
        this.episodePreviewDetails = res?.data;
      this.flag = false
      if (fromInitial) {
        if (res.data.Scenes.length == 0 || (res.data.Scenes.length > 0 && res.data.Scenes[0].ProxyCoordinates.length == 0)) {
          this.episodeLoaderr = false;
          return;

        }
        res.data.Scenes[0].ProxyCoordinates.forEach(obj => {
          let newObjArray = [obj];
          if (obj.superProxyProduct) {
            this.adServedObjArray.push(newObjArray);
          }
        });
        this.episodeLoaderr = false;
        this.adServedObjArray = this.adServedObjArray.map(innerArray => [innerArray[0]]);

        this.coordinatesList = this.episodePreviewDetails?.Scenes?.[0]?.ProxyCoordinates;
        for (let i = 0; i < this.coordinatesList?.length; i++) {
          let productDetails = []
          const products = this.coordinatesList[i]?.CoordinateHasProducts;
          for (let j = 0; j < products?.length; j++) {
            const productImages = products[j]?.ProductImage
            const productImageId = productImages?.id
            const image = productImages?.reuploadedImages?.images?.[0]
            const productId = products[j]?.Product.id
            const score = products[j]?.vzotScore
            const retailer = products[j]?.Retailer?.name
            productDetails.push({
              score: score,
              image: image,
              id: productId,
              productImageId: productImageId,
              name: retailer,
              proxyCoordinateId: this.coordinatesList[i].id
            })
          }
          const retailerObject = {
            productDetails: productDetails,
          }
          this.retailerProductImages.push(Object.assign({}, retailerObject))
          this.advertiserFilterProducts.push(Object.assign({}, retailerObject))
          this.adServedObjArray.map(item=>{
            item[0].retailerFilter = [];
            item[0].CoordinateHasProducts.map(item2=>{
              item2.hide = false;
            })
          })
        }
      }
    }, err => {
      this.retailerProductImages = [];
      this.advertiserFilterProducts = [];
    });
  }

  fetchSceneData() {
    this.apiService.sendRequest(getAllScenesOfShow, 'post', {
      pageNo: 1,
      limit: 1,
      showId: this.idForEpisode,
      clickedOnSceneId: this.currentScene != 0 ? this.currentScene : undefined
    }).subscribe((res: any) => {
      this.sceneCount = res?.data?.count
      this.options.ceil = res?.data?.count;
      this.allScenes = res?.data?.rows
      this.currentPage = res.data?.rows?.[0]?.relativeSceneNo;
      this.userService.scene.next(res.data.rows[0])
      if (this.sceneCount == 0) {
        this.toastrService.error('No Video Found');
        this.closeModal()
      }
      this.fetchData(false, false)
    })
  }

  onPlayerReady(initializeMediaAPI: VgApiService): void {
    this.api = initializeMediaAPI;
  }

  playVideo(event): void {
    this.showAdds = false;
    this.isPlaying = true;
    this.episodeLoaderr = false;
    this.adServedObjArray = []
  }

  rewindVideo(): void {
    const rewindSec = 10;
    const video: any = document.getElementById('mediaPlayed');
    video.currentTime -= rewindSec;
  }

  rePlayVideo(): void {
    this.api.play();
    this.isPlaying = true;
    this.api.getDefaultMedia().isCompleted = false;
  }

  forwardVideo(): void {
    const secsToSkip = 10;
    const video: any = document.getElementById('mediaPlayed');
    video.currentTime += secsToSkip;
  }

  NextScene() {

    if (this.sceneCount != this.currentPage)
      this.currentPage++;
    this.endClick$.next();
  }

  PreviousScene() {
    if (this.currentPage != 1)
      this.currentPage--;
    this.endClick$.next();
  }

  toggleSound(action: string) {
    const element = document.getElementById('toggle-animation');
    if (action == 'mute') {
      this.api.volume = 0;
      element.style.transition = 'transform .3s ease-in-out';
    } else {
      this.api.volume = 1;
      element.style.transition = 'transform .3s ease-in-out';
    }
  }

  adjustVolume(newVolume: any): void {
    this.api.volume = newVolume.value;
  }
  areObjectsEqual(obj1, obj2) {
    return obj1.id === obj2.id; // Assuming 'id' is the unique identifier
  }
  filtersArray = [];
  firstTime = true;

  End() {
    const body = {
      showId: this.showId,
      relativeSceneNo: this.currentPage
    }
    this.apiService.sendRequest(requests.getSceneByIdAndTopAds, 'post', body).subscribe((res: any) => {
      this.adServedObjArray = [];
      if (res.data) {
        this.currentScene = res?.data?.id
        this.currentSceneData = res?.data;
        if (this.currentSceneData.ProxyCoordinates) this.currentSceneData.ProxyCoordinates = this.currentSceneData.ProxyCoordinates.filter(obj => obj.CoordinateHasProducts.length > 0);
        const video: any = document.getElementById('videoPlayerId');
        video.currentTime = (res?.data?.startTime / 1000);
        this.userService.scene.next(res.data)
        this.fetchData(true, true)
      }
    })
  }

  adServedObjArray = [];
  async getAdds(pausedTime?: any, retailer?: []): Promise<any> {
    this.showAdds = false
    const body = {
      showId: this.showId,
      pausedAtMilliseconds: this.timePaused,
      approvedOnly: false,
      retailerId: retailer ?? undefined,
    };
    this.apiService.sendRequest(requests.getSceneByIdAndTopAds, 'post', body).subscribe(
      (resp: any) => {
        this.adServedObjArray = [];
        if (resp.data) {
          if (resp.data == null) {
            this.episodeLoaderr = false;
            return;
          }
          if (!resp.data.ProxyCoordinates) {
            resp.data.ProxyCoordinates = []
            this.episodeLoaderr = false;
            this.episodeLoader = false;
          }
          this.currentScene = resp?.data?.id
          this.currentPage = resp?.data?.relativeSceneNo
          this.currentSceneData = resp?.data;
          this.value = resp?.data?.relativeSceneNo;
          this.sceneProductsData = resp?.data
          this.fetchData(true, true)
        }
      },
      (err) => {
        this.sceneProductsData = []
        this.showAdds = false
        this.episodeLoaderr = false;
      },
      () => {
        if (this.sceneProductsData?.length != 0 && this.sceneProductsData != null)
          this.showAdds = true;
      }
    );
  }

  setScreenSize() {
    const element = document.getElementById('wrap-video');
    if (this.media.isActive('lt-sm')) {
      element.style.transform = 'rotate(90deg)';
      element.style.transformOrigin = 'bottom left';
      element.style.width = '100vh';
      element.style.height = '100vw';
      element.style.marginTop = '-100vw';
      element.style.position = 'absolute';
      element.style.zIndex = '4';
      element.style.visibility = 'visible';
      element.style.objectFit = 'cover';
    } else if (this.media.isActive('gt-sm') || this.media.isActive('gt-xs')) {
      element.style.transform = 'none';
      element.style.transformOrigin = 'initial';
      element.style.width = '100%';
      element.style.marginTop = '0';
      element.style.position = 'relative';
      element.style.zIndex = '4';
      element.style.visibility = 'visible';
      element.style.objectFit = 'cover';
    }
  }

  goBackToPrevPage(): void {
    this.location.back();
  }

  closeModal() {
    this.modal.close('Close click')
  }
  update() {
    let arrayOfObjs = []
    for(let x in this.adServedObjArray)
    {
      let products = [];
      for(let y in this.adServedObjArray[x][0].CoordinateHasProducts)
      {
        let temp = this.adServedObjArray[x][0].CoordinateHasProducts[y];
        let obj2= 
        {
          productId:  temp.Product.id ,
          colorId:  temp.Color.id ,
          productImageId:  temp.productImageId ,
          retailerId:  temp.Retailer.id ,
          vzotScore:  temp.vzotScore ,
          superProxy:  temp.superProxy ,
          minimumVzotScore: 0,
          toDisplayAd: true,
          sceneId:  temp.sceneId ,
          showId:  temp.showId ,
          productTag: '',
          matchedImageUrl:  temp.matchedImageUrl 
        }
        products.push(obj2);
      }
      let proxyCoordinateId = this.adServedObjArray[x][0].id;
      let obj = {
        proxyCoordinateId: proxyCoordinateId,
        products: products
      }
      arrayOfObjs.push(obj);
    }
    this.apiService.sendRequest(requests.updateEpPreview, 'post', { payload: arrayOfObjs }).subscribe(data => {
      this.toastrService.success('Updated')
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setProductScrollHeight()
  }

  $advertiserFilter: Subject<any> = new Subject;
  selectedRetailers: any;
  filteredIndex: number;
  alreadySelectedFilterArray = [];
  openModal(index) {
    console.log(index,this.adServedObjArray);
    this.adServedObjArray[index][0].CoordinateHasProducts.map(item=>{
      item.hide = true;
    })
    // this.filteredIndex = index
    const modalRef = this.modalService.open(FilterAdvertisersComponent, {
      windowClass: "modal-lg",
      backdrop: "static",
      keyboard: true,
      centered: true,
    });
    modalRef.componentInstance.alreadySelectedArray = this.adServedObjArray[index][0].retailerFilter// this.alreadySelectedFilterArray;
    modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
      if(receivedEntry)
      {
        console.log(receivedEntry);
        this.adServedObjArray[index][0].retailerFilter = receivedEntry.retailers;
        let retailerIds= [];
        receivedEntry.retailers.map(item=>{
          retailerIds.push(item?.id);
        })
        this.adServedObjArray[index][0].CoordinateHasProducts.map(item=>{
          if(retailerIds.includes(item.retailerId))
          {
            item.hide = false;
          }
        })                
        
      }
    })
  }
  limitadd = 1;
  removeAd(obj: any) {
    console.log(obj);
    if (obj.superProxyProduct) {
      for (let x = 0; x < this.adServedObjArray.length; x++) {
        for (let y = 0; y < this.adServedObjArray[x].length; y++) {
          if (this.adServedObjArray[x][y] == obj) {
            this.adServedObjArray[x].splice(y, 1)
            if (this.adServedObjArray[x].length == 1) {
              let body = {
                limit: 20,
                proxyCoordinateId: this.adServedObjArray[x][0].CoordinateHasProducts ? this.adServedObjArray[x][0].id : this.adServedObjArray[x][0].ProxyCoordinateIdAdded,
                proxyImageUrl: this.adServedObjArray[x][0].CoordinateHasProducts ? this.adServedObjArray[x][0].superProxyProduct.ProductImage.reuploadedImages.images[0] : this.adServedObjArray[x][0].Colors.ProductImage.reuploadedImages.images[0],
                requestForSuperProxy: true,
              }
              this.apiService.sendRequest(requests.requestForProxy, 'post', body).subscribe((data: any) => {
                let obj = data.data.rows.products[data.data.rows.products.length - 1]
                obj.ProxyCoordinateIdAdded = this.adServedObjArray[x][0].CoordinateHasProducts ? this.adServedObjArray[x][0].id : this.adServedObjArray[x][0].ProxyCoordinateIdAdded
                obj.sceneId = this.adServedObjArray[x][0].CoordinateHasProducts ? this.adServedObjArray[x][0].CoordinateHasProducts[0].sceneId : this.adServedObjArray[x][0].sceneId
                obj.showId = this.adServedObjArray[x][0].CoordinateHasProducts ? this.adServedObjArray[x][0].CoordinateHasProducts[0].showId : this.adServedObjArray[x][0].showId
                if (!this.adServedObjArray[x].includes(obj))
                  this.adServedObjArray[x].push(obj)
              })
            }
            return;
          }
        }
      }
    }
    else {
      let body = {
        "proxyCoordinateId": obj.proxyCoordinateId? obj.proxyCoordinateId:obj.id,
        "productId": obj.productId,
      }
      this.apiService.sendRequest(requests.deleteAdGCP, 'post', body).subscribe(data => {
        for(let x in this.adServedObjArray)
        {
          for(let y in this.adServedObjArray[x][0].CoordinateHasProducts)
          {
            if(this.adServedObjArray[x][0].CoordinateHasProducts[y].matchedImageUrl == obj.matchedImageUrl)
            {
              this.adServedObjArray[x][0].CoordinateHasProducts.splice(y,1);
              return;
            }
          }
        }
      })
    }
  }


}
