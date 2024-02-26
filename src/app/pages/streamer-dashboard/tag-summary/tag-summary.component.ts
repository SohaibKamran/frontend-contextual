
import { Options } from '@angular-slider/ngx-slider';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
import { fabric } from 'fabric';
import { SelectAdvertisersComponent } from '../select-advertisers/select-advertisers.component';
import { ProductRecordModalComponent } from '../product-record-modal/product-record-modal.component';
import { SharedService } from 'src/app/core/services/shared.service';
import { AddEditTaggerDetailsComponent } from '../../add-edit-tagger-details/add-edit-tagger-details.component';
import { EpisodePreviewComponent } from '../../episode-preview/episode-preview.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';
import { TaggerService } from '../../tagger/tagger.service';
import { FilterAdvertisersComponent } from '../filter-advertisers/filter-advertisers.component';
import { ChatGptModalComponent } from '../../tagger/chat-gpt-modal/chat-gpt-modal.component';
import { Subject } from 'rxjs';
import { AdAddToCardModalComponent } from 'src/app/shared/ad-add-to-card-modal/ad-add-to-card-modal.component';
import { addTag, eliminateGcpProducts, getColors, getGenders, getKeywords } from 'src/app/core/constants';
import { AddEditAnnotatorComponent } from '../../manage-annotators/add-edit-annotator/add-edit-annotator.component';
import { ManageAnnotatorsService } from '../../manage-annotators/manage-annotators.service';
@Component({
  selector: 'app-tag-summary',
  templateUrl: './tag-summary.component.html',
  styleUrls: ['./tag-summary.component.scss']
})
export class TagSummaryComponent implements OnInit, OnDestroy {
  isClipOn = false;
  options: Options = {
    floor: 0,
    ceil: 100,
    hideLimitLabels: true
  };
  showProductTagInfo: boolean = false
  productData = {}
  @Input() public data;
  @Input() public series;
  tagSummary: any;
  objArray = {};
  proxyImage: any;
  superProxyImage: string = undefined;
  dynamicId: any
  prInReview = '#e4f70f';
  prApproved = 'green';
  prReturned = 'red';
  currentSceneId: number
  showId: any
  ctx: any;
  canvas: any;
  canvasMade = false;
  constructCanvasVar = true;
  currX = 0;
  currY = 0;
  flag = false;
  gcpFilterString: string = "";
  dot_flag = false;
  coordinateColor: any
  cordinateX: number;
  cordinateY: number;
  sceneImgURL: string;
  canvasHeight: any;
  canvasWidth: any;
  superProxyVzotScore: any
  sceneProductsData: any;
  updatedProductsRetailer: string;
  productImages = [];
  retailerProductImages = [];
  retailerArray: any = [];
  actors = [];
  sceneId: any;
  assignedActor: any;
  productProxyData: any;
  actorProxyId = -1;
  xCordinates: number;
  yCordinates: number;
  forFlow: any;
  actorId: number;
  tagNames: string;
  productBody = [];
  tagIds = [];
  minimumVzotScore;
  proxyCordinateId: number
  superProxyCount = 0
  coordinateObseravable
  sceneThumbnailObservable
  xCoordinateObservable
  yCoordinateObservable
  screenObservable
  droppedImage = null;
  imageFromApi: string;
  proxyImageUrl;
  value = [];
  tags = [];
  idForImage: number
  taggedIdsObservable: any
  taggedIds = []
  taggedIdIndex = 0
  tagSummaryCoordinateId: number = null;
  proxyIdObservable: any
  retailer: string
  public refreshPage;
  superProxyId: number;
  advertiserId: number;
  advertiserFilterProducts: any = []
  selectedRetailers: any = []
  taggingStatusValue: any = undefined
  taggingStatusColor: any = undefined
  userRole: number = null
  taggerData: any
  selectedColor: null;
  selectedCategory: null;
  selectedGender: null;
  totalColorsCount = 0;
  fetchedColorsCount = 0
  colors = []
  categories = []
  colorsPagination: { pageNo: number, limit: number, offset?: number } = { pageNo: 1, limit: 100 }
  totalGendersCount = 0;
  fetchedGendersCount = 0;
  attributeText = '';
  tunerText = '';
  isTagButtonDisabled: boolean = false
  isTunerButtonDisabled: boolean = false
  genders = []
  gendersPagination: { pageNo: number, limit: number, offset?: number } = { pageNo: 1, limit: 100 }
  isDisabled = false;
  $advertiserFilter: Subject<any> = new Subject;
  prTaggingStatuses = [
    {
      id: 3,
      title: "PR in Review",
      class: "review"
    }
  ]

  constructor(
    public modalService: NgbModal,
    private apiService: ApiService,
    private sharedService: SharedService,
    public ngxService: NgxUiLoaderService,
    private toastrService: ToastrService,
    private taggerService: TaggerService,
    private manageAnnotatorService: ManageAnnotatorsService
  ) { }

  ngOnDestroy(): void {
    this.taggedIdsObservable.unsubscribe()
    this.taggerService.coordinateIds.next(null)
    this.proxyIdObservable?.unsubscribe();
    this.taggedIdsObservable?.unsubscribe();
    this.refreshPage?.unsubscribe();
  }

  ngOnInit() {
    this.fetchCountries()
    this.userRole = JSON.parse(localStorage.getItem('role'))
    // this.getCategories();
    this.getColors();
    this.getGenders();
    // this.getTaggerData();
    // console.log("=============>", this.series)
    this.proxyIdObservable = this.sharedService.proxyCordinateId.subscribe((data) => {
      if (data != null) {
        this.dynamicId = data
      }
      this.fetchData();
      this.getSceneID()
      this.fetchShowId()
      this.fetchProxyCoordinateIds()
    })
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
      this.getOptimizeAdsProducts('', false)
    })
  }

  settaggedIdIndex() {
    const index = this.taggedIds?.findIndex((item) => {
      return item === this.dynamicId
    })
    if (index != -1) {
      this.taggedIdIndex = index
    }
  }

  getSceneID() {
    this.sharedService.sceneId.subscribe((res) => {
      this.currentSceneId = res
      // this.getTaggerData()
    })
  }

  fetchProxyCoordinateIds() {

    this.taggedIdsObservable = this.taggerService.coordinateIds.subscribe((res) => {
      if (res) {
        this.taggedIds = res
        this.settaggedIdIndex()
        if (this.taggedIds !== null && this.taggedIds?.length !== 0)
          this.dynamicId = this.taggedIds[this.taggedIdIndex]
      }
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
    this.getColors()
  }

  addTag(tag, isTuner = false) {
    if (tag?.trim == '')
      return;
      if(isTuner) 
        this.isTunerButtonDisabled = true
      else
        this.isTagButtonDisabled = true
    const data = [{
      name: tag,
      isHelper: 1,
      parentTagId: null,
      weight: 0.2,
      isTuner: isTuner ? true : false
    }]
    this.apiService.sendRequest(addTag, 'post', data).subscribe((data: any) => {
      this.tags.push(data?.data?.[0])
      this.tagIds.push(data?.data?.[0].id)
      if(isTuner){
        this.tunerText = ''
        this.isTunerButtonDisabled = false
      }
      else {
        this.attributeText = ''
        this.isTagButtonDisabled = false
      }
      this.getOptimizeAdsProducts('', false)
    },
      (err) => {
        console.log(err)
        this.attributeText = ''
        this.isTagButtonDisabled = false
      }
    )
  }
  alreadySelectedFilterArray = [];

  openfilterAdvertisers() {
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
        this.retailerProductImages = [];
        this.selectedRetailers = receivedEntry.retailers;
        this.selectedRetailers = Array.from(new Set(this.selectedRetailers.map(obj => obj.id)))
          .map(id => {
            return this.selectedRetailers.find(obj => obj.id === id);
          });
        this.advertiserFilterProducts?.forEach(retailer => {
          this.selectedRetailers?.forEach(advertiser => {
            if (retailer.name == advertiser.name) {
              this.retailerProductImages.push(retailer)
            }
          });
        });
        this.$advertiserFilter.next(receivedEntry)
      }
    })
  }

  openAIModal() {
    const data = {
      isAddAttribute: true,
      fromTagSummary: true,
      id: this.data?.id ? this.data?.id : this.dynamicId,
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

  openReplaceModal(replaceModal: any, event) {
    this.modalService.open(replaceModal, {
      backdrop: "static",
      keyboard: true,
      centered: true,
      windowClass: 'modal-md'
    });
  }

  removeSuperProxy() {
    const body = {
      id: this.tagSummaryCoordinateId,
      removeSuperProxy: true
    }

    this.apiService.sendRequest(requests.updateTagProductInScene, 'post', body)
      .subscribe((res) => {
        this.sharedService.refreshPage.next({ currentSceneId: this.currentSceneId })
        this.fetchData()
      })
  }

  superProxyProduct = null;
  showRow(pr:any)
  {
    for(let x in pr)
    {
      if(pr[x].toDisplayAd==true)
      {
        return true;
      }
    }
    return false;
  }
  fetchData(filter?:any) {
    this.ngxService.startLoader("loader-01");
    // this.productBody = [];
    this.apiService.sendRequest(requests.getProxyCoordinateById, 'post', { id: this.data?.id ? this.data?.id : this.dynamicId }).subscribe({
      next: (v: any) => {
        this.retailerProductImages = []
        this.tagSummary = v.data;
        this.tagSummaryCoordinateId = this.tagSummary?.id;
        this.proxyImage = this.tagSummary.proxyImageUrl;
        sessionStorage.setItem('droppedImageUrl', this.proxyImage)
        this.sceneImgURL = this.tagSummary.Scene.thumbnail;
        this.superProxyImage = this.tagSummary?.superProxyProduct?.matchedImageUrl;
        this.sceneId = this.tagSummary?.Scene?.id;
        this.retailer = this.tagSummary?.superProxyProduct?.Retailer?.name;
        this.cordinateX = this.tagSummary.xCoordinate;
        this.cordinateY = this.tagSummary.yCoordinate;
        this.canvasHeight = this.tagSummary.canvasHeight;
        this.canvasWidth = this.tagSummary.canvasWidth
        this.coordinateColor = this.tagSummary.coordinateColor;
        this.taggerData = this.tagSummary.Tagger
        this.isClipOn = this.tagSummary.clip;

        for (let xy in this.genders) {
          if (this.genders[xy].name == this.tagSummary.gender) {
            this.selectedGender = this.genders[xy].id
          }
        }
        for (let color of this.colors) {
          if (color.name === this.tagSummary.primaryColor) {
            this.selectedColor = color.id;
          }
        }
        for (let category of this.categories) {
          if (category.name === this.tagSummary.category) {
            this.selectedCategory = category.id;
          }
        }
        if (this.tagSummary.taggingStatusId === 2) {
          this.taggingStatusValue = "PR in Progress"
          this.taggingStatusColor = "inprogress"
        }
        else if (this.tagSummary.taggingStatusId === 3) {
          this.taggingStatusValue = "PR in Review"
          this.taggingStatusColor = "review"
        }
        else if (this.tagSummary.taggingStatusId === 4) {
          this.taggingStatusValue = "PR Returned"
          this.taggingStatusColor = "returned"
        }
        else if (this.tagSummary.taggingStatusId === 5) {
          this.taggingStatusValue = "PR Approved"
          this.taggingStatusColor = "approved"
        }

        this.tags = [];
        this.tagIds = [];
        for (let i = 0; i < this.tagSummary.CoordinateHasTags.length; i++) {
          const tag = this.tagSummary?.CoordinateHasTags[i]?.Tag
          if (tag && !tag?.isTuner) {
            this.tagIds.push(tag.id);
            this.tagNames = tag?.name + ',';
            this.tags.push(tag)
          }
        }
        if (this.tagSummary?.superProxyProduct) {
          const superproxy = this.tagSummary?.superProxyProduct;
          this.superProxyProduct = {
            productId: superproxy.id,
            retailerId: superproxy.Retailer?.id,
            vzotScore: superproxy.vzotScore,
            superProxy: true,
            productTag: this.tagNames ?? "",
            colorId: superproxy?.Color?.id,
            productImageId: superproxy?.ProductImage?.id,
            toDisplayAd: superproxy?.toDisplayAd == 1 ? true : false,
            matchedImageUrl: superproxy?.matchedImageUrl
          };
        }
        this.imageFromApi = v.data.proxyImageUrl;
        this.cordinateX = v.data.xCoordinate;
        this.cordinateY = v.data.yCoordinate;
        this.canvasHeight = v.data.canvasHeight;
        this.canvasWidth = v.data.canvasWidth
        this.coordinateColor = v.data.coordinateColor;
        this.actorProxyId = v?.data?.id;
        this.idForImage = v?.data?.id;
        this.sceneProductsData = v?.data?.Retailers;

        const retailerNames = Object.keys(this.sceneProductsData);

        for (let i = 0; i < retailerNames?.length; i++) {
          let retailerId;
          const products = this.tagSummary?.Retailers[retailerNames[i]].Products;
          const productDetails = [];
          for (let j = 0; j < products.length; j++) {
            retailerId = products[j].retailerId;
            const productId = products[j].id;
            const colorId = products[j]?.Color?.id
            const productImages = products[j]?.ProductImage;
            const productImageId = productImages?.id;
            const score = products[j]?.vzotScore;
            const matchedImageUrl = products[j].matchedImageUrl;
            // this.value.push(score);
            const image = productImages?.reuploadedImages.images[0];
            const id = products[j].id;
            const retailerImage = this.tagSummary?.Retailers[retailerNames[i]].imageUrl;
            const retailerName = this.tagSummary?.Retailers[retailerNames[i]].name;
            const superProxy = products[j].superProxy?true:false;
            // const proxyCoordinateId = products[j].CoordinateHasProduct.proxyCoordinateId
            // const superProxy = products[j].CoordinateHasProduct.superProxy
            productDetails.push({
              score: parseInt(score),
              image: image,
              id: id,
              retailerImage: retailerImage,
              retailerName: retailerName,
              toDisplayAd: superProxy?products[j].toDisplayAd: true,
              sceneId: this.sceneId,
              superProxy: productImageId == this.superProxyId ? true : superProxy,
              colorId: colorId,
              productImageId: productImageId,
              matchedImageUrl: matchedImageUrl
            });
            this.productBody.push({
              productId: productId,
              retailerId: retailerId,
              vzotScore: score,
              productTag: this.tagNames,
              superProxy: productImageId == this.superProxyId ? true : superProxy,
              colorId: colorId,
              productImageId: productImageId,
              matchedImageUrl: matchedImageUrl,
              toDisplayAd: superProxy?products[j].toDisplayAd: true
            });
          }

          const retailerObject = {
            id: retailerId,
            name: retailerNames[i],
            productDetails: productDetails,
          };

          let minValue = 0;
          if (retailerObject?.productDetails?.length !== 0) {
            minValue = Math.min(...retailerObject.productDetails.map(o => o.score))
          }
          // this.value.push(minValue)
          this.retailerProductImages.push(retailerObject);
          this.retailerArray.push(retailerObject);

          if (!filter) {
            let minValue = 0;
            if (retailerObject.productDetails.length !== 0) {
              minValue = Math.min(...retailerObject.productDetails.map(o => o.score))
            }
            // this.value.push(minValue)

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

        for (let i = 0; i < retailerNames.length; i++) {
          let tempImages = [];
          // const retailerId = this.sceneProductsData[retailerNames[i]].id;
          const products = this.sceneProductsData[retailerNames[i]].Products;
          // const productDetails = [];

          for (let j = 0; j < products.length; j++) {
            tempImages = [];
            const productImages = products[j]?.ProductImage;
            // const reuploadedImages = productImages[0].reuploadedImages.images;
            // const score = products[j]?.CoordinateHasProduct.vzotScore;
            // this.value.push(score);
            const image = productImages.reuploadedImages.images[0];
            if (products[j].superProxy) {
              this.superProxyImage =products[j]?.matchedImageUrl; //  productImages?.reuploadedImages?.images[0];
              this.retailer = retailerNames[i]
              this.superProxyVzotScore = products[j]?.vzotScore
            } else {
              // this.proxyImage = image?.reuploadedImages?.images[0];
            }
          }
        }

        if (v?.data?.Actor) this.assignedActor = v?.data?.Actor;
      },
      error: (error: any) => {
        this.ngxService.stopLoader("loader-01");
        this.toastrService.error(error.message, "Error!");
      },
      complete: () => {
        // console.log('completed');
        // console.log(this.retailerProductImages);
        this.retailerProductImages = this.retailerProductImages.reduce((accumulator, currentValue) => {
          if (!accumulator.some(obj => obj.id === currentValue.id && obj.name === currentValue.name)) {
            accumulator.push(currentValue);
          }
          return accumulator;
        }, []);
        this.ngxService.stopLoader("loader-01");
        this.constructCanvas();
        this.getOptimizeAdsProducts();
        // this.mapRetailersproducts();
      }
    });
  }

  getAttributesData(product) {
    this.isDisabled = true;
    this.apiService.sendRequest(getKeywords, 'post', { query: `${product?.title} ${product?.brand} ${product?.color} ${product?.description}` })
      .subscribe((res: any) => {
        this.showProductTagInfo = true;
        this.isDisabled = false;
        product.attributes = res.keywords;
        this.productData = Object.assign(product)
      },
        (error) => {
          console.log("🚀 ~ file: product-record-modal.component.ts:617 ~ ProductRecordModalComponent ~ getAttributesData ~ error:", error)
        })
  }

  hideAttributeSection($event) {
    this.showProductTagInfo = false;
  }
  disp()
  {
    console.log(this.retailerProductImages, "retailerProductImages");
    
  }

  scaleRatio;
  constructCanvas() {
    this.canvasMade = true;
    this.constructCanvasVar = true
    setTimeout(() => {
      let img = new Image();
      if (!this.canvas) {
        this.canvas = new fabric.Canvas('tagSummaryCanvas');
      }
      this.canvas.height = document.getElementById('superProxyCanvas').clientHeight
      this.canvas.width = document.getElementById('superProxyCanvas').clientWidth;

      this.ctx = this.canvas.getContext('2d');
      var self = this
      img.onload = function () {
        self.scaleRatio = (self.canvas.width / img.width)
        img.width = self.canvas.width
        self.canvas.setDimensions({ width: self.canvas.width, height: self.canvas.height });
        var fabricImage = new fabric.Image(img);
        fabricImage.set({
          scaleX: 1,
          scaleY: 1,
        });
        (fabricImage as any).scaleToWidth(self.canvas.width);

        self.canvas.setBackgroundImage(fabricImage).renderAll();
        // console.log(fabricImage.height, self.canvas.height);
        var backgroundImage = self.canvas.backgroundImage;
        self.canvas.renderAll()
        // console.log(fabricImage.height, self.canvas.height);
      };
      img.src = self.sceneImgURL
      setTimeout(() => {
        this.translateProductCoorOntoCanvas()
      }, 1000)
    }, 2000);
  }

  translateProductCoorOntoCanvas() {
    //Have to do it dynamically
    this.currX = (this.cordinateX) * this.scaleRatio //- this.canvas._offset.left
    this.currY = (this.cordinateY) * this.scaleRatio //this.canvas._offset.top;
    while (this.currX > this.canvas.width) {
      this.currX = this.currX - 10
    }
    while (this.currY > this.canvas.height) {
      this.currY = this.currY - 10
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

  setAttributes(text) {
    // console.log(text);

    return text.split(',')
  }


  //Done previously but is of no use for the time being.
  //Leaving this here for now as client is changing his requirements frequently
  mapRetailersproducts() {
    for (let i = 0; i < this.tagSummary.CoordinateHasTags.length; i++) {
      //tags work if needed
    }

    for (const key in this.tagSummary.Retailers) {
      if (!this.objArray[key]) {
        this.objArray[key] = [];
      }

      const products = this.tagSummary.Retailers[key].Products.slice();

      products.forEach((product) => {
        const image = product?.ProductImages[0]; // Access only the 0th index of ProductImages
        this.objArray[key].push({
          "image": image?.reuploadedImages?.images[0],
          "superProxy": product?.CoordinateHasProduct?.superProxy,
          "vzotScore": product?.CoordinateHasProduct?.vzotScore,
          "vzotThreshold": this.tagSummary.Retailers[key].vzotThreshold
        });

        if (product?.CoordinateHasProduct.superProxy) {
          this.superProxyImage = image?.reuploadedImages?.images[0];
        } else {
          // this.proxyImage = image?.reuploadedImages?.images[0];
        }
      });

    }
  }

  onChangeVzot(log: any) {
    // console.log("vzot: ", log);

  }

  transform(value: number, length: number): string {
    let paddedValue: any;
    if (value !== undefined && value !== null) {
      paddedValue = value.toString().padStart(length, '0');
      return paddedValue;
    }
    return "";
  }
  superProxyToDisplay = true;
  eliminateProduct(product: any, index: number) {
    if (product.id == this.superProxyProduct.productId) {
      for (let x in this.productBody) {
        if (this.productBody[x].productId == this.superProxyProduct.productId) {
          this.productBody[x].toDisplayAd = false;
        }
      }
    }
    else {
      for (let x = 0; x < this.productBody.length; x++) {
        if (!this.productBody[x].superProxy && this.productBody[x].productImageId == product.productImageId) {
          this.productBody.splice(x, 1)
          break;
        }
      }
    }
    const productIndex = this.retailerProductImages[index]?.productDetails?.findIndex(p => p.id == product?.id)
    if (productIndex != undefined) {
      // this.retailerProductImages[index].productDetails[productIndex].toDisplayAd = false
      this.apiService.sendRequest(eliminateGcpProducts, 'post', {
        proxyCoordinateId: this.tagSummaryCoordinateId,
        productId: product?.id
      }).subscribe((res) => {
        for (let x in this.retailerProductImages[index].productDetails) {
          if (this.retailerProductImages[index].productDetails[x] == product) {
            this.retailerProductImages[index].productDetails.splice(x, 1)
            break;
          }
        }
        console.log(res, "eliminateGcpProducts")
      }, (error) => console.log(error))
    }
    // const productBodyIndex = this.productBody.findIndex(p => p.productId == product?.id)
    // this.productBody[productBodyIndex].toDisplayAd = false;
  }
  @Output() updated = new EventEmitter<any>();
  onUpdateAndClose() {
    if (this.superProxyProduct) {
      const body = this.apiBody();
      for(let x in body.products)
      {
        if(body.products[x].toDisplayAd == 0) body.products[x].toDisplayAd = false;
        else if(body.products[x].toDisplayAd == 1) body.products[x].toDisplayAd = true;
      }
      this.apiService.sendRequest(requests.tagProductInScene, 'post', body).subscribe(res => {
        this.updated.emit('true')
        this.modalService.dismissAll()
      })
    }
    else {
      this.apiService.sendRequest(requests.updateTagProductInScene, 'post', { id: this.data?.id ? this.data?.id : this.dynamicId, taggingStatusId: parseInt(this.tagSummary.taggingStatusId), tagIds: this.tagIds }).subscribe(res => {
        this.updated.emit('true')
        this.modalService.dismissAll()
      })
    }
  }
  resetGender() {
    this.selectedGender = null
    console.log('gender cleared');

  }
  updateTaggingStatus(statusId: number) {
    if (this.tagSummary.taggingStatusId != statusId) {
      const updateStatusBody = {
        id: this.currentSceneId,
        taggingStatusId: statusId
      }
      this.apiService.sendRequest(requests.updateSceneById, 'post', updateStatusBody).subscribe((res) => {
        this.fetchData()
      })
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
    })
    // console.log(product, "product")

    activeModal.componentInstance.id = product?.id
    activeModal.componentInstance.productImageId = product?.productImageId
    activeModal.componentInstance.matchedImageUrl = product?.matchedImageUrl
    activeModal.componentInstance.retailerName = product?.retailerName
  }

  productRecordModal(screen: number) {
    const modalRef = this.modalService.open(ProductRecordModalComponent, {
      animation: true,
      windowClass: "modal-xl",
      backdrop: "static",
      keyboard: true,
      centered: true,
      scrollable: true,
    })
    this.sharedService.screen.next(screen)
    this.sharedService.proxyCordinateId.next(this.tagSummaryCoordinateId)
    this.sharedService.showId.next(this.showId)

    modalRef.result.then((result) => {
      if (result)
        this.isClipOn = result.isClipOn;
    });
    // console.log("SCREEN", screen)
    // this.sharedService.sceneId.next(this.data.id)
  }

  // getTaggerData() {
  //   this.apiService.sendRequest(requests.getUserProfile, 'post')
  //     .subscribe((res: any) => {
  //       this.taggerData = res?.data;
  //     });
  // }

  openAddEditTagger(tagger: any) {
    this.modalService.open(AddEditAnnotatorComponent, {
      animation: true,
      windowClass: "modal-xl",
      backdrop: "static",
      keyboard: true,
      centered: true,
    })
    this.manageAnnotatorService.setAnnotatorId(tagger.id)
    this.sharedService.taggerId.next(tagger.id);

    // console.log("Tagger Id: " + tagger.id);
  }
  fetchCountries(tagger?: any) {

    this.apiService.sendRequest(requests.getCountries, 'post', { pageNo: 1, limit: 249 }).subscribe((res: any) => {
      // console.log(res)
      this.sharedService.countries.next(res?.data?.countries?.rows)

    })
  }

  staticModal(deleteModal: any) {
    this.modalService.open(deleteModal, {
      backdrop: "static",
      keyboard: true,
      centered: true,
      windowClass: 'modal-md'
    });
  }
  staticsModal(replaceModal: any) {
    this.modalService.open(replaceModal, {
      backdrop: "static",
      keyboard: true,
      centered: true,
      windowClass: 'modal-md'
    });
  }

  openEpisodePreview(id?: any) {
    this.modalService.open(EpisodePreviewComponent, {
      windowClass: "modal-xl",
      backdrop: "static",
      keyboard: false,
      centered: true,
    })
    //Observable to send data 
    this.sharedService.videoData.next(id)
  }


  submitModal() {
    const body = this.apiBody();
    this.apiService.sendRequest(requests.tagProductInScene, 'post', body).subscribe((res: any) => {
      // console.log()
    });
  }

  fetchShowId() {
    this.sharedService.showId.subscribe((res) => {
      if (res != null) {
        this.showId = res;
      }
    });
  }

  private apiBody() {
    const maxProductsPerRetailer = 10000;
    const retailerCountMap = new Map();
    const filteredProducts = [];

    for (const product of this.productBody) {
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
        filteredProducts.push(this.superProxyProduct)
    }
    let genderSelected: any;
    for (let x in this.genders) {
      if (this.genders[x].id == this.selectedGender) {
        genderSelected = this.genders[x].name;
      }
    }
    return {
      id: this.idForImage,
      gender: genderSelected,
      sceneId: this.currentSceneId,
      showId: this.showId,
      proxyImageUrl: this.imageFromApi,
      taggingStatusId: parseInt(this.tagSummary.taggingStatusId),
      coordinates: {
        x: this.xCordinates ? this.xCordinates : this.cordinateX,
        y: this.yCordinates ? this.yCordinates : this.cordinateY,
      },
      canvasHeight: +this.canvasHeight,
      canvasWidth: +this.canvasWidth,
      actorId: this.actorId,
      products: filteredProducts,
      tagIds: this.tagIds
    };
  }
  changeScreen(index: number) {
    if (index == 1) {
      this.taggedIdIndex--
      this.dynamicId = this.taggedIds[this.taggedIdIndex]
    }
    else {
      this.taggedIdIndex++
      this.dynamicId = this.taggedIds[this.taggedIdIndex]
    }
    this.data=null
    this.sharedService.proxyCordinateId.next(this.dynamicId);
    this.fetchData()
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
    products = this.retailerProductImages;
    for (let i = 0; i < products.length; i++) {
      products[i].productDetails = products[i].productDetails.filter((item) => {
        return item.id !== product.id;
      });
    }
  }

  vzotChange(index: number) {
    this.minimumVzotScore = this.value[index];
    // for (let i = 0; i < this.retailerProductImages?.length; i++) {
      this.retailerProductImages[index].minimumVzotScore = this.value[index];
    // }
  }

  retaileridsend = '';
  superrr:any = undefined;
  countttt = 0;
  ChangeVzotScore(product: any) {
    console.log(product);
    const tagArray = this.tags.map((tag) => {
      return tag.name
    })
    let minScore;
    let nameRetailer;
    let superProxy;
    let retailerId;
    let retailerImage;
    for(let x in this.retailerProductImages)
    {
      if(this.retailerProductImages[x].name === product.name)
      {
        this.retailerProductImages[x].filter = true;
        minScore = this.retailerProductImages[x].minimumVzotScore;
        nameRetailer = this.retailerProductImages[x].name;
        retailerId = this.retailerProductImages[x].id;
        if(this.retailerProductImages[x]?.productDetails.length>0)
        {
          retailerImage = this.retailerProductImages[x]?.productDetails[0].retailerImage;
        }
        else
        {
          retailerImage = this.retailerProductImages[x]?.retailerImage;
        }
      }
    }
    for(let x in this.retailerProductImages)
    {
      for(let y in this.retailerProductImages[x].productDetails)
      {
        if(this.retailerProductImages[x].productDetails[y]?.superProxy)
        {
          superProxy = this.retailerProductImages[x].productDetails[y];
          if(!this.superrr) this.superrr = superProxy;
        }
      }
    }
    for(let x in this.retailerProductImages)
    {
      if(this.retailerProductImages[x]?.productDetails?.length>0)
      {
        this.retailerProductImages[x].retailerImage = this.retailerProductImages[x].productDetails[0].retailerImage;
      }
    }

    let boddy = {
      payloadForFilteredProducts: { 
        products: this.retailerProductImages,
        originalProductCount: this.countttt,
        superProxyProduct: this.superProxyProduct,
        sceneId: this.sceneId,
        nameOfRetailerToFilter: nameRetailer,
        // retailerImage: retailerImage
      },
      gcpFilter: 'retailerId='+retailerId,
      minimumVzotScore: minScore,
      databaseFilters: tagArray?.length !== 0 ? tagArray : undefined,
      limit:100,
      proxyImageUrl: this.superProxyImage ?? this.imageFromApi,

    }
    console.log(boddy);
    
    console.log(this.retailerProductImages);
    this.ngxService.startLoader("loader-01");
    this.apiService.sendRequest(requests.getProductByProxy, 'post', boddy).subscribe((data:any)=>{
      console.log(data);
      this.countttt = data.data.count;
      this.retailerProductImages = data.data.rows;
      for(let x in this.retailerProductImages)
      {
        for(let y in this.retailerProductImages[x]?.productDetails)
        {
          this.retailerProductImages[x].productDetails[y].score = Math.round(this.retailerProductImages[x]?.productDetails[y]?.score);
        }
      }
      this.ngxService.stopLoader("loader-01");
    })
    return;
  }

  checkShowAdQueue() {
    for (let x in this.retailerProductImages) {
      for (let y in this.retailerProductImages[x].productDetails) {
        if (this.retailerProductImages[x].productDetails.length > 0) {
          if (this.retailerProductImages[x].productDetails[y].toDisplayAd == 1 ||
            this.retailerProductImages[x].productDetails[y].toDisplayAd == true) {
            return true;
          }
        }
      }
    }
    return false
  }
  getOptimizeAdsProducts(filter?: any, loader=true) {
    if(loader)
      this.ngxService.startLoader("loader-01");
    if (!filter) {
      this.retailerProductImages = [];
    }
    const gender = this.genders.find(g => g.id == this.selectedGender);
    const color = this.colors.find(c => c.id == this.selectedColor);
    const category = this.categories.find(c => c.id == this.selectedCategory);
    const tagArray = this.tags.filter((tag) => !tag.isTuner).map((tag) => {
      return tag.name
    });
    const tagWeights = this.tags.filter((tag) => !tag.isTuner).map((tag) => {
      return tag.weight
    });
    const tuners = this.tags.filter((tag) => tag.isTuner).map((tag) => {
      return tag.name
    });
    const tunerWeights = this.tags.filter((tag) => tag.isTuner).map((tag) => {
      return tag.weight
    });

    let filters = [];
    if (color) {
      filters.push('primary_color=' + color.name);
    }
    if (gender) {
      filters.push('gender=' + gender.name);
    }
    if(category) {
      filters.push('category=' + category.name);
    }

    this.gcpFilterString = filters.join(",");

    if (this.superProxyImage) {
      const body = {
        proxyCoordinateId: this.tagSummaryCoordinateId,
        limit: 100,
        proxyImageUrl: this.superProxyImage,
        databaseFilters: tagArray?.length !== 0 ? tagArray : undefined,
        color: color ? color?.name : undefined,
        gcpFilter: this.gcpFilterString == "" ? undefined : this.gcpFilterString,
        tagWeights: tagWeights?.length !== 0 ? tagWeights : undefined,
        tuners: tuners?.length !== 0 ? tuners : undefined,
        tunerWeights: tunerWeights?.length !== 0 ? tunerWeights : undefined,
      };
      this.apiService.sendRequest(this.isClipOn ? requests.getProductsByImageEmbedding : requests.getProductByProxy, 'post', filter ? filter : body).subscribe(
        (res: any) => {
          this.countttt = res?.data?.count;
          this.productProxyData = res?.data.rows;
          let retailerNames;
          if (this.productProxyData)
            retailerNames = Object.keys(this.productProxyData);
          for (let i = 0; i < retailerNames?.length; i++) {
            let tempImages = [];
            let retailerId;
            const products = this.productProxyData[retailerNames[i]];
            const productDetails = [];
            for (let j = 0; j < products.length; j++) {
              retailerId = products[j].retailerId;
              const retailerImage = products[j]?.Retailer?.imageUrl
              const retailerName = products[j]?.Retailer?.name
              const productId = products[j].id;
              tempImages = [];
              const colorId = products[j]?.Colors?.id
              const title = products[j]?.title;
              const description = products[j]?.description;
              const productImages = products[j]?.Colors.ProductImage;
              const productImageId = productImages?.id;
              const score = products[j]?.vzotScore;
              // this.value.push(score);
              const image = products[j].matchedImageUrl//.//reuploadedImages.images[0];
              const id = products[j].id;
              const matchedImageUrl = products[j].matchedImageUrl;
              const gender = products[j]?.Gender?.name;
              const color = products[j]?.Colors?.name;
              const brand = products[j]?.Brand?.name;
              // const proxyCoordinateId = products[j].CoordinateHasProduct.proxyCoordinateId
              // const superProxy = products[j].CoordinateHasProduct.superProxy
              productDetails.push({
                score: Math.round(score),
                image: image,
                id: id,
                sceneId: this.sceneId,
                productTag: this.tagNames ?? "",
                superProxy: productImageId == this.superProxyId ? true : false,
                colorId: colorId,
                productImageId: productImageId,
                toDisplayAd: true,
                retailerImage: retailerImage,
                title: title,
                retailerName: retailerName,
                description: description,
                matchedImageUrl: matchedImageUrl,
                gender,
                color,
                brand
              });
              this.productBody.push({
                productId: productId,
                retailerId: retailerId,
                vzotScore: score,
                productTag: this.tagNames ?? "",
                superProxy: productImageId == this.superProxyId ? true : false,
                colorId: colorId,
                productImageId: productImageId,
                matchedImageUrl: matchedImageUrl
              });
            }

            const retailerObject = {
              id: retailerId,
              name: retailerNames[i],
              minimumVzotScore: 0,
              productDetails: productDetails.slice(),
            };

            if (!filter) {
              let minValue = 0;
              if (retailerObject.productDetails.length !== 0) {
                minValue = Math.min(...retailerObject.productDetails.map(o => o.score))
              }
              // this.value.push(minValue)
              retailerObject.minimumVzotScore = 0;
              this.value.push(retailerObject.minimumVzotScore)
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
            this.advertiserFilterProducts.forEach(retailer => {
              this.selectedRetailers.forEach(advertiser => {
                if (retailer.name == advertiser) {
                  this.retailerProductImages.push(retailer)
                }
              });
            });
          }
          this.ngxService.stopLoader("loader-01");
        }, (error: any) => {
          this.tagSummary = undefined;
          this.ngxService.stopLoader("loader-01");
          this.toastrService.error("No Product Found", "Error!");
        });
    }
    else {
      this.ngxService.stopLoader("loader-01");
    }
  }

  removeProxyCordinate(product: any) {
    this.sharedService.removeProxyCoordinate.next(product)
    this.modalService.dismissAll();
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

  onTagClick(tag) {
    const body = {
      id: tag.id,
      weight: -tag.weight
    }
    tag.weight = -tag.weight
    this.apiService.sendRequest(requests.updateTag, 'post', body).subscribe((data: any) => {
      this.getOptimizeAdsProducts('', false);
    });
  }

}
