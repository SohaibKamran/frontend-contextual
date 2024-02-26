import { Component, HostListener, OnInit, ViewChild, } from '@angular/core';
import { Router } from '@angular/router';
import { fabric } from 'fabric';
import { TaggerService } from './tagger.service';
import { Subject, take } from 'rxjs';
import { MatDialog } from "@angular/material/dialog";
import { ActorModalComponent } from './actor-modal/actor-modal.component';
import { SuperDataModalComponent } from './super-data-modal/super-data-modal.component';
import { EpisodeModalComponent } from './episode-modal/episode-modal.component';
import { TagSummaryComponent } from '../videos/tag-summary/tag-summary.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedService } from 'src/app/core/services/shared.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SceneNotesModalComponent } from './scene-notes-modal/scene-notes-modal.component';
import { FilterScenesModalComponent } from './filter-scenes-modal/filter-scenes-modal.component';
import { ProductRecordModalComponent } from '../videos/product-record-modal/product-record-modal.component';
import { ChatGptModalComponent } from './chat-gpt-modal/chat-gpt-modal.component';
import { EpisodePreviewComponent } from '../episode-preview/episode-preview.component';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
import { UploadService } from 'src/app/core/services/upload.service';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tagger',
  templateUrl: './tagger.component.html',
  styleUrls: ['./tagger.component.scss']
})
export class TaggerComponent implements OnInit {
  @ViewChild('sceneSubmittedModal') sceneSubmittedModal: any;
  googleSearch: any
  relativeSceneNo: any
  canvas: any;
  ctx: any;
  error: boolean = false
  flag: boolean = false;
  currX: number = 0;
  currY: number = 0;
  tagIdArray = []
  dot_flag: boolean = false;
  color: string = 'red';
  toggleScenes: boolean = false;
  scenesList: boolean = true;
  proxyScenes: boolean = false;
  insideCanvas = false;
  scrolledToStart = false;
  scrolledToEnd = false;
  div: any;
  imagePicked = false;
  mainSection = true;
  currentSceneId: any;
  currentScene: any;
  returnedPageNo: any;
  clickedOnSceneId: any
  loader = false;
  proxies = 0;
  currentSelectedTag = []
  breadCrumbItems: ({ label: string; active?: undefined; } | { label: string; active: boolean; })[];
  selectedObj: any;
  actorModal: any;
  actorName = '';
  actorImageSrc = '';
  count: any;
  objArray = []
  proxyProducts: any = [];
  droppedImgUrl: any;
  $videoFilter: Subject<any> = new Subject;
  staticImg: "https://cdna.lystit.com/520/650/n/photos/trendstack/d69c0894/fred-mello--Red-Cotton-Polo-Shirt.jpeg";
  sceneBody: any = {}
  searchTagIds = []
  canvasMade = false;
  constructCanvasVar = true;
  mainImageInCanvas = ''
  selectedTag = ''
  currentSelection: any;
  imgId: any;
  imgOrigWidth: any;
  imgOrigHeight: any;
  startClientX: any;
  startClientY: any;
  endClientX: any;
  endClientY: any;
  currentColor: any;
  colorArray: any = [];
  canvasHeight: any;
  canvasWidth: any;
  colorsTag = [];
  colorsArray = [];
  category1List = [];
  category2List = [];
  category3List = [];
  selectedTab = null;
  allScenes = [];
  noShow = true;
  allActors: any[] = [];
  firstRender = true;
  imageSearched = false;
  clickedOffsetX: any;
  clickedOffsetY: any;
  showInfo: any
  uploadEvent: any
  isLoading: boolean = false;
  pageNo: number = 1
  coordinateIdsArray: any = []
  userRole: number = null
  totalScenesCount: number
  isSubmitting: boolean = false;
  notesNotifications: number = 0;
  @ViewChild('slickModal', { static: true }) slickModal: SlickCarouselComponent;
  sceneFilter: any
  body: any = {}
  first_Render: boolean = true;
  showIdObservable
  mousePosition = {
    x: 0,
    y: 0
  };
  page = 1
  slideConfig = {
    "slidesToShow": 9.5,
    "slidesToScroll": 1,
    "swipeToSlide": true,
    "touchThreshold": 100,
    "infinite": false,
    "draggable": true,
    "arrows": false,
    responsive: [
      {
        breakpoint: 2400,
        settings: {
          slidesToShow: 8.5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 2000,
        settings: {
          slidesToShow: 7.5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1800,
        settings: {
          slidesToShow: 6.5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 5.5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 4.5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3.5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3.5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 390,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
        },
      },
    ],
  };;
  click = 0;
  scenesCount: number
  toggleLeft: boolean = false

  constructor(
    private ngxLoader: NgxSpinnerService,
    private dialog: MatDialog,
    private router: Router,
    public sharedService: SharedService,
    private apiService: ApiService,
    private taggerService: TaggerService,
    public modalService: NgbModal,
    public ngxService: NgxUiLoaderService,
    private fileUploadService: UploadService,
    private toastrService: ToastrService,
  ) {

    this.insideCanvas = false;
    this.imagePicked = false;
    this.breadCrumbItems = [
      { label: 'Indexing' },
      { label: 'Annotator', active: true }
    ];
  }

  ngOnInit(): void {
    this.userRole = JSON.parse(localStorage.getItem('role'))
    this.ngxLoader.show()
    this.getUserInfo()
    this.taggerService.getTags().subscribe(data => {
      this.category1List = data['data'];
      if (this.category1List?.length !== 0) {
        this.selectedTag = this.category1List[0]?.name
        this.category2List = this.category1List[0]?.subTags;
        if (this.category2List?.length !== 0) {
          this.selectedTab = this.category2List[0]?.name;
          this.category3List = this.category2List[0]?.subTags;
        }
      }
    })

    this.sharedService.tagIds?.subscribe(value => {
      if (value)
        this.currentSelectedTag = [...value]
    })

    this.sharedService.refreshPage?.subscribe(value => {
      const currentScene = this.allScenes.find((s) => s.id == value.currentSceneId)
      if (this.selectedObj) {
        this.selectedObj.taggingStatusId = 2;
        this.selectedObj.taggingStatusValue = "INPROGRESS";
      }
      if (currentScene)
        this.handleSceneSelectionid(currentScene)
    });

    this.sharedService.removeProxyCoordinate?.subscribe((value) => {
      if (value != null) {
        this.removeProxyProduct(value)
      }
    })

    if (this.sharedService.selectedTags) {
      this.sharedService.selectedTags.subscribe((res) => {
        this.searchString = ''
        for (let i = 0; i < res?.length; i++) {
          //Show the selected tags as tags and not single string
          this.currentTagSelected.push(res[i]?.name)
        }
      })
    }
    if (this.router.url == '/tagger/tag-video') {
      this.sharedService.showToolbar = true;
    }
    if (sessionStorage.getItem('showId')) {
      this.getActors()
      this.getShowByIdMethod()
    }
    else {
      this.ngxLoader.hide()
      this.firstRender = false;
    }
    this.getRecentProxies()
  }

  getShowByIdMethod() {
    this.showId = parseInt(sessionStorage.getItem('showId'))
    this.clickedOnSceneId = sessionStorage.getItem('sceneId') != "undefined" ? parseInt(sessionStorage.getItem('sceneId')) : undefined
    this.taggerService.getShowById(this.showId).subscribe((data: any) => {
      this.showInfo = data['data'];
      if (data?.data?.videoTypeValue == "EPISODE") {
        this.noShow = false;
        this.currentShowSelected = data['data'];
        this.currentEpisodeSelected = this.currentShowSelected.Episodes[0];
        this.taggerService.getAllScenesOfShow({
          showId: this.showId,
          pageNo: this.page,
          limit: 60,
          clickedOnSceneId: this.clickedOnSceneId
        }).subscribe((data: any) => {
          this.sharedService.returnedPageNo = data['data'].pageNo;
          this.allScenes = data['data'].rows;
          this.totalScenesCount = data?.data?.count
          if (this.clickedOnSceneId) {
            const clickedScene = this.allScenes?.find((scene) => scene?.id == this.clickedOnSceneId)
            this.selectedObj = clickedScene;
          }
          else
            this.selectedObj = data['data'].rows[0];
          setTimeout(() => {
            const slider = document.getElementById('scenes-slider');
            this.sliderWidth = slider.scrollWidth;
            this.scrollToScene(this.clickedOnSceneId)
          }, 50);
          this.page = data['data'].pageNo ?? this.page
          this.first_Render = false;
          this.handleSceneSelectionid(this.selectedObj)
        });
      } else {
        this.noShow = false;
        this.currentShowSelected = data['data'];
        this.currentEpisodeSelected = this.currentShowSelected;
        this.taggerService.getAllScenesOfShow({
          showId: this.showId,
          pageNo: this.page,
          limit: 60,
          clickedOnSceneId: this.clickedOnSceneId
        }).subscribe((data: any) => {
          this.sharedService.returnedPageNo = data['data'].pageNo;
          this.allScenes = data['data'].rows;
          this.totalScenesCount = data?.data?.count
          if (this.clickedOnSceneId) {
            const clickedScene = this.allScenes?.find((scene) => scene?.id == this.clickedOnSceneId)
            this.selectedObj = clickedScene;
          }
          else
            this.selectedObj = data['data'].rows[0];
          setTimeout(() => {
            const slider = document.getElementById('scenes-slider');
            this.sliderWidth = slider.scrollWidth;
            this.scrollToScene(this.clickedOnSceneId)
          }, 50);
          this.page = data['data'].pageNo ?? this.page
          this.first_Render = false;
          this.handleSceneSelectionid(this.selectedObj)
        });
      }
    })
  }

  transform(value: number, length: number): string {
    let paddedValue: any;
    if (value !== undefined && value !== null) {
      paddedValue = value.toString().padStart(length, '0');
      return paddedValue;
    }
    return "";
  }

  handleSceneSelectionid(scene: any) {
    this.currentScene = scene;
    this.proxyProducts = [];
    this.objArray = [];
    this.currentSceneId = scene?.id;
    this.relativeSceneNo = scene?.relativeSceneNo;
    this.selectedObj = scene
    this.mainImageInCanvas = scene?.thumbnail;
    this.sharedService.sceneThumbnail.next(scene?.thumbnail)
    let CoordinateIds = []

    if (this.canvasMade == true)
      this.canvas?.clear()
    if (this.firstRender == false && !this.modalService.hasOpenModals())
      this.ngxLoader.show('active-scene');
    this.constructCanvas()
    this.ngxService.startLoader("loader-10");
    // Scene Notes
    this.apiService.sendRequest(requests.getSceneNotes, 'post', { sceneId: this.currentSceneId }).subscribe((dataa: any) => {
      let allRecords = dataa.data;
      if (allRecords.length > 0)
        this.notesNotifications = allRecords.map(record => record.isCompleted ? 0 : 1).reduce((a, b) => a + b);
      else
        this.notesNotifications = 0;
      this.taggerService.getProductsOfScene(this.currentSceneId).subscribe(data => {
        this.getRecentProxies()
        this.proxyProducts = data['data']?.rows
        this.ngxService.stopLoader("loader-10");
        if (this.proxyProducts === null || this.proxyProducts?.length === 0) {
          this.objArray = [];
        }
        this.getSuperProxyImages();
        this.count = data['data'].count;
        this.currentIndex = this.proxyProducts?.length;
        for (let i = 0; i < this.proxyProducts?.length; i++) {
          if (this.proxyProducts[i]?.id)
            CoordinateIds.push(this.proxyProducts[i]?.id)
        }
        this.coordinateIdsArray = [...CoordinateIds]
        this.taggerService.coordinateIds.next(CoordinateIds)
        setTimeout(() => {
          this.translateProductCoorOntoCanvas()
          this.loader = true;
        }, 3000);
      }, err => {
        this.proxyProducts = []
        this.currentIndex = 0;
        this.ngxService.stopLoader("loader-10");
  
      })
    })

  }
  async toggleSceneRight() {
    this.ngxLoader.show('active-scene');
    let toReturn = false
    //Handling custom scene changing
    const lastSceneInArray = this.allScenes[this.allScenes?.length - 1];
    if (lastSceneInArray?.id === this.currentSceneId) {
      this.page += 1
      this.toggleLeft = false;
      await this.fetchScenes()
    }
    //Ends here
    for (let x = 0; x < this.allScenes?.length; x++) {
      if (this.allScenes[x].id == this.currentSceneId && toReturn == false) {
        if (this.allScenes[x + 1]) {
          this.currentSceneId = this.allScenes[x + 1].id;
          this.relativeSceneNo = this.allScenes[x + 1].relativeSceneNo;
          this.mainImageInCanvas = this.allScenes[x + 1].thumbnail;
          this.currentScene = this.allScenes[x + 1];
        }
        else {
          this.currentScene = this.allScenes[0]
          this.currentSceneId = this.allScenes[0].id;
          this.relativeSceneNo = this.allScenes[0].relativeSceneNo;
          this.mainImageInCanvas = this.allScenes[0].thumbnail;
        }
        // this.currentScene = scene;
        sessionStorage.setItem("sceneId", this.currentSceneId)
        this.handleSceneSelectionid(this.currentScene)
        return;
      }
    }
    // Scene Notes
    this.apiService.sendRequest(requests.getSceneNotes, 'post', { sceneId: this.currentSceneId }).subscribe((data: any) => {
      let allRecords = data.data;
      if (allRecords.length > 0)
        this.notesNotifications = allRecords.map(record => record.isCompleted ? 0 : 1).reduce((a, b) => a + b);
      else
        this.notesNotifications = 0;
    })
  }

  toggleMainSection() {
    this.mainSection = !(this.mainSection)
  }

  async toggleSceneLeft() {
    this.ngxLoader.show('active-scene');
    let toReturn = false
    //Handling custom scene changing
    const firstSceneInArray = this.allScenes?.[0];
    if (firstSceneInArray?.id === this.currentSceneId) {
      this.page -= 1
      this.toggleLeft = true;
      await this.fetchScenes()
    }
    //Ends Here
    for (let x = 0; x < this.allScenes.length; x++) {
      if (this.allScenes[x].id == this.currentSceneId && toReturn == false) {
        if (this.allScenes[x - 1]) {
          this.currentSceneId = this.allScenes[x - 1].id;
          this.relativeSceneNo = this.allScenes[x - 1].relativeSceneNo;
          this.mainImageInCanvas = this.allScenes[x - 1].thumbnail;
          this.currentScene = this.allScenes[x - 1];
        }
        else {
          this.currentScene = this.allScenes[this.allScenes.length - 1]
          this.currentSceneId = this.allScenes[this.allScenes.length - 1].id;
          this.relativeSceneNo = this.allScenes[this.allScenes.length - 1].relativeSceneNo;
          this.mainImageInCanvas = this.allScenes[this.allScenes.length - 1].thumbnail;
        }
        sessionStorage.setItem("sceneId", this.currentSceneId)
        this.handleSceneSelectionid(this.currentScene)
        return;
      }
    }
    // Scene Notes
    this.apiService.sendRequest(requests.getSceneNotes, 'post', { sceneId: this.currentSceneId }).subscribe((data: any) => {
      let allRecords = data.data;
      if (allRecords.length > 0)
        this.notesNotifications = allRecords.map(record => record.isCompleted ? 0 : 1).reduce((a, b) => a + b);
      else
        this.notesNotifications = 0;
    })
  }

  redirectToVideosTab() {
    this.router.navigate(['/tagger/video'])
  }

  translateProductCoorOntoCanvas() {
    this.colorArray = [];
    for (let x in this.proxyProducts) {
      this.colorArray.push(this.proxyProducts[x].coordinateColor)
      //Have to do it dynamically
      this.currX = ((this.proxyProducts[x]?.xCoordinate) * this.scaleRatio) + this.canvas?.backgroundImage?.left;
      this.currY = ((this.proxyProducts[x]?.yCoordinate) * this.scaleRatio) + this.canvas?.backgroundImage?.top;
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
        this.ctx.fillStyle = this.proxyProducts[x]?.coordinateColor
        this.ctx.arc(this.currX, this.currY, 4, 0, 2 * Math.PI);
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 2
        this.ctx.fill()
        this.ctx.stroke();
        this.dot_flag = false;
      }
    }
    this.ngxLoader.hide('active-scene');
  }

  scaleRatio;
  globalEvent: any;
  constructCanvas() {
    this.canvasMade = true;
    this.constructCanvasVar = true
    setTimeout(() => {
      let img = new Image();
      if (!this.canvas) {
        this.canvas = new fabric.Canvas('canvas');
      }
      this.canvas.height = document.getElementById('canvasCon').clientHeight
      this.canvas.width = document.getElementById('canvasCon').clientWidth;
      this.ctx = this.canvas.getContext('2d');
      var self = this
      img.onload = function () {
        self.scaleRatio = Math.min((self.canvas.width / img.width), (self.canvas.height / img.height))
        img.width = self.canvas.width
        img.height = self.canvas.height
        self.canvas.setDimensions({ width: self.canvas.width, height: self.canvas.height });
        var fabricImage = new fabric.Image(img);
        fabricImage.set({
          scaleX: self.scaleRatio,
          scaleY: self.scaleRatio,
        });
        self.canvas.setBackgroundImage(fabricImage).renderAll()
        self.canvas.backgroundImage.center()
        self.canvas.renderAll()
        self.canvas.on('drop', (options: any) => {
          self.globalEvent = options.e;
        })
      };
      img.src = self.mainImageInCanvas
      this.firstRender = false
      this.ngxLoader.hide()
      this.ngxLoader.hide('active-scene');
    }, 2000);

  }

  createCanvas() {
    if (!this.canvas) {
      this.canvas = new fabric.Canvas('canvas');
    }
  }

  changeTag(item) {
    this.selectedTag = item.name;
    const secondLevel = this.category1List.find(cat => cat.name.includes(item.name))
    this.category2List = secondLevel?.subTags;
    this.activeItemIndex = 0;
    this.category3List = this.category2List[0]?.subTags;
    this.selectedTab = this.category2List[0]?.name;
  }
  tempProductImages: string[] = [
  ];
  setScenesList() {
    this.scenesList = true;
    this.proxyScenes = false;
  }
  setProxyScenes() {
    this.scenesList = false;
    this.proxyScenes = true;
  }
  toggle() {
    this.toggleScenes = !this.toggleScenes;
  }

  transformPayloadProductObj(productInput: any) {

    let product = productInput
    product.coordinates = {
      x: product?.xCoordinate,
      y: product?.yCoordinate
    }
    product.actorId = product?.Actor?.id;
    product.tagIds = [];
    product.products = []
    for (let x in product.Tags) {
      product.tagIds.push(product?.Tags[x]?.id)
    }
    if (product.tagIds.length == 0) {
      product.tagIds = this.tagsToInputProxyResult
    }
    for (let x in product.CoordinateHasProducts) {
      let obj = {
        productTag: product?.CoordinateHasProducts[x]?.tag,
        productId: product?.CoordinateHasProducts[x]?.Product?.id
      }
      let str = '';
      for (let t in obj.productTag) {
        str = str + obj.productTag[t] + ' '
      }
      let newObj = {
        productTag: str,
        productId: obj.productId
      }
      product.products.push(newObj)
    }
    this.taggerService.addProductOfScene(product).subscribe();
  }

  currentTagger: any;
  getUserInfo() {
    this.apiService.sendRequest(requests.getUserProfile, 'post').subscribe((res: any) => {
      this.currentTagger = res?.data;
    })
  }

  episodeModal: any;
  episodeModalOpen() {
    this.episodeModal = this.dialog.open(EpisodeModalComponent, {
      data: { currentShow: this.currentShowSelected, currentTagger: this.currentTagger }
    })

    this.episodeModal.componentInstance.passEntry.subscribe((receivedEntry) => {
      this.taggerService.showId.next(receivedEntry)
      this.getShowByIdMethod()

    })
  }


  actorSelect(name: any, imgSrc: any, id: any) {
    let index = this.currentSelection
    this.actorName = name;
    this.actorImageSrc = imgSrc;
    let actorObj = {
      name: this.actorName,
      imageUrl: this.actorImageSrc,
      id: id
    }
    this.proxyProducts[index].Actor = actorObj
    this.proxyProducts[index].actorId = id
    this.transformPayloadProductObj(this.proxyProducts[index])

  }
  setCurrentSelection(i: any) {
    this.currentSelection = i;
    this.taggerService.currentItemSelected = this.proxyProducts[i];
    this.taggerService.selectActor()
    this.actorModal = this.dialog.open(ActorModalComponent)
    this.actorModal.afterClosed().subscribe(data => {
      this.actorSelect(data.name, data.imageUrl, data.id)
    })
  }
  superModal: any;
  openSuperDataModal() {
    this.superModal = this.dialog.open(SuperDataModalComponent, {
      data: {
        currentProxyProduct: this.currentProxyProduct, allProducts: this.allProducts,
        currentTagSelected: this.currentTagSelected
      }
    }
    )
    this.superModal.afterClosed().subscribe(data => {
      let tagStr = '';
      for (let x in this.currentProxyProduct?.Tags) {
        tagStr = tagStr + ' ' + this.currentProxyProduct?.Tags[x].name + ' '
      }
      if (tagStr != '') {
        for (let x in this.currentProxyProduct.CoordinateHasProducts) {
          this.currentProxyProduct.CoordinateHasProducts[x].tag = tagStr;
        }
      }
      this.transformPayloadProductObj(this.currentProxyProduct)
    })
  }

  getNewColor() {
    let n = (Math.random() * 0xfffff * 1000000).toString(16);
    this.currentColor = '#' + n.slice(0, 6)
    if (this.colorArray.includes(this.currentColor)) {
      this.getNewColor()
    }

    this.colorArray.push(this.currentColor)
    return this.currentColor
  };
  findCoordinates(res, e) {
    if (res == 'down') {
      this.currX = e.pageX - this.canvas._offset.left
      this.currY = e.pageY - this.canvas._offset.top;
      this.currX = Math.floor(this.currX)
      this.currY = Math.floor(this.currY)
      if (this.currY > (this.canvas.backgroundImage.height * this.canvas.backgroundImage.scaleY)) return false;
      this.proxyProducts[this.currentIndex].coordinates.x = this.currX / this.scaleRatio;
      this.proxyProducts[this.currentIndex].coordinates.y = this.currY / this.scaleRatio;
      this.proxyProducts[this.currentIndex].yCoordinate = this.currY / this.scaleRatio;
      this.proxyProducts[this.currentIndex].xCoordinate = this.currX / this.scaleRatio;
      if (this.currY < 0) this.currY = e.clientY
      this.sharedService.cordinateX.next(this.currX);
      this.sharedService.cordinateY.next(this.currY);
      this.flag = true;
      this.dot_flag = true;
      if (this.dot_flag) {
        this.ctx.beginPath();
        this.ctx.fillStyle = this.getNewColor().toString();
        this.ctx.arc(this.currX, this.currY, 4, 0, 2 * Math.PI);
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 2
        this.ctx.fill()
        this.ctx.stroke();
        this.dot_flag = false;
        this.imagePicked = false;
      }
    }
    return true
  }

  currentIndex = 0;

  ondrop() {
    this.dragend(event)
  }
  removeCheck() {
    this.dragtrue = false;
  }
  dragtrue = false;
  checkForImage(event: any) {
    this.dragtrue = true;
  }
  sliderEnabled = true;
  recentProxyDragStart(data: any) {
    this.fromRecentProxiesData = data;
    this.sliderEnabled = false;
  }
  fromRecentProxiesData = null;
  dragstart(event, fromRecentProxiesFlag?: boolean, recentProxy?: any) {
    if (fromRecentProxiesFlag) {
      this.fromRecentProxiesData = recentProxy;
    }
    if (!this.canvas) return;
    this.imgId = event.srcElement.id;
    this.startClientX = event.clientX;
    this.startClientY = event.clientY;
    this.imagePickedSrc = event.srcElement.currentSrc;
    event.srcElement.style.boxShadow = 'none';
    event.srcElement.style.filter = 'none';
    this.imgOrigHeight = event.srcElement.style.height
    this.imgOrigWidth = event.srcElement.style.width
    this.imagePicked = true;
    let el = document.getElementsByClassName('tag-scene'); //canvas element
    el[0].scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    });
  }

  async uploadFileToBucket() {
    await this.taggerService.getFileBuffer(this.droppedImgUrl)
      .toPromise().then(async (ress: ArrayBuffer) => {
        const fileBlob = new Blob([ress]);
        const filename = Date.now().toString();
        const imageFile = new File([fileBlob], filename, {
          type: 'image/jpeg',
        })
        await this.fileUploadService.uploadFile({ file: imageFile })
          .toPromise().then(
            async (res: any) => {
              // this.droppedImgUrl = res[0];
              await this.taggerService.apiForFetchingCorrectLinkForPR(res[0]).toPromise().then((data: any) => {
                console.log(data);
                this.droppedImgUrl = data.data;
              })
            }).catch((err) => {
              console.log(err)
            });
      })
      .catch((err) => {
        console.log(err)
      });
  }

  async dragend(event: any) {
    this.sliderEnabled = true;
    if (!this.globalEvent) this.globalEvent = event;
    const pointer = this.canvas.getPointer(this.globalEvent);
    // Check if the click is within the empty space area
    if (pointer.x > (this.canvas.backgroundImage.width * this.canvas.getZoom() * this.canvas.backgroundImage.scaleX) + this.canvas.backgroundImage.left
      ||
      pointer.y > (this.canvas.backgroundImage.height * this.canvas.getZoom() * this.canvas.backgroundImage.scaleY) + this.canvas.backgroundImage.top
    ) {
      console.log('Clicked on the empty space!');
      return;
    }
    if (pointer.x < this.canvas.backgroundImage.left
      ||
      pointer.y < this.canvas.backgroundImage.top
    ) {
      console.log('Clicked on the empty space!');
      return;
    }

    event.srcElement.style.height = this.imgOrigHeight
    event.srcElement.style.width = this.imgOrigWidth
    this.droppedImgUrl = event.srcElement.currentSrc ?? this.droppedImgUrl
    this.ngxService.startLoader("loader-03");
    if (event.srcElement.currentSrc && (!this.fromRecentProxiesData || this.fromRecentProxiesData.length == 0)) {
      await this.uploadFileToBucket();
    }
    if (event?.dataTransfer?.dropEffect == 'none') {
      this.ngxService.stopLoader("loader-03");
      return
    };
    if (!this.canvas) {
      this.ngxService.stopLoader("loader-03");
      return
    };
    event.srcElement.style.height = this.imgOrigHeight
    event.srcElement.style.width = this.imgOrigWidth
    this.currentTagSelectedIds = [...new Set(this.currentTagSelectedIds)];
    this.tagsToInputProxyResult = this.currentTagSelectedIds;
    event.srcElement.style.height = this.imgOrigHeight
    event.srcElement.style.width = this.imgOrigWidth
    this.endClientX = this.globalEvent.clientX;
    this.endClientY = this.globalEvent.clientY;


    let obj = {
      'proxyImageUrl': this.droppedImgUrl,
      'coordinates': {
        "x": 1,
        "y": 1
      },
      'color': 'Red',
      'gender': 'Male',
      'pattern': 'dotted',
      'xCoordinate': 1,
      'yCoordinate': 1,
      'products': [],
      'tags': [],
      'coordinateColor': '',
      'sceneId': this.currentSceneId
    }
    this.proxyProducts.push(obj);
    let ff = this.findCoordinates('down', this.globalEvent);
    if (!ff) {
      this.ngxService.stopLoader("loader-03");
      return
    };
    this.proxyProducts[this.currentIndex].coordinateColor = this.currentColor
    this.proxyProducts[this.currentIndex].color = this.currentColor
    this.imagePickedSrc = ''
    setTimeout(() => {
      this.proxyProducts[this.currentIndex].tagIds = this.tagsToInputProxyResult;
      delete this.proxyProducts[this.currentIndex].tags
      if (this.sharedService.proxyImageId.length !== 0) {
        this.searchTagIds = [];
        for (let x in this.sharedService.proxyImageId) {
          this.searchTagIds.push(this.sharedService.proxyImageId[x].id)
        }
      }
      let bodytagIds = [];
      if (this.imageSearched === true) {
        bodytagIds = this.searchTagIds
      } else {
        bodytagIds = this.currentTagSelectedIds;
      }
      const body = {
        sceneId: this.currentSceneId,
        proxyImageUrl: this.droppedImgUrl,
        coordinates: {
          x: (this.currX - this.canvas.backgroundImage.left) / this.scaleRatio,
          y: (this.currY - this.canvas.backgroundImage.top) / this.scaleRatio
        },
        color: this.currentColor,
        coordinateColor: this.currentColor,
        canvasHeight: +this.canvas.width,
        canvasWidth: this.scaleRatio,
        showId: this.showId,
        tagIds: bodytagIds?.length !== 0 ? bodytagIds : undefined
      }
      if (body?.tagIds?.length === 0) {
      }
      this.ngxService.stopLoader("loader-03");
      if (!this.fromRecentProxiesData || this.fromRecentProxiesData.length == 0) {
        this.apiService.sendRequest(requests.tagProductInScene, 'post', body)
          .subscribe((res: any) => {
            bodytagIds = [];
            this.sharedService.proxyImageId = [];
            this.proxyProducts.pop();
            this.proxyProducts.push(res?.data)
            let CoordinateIds = []
            for (let i = 0; i < this.proxyProducts?.length; i++) {
              if (this.proxyProducts[i]?.id)
                CoordinateIds.push(this.proxyProducts[i]?.id)
            }
            this.taggerService.coordinateIds.next(CoordinateIds)
            this.file = null
            this.isSubmitting = false;
            const sceneIndex = this.allScenes.findIndex(s => s.id == this.currentSceneId);
            if (sceneIndex !== undefined)
              this.allScenes[sceneIndex].productRecordsCount += 1;
            this.productRecordModal(1, res?.data?.id);
          })
        this.sharedService.screen.next(1)
        this.sharedService.sceneId.next(this.currentSceneId)
        this.sharedService.incrementRecord.next(1)
        this.sharedService.showId.next(this.showId)
        this.sharedService.droppedImageUrl = this.droppedImgUrl
        this.currentIndex++;
        this.mouseIn = false
      }
      else {
        let newBody = {
          "sceneId": this.currentSceneId,
          "showId": this.currentShowSelected.id,
          "existingCoordinateId": this.fromRecentProxiesData[1].id,
          "coordinates": {
            x: (this.currX - this.canvas.backgroundImage.left) / this.scaleRatio,
            y: (this.currY - this.canvas.backgroundImage.top) / this.scaleRatio
          },
          "coordinateColor": this.currentColor,
          "canvasHeight": +this.canvas.width,
          "canvasWidth": this.scaleRatio,
        }
        this.ngxService.startLoader('loader-recent');
        this.apiService.sendRequest(requests.tagRecentProxies, 'post', newBody).subscribe(data => {
          this.fetchScenes();
          this.getShowByIdMethod();
          this.fromRecentProxiesData = null;
          this.sharedService.screen.next(1)
          this.sharedService.sceneId.next(this.currentSceneId)
          this.sharedService.incrementRecord.next(1)
          this.sharedService.showId.next(this.showId)
          this.sharedService.droppedImageUrl = this.droppedImgUrl
          this.currentIndex++;
          this.mouseIn = false
          this.handleSceneSelectionid(this.currentScene)
        }, err => {
          this.fromRecentProxiesData = null;
          this.sharedService.screen.next(1)
          this.sharedService.sceneId.next(this.currentSceneId)
          this.sharedService.incrementRecord.next(1)
          this.sharedService.showId.next(this.showId)
          this.sharedService.droppedImageUrl = this.droppedImgUrl
          this.currentIndex++;
          this.mouseIn = false
          this.handleSceneSelectionid(this.currentScene)
        })
      }

    }, 1000);
  }
  removeProxyProduct(product: any) {
    let body = null;
    if (product?.id) {
      body = {
        coordinateId: product.id
      }
    }
    else {
      body = {
        yCoordinate: product.yCoordinate,
        xCoordinate: product.xCoordinate,
        sceneId: product.sceneId
      }
    }
    this.taggerService.removeCoordinate(body).subscribe(data => {
      this.currentIndex--
      const sceneIndex = this.allScenes.findIndex(s => s.id == this.currentSceneId);
      if (sceneIndex !== undefined) {
        this.allScenes[sceneIndex].productRecordsCount -= 1;
      }
      if (this.allScenes[sceneIndex].productRecordsCount == 0) {
        this.selectedObj.taggingStatusId = 1;
        this.selectedObj.taggingStatusValue = "TODO";
      }
      this.handleSceneSelectionid(this.currentScene)
    })
  }

  removeSuperProxy(product: any) {
    const proxyProduct = product?.CoordinateHasProducts?.find(p => p.superProxy === true);
    const body = {
      id: proxyProduct.proxyCoordinateId,
      removeSuperProxy: true
    }

    this.apiService.sendRequest(requests.updateTagProductInScene, 'post', body)
      .subscribe((res) => {
        this.currentIndex--
        this.handleSceneSelectionid(this.currentScene)
      })
  }

  mouseDown = false;
  startX: any;
  scrollLeft: any;
  scrollTagStart(event: any) {
    let slider: any = document.getElementsByClassName('tab-pane fade show active')['pills-home']
    this.mouseDown = true;
    this.startX = event.pageX - slider.offsetLeft;
    this.scrollLeft = slider.scrollLeft;
  }
  scrollTagMove(event: any) {
    let slider: any = document.getElementsByClassName('tab-pane fade show active')['pills-home']

    if (!this.mouseDown) return;
    event.preventDefault();
    const x = event.pageX - slider.offsetLeft;
    const walk = (x - this.startX) * 3; //scroll-fast
    slider.scrollLeft = this.scrollLeft - walk;
  }
  scrollTagEnd(event: any) {
    this.mouseDown = false;
  }
  scrollTagStart2(event: any) {
    let slider: any = document.getElementsByClassName('tab-pane fade')['pills-profile']
    this.mouseDown = true;
    this.startX = event.pageX - slider.offsetLeft;
    this.scrollLeft = slider.scrollLeft;
  }
  scrollTagMove2(event: any) {
    let slider: any = document.getElementsByClassName('tab-pane fade')['pills-profile']

    if (!this.mouseDown) return;
    event.preventDefault();
    const x = event.pageX - slider.offsetLeft;
    const walk = (x - this.startX) * 3; //scroll-fast
    slider.scrollLeft = this.scrollLeft - walk;
  }
  scrollTagEnd2(event: any) {
    this.mouseDown = false;
  }
  scrollTagStart3(event: any) {
    let slider: any = document.getElementsByClassName('tab-pane fade')['pills-contact']
    this.mouseDown = true;
    this.startX = event.pageX - slider.offsetLeft;
    this.scrollLeft = slider.scrollLeft;
  }
  scrollTagMove3(event: any) {
    let slider: any = document.getElementsByClassName('tab-pane fade')['pills-contact']

    if (!this.mouseDown) return;
    event.preventDefault();
    const x = event.pageX - slider.offsetLeft;
    const walk = (x - this.startX) * 3; //scroll-fast
    slider.scrollLeft = this.scrollLeft - walk;
  }
  scrollTagEnd3(event: any) {
    this.mouseDown = false;
  }
  showId: any;
  sceneId: any;
  currentShowSelected = {
    Episodes: [],
    createdAt: '',
    deletedAt: '',
    description: '',
    episodeNo: 0,
    percentage: 0,
    id: 0,
    length: 0,
    seasonNo: 0,
    showCategoryId: 0,
    showId: 0,
    thumbnail: '',
    title: '',
    totalEpisodes: 0,
    totalScenes: 0,
    updatedAt: '',
    videoUrl: ''
  };
  currentEpisodeSelected: any = {
    createdAt: '',
    deletedAt: '',
    description: '',
    episodeNo: 0,
    id: 0,
    length: 0,
    seasonNo: 0,
    showCategoryId: 0,
    showId: 0,
    thumbnail: '',
    title: '',
    totalEpisodes: 0,
    totalScenes: 0,
    updatedAt: '',
    videoUrl: ''
  };

  getActors() {
    this.taggerService.getActors().subscribe(data => {
      this.allActors = data['data']
    })
  }
  goToVideos() {
    this.router.navigate(['/tagger/video'])
  }

  activeItemIndex: number = 0; // Assuming the initial active item is the first item

  setCategory3List(item) {
    this.category3List = item?.subTags;
    this.selectedTab = item?.name;
  }


  ngAfterViewInit() {
    this.div = document.getElementsByClassName('tag-scene')[0];
    this.imagePicked = false;
    this.insideCanvas = true
  }
  recentProxies = [];
  getRecentProxies() {
    this.taggerService.getRecentSuperProxies(this.showId).subscribe(data => {
      this.recentProxies = data['data']['rows'];
      this.ngxService.stopLoader('loader-recent')
    })
  }

  staticModal(uploadProxyImageModal: any, event) {
    this.uploadEvent = event;
    this.clickedOffsetX = event.offsetX;
    this.clickedOffsetX = event.offsetY;
    this.modalService.open(uploadProxyImageModal, {
      backdrop: "static",
      keyboard: true,
      centered: true,
      windowClass: 'modal-md'
    });
  }

  file: any = null;
  onChange(event) {
    console.log(event);
    this.globalEvent = null;
    this.file = event.target.files[0];
    if (!this.file?.type?.includes('image')) {
      this.error = true;
      return;
    }
    else {
      this.error = false;
      this.dragtrue = false;
      this.onUpload(event)
    }
  }

  onProxyModalClose() {
    this.file = null;
    this.error = false;
    this.modalService.dismissAll()
  }

  onUpload($event) {
    this.isSubmitting = true;
    console.log(this.file)
    this.fileUploadService.uploadFile({ file: this.file }).subscribe(
      (res: any) => {
        this.droppedImgUrl = res[0];
        this.modalService.dismissAll()
        this.dragend(this.uploadEvent)
      },
      (err: any) => {
        console.log(err);
        this.isSubmitting = false;
        this.error = false;
        this.file = null;
        this.toastrService.error('File Format not supoorted')
      }
    );
  }


  imagePickedSrc = ''
  mouseIn = false;
  searchNumber = 41

  singleSearch = false;
  paginationSearchFunction() {
    this.isLoading = true
    this.sharedService.tagIds.next(this.currentSelectedTag)

    if (this.singleSearch == false) {
      let tempStr = ''
      for (let x in this.currentTagSelected) {
        tempStr = tempStr + this.currentTagSelected[x] + ' '
      }
      this.ngxService.startLoader('searchLoader')
      this.taggerService.getGoogleSearch(tempStr + this.searchString, this.searchNumber).subscribe((data) => {
        for (let x in data.items) {
          this.tempProductImages.push(data.items[x].link)
        }
        this.searchNumber = this.searchNumber + 10;
        this.taggerService.getGoogleSearch(tempStr + this.searchString, this.searchNumber).subscribe((data) => {
          for (let x in data.items) {
            this.tempProductImages.push(data.items[x].link)
          }
          this.searchNumber = this.searchNumber + 10;
          this.ngxService.stopLoader('searchLoader')
          this.isLoading = false;
        },
          (error) => {
            this.ngxService.stopLoader('searchLoader')
            this.isLoading = false;
          })
      },
        (error) => {
          this.ngxService.stopLoader('searchLoader')
          this.isLoading = false;
        }
      )
    }
    else {
      this.ngxService.startLoader('searchLoader')
      this.taggerService.getGoogleSearch(this.tagsToInputProxyResult[0].name, this.searchNumber).subscribe((data) => {
        for (let x in data.items) {
          this.tempProductImages.push(data.items[x].link)
        }
        this.searchNumber = this.searchNumber + 10;
        this.taggerService.getGoogleSearch(this.tagsToInputProxyResult[0].name, this.searchNumber).subscribe((data) => {
          for (let x in data.items) {
            this.tempProductImages.push(data.items[x].link)
          }
          this.searchNumber = this.searchNumber + 10;
          this.ngxService.stopLoader('searchLoader')
          this.isLoading = false;
        },
          (error) => {
            this.ngxService.stopLoader('searchLoader')
            this.isLoading = false;
          }
        )
      },
        (error) => {
          this.ngxService.stopLoader('searchLoader')
          this.isLoading = false;
        }
      )
    }
  }
  searchString = ''
  searchColorSelected = '';
  searchColors = []
  tagsToInputProxyResult = [];
  finalStr = 'default'
  isAllSpaces = (str: string): boolean => {
    return /^\s*$/.test(str);
  };

  //Made multiple API calls to google api as google API provides 10 results per page and client wants more results.
  //This change is done in both searchFunction and paginationSearchFunction.
  searchFunction() {
    if (this.isAllSpaces(this.searchString) && this.currentTagSelected.length == 0) return
    if (this.searchString == '' && this.currentTagSelected.length == 0) return;
    else if (this.searchString == '' && this.currentTagSelected.length > 0) this.searchString = ''
    this.singleSearch = false;
    //Client want just his provided categories to be displayed
    //Below method is used if client want to add the custom search of tagger to be added in list of categories.
    if (this.searchString != '')
      this.searchStringHasNoTagMatch()
    else this.currentTagSelectedIds = []
    let totalData = [];
    for (let i = 0; i < this.currentSelectedTag?.length; i++) {
      this.currentTagSelectedIds.push(this.currentSelectedTag[i]?.id)
    }
    this.currentTagSelectedIds = [...new Set(this.currentTagSelectedIds)];
    let tempString = ''
    for (let x in this.currentTagSelected) {
      tempString = tempString + this.currentTagSelected[x] + ' '
    }
    let newStr = tempString != "" ? tempString + ' ' + this.searchString : this.searchString
    this.finalStr = newStr;
    this.ngxService.startLoader('searchLoader')

    this.taggerService.getGoogleSearch(newStr, 0).subscribe((data) => {
      for (let x in data.items) {
        totalData.push(data.items[x].link)
      }
      this.tempProductImages = []
      this.tempProductImages = totalData
      this.taggerService.getGoogleSearch(newStr, 11).subscribe(data => {
        for (let x in data.items) {
          this.tempProductImages.push(data.items[x].link)
        }
        this.taggerService.getGoogleSearch(newStr, 21).subscribe(data => {
          for (let x in data.items) {
            this.tempProductImages.push(data.items[x].link)
          }
          this.taggerService.getGoogleSearch(newStr, 31).subscribe(data => {
            for (let x in data.items) {
              this.tempProductImages.push(data.items[x].link)
            }
            this.ngxService.stopLoader('searchLoader')
          },
            (error) => {
              this.ngxService.stopLoader('searchLoader')
            })
        },
          (error) => {
            this.ngxService.stopLoader('searchLoader')
          })
      },
        (error) => {
          this.ngxService.stopLoader('searchLoader')
        })
    },
      (error) => {
        this.ngxService.stopLoader('searchLoader')
      }
    )
  }
  clearSearch() {
    this.searchString = '';
    this.currentTagSelected = []
    this.currentTagSelectedIds = [];
    this.currentSelectedTag = []
  }
  singleTagSearchFunction(tag: any) {
    this.singleSearch = true;
    this.tagsToInputProxyResult = [];
    this.currentTagSelectedIds = []
    this.tagsToInputProxyResult.push(tag)
    this.currentTagSelectedIds.push(tag.id)
    this.imageSearched = false;
    this.ngxService.startLoader('searchLoader')

    this.taggerService.getGoogleSearch(tag.name, 0).subscribe(data => {
      let totalData = []
      for (let x in data.items) {
        totalData.push(data.items[x].link)
      }
      this.tempProductImages = []
      this.tempProductImages = totalData
      this.taggerService.getGoogleSearch(tag.name, 11).subscribe(data => {
        for (let x in data.items) {
          this.tempProductImages.push(data.items[x].link)
        }
        this.taggerService.getGoogleSearch(tag.name, 21).subscribe(data => {
          for (let x in data.items) {
            this.tempProductImages.push(data.items[x].link)
          }
          this.taggerService.getGoogleSearch(tag.name, 31).subscribe(data => {
            for (let x in data.items) {
              this.tempProductImages.push(data.items[x].link)
            }
            this.ngxService.stopLoader('searchLoader')
          }, (err) => this.ngxService.stopLoader('searchLoader'))
        }, (err) => this.ngxService.stopLoader('searchLoader'))
      }, (err) => this.ngxService.stopLoader('searchLoader'))
    }, (err) => this.ngxService.stopLoader('searchLoader'))
  }
  searchStringHasNoTagMatch() {
    let words: string[] = this.searchString.split(' ');
    this.currentTagSelectedIds = this.currentTagSelectedIds.filter(idA => this.currentSelectedTag.some(objB => objB.id === idA));
    for (let x in words) {
      this.taggerService.addTag(words[x], null).subscribe((data: any) => {
        this.currentTagSelectedIds.push(data['data']?.[0].id);
        let tag = []
        for (let i = 0; i < data['data'].length; i++) {
          tag.push(
            {
              id: data['data'][i].id,
              name: data['data'][i].name
            }
          )
        }
        this.sharedService.proxyImageId.push(tag);
      })
    }
    return;
  }
  onScrollSearchResults(event: any) {
    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) { }
  }

  @HostListener('scroll', ['$event'])
  onScrollSearch(event: any) {
    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight - 1) {
      // code
      if (!this.isLoading && this.searchNumber < 200)
        this.paginationSearchFunction()
    }
  }
  currentTagSelected = []
  tagSelectionForDrop: any;
  dropOnSearchDiv() {
    this.selectTag(this.tagSelectionForDrop)

  }

  currentTagSelectedIds = []
  removeTagFromSearchBar(tag: any) {
    for (let x = 0; x < this.currentTagSelected.length; x++) {
      if (this.currentTagSelected[x] == tag) {
        this.currentTagSelected.splice(x, 1)
        this.currentTagSelectedIds.splice(x, 1)
        this.currentSelectedTag.splice(x, 1)
        return;
      }
    }
  }
  selectTag(tag: any) {
    if (this.currentTagSelected.length == 0) {
      this.currentTagSelectedIds = []
    }
    if (this.currentTagSelected.includes(tag.name)) return;
    this.currentTagSelected.push(tag.name)
    this.currentTagSelectedIds.push(tag.id)
    this.currentSelectedTag.push(tag)
  }
  currentProxyProduct: any;
  currentProxyProductSelected(item: any) {
    this.currentProxyProduct = item;
    this.getAllProducts()

  }
  allProducts = []
  selectedProducts = [];
  getAllProducts() {
    this.taggerService.getAllProducts().subscribe(data => {
      this.allProducts = data['data'].rows;

      this.openSuperDataModal()
    })

  }
  checkIfInList(product: any) {
    let check = false;
    for (let x in this.currentProxyProduct.CoordinateHasProducts) {
      if (this.currentProxyProduct.CoordinateHasProducts[x].Product.id == product.id) {
        check = true;
        break;
      }
    }
    return check;
  }
  selectProduct(product: any) {
    this.selectedProducts.push(product)
    let obj = {
      "Product": product,
      "tag": this.finalStr
    }
    let dontAdd = false;
    for (let x in this.currentProxyProduct.CoordinateHasProducts) {
      if (this.currentProxyProduct.CoordinateHasProducts[x].Product.id == product.id) {
        dontAdd = true;
      }
    }
    if (dontAdd == false) {
      this.currentProxyProduct.CoordinateHasProducts.push(obj);
    }
  }
  removeProduct(product: any) {
    for (let x in this.selectedProducts) {
      if (this.selectedProducts[x] == product) {
        this.selectedProducts.splice(parseInt(x), 1)
      }
    }
    for (let x in this.currentProxyProduct.CoordinateHasProducts) {
      if (this.currentProxyProduct.CoordinateHasProducts[x].Product.id == product.id) {
        this.currentProxyProduct.CoordinateHasProducts.splice(parseInt(x), 1)
      }
    }
  }
  saveSuperData() {
    let obj = this.currentProxyProduct
    obj.products = [];
    for (let x in obj.CoordinateHasProducts) {
      let newobj = {
        "productTag": obj.CoordinateHasProducts[x].tag,
        "productId": obj.CoordinateHasProducts[x].Product.id
      }
      obj.products.push(newobj)
    }
    obj.coordinates =
    {
      "x": obj.xCoordinate,
      "y": obj.yCoordinate
    }
    obj.xCoordinate;
    obj.yCoordinate;
    obj.Actor
    obj.actorId
    obj.id
    obj.tagIds = this.currentTagSelected
    for (let x in obj.Tags) {
      obj.tagIds.push(obj.Tags[x].id)
    }
    this.taggerService.addProductOfScene(obj).subscribe(data => {
    })
  }

  openSceneNotesmodal() {
    const modalRef = this.modalService.open(SceneNotesModalComponent, {
      animation: true,
      windowClass: "modal-md",
      backdrop: "static",
      keyboard: true,
      centered: true,
    })
    modalRef.componentInstance.sceneId = this.currentSceneId

    // Handle modal close
    modalRef.result.then(() => {
      this.apiService.sendRequest(requests.getSceneNotes, 'post', { sceneId: this.currentSceneId }).subscribe((data: any) => {
        let allRecords = data.data;
        if (allRecords.length > 0)
          this.notesNotifications = allRecords.map(record => record.isCompleted ? 0 : 1).reduce((a, b) => a + b);
        else
          this.notesNotifications = 0;
      })
    }).catch((reason) => {
      this.apiService.sendRequest(requests.getSceneNotes, 'post', { sceneId: this.currentSceneId }).subscribe((data: any) => {
        let allRecords = data.data;
        if (allRecords.length > 0)
          this.notesNotifications = allRecords.map(record => record.isCompleted ? 0 : 1).reduce((a, b) => a + b);
        else
          this.notesNotifications = 0;
      })
    });
  }
  formBody = {
    sceneNo: null,
    rangeStart: null,
    rangeEnd: null,
    proxyNo: '',
    proxyInput: null,
    products: '',
    productInput: null,
  }
  currentCoordinateCountFilter: any = undefined;
  currentTimeRange: any = undefined;
  currentProductSearchTerm: any = undefined;
  open() {
    const modelRef = this.modalService.open(FilterScenesModalComponent, {
      windowClass: "modal-md",
      backdrop: "static",
      keyboard: true,
      centered: true,
    })
    modelRef.componentInstance.formBody = this.formBody;
    modelRef.componentInstance.passEntry.subscribe((res) => {
      console.log(res);
      this.body = res
      this.currentCoordinateCountFilter = res.coordinateCountFilter ? res.coordinateCountFilter : undefined;
      this.currentTimeRange = res.timeRange ? res.timeRange : undefined;
      this.currentProductSearchTerm = res.productSearchTerm ? res.productSearchTerm : undefined;

      this.body.pageNo = 1;
      this.page = 1;
      this.allScenes = [];
      this.fetchScenes()
      this.sharedService.scenesFilter.next(res)
    });
    modelRef.componentInstance.outputForm.subscribe((res) => {
      console.log(res);
      this.formBody.productInput = res.value.productInput;
      this.formBody.products = res.value.products;
      this.formBody.proxyInput = res.value.proxyInput;
      this.formBody.proxyNo = res.value.proxyNo;
      this.formBody.rangeEnd = res.value.rangeEnd;
      this.formBody.rangeStart = res.value.rangeStart;
      this.formBody.sceneNo = res.value.sceneNo;

    })

  }
  openTagSummaryModal(addModal?: any) {
    this.sharedService.showId.next(this.showId)
    const modalRef = this.modalService.open(TagSummaryComponent, {
      windowClass: "modal-xl",
      backdrop: "static",
      keyboard: false,
      centered: true,
    });
    modalRef.componentInstance.updated.pipe(take(1)).subscribe(data => {
      console.log(data);
      if (data) {
        this.handleSceneSelectionid(this.currentScene)
      }
    })
    if (addModal?.id) {
      this.sharedService.proxyCordinateId.next(addModal.id)
      this.sharedService.imgUrl = this.droppedImgUrl;
    }
    else if (this.coordinateIdsArray?.length > 0) {
      this.sharedService.proxyCordinateId.next(this.coordinateIdsArray?.[0])
      this.sharedService.droppedImageUrl = this.droppedImgUrl;
    }
    this.sharedService.sceneId.next(this.currentSceneId)

  }

  openAiModal() {
    const modalRef = this.modalService.open(ChatGptModalComponent, {
      windowClass: "modal-xl",
      backdrop: "static",
      keyboard: true,
      size: 'lg',
      centered: false,
    });
  }

  EpisodePreview() {
    this.modalService.open(EpisodePreviewComponent, {
      windowClass: "modal-xl",
      backdrop: "static",
      keyboard: false,
      centered: true,
    })
    //Observable to send data 
    this.sharedService.videoData.next(this.showId)
    //Observable to send data 
    this.sharedService.videoData.next(this.showId)
    this.sharedService.sceneId.next(this.currentSceneId)
  }

  getSuperProxyImages() {

    if (this.proxyProducts === null || this.proxyProducts.length === 0) {
      this.objArray = [];
    } else {
      this.objArray = [];
      this.proxyProducts.forEach((indec) => {
        const coordinateHasProducts = indec?.CoordinateHasProducts;
        if (coordinateHasProducts && coordinateHasProducts.length > 0) {
          const product = coordinateHasProducts[0];
          if (product) {
            const image = product?.ProductImage;
            if (image) {
              const reuploadedImages = image.reuploadedImages;
              let superProxyImage: any
              if (coordinateHasProducts[0].superProxy && reuploadedImages && reuploadedImages.images && reuploadedImages.images.length > 0) {
                superProxyImage = coordinateHasProducts[0].matchedImageUrl
                indec['cordinateProd'] = {
                  image: superProxyImage,
                  proxyCoordinateId: coordinateHasProducts[0].proxyCoordinateId,
                }
              }
            }
          }
        }
      });
    }
  }

  productRecordModal(screen: number, proxyProductid?: number) {
    this.sharedService.proxyCordinateId.next(proxyProductid)
    this.sharedService.screen.next(screen)
    this.sharedService.showId.next(this.showId)
    this.modalService.open(ProductRecordModalComponent, {
      animation: true,
      windowClass: "modal-xl",
      backdrop: "static",
      keyboard: true,
      centered: true,
      scrollable: true,
    })
  }


  staticsModal() {
    const body = {
      id: this.currentSceneId,
      taggingStatusId: 3
    }
    this.apiService.sendRequest(requests.updateSceneById, 'post', body)
      .subscribe((res: any) => {
        this.selectedObj.taggingStatusId = 3;
        this.selectedObj.taggingStatusValue = "INREVIEW";
        this.handleSceneSelectionid(this.currentScene)
      })
  }

  continueScene() {
    const body = {
      sceneId: this.currentSceneId,
      proxyImageUrl: this.droppedImgUrl,
      coordinates: {
        x: this.currX,
        y: this.currY,
      },
      showId: this.showId,
      canvasHeight: +this.canvas.width,
      canvasWidth: this.scaleRatio,
      color: this.currentColor,
      coordinateColor: this.currentColor
    }

    this.apiService.sendRequest(requests.tagProductInScene, 'post', body)
      .subscribe((res: any) => {
        this.toggleSceneRight();
      })
  }

  openEpisodePreview() {
    this.modalService.open(EpisodePreviewComponent, {
      windowClass: "modal-xl",
      backdrop: "static",
      keyboard: false,
      centered: true,
    })
    //Observable to send data 
    this.sharedService.videoData.next(this.showId)
    this.sharedService.sceneId.next(this.currentSceneId)
  }

  //Slider tagger code here
  isDraggedLeft: boolean = false;
  isDragging: boolean = false;

  onMouseDown($event: MouseEvent) {
    this.mousePosition.x = $event.screenX;
    this.mousePosition.y = $event.screenY;
  }

  sendImg($event: any, scene: any) {
    if (
      this.mousePosition.x === $event.screenX &&
      this.mousePosition.y === $event.screenY
    ) {
      this.currentScene = scene;
      sessionStorage.setItem("sceneId", scene?.id)
      this.handleSceneSelectionid(scene)
    }
  }

  scrollSceneStart(event: any) {
    let slider: any = document.getElementById('scenes-slider');
    this.mouseDown = true;
    this.startX = event.pageX - slider.offsetLeft;
    this.scrollLeft = slider.scrollLeft;
  }
  scrollSceneMove(event: any) {
    let slider: any = document.getElementById('scenes-slider');
    if (!this.mouseDown) return;
    event.preventDefault();
    const x = event.pageX - slider.offsetLeft;
    const walk = (x - this.startX) * 1; //scroll-fast
    const newScrollLeft = this.scrollLeft - walk;
    //Scroll event is automatically called and api calls are handled there in handleScroll method
    slider.scrollLeft = newScrollLeft;
  }
  scrollSceneEnd(event: any) {
    this.mouseDown = false;
  }

  scrolledLeft = false;
  scrolledRight = false;
  isPreviouslyScrolledLeft = false;
  isPreviouslyScrolledRight = false;
  isReachedFirstPage = false;
  isReachedLastPage = false;

  sliderWidth = null;

  @HostListener('scroll', ['$event'])
  handleScroll($event) {
    const slider = document.getElementById('scenes-slider');
    event.preventDefault();
    // Check if at the start of the scroller
    if (slider.scrollLeft <= 700 && !this.scrolledToEnd) {
      // Reached the start
      if (!this.scrolledToStart) {
        this.scrolledToStart = true;
        this.scrolledLeft = true;
        this.scrolledToEnd = false;
        if (this.page > 1 && this.clickedOnSceneId && !this.isReachedFirstPage) {
          this.page -= 1
          this.fetchScenes()
        }
        else {
          this.isReachedFirstPage = true
        }
      }
    } else if (slider.scrollLeft >= slider.scrollWidth - (2.25 * slider.clientWidth)) {
      if (this.allScenes[this.allScenes?.length - 1]?.relativeSceneNo == this.scenesCount && !this.isReachedLastPage) {
        this.isReachedLastPage = true;
        return;
      }
      // Reached the end
      if (!this.scrolledToEnd && !this.isReachedLastPage) {
        this.scrolledToEnd = true;
        this.scrolledRight = true;
        this.scrolledToStart = false;
        this.page += 1
        this.fetchScenes()
        return;
      }
    }
    else {
      // If not at the start or end, reset the flags
      this.scrolledToStart = false;
      this.scrolledToEnd = false;
      this.scrolledLeft = false;
      this.scrolledRight = false;
    }
  }

  fetchScenes() {
    if (this.clickedOnSceneId && this.isPreviouslyScrolledLeft && this.scrolledRight) {
      this.page -= 1;
      const currentPages = Math.ceil(this.allScenes.length / 60)
      this.page = this.page + currentPages;
      this.isPreviouslyScrolledLeft = false
    }
    else if (this.clickedOnSceneId && this.isPreviouslyScrolledRight && this.scrolledLeft && this.page != 1) {
      this.page += 1;
      const currentPages = Math.ceil(this.allScenes.length / 60)
      this.page = this.page - currentPages;
      this.isPreviouslyScrolledRight = false;
    }
    this.body.showId = this.showId;
    this.body.pageNo = this.page;
    if (this.body.productSearchTerm == '') delete this.body.productSearchTerm
    this.body.limit = 60;
    if (this.currentCoordinateCountFilter) this.body.coordinateCountFilter = this.currentCoordinateCountFilter
    if (this.currentTimeRange) this.body.timeRange = this.currentTimeRange
    if (this.currentProductSearchTerm) this.body.productSearchTerm = this.currentProductSearchTerm
    if (this.page > 0) {
      this.taggerService.getAllScenesOfShow(this.body).subscribe((data: any) => {
        // if (data.data.rows.length == 0) return;
        if (this.scrolledRight) {
          this.isPreviouslyScrolledRight = true;
          this.allScenes = this.allScenes.concat(data.data.rows)
        }
        else if (this.scrolledLeft && this.clickedOnSceneId) {
          this.isPreviouslyScrolledLeft = true;
          this.allScenes = data.data.rows.concat(this.allScenes)
          const slider = document.getElementById('scenes-slider');
          slider.scrollLeft = this.sliderWidth;
        }
        else {
          this.allScenes = data.data.rows;
          this.currentScene = this.currentScene? this.currentScene : this.allScenes[0];
          this.handleSceneSelectionid(this.currentScene)
        }
        this.body = {}
        this.page = data['data'].pageNo ?? this.page;
        this.sharedService.returnedPageNo = undefined
        this.scenesCount = data['data']['count']
        this.toggleLeft = false;
        this.scrollLeft = false;
        this.scrolledRight = false;
      })
    }
  }

  scrollToScene(sceneIdentifier) {
    const slider = document.getElementById('scenes-slider');
    //To move to particular scene position
    const sceneElements = document.querySelectorAll('.slide');
    const sceneIndex = this.allScenes.findIndex(s => s.id == sceneIdentifier);

    if (sceneIndex !== -1) {
      // Calculate the scroll position based on the scene's index and the width of each scene element
      const sceneElement = sceneElements[sceneIndex] as HTMLElement;

      // Calculate the scroll position based on the scene's index and the width of each scene element
      const sceneWidth = sceneElement.offsetWidth;
      const scrollPosition = sceneIndex * sceneWidth;

      // Scroll to the calculated position
      slider.scrollLeft = scrollPosition;
    }
  }

  orderProductRecords(direction: string, index: number) {
    let body;
    if (direction === "+") {
      if (index >= this.proxyProducts.length)
        this.toastrService.error("Cannot move proxy further down")
      body = {
        firstCoordinateId: this.proxyProducts[index].id,
        secondCoordinateId: this.proxyProducts[index + 1].id
      }
    }
    else if (direction === "-") {
      if (index <= 0)
        this.toastrService.error("Cannot move proxy further up")
      body = {
        firstCoordinateId: this.proxyProducts[index].id,
        secondCoordinateId: this.proxyProducts[index - 1].id
      }
    }
    else {
      this.toastrService.error("Invalid direction")
      return;
    }
    this.apiService.sendRequest(requests.swapProxyCoordinates, 'post', body).subscribe((res: any) => {
      console.log(res?.data?.rows?.length === 2)
      if (res?.data?.length === 2)
        this.handleSceneSelectionid(this.currentScene)
    });
  }
}
