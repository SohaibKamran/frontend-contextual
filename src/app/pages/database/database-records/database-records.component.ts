import { Component, Input, OnDestroy, OnInit, SimpleChanges, } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Observable, takeUntil } from 'rxjs';
import { ROLES } from 'src/app/account/register/roles';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
import { VideoSeriesDetailsComponent } from '../../videos/video-series-details/video-series-details.component';
import { DatabaseService } from '../database.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TagSummaryComponent } from '../../videos/tag-summary/tag-summary.component';
import { EpisodePreviewComponent } from '../../episode-preview/episode-preview.component';
const FILTER_PAG_REGEX = /[^0-9]/g;

@Component({
  selector: 'app-database-records',
  templateUrl: './database-records.component.html',
  styleUrls: ['./database-records.component.scss']
})
export class DatabaseRecordsComponent implements OnDestroy, OnInit {
  @Input() $videoFilter: Observable<any>;
  @Input() sortBy: any;

  loader = false
  isAlive = new Subject<boolean>()
  tableHeadings = [{ name: "Series / Movie", order: "" }, { name: "Season", order: "" }, { name: "Episode", order: "" }, { name: "Scene", order: "" }, { name: "Scene/Preview", order: "" },
  { name: "Product Id", order: "" }, { name: "PR Status", order: "" }, { name: "Top VZOT Score", order: "" }, { name: "Annotator", order: "" }, { name: "Proxy", order: "" }, { name: "Super Proxy", order: "" },
  { name: "Actor", order: "" }, { name: "Super Proxy Source", order: "" }, { name: "Gender", order: "" }, { name: "Color", order: "" }, { name: "Pattern", order: "" }, { name: "SubCategories", order: "" }, { name: "Attributes", order: "" },
  { name: "Coordinates", order: "" }, { name: "Ad Match1", order: "" }, { name: "Advertiser1", order: "" }, { name: "VZOT Scrore1", order: "" }, { name: "Ad Match2", order: "" }, { name: "Advertiser2", order: "" }, { name: "VZOT Scrore2", order: "" },
  { name: "Ad Match3", order: "" }, { name: "Advertiser3", order: "" }, { name: "VZOT Scrore3", order: "" }, { name: "AR Date", order: "" }, { name: "Timecode Start", order: "" }, { name: "Timecode End", order: "" },
  { name: "Description", order: "" }, { name: "Brand", order: "" }, { name: "Price", order: "" }, { name: "Scene Thumb Image ID", order: "" }, { name: "Proxy1 Image ID", order: "" }, { name: "Super-Proxy1 Image ID", order: "" },
  { name: "Super-Proxy2 Image ID", order: "" }, { name: "Super-Proxy3 Image ID", order: "" }, { name: "Poster Image ID", order: "" }
  ]
  backendHeadings = ["title", "seasonNo", "episodeNo", "id", "Scene/Preview",
    "prId", "taggingStatusId", "topVzotScore", "fullName", "Proxy",
    "Super Proxy", "name", "Super Proxy Source", "name", "name",
    "Pattern", "SubCategories", "Attributes", "Coordinates", "Ad Match1",
    "name", "VZOT Scrore1", "Ad Match2", "name", "VZOT Scrore2",
    "Ad Match3", "name", "VZOT Scrore3", "createdAt", "startTime",
    "endTime", "description", "name", "Price", "Scene Thumb Image ID",
    "Proxy1 Image ID", "Super-Proxy1 Image ID", "Super-Proxy2 Image ID", "Super-Proxy3 Image ID", "Poster Image ID"
  ]

  taggingStatuses = [

    {
      id: 3,
      title: "PR In Review",
      class: 'review'
    },
    {
      id: 4,
      title: "PR Returned",
      class: 'returned'
    },
    {
      id: 5,
      title: "PR Approved",
      class: 'approved'
    },
  ]
  coordinateListing: any = []
  coordinatesSceneData: any[];
  pagination: { pageNo: number, limit: number, offset?: number } = { limit: 10, pageNo: 1 }
  body: any;
  totalCount: any;
  // allActors:any
  taggerArray: any;
  allTaggers: any;
  dropdownSettings = {
    // singleSelection: false,
    idField: 'id',
    textField: 'fullName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 1,
  };
  nameObs: any
  sortObs: any
  constructor(
    private apiService: ApiService,
    public modalService: NgbModal,
    public router: Router,
    public sharedService: SharedService,
    private databaseService: DatabaseService,
    private toastrService: ToastrService

  ) { }

  // ngOnChanges(changes: SimpleChanges) {
  //   if (this.sortBy) {
  //     let sortingOrder;
  //     this.sortBy === 1 ? sortingOrder = "DESC" : sortingOrder = "ASC"
  //     this.body.coordinateOrder = [["createdAt", sortingOrder]]
  //     this.fetchCoordinateListingForAdmin();
  //   }
  // }

  fetchSortingOrder() {
    this.sortObs = this.databaseService.sortBy.subscribe((res) => {
      let sortingOrder = ""
      if (res != null) {
        res === 2 ? sortingOrder = "DESC" : sortingOrder = "ASC"
        this.body.coordinateOrder = [["createdAt", sortingOrder]]
        this.fetchCoordinateListingForAdmin();
      }
    })
  }
  ngOnInit(): void {
    this.isAlive.next(true)
    const series = JSON.parse(sessionStorage.getItem('series'))
    const actor = JSON.parse(sessionStorage.getItem('actor'))
    this.body = {
      pageNo: this.pagination.pageNo,
      limit: this.pagination.limit
    }
    series ? this.body['seriesId'] = series?.id :
      actor ? this.body['actorIds'] = [actor?.id] : null

    this.getAllTaggers();
    this.fetchSortingOrder()
    this.fetchFilteredData()
  }
  fetchCoordinateListingForAdmin(filter?: any) {
    this.loader = true
    this.coordinateListing = []
    this.coordinatesSceneData = []
    this.apiService.sendRequest(requests.coordinateListingForAdmin, 'post', filter ?? this.body).subscribe((res: any) => {
      this.scrollReset()
      this.loader = false
      this.coordinateListing = res?.data?.rows;
      this.totalCount = res?.data?.count
      this.databaseService.databaseCount.next(this.totalCount)
      // this.mapSceneCooerdinatesDate();
    })
  }
  openModal(addModal?: any) {
    const modal=this.modalService.open(VideoSeriesDetailsComponent, {
      windowClass: "modal-xl",
      backdrop: "static",
      keyboard: false,
      centered: true,
    });
    modal.componentInstance.seriesId=addModal
  }
  getAllTaggers() {
    this.apiService.sendRequest(requests.getTagger, 'post', {
      "pageNo": 1,
      "limit": 100
    }).subscribe((response: any) => {
      this.allTaggers = response.data
    })
  }

  scrollReset() {
    const scroll = document.getElementById("table")
    scroll.scroll(0, 0)
  }

  updateTagProductInScene(sceneId: number, statusId: number, index: number) {
    this.coordinateListing[index].taggingStatusId = statusId
    this.apiService.sendRequest(requests.updateTagProductInScene, 'post', {
      id: sceneId,
      taggingStatusId: statusId

    }).subscribe({
      next: (res: any) => {
        // console.log("files,r", res);

      },
      error: (err: any) => {
        console.log(err.error.messege, "ERROR")
        console.log(err, "ERROR")
        this.toastrService.error(err['error']['message'], "Error!");
      },
      complete: () => {
        // console.log('completed');
        this.toastrService.success("Status updated Successfully.")

      }
    })
  }
  onPageChange(event: any) {

    this.pagination.pageNo = event;
    this.body = {
      ...this.body,
      pageNo: event
    }
    this.databaseService.databaseRecords.next(this.body)
    // this.fetchCoordinateListingForAdmin()
  }

  selectPage(page: string) {
    this.pagination.pageNo = parseInt(page);
    this.body = {
      ...this.body,
      pageNo: event
    }
    this.databaseService.databaseRecords.next(this.body)

    this.pagination.pageNo = parseInt(page, 10) || 1;
  }

  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(FILTER_PAG_REGEX, '');
  }

  mapSceneCooerdinatesDate() {
    this.coordinatesSceneData = [];
    if (this.coordinateListing && this.coordinateListing.length > 0) {
      let obj;
      this.coordinateListing.forEach((scene) => {
        if (scene?.CoordinateHasProducts[0]?.superProxy) {
          obj = {
            proxyImage: scene?.CoordinateHasProducts[0]?.ProductImage?.reuploadedImages.images[0],
            superProxySource: scene?.CoordinateHasProducts[0]?.Product.Retailer.name,
            superProxyImage: scene?.CoordinateHasProducts[0]?.matchedImageUrl,
            gender: scene?.CoordinateHasProducts[0]?.Product.Gender.name,
            color: scene?.CoordinateHasProducts[0]?.Color.name,
            pattern: scene?.pattern,
            subCategory: scene?.CoordinateHasProducts[0]?.Product.ProductHasCategories?.[0]?.ProductCategory?.name,
            attributes: scene?.CoordinateHasProducts[0].tag == "" ? null : scene?.CoordinateHasProducts[0].tag,
            adMatch1: scene?.CoordinateHasProducts[1]?.matchedImageUrl,
            adMatchAdv1: scene?.CoordinateHasProducts[1]?.Product.Retailer.name,
            adMatchScore1: scene?.CoordinateHasProducts[1]?.vzotScore,
            adMatch2: scene?.CoordinateHasProducts[2]?.matchedImageUrl,
            adMatchAdv2: scene?.CoordinateHasProducts[2]?.Product.Retailer.name,
            adMatchScore2: scene?.CoordinateHasProducts[2]?.vzotScore,
            adMatch3: scene?.CoordinateHasProducts[3]?.matchedImageUrl,
            adMatchAdv3: scene?.CoordinateHasProducts[3]?.Product.Retailer.name,
            adMatchScore3: scene?.CoordinateHasProducts[3]?.vzotScore,
            brand: scene?.CoordinateHasProducts[0]?.Product.Brand.name,
            price: scene?.CoordinateHasProducts[0]?.ProductImage.prices.actualPrice,
            sceneThumbId: scene?.proxyImageUrl.split('/').pop(),
            proxyId1: scene?.proxyImageUrl.split('/').pop(),
            superProxyId1: scene?.CoordinateHasProducts[1]?.ProductImage?.reuploadedImages.images[0].split('/').pop(),
            superProxyId2: scene?.CoordinateHasProducts[2]?.ProductImage?.reuploadedImages.images[0].split('/').pop(),
            superProxyId3: scene?.CoordinateHasProducts[3]?.ProductImage?.reuploadedImages.images[0].split('/').pop(),
            posterImageId: scene?.Scene?.thumbnail?.split('/').pop()
          }
        }
        else {
          obj = {
            proxyImage: scene?.CoordinateHasProducts[0]?.ProductImage?.reuploadedImages.images[0],
            superProxySource: undefined,
            superProxyImage: undefined,
            gender: undefined,
            color: undefined,
            pattern: scene?.pattern,
            subCategory: undefined,
            attributes: scene?.CoordinateHasProducts[0].tag,
            adMatch1: undefined,
            adMatchAdv1: undefined,
            adMatchScore1: undefined,
            adMatch2: undefined,
            adMatchAdv2: undefined,
            adMatchScore2: undefined,
            adMatch3: undefined,
            adMatchAdv3: undefined,
            adMatchScore3: undefined,
            brand: undefined,
            price: undefined,
            sceneThumbId: scene?.proxyImageUrl.split('/').pop(),
            proxyId1: scene?.proxyImageUrl.split('/').pop(),
            superProxyId1: undefined,
            superProxyId2: undefined,
            superProxyId3: undefined,
            posterImageId: scene?.Scene?.thumbnail?.split('/').pop()
          }
        }
        this.coordinatesSceneData.push(obj)
      })
      // console.log("coordinatesSceneData", this.coordinatesSceneData)
    }

  }

  sort(order: number, heading: number) {
    let sortingOrder;
    this.body = {
      ...this.body,
      showOrder:undefined,
      sceneOrder:undefined,
      coordinateOrder:undefined,
      taggerOrder:undefined,
      actorOrder:undefined,
      seriesOrder:undefined,
      advertiserOrder:undefined,
      brandOrder:undefined,
      colorOrder:undefined,
      genderOrder:undefined 
    }
    this.tableHeadings = [{ name: "Series / Movie", order: "" }, { name: "Season", order: "" }, { name: "Episode", order: "" }, { name: "Scene", order: "" }, { name: "Scene/Preview", order: "" },
    { name: "Product Id", order: "" }, { name: "PR Status", order: "" }, { name: "Top VZOT Score", order: "" }, { name: "Annotator", order: "" }, { name: "Proxy", order: "" }, { name: "Super Proxy", order: "" },
    { name: "Actor", order: "" }, { name: "Super Proxy Source", order: "" }, { name: "Gender", order: "" }, { name: "Color", order: "" }, { name: "Pattern", order: "" }, { name: "SubCategories", order: "" }, { name: "Attributes", order: "" },
    { name: "Coordinates", order: "" }, { name: "Ad Match1", order: "" }, { name: "Advertiser1", order: "" }, { name: "VZOT Scrore1", order: "" }, { name: "Ad Match2", order: "" }, { name: "Advertiser2", order: "" }, { name: "VZOT Scrore2", order: "" },
    { name: "Ad Match3", order: "" }, { name: "Advertiser3", order: "" }, { name: "VZOT Scrore3", order: "" }, { name: "AR Date", order: "" }, { name: "Timecode Start", order: "" }, { name: "Timecode End", order: "" },
    { name: "Description", order: "" }, { name: "Brand", order: "" }, { name: "Price", order: "" }, { name: "Scene Thumb Image ID", order: "" }, { name: "Proxy1 Image ID", order: "" }, { name: "Super-Proxy1 Image ID", order: "" },
    { name: "Super-Proxy2 Image ID", order: "" }, { name: "Super-Proxy3 Image ID", order: "" }, { name: "Poster Image ID", order: "" }
    ]
    if (order == 1) {
      sortingOrder = "ASC"
      this.tableHeadings[heading].order = "ASC"
    }
    else {
      sortingOrder = "DESC"
      this.tableHeadings[heading].order = "DESC"
    }
    if (heading == 1 || heading == 2) {
      this.body = { ...this.body, showOrder: [[this.backendHeadings[heading], sortingOrder]] }

    }
    else if (heading == 3 || heading == 29 || heading == 30) {
      this.body = { ...this.body, sceneOrder: [[this.backendHeadings[heading], sortingOrder]] }
    }
    else if (heading == 5 || heading == 6 || heading == 7 || heading == 28) {
      this.body = { ...this.body, coordinateOrder: [[this.backendHeadings[heading], sortingOrder]] }
    }
    else if (heading == 8) {
      this.body = { ...this.body, taggerOrder: [[this.backendHeadings[heading], sortingOrder]] }
    }
    else if (heading == 11) {
      this.body = { ...this.body, actorOrder: [[this.backendHeadings[heading], sortingOrder]] }
    }
    else if (heading == 0 || heading == 31) {
      this.body = { ...this.body, seriesOrder: [[this.backendHeadings[heading], sortingOrder]] }
    }
    else if (heading == 20 || heading == 23 || heading == 26) {
      this.body = { ...this.body, advertiserOrder: [[this.backendHeadings[heading], sortingOrder]] }
    }
    else if (heading == 32) {
      this.body = { ...this.body, brandOrder: [[this.backendHeadings[heading], sortingOrder]] }
    }
    else if (heading == 14) {
      this.body = { ...this.body, colorOrder: [[this.backendHeadings[heading], sortingOrder]] }
    }
    else if (heading == 13) {
      this.body = { ...this.body, genderOrder: [[this.backendHeadings[heading], sortingOrder]] }
    }
    this.databaseService.databaseRecords.next(this.body)
    // this.fetchCoordinateListingForAdmin();
  }

  fetchFilteredData() {
    this.coordinateListing = []
    this.coordinatesSceneData = []
    this.databaseService.databaseRecords.pipe(takeUntil(this.isAlive)).subscribe((Res: any) => {
      if (Res) {
        let body: any = {}
        Object.assign(body, Res)
        delete body['seriesName']
        delete body['actors']
        delete body['taggers']
        this.body=body
        // if(this.body?.taggerIds){
        //   this.body.taggerIds=this.body.taggerIds.map(item=>item.id)
        // }
        // if(this.body?.actorIds){
        //   this.body.actorIds=this.body.actorIds.map(item=>item.id)
        // }
        console.log(body)
        this.fetchCoordinateListingForAdmin(body)
      }
      else {
        this.fetchCoordinateListingForAdmin()
      }
    })
  }
  goToTagger(tagger?: number, id?: any, sceneId?: any) {
    console.log(sceneId, "SCENE ID")
    if (id)
      sessionStorage.setItem('showId', id)
    if (sceneId)
      sessionStorage.setItem('sceneId', sceneId)
    localStorage.setItem('simulatedtaggerid', tagger + "")
    this.router.navigate(['/tagger/tag-video'])
  }
  openTagSummaryModal(addModal?: any) {
    const modalRef = this.modalService.open(TagSummaryComponent, {
      windowClass: "modal-xl",
      backdrop: "static",
      keyboard: false,
      centered: true,
    });
    // console.log("data in video: ", addModal);
    this.sharedService.sceneId.next(addModal.id)

    modalRef.componentInstance.data = addModal;
    // modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
    //   // console.log("-==================>",receivedEntry);
    //   })
  }
  openEpisodePreview(id?: any, seasonId?: number, sceneId?: number) {
    if(seasonId)
    {
      this.sharedService.seasonId.next(seasonId)
    }
    sessionStorage.setItem('showId', JSON.stringify(id))
    this.modalService.open(EpisodePreviewComponent, {
      windowClass: "modal-xl",
      backdrop: "static",
      keyboard: false,
      centered: true,
    })
    //Observable to send data 
    this.sharedService.videoData.next(id)
    if (sceneId) {
      this.sharedService.sceneId.next(sceneId)
    }
    if (id)
    {
      this.sharedService.showId.next(id)
    }

  }
  ngOnDestroy() {
    this.isAlive.next(false)
  }

}
