import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { FilterAdvertisersComponent } from '../filter-advertisers/filter-advertisers.component';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
import { fabric } from 'fabric';
import { SharedService } from 'src/app/core/services/shared.service';
import { Options } from '@angular-slider/ngx-slider';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';
import { TaggerService } from '../../tagger/tagger.service';
import { ChatGptModalComponent } from '../../tagger/chat-gpt-modal/chat-gpt-modal.component';
import { AdAddToCardModalComponent } from 'src/app/shared/ad-add-to-card-modal/ad-add-to-card-modal.component';
import { addTag, eliminateGcpProducts, getAllScenesOfShow, getColors, getGenders, getKeywords } from 'src/app/core/constants';

@Component({
  selector: 'app-product-record-modal',
  templateUrl: './product-record-modal.component.html',
  styleUrls: ['./product-record-modal.component.scss']
})
export class ProductRecordModalComponent implements OnInit,AfterViewInit, OnDestroy {
  selectedScreen = 1;
  isClipOn = true;
  inputEmbedding = [];
  sceneProductsData: any;
  sceneImgURL: string;
  updatedProductsRetailer: string;
  objArray: any;
  proxyImagesList = [];
  productImages = [];
  retailerProductImages = [];
  retailerArray: any = [];
  advertiserFilterProducts: any = []
  selectedRetailers: any = []
  actors = [];
  scenesCoordinateList = [];
  actorsPagination: { pageNo: number, limit: number, offset?: number } = { pageNo: 1, limit: 1000 }
  totalActorsCount = 0;
  fetchedActorsCount = 0;
  sceneId: any;
  allScenes = [];
  showId: any;
  assignedActor: any;
  productProxyData: any;
  superProxyId: number;
  superProxyName: string;
  advertiserId: number;
  actorProxyId = -1;
  xCordinates: number;
  yCordinates: number;
  cordinateX: number;
  cordinateY: number;
  actorId: number;
  tagNames: string = "";
  gcpFilterString: string = "";
  productBody = [];
  historyProducts = []
  historyActorId: any
  tagIds = [];
  tagSummary: any;
  minimumVzotScore;
  proxyCordinateId: number
  superProxyCount = 0
  ctx: any;
  canvas: any;
  canvasMade = false;
  constructCanvasVar = false;
  currX = 0;
  currY = 0;
  flag = false;
  selectedColor: null;
  selectedCategory: null;
  selectedGender: null;
  showProductTagInfo: boolean = false
  dot_flag = false;
  coordinateColor: any
  canvasHeight: any;
  canvasWidth: any;
  coordinateObseravable
  sceneThumbnailObservable
  xCoordinateObservable
  yCoordinateObservable
  isTagAddedObservable
  currentPage = 1;
  screenObservable
  idForImage: number
  superProxyImage: string = undefined;
  $advertiserFilter: Subject<any> = new Subject;
  fetch_actors: boolean = false;
  isActorsRecognized: boolean = false;
  replaceModalReference: any
  submitRecordModal: boolean = false;
  isTagButtonDisabled: boolean = false
  totalColorsCount = 0;
  totalScenesCount = 0;
  fetchedColorsCount = 0
  colors = []
  categories = []
  colorsPagination: { pageNo: number, limit: number, offset?: number } = { pageNo: 1, limit: 100 }
  totalGendersCount = 0;
  fetchedGendersCount = 0;
  attributeText = '';
  genders = []
  gendersPagination: { pageNo: number, limit: number, offset?: number } = { pageNo: 1, limit: 100 }
  isDisabled = false;
  steps = [
    {
      step: 1,
      start: 0,
      active: true,
      text: 'Lock-In Super-Proxy',
      icon: false,
    },
    {
      step: 2,
      start: 50,
      active: false,
      text: 'Assign an Actor',
      icon: false
    },
    {
      step: 3,
      start: 100,
      active: false,
      text: 'Audit Ad Queue',
      icon: false
    },
    {
      step: 4,
      start: 100,
      active: false,
      text: 'Batch Shots',
      icon: false
    }
  ];

  proxyImageUrl;
  value = [];
  options: Options = {
    floor: 0,
    ceil: 100
  };
  tags = []
  droppedImage = null;
  imageFromApi: string;
  submitButton: string = 'Next';
  // @HostListener('window:scroll', ['$event'])
  // onScroll(event: Event): void {
  //   console.log("Onscroll");

  //   // Check if the user has scrolled to the bottom
  //   if (this.isScrolledToBottom()) {
  //     // Load the next page
  //     this.loadNextPage();
  //   }
  // }
  private isScrolledToBottom(element: HTMLElement): boolean {
    console.log("isScrolledToBottom");
    const windowHeight = element.clientHeight;
    const scrollY = element.scrollTop;
    const contentHeight = element.scrollHeight;

    return windowHeight + scrollY >= contentHeight;
  }

  private loadNextPage(): void {
    console.log("loadNext");
    this.currentPage++;
    this.getScenes(this.currentPage);
  }
  constructor(
    private el: ElementRef,
    public modalService: NgbModal,
    public modal: NgbActiveModal,
    private apiService: ApiService,
    private sharedService: SharedService,
    public ngxService: NgxUiLoaderService,
    private toastrService: ToastrService,
    private taggerService: TaggerService
  ) {
    // console.log('');
  }
  ngAfterViewInit(): void {
    const scrollableDiv = this.el.nativeElement.querySelector('.modal-body.pr-modal-body');
    // Listen for the scroll event on the div
    scrollableDiv.addEventListener('scroll', (event) => {
      console.log('Scrolled inside the div');
      // Check if the user has scrolled to the bottom
      if (this.isScrolledToBottom(scrollableDiv) && (this.allScenes.length !== this.totalScenesCount) ) {
        // Load the next page
        this.loadNextPage();
      }
    });
  }
  ngOnInit(): void {
    this.isTagAddedObservable = this.sharedService.isTagAdded.subscribe((data) => {
      if (data)
        this.fetchLockSuperProxyData();
    })
    this.getColors();
    this.getCategories();
    this.getGenders();
    this.fetchShowId();
    this.fetchSceneId();
    this.fetchSceneImage();
    this.fetchScreen();
    this.fetchLockSuperProxyData();
    this.constructCanvas();
  }

  // LockSuperProxyProduct() {
  //   this.productImages[0].productDetails[0].superProxy = true;
  //   this.superProxyImage = this.productImages[0]?.productDetails[0]?.image;
  //   this.superProxyId = this.productImages[0]?.productDetails[0]?.productImageId;
  //   this.advertiserId = this.productImages[0]?.productDetails[0]?.retailerId;
  //   let imagesArray = [];
  //   this.productImages?.forEach((product) => {
  //     product.productDetails?.forEach((item) => {
  //       const body = {
  //         productId: item.id,
  //         retailerId: item?.retailerId,
  //         vzotScore: item?.score,
  //         productTag: this.tagNames,
  //         superProxy: item?.superProxy,
  //         colorId: item?.colorId,
  //         productImageId: item?.productImageId
  //       }
  //       imagesArray.push(body)
  //     })
  //   })
  //   this.productBody = [...imagesArray]
  //   this.submitModal()
  // }

  scaleRatio;
  constructCanvas() {
    this.canvasMade = true;
    this.constructCanvasVar = true
    setTimeout(() => {
      let img = new Image();
      if (!this.canvas) {
        this.canvas = new fabric.Canvas('proxyCanvas');
      }
      this.canvas.height = document.getElementById('superProxyCanvas').clientHeight
      this.canvas.width = document.getElementById('superProxyCanvas').clientWidth;
      // console.log(this.canvas.height,this.canvas.width);
      this.ctx = this.canvas.getContext('2d');
      var self = this
      img.onload = function () {
        self.scaleRatio = Math.min((self.canvas?.width / img?.width), (self.canvas?.height / img?.height))
        if(img)
        {
          img.width = self.canvas?.width
          img.height = self.canvas?.height
        }
        self.canvas?.setDimensions({ width: self.canvas?.width, height: self.canvas?.height });
        var fabricImage = new fabric.Image(img);
        fabricImage.set({
          scaleX: self.scaleRatio,
          scaleY: self.scaleRatio,
        });
        self.canvas?.setBackgroundImage(fabricImage)?.renderAll()
        self.canvas?.backgroundImage.center()
        self.canvas?.renderAll()
      };
      img.src = self.sceneImgURL
      // console.log(self.sceneImgURL);


      setTimeout(() => {
        this.translateProductCoorOntoCanvas()
      }, 1000)
    }, 2000);
  }

  fetchSceneImage() {
    this.sceneThumbnailObservable = this.sharedService.sceneThumbnail.subscribe((res: any) => {
      if (res != null) this.sceneImgURL = res;
    });
  }
  fetchDroppedImage() {
    if (this.sharedService.droppedImageUrl) {
      this.droppedImage = this.sharedService.droppedImageUrl;
    }
    else {
      this.droppedImage = this.sharedService.imgUrl;
    }

    this.xCoordinateObservable = this.sharedService.cordinateX.subscribe((res: any) => {
      this.xCordinates = res;
      // console.log(this.xCordinates)
    });

    this.yCoordinateObservable = this.sharedService.cordinateY.subscribe((res: any) => {
      this.yCordinates = res;
      // console.log(this.yCordinates)
    });

    // this.fetchLockSuperProxyData();
  }
  getProductByProxyMethod(filter?: any) {
    this.ngxService.startLoader("loader-02");
    this.productImages = [];
    this.gcpFilterString = undefined;
    const gender = this.genders.find(g => g.id == this.selectedGender);
    const color = this.colors.find(c => c.id == this.selectedColor);
    const category = this.categories.find(c => c.id == this.selectedCategory);
    const tagArray = this.tags.map((tag) => {
      return tag.name
    })
    const tagWeights = this.tags.map((tag) => {
      return tag.weight
    })

    let filters = [];
    if (color ) {
      filters.push((this.isClipOn?'primary_color=':'color=') + color.name);
    }
    if (gender) {
      filters.push('gender=' + gender.name);
    }
    if (category) {
      filters.push('category=' + category.name);
    }

    this.gcpFilterString = filters.join(",");
    const body = {
      limit: 100,
      proxyImageUrl: this.imageFromApi,
      // proxyImageUrl: this.superProxyImage ?? this.imageFromApi,
      requestForSuperProxy: true,
      gcpFilter: this.gcpFilterString == "" ? undefined : this.gcpFilterString,
      databaseFilters: tagArray?.length !== 0 ? tagArray : undefined,
      tagWeights: tagWeights?.length !== 0 ? tagWeights : undefined,
      // gcpFilter: "retailer=Zappos"
      proxyCoordinateId: this.proxyCordinateId,

    };
    this.apiService.sendRequest(this.isClipOn ? requests.getProductsByImageEmbedding : requests.getProductByProxy, 'post', body).subscribe((res: any) => {
      if (res.data.length != 0) {
        const products = res?.data?.rows?.products;
        for (let j = 0; j < products.length; j++) {
          const retailerId = products[j].retailerId;
          const productId = products[j].id;
          const colorId = products[j]?.Colors?.id
          const productImages = products[j]?.Colors.ProductImage;
          const productImageId = productImages?.id;
          const score = products[j]?.vzotScore;
          const title = products[j]?.title;
          const retailerName = products[j]?.Retailer?.name
          const description = products[j]?.description;
          const gender = products[j]?.Gender?.name;
          const color = products[j]?.Colors?.name;
          const brand = products[j]?.Brand.name;
          // const image = productImages.reuploadedImages.images[0];
          const id = products[j].id;
          const matchedId = products[j]?.matchedImageUrl;
          this.proxyImagesList.push({
            score: Math.round(score),
            // image: image,
            id: id,
            retailerId: retailerId,
            productTag: this.tagNames,
            sceneId: this.sceneId,
            superProxy: productImageId == this.superProxyId ? true : false,
            colorId: colorId,
            productImageId: productImageId,
            title: title,
            retailerName: retailerName,
            description: description,
            matchedImageUrl: matchedId,
            gender: gender,
            color: color,
            brand: brand
          });
          this.productBody.push({
            productId: productId,
            retailerId: retailerId,
            vzotScore: score,
            productTag: this.tagNames,
            superProxy: productImageId == this.superProxyId ? true : false,
            colorId: colorId,
            productImageId: productImageId,
            matchedImageUrl: matchedId

          });
          this.historyProducts.push({
            productId: productId,
            retailerId: retailerId,
            vzotScore: score,
            productTag: this.tagNames,
            superProxy: productImageId == this.superProxyId ? true : false,
            colorId: colorId,
            productImageId: productImageId,
            matchedImageUrl: matchedId

          });
        }
      }
      this.proxyImageUrl = this.droppedImage;
      this.droppedImage = null;
      this.sharedService.droppedImageUrl = null;
      this.ngxService.stopLoader("loader-02");
      // this.sharedService.droppedSuperProxyImage.subscribe((data) => {
      //   if (data)
      //     this.LockSuperProxyProduct();
      // })
    }, (error: any) => {
      this.ngxService.stopLoader("loader-02");
      this.toastrService.error("No Product Found", "Error!");
    });
  }

  showRow(pr: any) {
    for (let x in pr) {
      if (pr[x].toDisplayAd == true) {
        return true;
      }
    }
    return false;
  }
  genderName = '';
  onGenderChange(id) {
    const gender = this.genders.find(g => g.id == id)
    if (gender) {
      this.selectedGender = gender?.id
      this.genderName = gender?.name
    }
  }
  countttt = 0;
  async getOptimizeAdsProducts(filter?: any, loader = true) {
    if (loader === true)
      this.ngxService.startLoader("loader-02");
    if (!filter) {
      this.fetchDroppedImage();
      this.retailerProductImages = [];
      this.productImages = [];
    }
    this.gcpFilterString = undefined;
    const gender = this.genders.find(g => g.id == this.selectedGender);
    const color = this.colors.find(c => c.id == this.selectedColor);
    const category = this.categories.find(c => c.id == this.selectedCategory);
    const tagArray = this.tags.map((tag) => {
      return tag.name
    })
    const tagWeights = this.tags.map((tag) => {
      return tag.weight
    })

    let filters = [];
    if (color) {
      filters.push('primary_color=' + color.name);
    }
    if (gender) {
      filters.push('gender=' + gender.name);
    }
    if (category) {
      filters.push('category=' + category.name);
    }

    this.gcpFilterString = filters.join(",");
    const body = {
      proxyCoordinateId: this.proxyCordinateId,
      limit: 100,
      proxyImageUrl: this.superProxyImage ?? this.imageFromApi,
      databaseFilters: tagArray?.length !== 0 ? tagArray : undefined,
      color: color ? color?.name : undefined,
      gcpFilter: this.gcpFilterString == "" ? undefined : this.gcpFilterString,
      requestForSuperProxy: this.selectedScreen == 1 ? true : false,
      tagWeights: tagWeights?.length !== 0 ? tagWeights : undefined,
    };

    await this.apiService.sendRequest(this.isClipOn ? requests.getProductsByImageEmbedding : requests.getProductByProxy, 'post', filter ? filter : body).subscribe(async (res: any) => {
      this.productProxyData = res?.data.rows;
      this.countttt = res?.data?.count;
      let retailerNames;
      let retailerIds = [];
      if (this.productProxyData)
        retailerNames = Object.keys(this.productProxyData);
      this.proxyImagesList = [];
      this.productBody = [];
      for (let i = 0; i < retailerNames?.length; i++) {
        let retailerId;
        const products = this.productProxyData[retailerNames[i]];
        products.length > 0 && retailerIds.push(products[0].retailerId);
        const productDetails = [];
        let minValue = 0;
        for (let j = 0; j < products.length; j++) {
          minValue = products[j].Retailer?.vzotThreshold;
          let retailerId = products[j].retailerId;
          const productId = products[j].id;
          const colorId = products[j]?.Colors?.id
          const productImages = products[j]?.Colors.ProductImage;
          const productImageId = productImages?.id;
          const score = products[j]?.vzotScore;
          const title = products[j]?.title;
          const retailerName = products[j]?.Retailer?.name
          const description = products[j]?.description;
          // const image = productImages.reuploadedImages.images[0];
          const id = products[j].id;
          const retailerImage = products[j]?.Retailer?.imageUrl
          const matchedId = products[j]?.matchedImageUrl
          const gender = products[j]?.Gender?.name;
          const color = products[j]?.Colors?.name;
          const brand = products[j]?.Brand?.name;
          productDetails.push({
            minimumVzotScore: minValue?minValue:0,
            score: Math.round(score),
            // image: image,
            id: id,
            sceneId: this.sceneId,
            superProxy: productImageId == this.superProxyId ? true : false,
            colorId: colorId,
            productImageId: productImageId,
            toDisplayAd: true,
            retailerImage: retailerImage,
            retailerId: retailerId,
            title: title,
            retailerName: retailerName,
            description: description,
            matchedImageUrl: matchedId,
            gender,
            color,
            brand
          });
          this.proxyImagesList.push({
            score: Math.round(score),
            // image: image,
            id: id,
            retailerId: retailerId,
            productTag: this.tagNames,
            sceneId: this.sceneId,
            superProxy: productImageId == this.superProxyId ? true : false,
            colorId: colorId,
            productImageId: productImageId,
            title: title,
            retailerName: retailerName,
            description: description,
            matchedImageUrl: matchedId,
            gender: gender,
            color: color,
            brand: brand
          });
          this.productBody.push({
            minimumVzotScore: minValue?minValue:0,
            productId: productId,
            retailerId: retailerId,
            vzotScore: score,
            productTag: this.tagNames,
            superProxy: productImageId == this.superProxyId ? true : false,
            colorId: colorId,
            productImageId: productImageId,
            matchedImageUrl: matchedId

          });
          this.historyProducts.push({
            productId: productId,
            retailerId: retailerId,
            vzotScore: score,
            productTag: this.tagNames,
            superProxy: productImageId == this.superProxyId ? true : false,
            colorId: colorId,
            productImageId: productImageId
          });
          // retailerIds.push(retailerId)
        }
        const retailerObject = {
          id: retailerIds[i],
          name: retailerNames[i],
          minimumVzotScore: 0,
          productDetails: productDetails.slice()
        };

        if (!filter) {
          const productImageObject = {
            id: retailerId,
            name: retailerNames[i],
            productDetails: productDetails.slice()
          };
          this.productImages.push(productImageObject);
        }

        if (!filter) {
          // if (retailerObject.productDetails.length !== 0) {
          //   minValue = Math.min(...retailerObject.productDetails.map(o => o.score))
          // }
          retailerObject.minimumVzotScore = 0;
          if(!minValue) minValue = 0;
          this.value.push(minValue)
          // this.value.push(retailerObject.minimumVzotScore)
          this.retailerProductImages.push(retailerObject);
          this.retailerArray.push(retailerObject);
        }
        else {
          //Finding index of specific object.
          const objIndex = this.advertiserFilterProducts.findIndex((obj => obj.name == this.updatedProductsRetailer));

          if (i == objIndex) {
            //Updating object's property.
            this.advertiserFilterProducts[objIndex] = retailerObject
          }
        }
      }
      if (!filter)
        this.advertiserFilterProducts = this.retailerProductImages;
      if (this.selectedRetailers.length !== 0) {
        this.retailerProductImages = [];
        this.filteredRows = [];
        for (const retailer of this.advertiserFilterProducts) {
          for (const advertiser of this.selectedRetailers) {
            if (retailer.name == advertiser) {
              this.retailerProductImages.push(retailer)
            }
          }
        }
        this.filteredRows = this.retailerProductImages;
        // this.advertiserFilterProducts.forEach(retailer => {
        //   this.selectedRetailers.forEach(advertiser => {
        //     if (retailer.name == advertiser) {
        //       this.retailerProductImages.push(retailer)
        //     }
        //   });
        // });
      }
      // if (this.submitRecordModal) {
      //   await this.submitModal()
      // }
      this.ngxService.stopLoader("loader-02");
    }, (error: any) => {
      this.ngxService.stopLoader("loader-02");
      this.toastrService.error("No Product Found", "Error!");
    });
  }
  filteredRows = [];

  openAddToCartModal(product) {
    const activeModal = this.modalService.open(AdAddToCardModalComponent, {
      animation: true,
      windowClass: "modal-xl",
      size: 'lg',
      backdrop: "static",
      keyboard: true,
      centered: true,
    })

    activeModal.componentInstance.id = product?.id;
    activeModal.componentInstance.productImageId = product?.productImageId;
    activeModal.componentInstance.proxyCoordinateId = this.proxyCordinateId//product?.CoordinateHasProducts[0]?.ProxyCoordinateIdAdded?product?.CoordinateHasProducts[0]?.ProxyCoordinateIdAdded:product?.CoordinateHasProducts[0]?.proxyCoordinateId
    activeModal.componentInstance.retailerId = product?.retailerId
    activeModal.componentInstance.showId = this.showId//product?.CoordinateHasProducts[0]?.showId
    activeModal.componentInstance.sceneId = this.sceneId//product?.CoordinateHasProducts[0]?.sceneId
    activeModal.componentInstance.retailerName = product?.retailerName//product?.CoordinateHasProducts[0]?.Retailer?.name
  }

  greaterThan(subj: number, num: number) {
    // console.log("🚀 ~ file: product-record-modal.component.ts:316 ~ ProductRecordModalComponent ~ greaterThan ~ num:", num)
    // console.log("🚀 ~ file: product-record-modal.component.ts:316 ~ ProductRecordModalComponent ~ greaterThan ~ subj:", subj)
    return subj < num;
  }

  vzotChange(index: number) {
    this.minimumVzotScore = this.value[index];
    // for (let i = 0; i < this.retailerProductImages?.length; i++) {
    this.retailerProductImages[index].minimumVzotScore = this.value[index];
    // }
  }

  retaileridsend = '';
  superrr: any = undefined;
  ChangeVzotScore(product: any) {
    this.gcpFilterString = undefined;
    const gender = this.genders.find(g => g.id == this.selectedGender);
    const color = this.colors.find(c => c.id == this.selectedColor);
    const category = this.categories.find(c => c.id == this.selectedCategory);
    const tagArray = this.tags.map((tag) => {
      return tag.name
    })
    const tagWeights = this.tags.map((tag) => {
      return tag.weight
    })

    let filters = [];
    if (color) {
      filters.push('primary_color=' + color.name);
    }
    if (gender) {
      filters.push('gender=' + gender.name);
    }
    if (category) {
      filters.push('category=' + category.name);
    }

    this.gcpFilterString = filters.join(",");
    let minScore;
    let nameRetailer;
    let superProxy;
    let retailerId;
    let retailerImage;
    for (let x in this.retailerProductImages) {
      if (this.retailerProductImages[x].name === product.name) {
        this.retailerProductImages[x].filter = true;
        minScore = this.retailerProductImages[x].minimumVzotScore;
        nameRetailer = this.retailerProductImages[x].name;
        retailerId = this.retailerProductImages[x].id;
        if (this.retailerProductImages[x]?.productDetails.length > 0) {
          retailerImage = this.retailerProductImages[x]?.productDetails[0].retailerImage;
        }
        else {
          retailerImage = this.retailerProductImages[x]?.retailerImage;
        }
      }
    }
    for (let x in this.retailerProductImages) {
      for (let y in this.retailerProductImages[x].productDetails) {
        if (this.retailerProductImages[x].productDetails[y]?.superProxy) {
          superProxy = this.retailerProductImages[x].productDetails[y];
          if (!this.superrr) this.superrr = superProxy;
        }
      }
    }
    for (let x in this.retailerProductImages) {
      if (this.retailerProductImages[x]?.productDetails?.length > 0) {
        this.retailerProductImages[x].retailerImage = this.retailerProductImages[x].productDetails[0].retailerImage;
      }
      // for(let y in this.retailerProductImages[x].productDetails)
      // {
      // }
    }
    // for(let x in this.retailerProductImages)
    // {
    //   delete this.retailerProductImages[x].id;
    // }
    const boddy = {
      payloadForFilteredProducts: {
        products: this.retailerProductImages,
        originalProductCount: this.countttt,
        superProxyProduct: superProxy ? superProxy : this.superrr,
        sceneId: this.sceneId,
        nameOfRetailerToFilter: nameRetailer,
        // retailerImage: retailerImage
      },
      gcpFilter: 'retailerId=' + retailerId,
      minimumVzotScore: minScore,
      databaseFilters: tagArray?.length !== 0 ? tagArray : undefined,
      limit: 100,
      proxyImageUrl: this.superProxyImage ?? this.imageFromApi,
      tagWeights: tagWeights?.length !== 0 ? tagWeights : undefined,
    }
    if(!boddy?.payloadForFilteredProducts?.superProxyProduct)
    {
      boddy.payloadForFilteredProducts.superProxyProduct = this.superProxyProduct
    }
    console.log(boddy);

    console.log(this.retailerProductImages);
    this.apiService.sendRequest(requests.getProductByProxy, 'post', boddy).subscribe((data:any)=>{
      console.log(data);
      this.countttt = data.data.count;
      this.retailerProductImages = data.data.rows;
      for (let x in this.retailerProductImages) {
        for (let y in this.retailerProductImages[x]?.productDetails) {
          this.retailerProductImages[x].productDetails[y].score = Math.round(this.retailerProductImages[x]?.productDetails[y]?.score);
        }
      }
    })
    return;
  }
  sad(item: any) {
    console.log(item);
   }
  yellowScoreIndicator(item: any,detail:any)
  {
    let products = item?.productDetails;
    for(let x=0;x<products.length;x++)
    {
      if(products[x].toDisplayAd == true)
      {
        if(products[x]==detail)
        {
          return true;
        }
        else
        {
          return false;
        }
      }
    }
    return false;
  }
  setRetailerProductImagesAfterFilter(retailerProductImage: any) {
    const colorId = retailerProductImage?.Colors?.id;
    const toDisplayAd = true;
    const productImageId = retailerProductImage?.Colors?.ProductImage?.id;
    const retailerImage = retailerProductImage?.Retailer?.imageUrl;
    const retailerName = retailerProductImage?.Retailer?.name;
    const sceneId = this.sceneId;
    const score = retailerProductImage?.vzotScore;
    const superProxy = false;
    retailerProductImage.colorId = colorId;
    retailerProductImage.toDisplayAd = toDisplayAd;
    retailerProductImage.productImageId = productImageId;
    retailerProductImage.retailerName = retailerName;
    retailerProductImage.retailerImage = retailerImage;
    retailerProductImage.sceneId = sceneId;
    retailerProductImage.score = score;
    retailerProductImage.superProxy = superProxy;
    return retailerProductImage;
  }
  transformData(rows: any): any[] {
    return Object.keys(rows).map((name) => {
      return {
        name,
        pdetails: rows[name] || [],
      };
    });
  }
  eliminateProduct(product: any, index: number) {
    const productIndex = this.retailerProductImages[index]?.productDetails?.findIndex(p => p.id == product?.id)
    if (productIndex != undefined) {
      this.retailerProductImages[index].productDetails[productIndex].toDisplayAd = false
      if (this.superProxyProduct?.productId == this.retailerProductImages[index].productDetails[productIndex].id) {
        this.superProxyProduct.toDisplayAd = false;
      }
      this.eliminatedProducts.push(product)
      this.apiService.sendRequest(eliminateGcpProducts, 'post', {
        proxyCoordinateId: this.proxyCordinateId,
        productId: product?.id
      }).subscribe((res: any) =>
        res?.data.row && console.log(res)
      )
    }
    // const productBodyIndex = this.productBody.findIndex(p => p.productId == product?.id)
    // this.productBody[productBodyIndex].toDisplayAd = false;
  }

  removeProxyProduct(product: any) {
    let body = null;
    if (product.id) {
      body = {
        coordinateId: product.id
      };
    } else {
      body = {
        yCoordinate: product.yCoordinate,
        xCoordinate: product.xCoordinate,
        sceneId: product.sceneId
      };
    }
    this.retailerProductImages = this.retailerProductImages.filter((item) => {
      return item.id != product.id;
    });
    let products = [];
    if (this.selectedScreen == 3) {
      products = this.retailerProductImages;
    } else if (this.selectedScreen == 1) {
      products = this.productImages;
    }
    for (let i = 0; i < products.length; i++) {
      products[i].productDetails = products[i].productDetails.filter((item) => {
        return item.id !== product.id;
      });
    }
    // this.fetchLockSuperProxyData()

  }

  openAIModal() {
    const data = {
      isAddAttribute: true,
      fromTagSummary: false,
      id: this.proxyCordinateId,
      tagIds: this.tagIds
    }
    this.sharedService.isAddAttributeCall.next(data)
    const modalRef = this.modalService.open(ChatGptModalComponent, {
      windowClass: "modal-xl",
      backdrop: "static",
      size: 'lg',
      keyboard: true,
      centered: false,
    });
  }

  // async lock(productId: number, proxyCoordinateId: number, retailerId: number) {
  //   let products = [];
  //   if (this.selectedScreen == 1) {
  //     products = this.productImages;
  //   } else {
  //     products = this.retailerProductImages;
  //   }

  //   const index = products.findIndex((object) => {
  //     return object.id === retailerId;
  //   });

  //   let productIndex = 0;
  //   if (index !== -1) {
  //     productIndex = products[index].productDetails.findIndex((object) => {
  //       return object?.productImageId === productId;
  //     });
  //   }

  //   const previousIndex = products.findIndex((object) => {
  //     return object.id === this.advertiserId;
  //   });

  //   let previousProductIndex = 0;
  //   if (index !== -1) {
  //     previousProductIndex = products[previousIndex].productDetails.findIndex((object) => {
  //       return object?.productImageId === this.superProxyId;
  //     });
  //   }

  //   if (productIndex !== -1) {
  //     if (this.selectedScreen == 1) {
  //       if (this.productImages[index].productDetails[productIndex].superProxy) {
  //         this.productImages[index].productDetails[productIndex].superProxy = false;
  //         // this.productBody[productIndex].superProxy = this.productImages[index].productDetails[productIndex].superProxy;
  //       }
  //       else if (!this.productImages[index].productDetails[productIndex].superProxy) {
  //         if ((previousIndex !== -1 && previousProductIndex !== -1) && this.productImages[index]?.productDetails[productIndex] !==
  //           this.productImages[previousIndex]?.productDetails[previousProductIndex]) {
  //           this.productImages[previousIndex].productDetails[previousProductIndex].superProxy = false;
  //           // this.productBody[previousProductIndex].superProxy = this.productImages[previousIndex].productDetails[previousProductIndex].superProxy;
  //         }
  //         this.productImages[index].productDetails[productIndex].superProxy = true;
  //         this.superProxyImage = this.productImages[index].productDetails[productIndex].image;
  //         // this.productBody[productIndex].superProxy = this.productImages[index].productDetails[productIndex].superProxy;
  //         this.superProxyId = this.productImages[index].productDetails[productIndex].productImageId;
  //         this.advertiserId = this.productImages[index].productDetails[productIndex].retailerId;
  //       }

  //     } else {
  //       if (this.retailerProductImages[index].productDetails[productIndex].superProxy) {
  //         this.retailerProductImages[index].productDetails[productIndex].superProxy = false;
  //         // this.productBody[productIndex].superProxy = this.retailerProductImages[index].productDetails[productIndex].superProxy;
  //         this.superProxyCount--
  //       }
  //       else if (this.superProxyCount == 0 && !this.retailerProductImages[index].productDetails[productIndex].superProxy) {
  //         this.retailerProductImages[index].productDetails[productIndex].superProxy = true;
  //         // this.productBody[productIndex].superProxy = this.retailerProductImages[index].productDetails[productIndex].superProxy;
  //         this.superProxyCount++
  //       }
  //     }
  //     let imagesArray = [];
  //     this.productImages?.forEach((product) => {
  //       product.productDetails?.forEach((item) => {
  //         const body = {
  //           productId: item.id,
  //           retailerId: item?.retailerId,
  //           vzotScore: item?.score,
  //           productTag: this.tagNames,
  //           superProxy: item?.superProxy,
  //           colorId: item?.colorId,
  //           productImageId: item?.productImageId
  //         }
  //         imagesArray.push(body)
  //       })
  //     })
  //     this.productBody = [...imagesArray]
  //     //this.submitRecordModal = true;
  //     // await this.getOptimizeAdsProducts()
  //     this.submitModal()
  //   }
  //   this.replaceModalReference.close();
  // }

  superProxyProduct = null;

  async lock(productId: number, proxyCoordinateId: number, retailerId: number) {
    let product = this.proxyImagesList.find(p => p.productImageId == productId)
    let index = this.proxyImagesList.findIndex(p => p.productImageId == productId)
    let previousSuperProxyIndex = null;
    if (product != undefined && index != undefined) {
      previousSuperProxyIndex = this.proxyImagesList.findIndex(p => p.superProxy == true);
      if (previousSuperProxyIndex != -1)
        this.proxyImagesList[previousSuperProxyIndex].superProxy = false;
      this.proxyImagesList[index].superProxy = true;
      this.superProxyImage = this.proxyImagesList[index].matchedImageUrl;
      this.superProxyId = product?.productImageId
      this.superProxyName = product?.retailerName
      const productData = {
        productId: product?.id,
        retailerId: product?.retailerId,
        vzotScore: product?.score,
        productTag: product?.productTag,
        superProxy: product?.superProxy,
        colorId: product?.colorId,
        productImageId: product?.productImageId,
        matchedImageUrl: product?.matchedImageUrl,
      }
      this.superProxyProduct = Object.assign(productData);
      const body = {
        id: this.idForImage,
        sceneId: this.sceneId,
        showId: this.showId,
        proxyImageUrl: this.imageFromApi,
        coordinates: {
          x: this.cordinateX,
          y: this.cordinateY,
        },
        canvasHeight: +this.canvasHeight,
        canvasWidth: +this.canvasWidth,
        actorId: this.actorId,
        products: [productData],
        tagIds: this.tagIds
      }
      this.apiService.sendRequest(requests.tagProductInScene, 'post', body).subscribe((res: any) => {
        this.replaceModalReference?.close({ isClipOn: this.isClipOn });
      });
    }
  }

  updateActorStatus(actorId: number) {
    if (actorId !== null)
      this.assignedActor = this.actors.find((a) => a.id === actorId);
    else
      this.assignedActor = null
    this.actorId = actorId;
    // this.submitModal()
  }
  productData = {}

  hideAttributeSection($event) {
    this.showProductTagInfo = false;
  }

  getAttributesData(product) {
    this.isDisabled = true;
    this.apiService.sendRequest(getKeywords, 'post', { query: `${product?.title} ${product?.brand} ${product?.color} ${product?.description}` })
      .subscribe((res: any) => {
        this.showProductTagInfo = true;
        this.isDisabled = false;
        product.attributes = res.keywords;
        this.productData = Object.assign(product)
        //console.log(this.productData)
      },
        (error) => {
          // console.log("🚀 ~ file: product-record-modal.component.ts:617 ~ ProductRecordModalComponent ~ getAttributesData ~ error:", error)
        })
  }

  getColors() {
    if (this.totalColorsCount != this.fetchedColorsCount || this.totalColorsCount == 0) {
      this.apiService.sendRequest(getColors, 'post', this.colorsPagination).subscribe(async (res: any) => {
        this.totalColorsCount = await res?.data?.count
        if (res?.data?.rows != 0)
          this.colors = this.colors?.concat(res?.data?.rows)
      })
    }
  }
  getCategories() {
    this.apiService.sendRequest(requests.getCategories, 'get').subscribe(async (res: any) => {
      if (res?.data?.rows != 0)
        this.categories = res?.data?.rows
    });
  }

  getGenders() {
    if (this.totalGendersCount != this.fetchedGendersCount || this.totalGendersCount == 0) {
      this.apiService.sendRequest(getGenders, 'post', this.gendersPagination).subscribe(async (res: any) => {
        this.totalGendersCount = await res?.data?.count
        if (res?.data?.rows != 0)
          this.genders = this.genders?.concat(res?.data?.rows)
      })
    }
  }

  onColorsScrollEnd(e) {
    this.colorsPagination.pageNo++
    this.getColors()
  }

  onGendersScrollEnd(e) {
    this.gendersPagination.pageNo++
    this.getGenders()
  }

  addTag(tag) {
    if (tag?.trim == '')
      return;
    this.isTagButtonDisabled = true
    const data = [{
      name: tag,
      isHelper: 1,
      parentTagId: null,
      weight: 0.2,
      isTuner: false,
    }]
    this.apiService.sendRequest(addTag, 'post', data).subscribe((data: any) => {
      this.tags.push(data?.data?.[0])
      this.tagIds.push(data?.data?.[0].id)
      this.attributeText = ''
      this.isTagButtonDisabled = false
      this.getOptimizeAdsProducts('', false);
    },
      (err) => {
        // console.log(err)
        this.attributeText = ''
        this.isTagButtonDisabled = false
      }
    )
  }

  onTagChange(event: any, id) {
    const body = {
      id,
      weight: event.target.value
    }
    this.apiService.sendRequest(requests.updateTag, 'post', body).subscribe((data: any) => {
      this.getOptimizeAdsProducts('', false);
    });
  }

  fetchScreen() {
    this.screenObservable = this.sharedService.screen.subscribe((res) => {
      this.selectedScreen = res;
      this.fetchCoordinateId();
      this.fetchSceneImage();
      if (this.selectedScreen == 3) {
        if (!this.fetch_actors) {
          this.fetchShowId();
          this.fetchActors();
        }
        this.steps[0].active = false;
        this.steps[0].icon = true;
        this.steps[1].active = false;
        this.steps[1].icon = true
        this.steps[2].active = true;
      }
    });
  }

  onAttributeDelete(attribute) {
    const finalAttributeList = this.tags?.filter((attr) => attr.id !== attribute?.id)
    const attributeIds = this.tagIds?.filter((id) => id !== attribute?.id)
    this.tags = [...finalAttributeList]
    this.tagIds = [...attributeIds]
    const data = {
      id: this.idForImage,
      tagIds: this.tagIds
    }
    this.apiService.sendRequest(requests.updateTagProductInScene, 'post', data).subscribe(res => {
      this.getOptimizeAdsProducts('', false);
    })
  }

  fetchCoordinateId() {
    this.coordinateObseravable = this.sharedService.proxyCordinateId.subscribe((res) => {
      if (res != null) {
        this.proxyCordinateId = res;
      }
    });
  }
  fetchSceneId() {
    this.sharedService.sceneId.subscribe((res) => {
      if (res != null) {
        this.sceneId = res;
      }
    });
  }

  fetchShowId() {
    this.sharedService.showId.subscribe((res) => {
      if (res != null) {
        this.showId = res;
      }
    });
  }

  closeModal() {
    this.modal.close({ isClipOn: this.isClipOn });
    const sceneId = {
      currentSceneId: this.sceneId
    }
    this.sharedService.refreshPage.next(sceneId)
    this.sharedService.proxyCordinateId.next(this.proxyCordinateId)
  }

  fetchLockSuperProxyData() {
    this.productImages = [];
    this.retailerProductImages = [];

    if (this.droppedImage) {
      this.getProductByProxyMethod();
      return;
    }
    this.tags = [];
    this.tagIds = [];
    this.ngxService.startLoader("loader-02");
    this.apiService.sendRequest(requests.getProxyCoordinateById, 'post', {
      id: this.proxyCordinateId
    })
      .subscribe((res: any) => {
        this.tagSummary = res.data;
        this.ngxService.stopLoader("loader-02");
        for (let k = 0; k < res?.data?.CoordinateHasTags.length; k++) {
          const tag = res?.data?.CoordinateHasTags[k]?.Tag
          if (tag != null && !tag.isTuner) {
            this.tagIds.push(tag.id);
            this.tagNames = tag?.name + ',';
            this.tags.push(tag)
          }
        }

        this.isClipOn = res?.data?.clip;
        this.imageFromApi = res.data.proxyImageUrl;
        this.cordinateX = res.data.xCoordinate;
        this.cordinateY = res.data.yCoordinate;
        this.canvasHeight = res.data.canvasHeight;
        this.canvasWidth = res.data.canvasWidth
        this.coordinateColor = res.data.coordinateColor;
        this.actorProxyId = res?.data?.id;
        this.idForImage = res?.data?.id;
        this.sceneImgURL = res?.data?.Scene?.thumbnail;
        this.superProxyImage = res?.data?.superProxyProduct?.matchedImageUrl;//ProductImage?.reuploadedImages?.images?.[0];
        const productData = {
          productId: res?.data?.superProxyProduct?.id,
          retailerId: res?.data?.superProxyProduct?.Retailer?.id,
          vzotScore: res?.data?.superProxyProduct?.vzotScore,
          productTag: res?.data?.superProxyProduct?.tag,
          superProxy: res?.data?.superProxyProduct?.superProxy,
          colorId: res?.data?.superProxyProduct?.Color?.id,
          productImageId: res?.data?.superProxyProduct?.ProductImage?.id,
          toDisplayAd: res?.data?.superProxyProduct?.toDisplayAd == 1 ? true : false,
          matchedImageUrl: res?.data?.superProxyProduct?.matchedImageUrl,
          gender: res?.data?.superProxyProduct?.Gender?.name,
          color: res?.data?.superProxyProduct?.Colors?.name,
          brand: res?.data?.superProxyProduct?.Brand?.name
        }
        this.superProxyProduct = Object.assign(productData);
        if (res?.data?.Actor) this.assignedActor = res?.data?.Actor;
        if (res?.data?.superProxyProduct || res?.data?.superProxyProduct !== null) {
          this.superProxyId = res?.data?.superProxyProduct?.ProductImage?.id;
          this.advertiserId = res?.data?.superProxyProduct?.Retailer?.id;
        }
        for (let xy in this.genders) {
          if (this.genders[xy].name == res?.data?.gender) {
            this.selectedGender = this.genders[xy].id
          }
        }
        for (let color of this.colors) {
          if (color.name === res?.data?.primaryColor) {
            this.selectedColor = color.id;
          }
        }
        for (let category of this.categories) {
          if (category.name === res?.data?.category) {
            this.selectedCategory = category.id;
          }
        }

        this.historyActorId = this.assignedActor?.id
        this.getProductByProxyMethod();
        });
  }

  translateProductCoorOntoCanvas() {
    //Have to do it dynamically
    // console.log(this.scaleRatio);
    // console.log(this.cordinateX,this.cordinateY);

    this.currX = (this.cordinateX) * this.scaleRatio //- this.canvas._offset.left
    this.currY = (this.cordinateY + 20) * this.scaleRatio //this.canvas._offset.top;

    // console.log(JSON.parse(JSON.stringify(this.currX)));
    // console.log(JSON.parse(JSON.stringify(this.currY)));


    // console.log(JSON.parse(JSON.stringify(this.currX / this.scaleRatio)));
    // console.log(JSON.parse(JSON.stringify(this.currY / this.scaleRatio)));




    if (this.canvas) {
      while (this.currX > this.canvas?.width) {
        this.currX = this.currX - 10
      }
      while (this.currY > this.canvas?.height) {
        this.currY = this.currY - 10
      }
    }
    this.flag = true;
    this.dot_flag = true;
    if (this.dot_flag) {
      this.ctx.beginPath();
      this.ctx.fillStyle = this.coordinateColor
      this.ctx.arc(this.currX, this.currY, 6, 0, 2 * Math.PI);
      this.ctx.strokeStyle = "white";
      this.ctx.lineWidth = 2
      this.ctx.fill()
      this.ctx.stroke();
      this.dot_flag = false;
    }
  }

  fetchActors() {
    this.ngxService.startLoader("loader-02");
    if (this.totalActorsCount != this.fetchedActorsCount || this.totalActorsCount == 0) {
      this.apiService.sendRequest(requests.getShowActors, 'post', { ...this.actorsPagination, showId: this.showId }).subscribe(async (res: any) => {
        this.totalActorsCount = await res?.data?.count
        if (res?.data?.rows != 0)
          this.actors = this.actors?.concat(res?.data?.rows)
        this.fetch_actors = true;
        this.ngxService.stopLoader("loader-02");
      }, (error) => {
        this.ngxService.stopLoader("loader-02");
      })
    }
  }

  recognizeActors() {
    this.ngxService.startLoader("loader-02");
    this.apiService
      .sendRequest(requests.recognizeActors, 'post', {
        showId: this.showId,
        sceneThumbnail: this.sceneImgURL
      })
      .subscribe((res: any) => {
        res?.data?.forEach(actor => {
          const isExist = this.actors.find(a => a.id === actor?.id)
          if (!isExist)
            this.actors.push(actor)
          else if (isExist) {
            this.updateActorStatus(actor?.id)
          }
        });
        this.isActorsRecognized = true;
        this.ngxService.stopLoader("loader-02");
      }, (error: any) => {
        this.ngxService.stopLoader("loader-02");
      });
  }

  NextScreen() {
    if (this.selectedScreen != 4) {
      let stepIndex = this.selectedScreen - 1;
      this.steps[stepIndex].active = false;
      this.steps[stepIndex].icon = true
      this.selectedScreen += 1;
      stepIndex += 1;
      this.steps[stepIndex].active = true;
      this.steps[stepIndex].icon = false
      this.submitButton = 'Next';

    }
    if (this.selectedScreen == 2 && !this.fetch_actors)
      this.fetchActors();
    else if (this.selectedScreen == 3 && this.superProxyImage) {
      this.getOptimizeAdsProducts();
    }else if(this.selectedScreen === 4){
      this.getScenes(1)
    }
    this.canvas = null;
    this.canvasMade = false;
    this.constructCanvasVar = true;
    this.constructCanvas()
  }
  BackScreen() {
    if (this.selectedScreen == 2) {
      this.proxyImagesList = []
      this.getProductByProxyMethod()
    }
    if (this.selectedScreen != 1) {
      let stepIndex = this.selectedScreen - 1;
      this.steps[stepIndex].active = false;
      this.steps[stepIndex].icon = true;
      this.selectedScreen -= 1;
      stepIndex -= 1;
      this.steps[stepIndex].active = true;
      this.steps[stepIndex].icon = false
    }
    if (this.selectedScreen == 2 && !this.fetch_actors)
      this.fetchActors();
    if(this.selectedScreen === 3){
      this.allScenes = []
    }
    if (this.selectedScreen == 4) {
      this.submitButton = 'Done';
    } else {
      this.submitButton = 'Next';
    }
    this.canvas = null;
    this.canvasMade = false;
    this.constructCanvasVar = true;
    this.constructCanvas()
  }
  getCoordinates($event,scene){
    const index = this.tagExist(scene)
    if(index !== -1){
      // const existingCoordinate = this.scenesCoordinateList.get(sceneId);
      this.scenesCoordinateList[index].coordinates = $event
    } else {
      const sceneCoordinate = {
        sceneId : scene.id,
        showId : this.showId,
        coordinates : $event,
        coordinateColor: this.tagSummary?.color,
      }
      this.scenesCoordinateList.push(sceneCoordinate);
    }
  }
  removeTag(scene){
    this.scenesCoordinateList = this.scenesCoordinateList.filter(data=>data.sceneId !=scene.id)
  }
  tagExist(scene){
    return this.scenesCoordinateList.findIndex(data => data.sceneId ===scene.id)
  }
  setScreenFromButton(screen: number) {
    const stepIndex = this.selectedScreen - 1;
    this.selectedScreen = screen + 1;
    this.steps[stepIndex].active = false;
    this.steps[screen].active = true;
    this.steps[stepIndex].icon = true
    this.steps[screen].icon = false
    if (this.selectedScreen == 2 && !this.fetch_actors) {
      this.fetchShowId();
      this.fetchActors();
    }
    if (this.selectedScreen == 3 && this.superProxyImage) {
      this.getOptimizeAdsProducts();
    }
    this.canvas = null;
    this.canvasMade = false;
    this.constructCanvasVar = true;
    this.constructCanvas()
  }
  getScenes(pageNo){
    this.apiService.sendRequest(getAllScenesOfShow, 'post', {
      pageNo: pageNo,
      limit: 40,
      showId: this.showId,
    }).subscribe((res: any) => {
      this.totalScenesCount = res?.data?.count;
      this.allScenes = [...this.allScenes, ...res?.data?.rows];
      this.allScenes.filter(scene=>scene.id !== this.tagSummary?.scene?.id)
    })
  }
  alreadySelectedFilterArray = [];
  open(content?: any) {
    this.retailerProductImages.map(item=>{
      item.hideRetailer = true;
    })
    const modalRef = this.modalService.open(FilterAdvertisersComponent, {
      windowClass: "modal-lg",
      backdrop: "static",
      keyboard: true,
      centered: true,
    })
    modalRef.componentInstance.alreadySelectedArray = this.alreadySelectedFilterArray;
    modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
      this.alreadySelectedFilterArray = receivedEntry.retailers;
      if (receivedEntry) {
        this.retailerProductImages = this.retailerProductImages.filter(item => item.id !== undefined);
        const retailerIds = this.alreadySelectedFilterArray.map(retailer => retailer.id);
        this.retailerProductImages.map(item=>{
          if(retailerIds.includes(item.id))
          {
            item.hideRetailer = false;
          }
        })
        this.selectedRetailers = receivedEntry.retailers;
      }
    })

    modalRef.componentInstance.closeCheck.subscribe((res)=>{
      if(res==true)
      {
        this.alreadySelectedFilterArray = [];
      }
    })
  }

  openReplaceModal(replaceModal: any, event) {
    this.replaceModalReference = this.modalService.open(replaceModal, {
      backdrop: "static",
      keyboard: true,
      centered: true,
      windowClass: 'modal-md'
    });
  }

  staticModal(cancelModal: any) {
    this.modalService.open(cancelModal, {
      backdrop: 'static',
      keyboard: true,
      centered: true,
      windowClass: 'modal-md'
    });
  }

  restoreHistory() {
    const body = {
      id: this.idForImage,
      sceneId: this.sceneId,
      showId: this.showId,
      proxyImageUrl: this.imageFromApi,
      coordinates: {
        x: this.cordinateX,
        y: this.cordinateY,
      },
      canvasHeight: +this.canvasHeight,
      canvasWidth: +this.canvasWidth,
      actorId: this.historyActorId ?? null,
      products: this.historyProducts,
      tagIds: this.tagIds
    };
    this.apiService.sendRequest(requests.tagProductInScene, 'post', body).subscribe((res: any) => {
      const sceneId = {
        currentSceneId: this.sceneId
      }
      this.sharedService.refreshPage.next(sceneId)
      this.sharedService.proxyCordinateId.next(this.proxyCordinateId)
      this.modal.close({ isClipOn: this.isClipOn })
    });
  }

  submitModal() {
    const body = this.apiBody();
    if (body.gender == '') delete body.gender
    this.apiService.sendRequest(requests.tagProductInScene, 'post', body).subscribe((res: any) => {
      // this.submitRecordModal = false;
      if (this.selectedScreen === 4) {
        const sceneId = {
          currentSceneId: this.sceneId
        }
        this.sharedService.refreshPage.next(sceneId)
        this.sharedService.proxyCordinateId.next(this.proxyCordinateId)
        this.modal.close({ isClipOn: this.isClipOn })
      }
    });
  }
  eliminatedProducts = [];
  private apiBody() {
    const maxProductsPerRetailer = 10000;
    const retailerCountMap = new Map();
    const filteredProducts = [];
    const primaryColor = this.colors.find(c => c.id == this.selectedColor)?.name;
    const category = this.categories.find(c => c.id == this.selectedCategory)?.name;
    let retailerIds = [];
    this.retailerProductImages.map(retailer=>{
      if(!retailer.hideRetailer)
      {
        retailerIds.push(retailer.id)
      }
    })
    for (let x = 0; x < this.productBody.length; x++) {
      if(!retailerIds.includes(this.productBody[x].retailerId)) continue;
      if (!this.productBody[x].superProxy) {
        for (let y in this.eliminatedProducts) {
          if (this.eliminatedProducts[y].id == this.productBody[x].productId) {
            this.productBody.splice(x, 1)
          }
        }
      }
      else {
        for (let y in this.eliminatedProducts) {
          if (this.eliminatedProducts[y].id == this.productBody[x].productId) {
            this.productBody[x].toDisplayAd = false;
          }
        }
      }
    }
    for (const product of this.productBody) {
      if(!retailerIds.includes(product.retailerId)) continue;
      const retailerId = product.retailerId;

      // If the retailerId is not in the map, initialize the count to 1
      if (!retailerCountMap.has(retailerId)) {
        retailerCountMap.set(retailerId, 1);
        filteredProducts.push(product);
      } else {
        // If the retailerId is in the map, check the count
        const count = retailerCountMap.get(retailerId);
        if (count < maxProductsPerRetailer) {
          // If the count is less than the maximum, add the product
          retailerCountMap.set(retailerId, count + 1);
          filteredProducts.push(product);
        }
      }
    }
    if (this.superProxyProduct !== null) {
      const prod = filteredProducts.find(p => p.productId == this.superProxyProduct?.productId)
      if (prod) {
        const prodIndex = filteredProducts.findIndex(p => p.productId == this.superProxyProduct?.productId)
        filteredProducts[prodIndex].superProxy = true;
      }
      else
      {
        this.superProxyProduct.toDisplayAd =false;
        filteredProducts.push(this.superProxyProduct)
      }
       //if(this.superProxyProduct.toDisplayAd==true || this.superProxyProduct.toDisplayAd==1)
    }
    for (let x in this.genders) {
      if (this.genders[x].id == this.selectedGender) {
        this.genderName = this.genders[x].name
      }
    }
    return {
      id: this.idForImage,
      sceneId: this.sceneId,
      showId: this.showId,
      batchScenes : this.scenesCoordinateList,
      proxyImageUrl: this.imageFromApi,
      coordinates: {
        x: this.cordinateX,
        y: this.cordinateY,
      },
      canvasHeight: +this.canvasHeight,
      canvasWidth: +this.canvasWidth,
      actorId: this.actorId,
      products: filteredProducts,
      tagIds: this.tagIds,
      clip: this.isClipOn,
      gender: this.genderName,
      primaryColor,
      category,
    };
  }

  ngOnDestroy() {
    this.coordinateObseravable?.unsubscribe()
    this.sceneThumbnailObservable?.unsubscribe()
    this.xCoordinateObservable?.unsubscribe()
    this.yCoordinateObservable?.unsubscribe()
    this.screenObservable?.unsubscribe()
    this.isTagAddedObservable?.unsubscribe();
  }

  removeProxyCordinate() {
    // // console.log(product);
    let body = null;

    body = {
      coordinateId: this.proxyCordinateId
    }
    this.taggerService.removeCoordinate(body).subscribe(data => {
      // console.log(data);
      // this.fetchData();
      this.modalService.dismissAll();
      this.sharedService.refreshPage.next({ currentSceneId: this.sceneId })
      // this.sharedService.proxyCordinateId.next(this.proxyCordinateId)
    })
  }
  openfilterAdvertisers() {
    this.retailerProductImages.map(item=>{
      item.hideRetailer = true;
    })
    const modalRef = this.modalService.open(FilterAdvertisersComponent, {
      windowClass: "modal-lg",
      backdrop: "static",
      keyboard: true,
      centered: true,
    })
    modalRef.componentInstance.alreadySelectedArray = this.alreadySelectedFilterArray;
    modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
      this.alreadySelectedFilterArray = receivedEntry.retailers;
      if (receivedEntry) {
        this.retailerProductImages = this.retailerProductImages.filter(item => item.id !== undefined);
        const retailerIds = this.alreadySelectedFilterArray.map(retailer => retailer.id);
        this.retailerProductImages.map(item=>{
          if(retailerIds.includes(item.id))
          {
            item.hideRetailer = false;
          }
        })
        this.selectedRetailers = receivedEntry.retailers;
      }
    })

    modalRef.componentInstance.closeCheck.subscribe((res)=>{
      if(res==true)
      {
        this.alreadySelectedFilterArray = [];
      }
    })
  }
  toggleClip() {
    this.isClipOn = !this.isClipOn;
    this.proxyImagesList = [];
    this.getProductByProxyMethod();
  }
}
