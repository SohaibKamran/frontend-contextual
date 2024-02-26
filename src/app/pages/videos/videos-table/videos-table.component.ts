import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/core/api.service';
import { ActorsComponent } from '../actors/actors.component';
import { requests } from 'src/app/core/config/config';
import { VideoSeriesDetailsComponent } from '../video-series-details/video-series-details.component';
import { EpisodePreviewComponent } from '../../episode-preview/episode-preview.component';
// import { SharedService } from 'src/app/core/services/shared.service';
import { TagSummaryComponent } from '../tag-summary/tag-summary.component';
import { Observable } from 'rxjs';
import { AddEditTaggerDetailsComponent } from '../../add-edit-tagger-details/add-edit-tagger-details.component';
import { SharedService } from 'src/app/core/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { DatabaseService } from '../../database/database.service';
import { SceneNotesModalComponent } from '../../tagger/scene-notes-modal/scene-notes-modal.component';
import { TaggerService } from '../../tagger/tagger.service';
const FILTER_PAG_REGEX = /[^0-9]/g;

@Component({
  selector: 'app-videos-table',
  templateUrl: './videos-table.component.html',
  styleUrls: ['./videos-table.component.scss']
})
export class VideosTableComponent implements OnInit, AfterViewInit {

  @Input() $videoFilter: Observable<any>;
  @ViewChild('target', { static: true, read: ElementRef }) target: ElementRef;
  showId: number
  selectedEpisode: any;
  selectedEpisodeScenes = [];
  selectedScene: any;
  selectedScenes: any;
  selectedSceneId: any;
  selectedAnnotators: Array<any> = [];
  videosListing: Array<any> = [];
  coordinatesSceneData: any[];
  pagination: { pageNo: number, limit: number, offset?: number } = { limit: 100, pageNo: 1 }
  prPagination: { pageNo: number, limit: number, offset?: number } = { limit: 10, pageNo: 1 }
  taggerPagination: { pageNo: number, limit: number, offset?: number, taggerName?: string } = { pageNo: 1, limit: 10 }
  scenePagination: { pageNo: number, limit: number, offset?: number } = { pageNo: 1, limit: 10 }
  taggerLoader: boolean = false
  fetchedScenesCount = 0
  totalSeriesCount = 0
  prBody: any
  selectedSeasonLoader = false
  totalCount: any;
  body: any
  // allActors:any
  taggerArray: any;
  allTaggers = [];
  dropdownSettings = {
    // singleSelection: false,
    idField: 'id',
    textField: 'fullName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 1,
    // itemsShowLimit: 3,
  };
  sceneListingLoader: boolean = false
  sceneLoader: boolean = false
  clicked: boolean = false
  movieScenesLoader: boolean = false
  movieTaggers = []
  taggingStatuses = [

    {
      id: 1,
      title: "Scene To Do",
      class: "todo"
    },
    {
      id: 2,
      title: "Scene In Progress",
      class: "inprogress"
    },
    {
      id: 3,
      title: "Scene In Review",
      class: "review"
    },
    {
      id: 4,
      title: "Scene Returned",
      class: "returned"
    },
    {
      id: 5,
      title: "Scene Approved",
      class: "approved"
    },
  ]
  fetchedTaggerCount = 0
  totalTaggerCount = 0
  prTaggingStatuses = [
    {
      id: 3,
      title: "PR In Review",
      class: "review"
    },
    {
      id: 4,
      title: "PR Returned",
      class: "returned"
    },
    {
      id: 5,
      title: "PR Approved",
      class: "approved"
    },
  ]
  sceneId: number = null
  loader: boolean = true
  tableHeadings = [{ name: "Series/Movie", order: "" }, { name: "Active", order: "" }, { name: "Episodes", order: "" }, { name: "Percent Done", order: "" }, { name: "Scenes", order: "" }, { name: "Product Records", order: "" }, { name: "Scene View", order: "" }, { name: "Ad Views", order: "" }, { name: "Ad Likes", order: "" }, { name: "Ad Clicks", order: "" }]
  backendHeadings = ["title", "showStatusId", "totalEpisodes", "", "totalScenes", "productRecords", "sceneViews", "adViews", "adClicks", "adLikes"]
  tableHeadingsPRs = [{ name: "Series / Movie", order: "" }, { name: "Season", order: "" }, { name: "Episode", order: "" }, { name: "Scene", order: "" }, { name: "Scene/Preview", order: "" },
  { name: "Product Id", order: "" }, { name: "PR Status", order: "" }, { name: "Top VZOT Score", order: "" }, { name: "Annotator", order: "" }, { name: "Proxy", order: "" }, { name: "Super Proxy", order: "" },
  { name: "Actor", order: "" }, { name: "Super Proxy Source", order: "" }, { name: "Gender", order: "" }, { name: "Color", order: "" }, { name: "Pattern", order: "" }, { name: "SubCategories", order: "" }, { name: "Attributes", order: "" },
  { name: "Coordinates", order: "" }, { name: "Ad Match1", order: "" }, { name: "Advertiser1", order: "" }, { name: "VZOT Scrore1", order: "" }, { name: "Ad Match2", order: "" }, { name: "Advertiser2", order: "" }, { name: "VZOT Scrore2", order: "" },
  { name: "Ad Match3", order: "" }, { name: "Advertiser3", order: "" }, { name: "VZOT Scrore3", order: "" }, { name: "AR Date", order: "" }, { name: "Timecode Start", order: "" }, { name: "Timecode End", order: "" },
  { name: "Description", order: "" }, { name: "Brand", order: "" }, { name: "Price", order: "" }, { name: "Scene Thumb Image ID", order: "" }, { name: "Proxy1 Image ID", order: "" }, { name: "Super-Proxy1 Image ID", order: "" },
  { name: "Super-Proxy2 Image ID", order: "" }, { name: "Super-Proxy3 Image ID", order: "" }, { name: "Poster Image ID", order: "" }
  ]
  backendHeadingsPR = ["title", "seasonNo", "episodeNo", "id", "Scene/Preview",
    "prId", "taggingStatusId", "topVzotScore", "fullName", "Proxy",
    "Super Proxy", "name", "Super Proxy Source", "name", "name",
    "Pattern", "SubCategories", "Attributes", "Coordinates", "Ad Match1",
    "name", "VZOT Scrore1", "Ad Match2", "name", "VZOT Scrore2",
    "Ad Match3", "name", "VZOT Scrore3", "createdAt", "startTime",
    "endTime", "description", "name", "Price", "Scene Thumb Image ID",
    "Proxy1 Image ID", "Super-Proxy1 Image ID", "Super-Proxy2 Image ID", "Super-Proxy3 Image ID", "Poster Image ID"
  ]

  series: any
  constructor(
    private apiService: ApiService,
    public modalService: NgbModal,
    public router: Router,
    public sharedService: SharedService,
    private toastrService: ToastrService,
    private cdr: ChangeDetectorRef,
    private databaseService: DatabaseService,
    private elementRef: ElementRef,
    private taggerService:TaggerService
  ) { }
  ngOnInit(): void {
    const userId = JSON.parse(localStorage.getItem('userId'))
    this.allTaggers[0] = { id: userId, fullName: 'Myself' }
    this.prBody = {
      pageNo: this.prPagination.pageNo,
      limit: this.prPagination.limit
    }
    this.series = JSON.parse(sessionStorage.getItem('series'));
    sessionStorage.removeItem('series');

    if (this.series) {
      this.pagination.pageNo = this.series.pageNo;
      this.totalCount = this.series.count
      this.body = {
        pageNo: this.pagination.pageNo,
        limit: this.pagination.limit
      }
      // Fetch data for the page number extracted from session storage
      this.fetchVideos(null, this.series);

    } else {
      this.body = {
        pageNo: this.pagination.pageNo,
        limit: this.pagination.limit
      }
      // No page number found in session storage, initialize to page 1 and fetch data
      this.fetchVideos();
    }
    // this.fetchVideos();
    this.getAllTaggers();
    if (this.$videoFilter) {
      this.$videoFilter.subscribe(filter => {
        // console.log("filter recived", filter);
        this.modalService.dismissAll()
        // delete filter.seriesName;
        this.body = filter
        this.pagination.pageNo = this.body.pageNo
        this.pagination.limit = this.body.limit
        this.fetchVideos()
      })
    }
  }
  ngAfterViewInit(): void {
    console.log("View called")

  }
  scrollToElement() {
    setTimeout(() => {
      console.log("SERIES ID", this.series.id)
      const element = document.getElementById(this.series.id + "");
      console.log(element)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }
  getAllTaggers(searchTagger?: string) {
    const tag = []
    this.taggerLoader = true
    if (this.totalTaggerCount != this.fetchedTaggerCount || this.totalTaggerCount == 0) {
      this.apiService.sendRequest(requests.getTagger, 'post', this.taggerPagination).subscribe((res: any) => {
        this.taggerLoader = false
        if (searchTagger || searchTagger === '') {
          this.allTaggers = []
          const userId = JSON.parse(localStorage.getItem('userId'))
          this.allTaggers[0] = { id: userId, fullName: 'Myself' }
        }
        this.totalTaggerCount = res?.data?.count
        for (let i = 0; i < res?.data?.rows?.length; i++) {
          const obj = {
            id: res?.data?.rows[i]?.id, fullName: res?.data?.rows[i]?.fullName
          }
          this.allTaggers = [...this.allTaggers, obj]
          this.fetchedTaggerCount++

        }
        console.log(this.allTaggers)
      })
    }
  }
  getEpisodeTaggers(searchTagger, episode?: any) {
    this.apiService.sendRequest(requests.getTagger, 'post', episode.taggerPagination).subscribe((res: any) => {
      this.taggerLoader = false
      if (searchTagger || searchTagger === '') {
        episode.taggers = []
        const userId = JSON.parse(localStorage.getItem('userId'))
        episode.taggers[0] = { id: userId, fullName: 'Myself' }
      }
      for (let i = 0; i < res?.data?.rows?.length; i++) {
        const obj = {
          id: res?.data?.rows[i]?.id, fullName: res?.data?.rows[i]?.fullName
        }
        episode.taggers = [...episode.taggers, obj]
      }
      console.log(episode.taggers)
    })

  }
  searchTagger($event, episode?: any, index?: any) {
    console.log($event)
    episode.flag = true
    console.log(episode)
    this.fetchedTaggerCount = 0
    episode.taggerPagination.pageNo = 1
    if ($event.term != '')
      episode.taggerPagination.taggerName = $event.term
    else {
      episode.taggerPagination.taggerName = undefined
      episode.taggers = []
    }
    console.log(this.videosListing[index])
    this.getEpisodeTaggers($event.term, episode)
  }
  tagerExist(tagger: any, episode: any) {
    return episode.TaggerTagsShows.some(x => x.taggerId === tagger.id)
  }
  onTaggerSelect(event: any, episode: any, index, videoIndex: number, seasonKey: any) {
    const annotatorsList = this.selectedAnnotators[index];
    console.log(annotatorsList, "List")
    const idx = this.videosListing[videoIndex]['Seasons'][seasonKey]['Episodes'].findIndex((item) => {
      return item.id === episode.id
    })
    if (annotatorsList.length == 0) {
      this.taggerIds = []
      this.videosListing[videoIndex]['Seasons'][seasonKey]['Episodes'][idx]['TaggerTagsShows'] = []
    }
    else {
      annotatorsList.map((t) => {
        this.taggerIds.push(t.id)
      })

      const user = {
        User: {
          fullName: annotatorsList[annotatorsList?.length - 1].fullName,
          id: annotatorsList[annotatorsList?.length - 1].id
        }
      }
      if (idx != -1) {
        this.videosListing[videoIndex]['Seasons'][seasonKey]['Episodes'][idx]['TaggerTagsShows'].push(user)
      }
    }
    // console.log(event);
    // console.log("tagger",this.taggerIds)
    this.AssignAnnotator(episode);
    // console.log("Array Of Id's", this.taggerIds);
  }
  onSelectAllTagger(items: any, episode: any, index: number, videoIndex: number, seasonKey: any) {
    // console.log(items);
    const idx = this.videosListing[videoIndex]['Seasons'][seasonKey]['Episodes'].findIndex((item) => {
      return item.id === episode.id
    })
    if (idx != -1) {
      // this.selectedAnnotators[index]=[]
      // this.taggerIds=[]
      this.videosListing[videoIndex]['Seasons'][seasonKey]['Episodes'][idx]['TaggerTagsShows'] = []
      items.map((t) => {
        const user = {
          User: {
            fullName: t.fullName,
            id: t.id
          }
        }
        console.log(t)
        this.taggerIds.push(t.id)
        this.videosListing[videoIndex]['Seasons'][seasonKey]['Episodes'][idx]['TaggerTagsShows'].push(user)
      })
    }

    this.AssignAnnotator(episode);
  }
  onDeselectAllTagger(items: any, episode: any, index: number, videoIndex: number, seasonKey: any) {
    const idx = this.videosListing[videoIndex]['Seasons'][seasonKey]['Episodes'].findIndex((item) => {
      return item.id === episode.id
    })
    if (idx != -1) {
      this.videosListing[videoIndex]['Seasons'][seasonKey]['Episodes'][idx]['TaggerTagsShows'] = []
      console.log(items);
      items.map((t) => {
        this.taggerIds.push(t.id)
      })
      this.AssignAnnotator(episode);
    }
  }
  taggerDeSelect(ev: any, episode: any, index) {
    // console.log(ev);
    // console.log("Array Of Id's", this.taggerIds);
    const annotatorsList = this.selectedAnnotators[index];
    annotatorsList.map((t) => {
      this.taggerIds.push(t.id)
    })
    this.AssignAnnotator(episode);
  }

  taggerIds = []
  AssignAnnotator(episode: any) {
    // // console.log("Tagger ",id)
    // console.log("Episode",episode)

    // this.taggerIds.push(id);
    const body = {
      showId: episode.id,
      taggerIds: this.taggerIds
    }
    this.apiService.sendRequest(requests.assignShowToTagger, 'post', body)
      .subscribe((res: any) => {
        this.taggerIds = []
        // console.log(res);
        // this.toastrService.success("Episode Assigned Successfully")
      })
  }

  onPageChange(event: any) {
    console.log(event, "Page number")
    this.body = {
      ...this.body,
      pageNo: event
    }
    // let page = this.pagination.pageNo == 1 ? 0 : this.pagination.pageNo - 1;
    // this.pagination.limit =event==1 ? 0: (event-1) * this.pagination.limit;
    this.fetchVideos()
  }
  sort(order: number, heading: number) {
    let sortingOrder;
    this.prBody = {
      pageNo: this.prPagination.pageNo,
      limit: this.prPagination.limit
    }
    this.tableHeadingsPRs = [{ name: "Series / Movie", order: "" }, { name: "Season", order: "" }, { name: "Episode", order: "" }, { name: "Scene", order: "" }, { name: "Scene/Preview", order: "" },
    { name: "Product Id", order: "" }, { name: "PR Status", order: "" }, { name: "Top VZOT Score", order: "" }, { name: "Annotator", order: "" }, { name: "Proxy", order: "" }, { name: "Super Proxy", order: "" },
    { name: "Actor", order: "" }, { name: "Super Proxy Source", order: "" }, { name: "Gender", order: "" }, { name: "Color", order: "" }, { name: "Pattern", order: "" }, { name: "SubCategories", order: "" }, { name: "Attributes", order: "" },
    { name: "Coordinates", order: "" }, { name: "Ad Match1", order: "" }, { name: "Advertiser1", order: "" }, { name: "VZOT Scrore1", order: "" }, { name: "Ad Match2", order: "" }, { name: "Advertiser2", order: "" }, { name: "VZOT Scrore2", order: "" },
    { name: "Ad Match3", order: "" }, { name: "Advertiser3", order: "" }, { name: "VZOT Scrore3", order: "" }, { name: "AR Date", order: "" }, { name: "Timecode Start", order: "" }, { name: "Timecode End", order: "" },
    { name: "Description", order: "" }, { name: "Brand", order: "" }, { name: "Price", order: "" }, { name: "Scene Thumb Image ID", order: "" }, { name: "Proxy1 Image ID", order: "" }, { name: "Super-Proxy1 Image ID", order: "" },
    { name: "Super-Proxy2 Image ID", order: "" }, { name: "Super-Proxy3 Image ID", order: "" }, { name: "Poster Image ID", order: "" }
    ]
    if (order == 1) {
      sortingOrder = "ASC"
      this.tableHeadingsPRs[heading].order = "ASC"
    }
    else {
      sortingOrder = "DESC"
      this.tableHeadingsPRs[heading].order = "DESC"
    }
    if (heading == 1 || heading == 2) {
      // this.prBody.showOrder = [[this.backendHeadingsPR[heading], sortingOrder]]
    }
    else if (heading == 3 || heading == 29 || heading == 30) {
      // this.prBody.sceneOrder = [[this.backendHeadingsPR[heading], sortingOrder]]
    }
    else if (heading == 5 || heading == 6 || heading == 7 || heading == 28) {
      this.prBody = { ...this.prBody, coordinateOrder: [[this.backendHeadingsPR[heading], sortingOrder]] }
    }
    else if (heading == 8) {
      this.prBody = { ...this.prBody, taggerOrder: [[this.backendHeadingsPR[heading], sortingOrder]] }
    }
    else if (heading == 11) {
      this.prBody = { ...this.prBody, actorOrder: [[this.backendHeadingsPR[heading], sortingOrder]] }
    }
    else if (heading == 0 || heading == 31) {
      // this.prBody.seriesOrder = [[this.backendHeadingsPR[heading], sortingOrder]]
    }
    else if (heading == 20 || heading == 23 || heading == 26) {
      this.prBody = { ...this.prBody, advertiserOrder: [[this.backendHeadingsPR[heading], sortingOrder]] }
    }
    else if (heading == 32) {
      this.prBody = { ...this.prBody, brandOrder: [[this.backendHeadingsPR[heading], sortingOrder]] }
    }
    else if (heading == 14) {
      this.prBody = { ...this.prBody, colorOrder: [[this.backendHeadingsPR[heading], sortingOrder]] }
    }
    else if (heading == 13) {
      this.prBody = { ...this.prBody, genderOrder: [[this.backendHeadingsPR[heading], sortingOrder]] }
    }
    this.fetchSceneDetails(this.sceneId);
  }

  fetchVideos(filter?: any, series: any = null) {
    this.selectedIndex = null
    this.loader = true
    this.apiService.sendRequest(requests.videoShowListing, 'post', this.body).subscribe((res: any) => {
      this.loader = false
      if (res?.data?.rows)
        this.videosListing = res?.data?.rows
      else if (res?.data?.length == 0) {
        this.videosListing = []
      }
      this.totalCount = res?.data?.count
      console.log(this.videosListing)
      for (let i = 0; i < this.videosListing?.length; i++) {
        if (this.videosListing[i].videoTypeId == 3) {
          this.assignedMovieTaggers(i)
        }
        this.videosListing[i].icon = "bi bi-chevron-right"
        this.videosListing[i].clicked = false
        if (series) {
          if (series.id === this.videosListing[i].id) {
            sessionStorage.removeItem('series')
            this.selectEpisode(i)
            if (this.series) {
              this.scrollToElement();
            }
          }
        }
        if (this.videosListing[i]?.showStatusId == 1) {
          this.videosListing[i].checked = true
        }
        else {
          this.videosListing[i].checked = false
        }
      }
    }, error => {
      this.videosListing = [];
    })

  }
  fetchShowScenes(id: any = null, videoTypeId: any = null, index: number = null, loadMore: boolean = false, limit: number = 10) {
    this.sceneListingLoader = true
    this.selectedScenes = []
    if (!loadMore) {
      this.selectedEpisodeScenes = []
      this.fetchedScenesCount = 0
      this.prPagination.limit = limit
      this.prBody = {
        ...this.prBody,
        limit: this.prPagination.limit
      }
    }
    if (videoTypeId) {
      this.selectEpisode(index)
      this.scenePagination.limit = limit
    }
    if (id)
      this.showId = id

    this.apiService.sendRequest(requests.getSceneDetails, 'post', { showId: this.showId, pageNo: this.scenePagination.pageNo, limit: this.scenePagination.limit }).subscribe((res: any) => {
      this.sceneListingLoader = false
      this.selectedEpisodeScenes = res?.data?.rows
      // // console.log('scenesListing/',res.data);
      for (let i = 0; i < res?.data?.rows?.length; i++) {
        if (this.selectedEpisodeScenes[i].taggingStatusValue) {
          this.selectedEpisodeScenes[i].taggingStatusValue = {
            title: this.taggingStatuses[this.selectedEpisodeScenes[i].taggingStatusId - 1]?.title,
            id: this.selectedEpisodeScenes[i].taggingStatusId,
            class: this.taggingStatuses[this.selectedEpisodeScenes[i].taggingStatusId - 1].class
          }
          this.selectedEpisodeScenes[i].taggingStatusColor = this.taggingStatuses[this.selectedEpisodeScenes[i].taggingStatusId - 1].class
        }
        else {
          this.selectedEpisodeScenes[i].taggingStatusValue = {
            title: this.taggingStatuses[this.selectedEpisodeScenes[i].taggingStatusId - 1]?.title,
            id: this.selectedEpisodeScenes[i].taggingStatusId,
            class: this.taggingStatuses[this.selectedEpisodeScenes[i].taggingStatusId - 1].class
          }
          this.selectedEpisodeScenes[i].taggingStatusColor = this.taggingStatuses[this.selectedEpisodeScenes[i].taggingStatusId].class

          // console.log(this.selectedEpisodeScenes[i].taggingStatusValue)
        }
        console.log(this.selectedEpisodeScenes, "Selectefd Epsidopes Scenes")
        // console.log("Tagging Statuses", this.taggingStatuses)
      }
    })
  }
  fetchSceneDetails(id: any, loadMore: boolean = false) {

    if (!loadMore) {
      this.prPagination.limit = 10
      this.prBody = {
        ...this.prBody,
        limit: this.prPagination.limit,
        "coordinateProductOrder": [[
          "superProxy", "DESC"
        ]]
      }
    }
    this.sceneId = id
    this.prBody = {
      ...this.prBody,
      sceneId: this.sceneId,
      "coordinateProductOrder": [[
        "superProxy", "DESC"
      ]]
    }
    if (this.selectedScenes.length == 0)
      this.sceneLoader = true
    this.apiService.sendRequest(requests.getSceneCooerdinates, 'post', this.prBody).subscribe((res: any) => {
      this.sceneLoader = false
      this.selectedScenes = res?.data?.rows
      console.log('scenesListing', res.data);
      this.mapSceneCooerdinatesDate();
    })
  }
  mapSceneCooerdinatesDate() {
    this.coordinatesSceneData = [];
    if (this.selectedScenes && this.selectedScenes.length > 0) {
      this.selectedScenes.forEach((scene, i) => {
        if (this.selectedScenes[i].taggingStatusValue) {
          // if (this.selectedScenes[i].taggingStatusValue == "INREVIEW") {
          //   this.selectedScenes[i].taggingStatusValue = "In Review"
          //   this.selectedScenes[i].taggingStatusColor = "review"
          // }
          // else {
          //   const tagStatus = this.prTaggingStatuses.find(t => t.id == this.selectedScenes[i].taggingStatusId)
          //   this.selectedScenes[i].taggingStatusValue = tagStatus?.title
          //   this.selectedScenes[i].taggingStatusColor = tagStatus.class
          // }
          this.selectedScenes[i].PRStatusValue = {
            id: this.selectedScenes[i]?.taggingStatusId,
            title: this.prTaggingStatuses[(this.selectedScenes[i]?.taggingStatusId) - 3]?.title,
            class: this.prTaggingStatuses[(this.selectedScenes[i]?.taggingStatusId) - 3]?.class
          }
          console.log(this.selectedScenes[i].PRStatusValue)
        }
        let obj;
        if (scene?.CoordinateHasProducts[0]?.superProxy) {
          obj = {
            proxyImage: scene?.proxyImageUrl,
            superProxyImage: scene?.CoordinateHasProducts?.[0]?.matchedImageUrl,
            superProxySource: scene?.CoordinateHasProducts[0]?.Product.Retailer.name,
            gender: scene?.CoordinateHasProducts[0]?.Product.Gender.name,
            color: scene?.CoordinateHasProducts[0]?.Color.name,
            pattern: scene?.pattern,
            subCategory: scene?.CoordinateHasProducts[0]?.Product.ProductHasCategories.find(x => x.categoryLevel == 1).ProductCategory?.name,
            attributes: scene?.CoordinateHasProducts[0].tag,
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
            price: scene?.CoordinateHasProducts[0]?.Product.ProductImage?.prices.actualPrice,
            sceneThumbId: scene?.proxyImageUrl.split('/').pop(),
            proxyId1: scene?.proxyImageUrl.split('/').pop(),
            superProxyId1: scene?.CoordinateHasProducts[1]?.ProductImage?.reuploadedImages.images[0].split('/').pop(),
            superProxyId2: scene?.CoordinateHasProducts[2]?.ProductImage?.reuploadedImages.images[0].split('/').pop(),
            superProxyId3: scene?.CoordinateHasProducts[3]?.ProductImage?.reuploadedImages.images[0].split('/').pop(),
            posterImageId: this.videosListing[this.selectedIndex].thumbnail.split('/').pop(),
            description: scene?.CoordinateHasProducts[0]?.Product?.description
          }
        }
        else {
          console.log("IT is not a super proxy")
          obj = {
            proxyImage: scene?.proxyImageUrl,
            superProxySource: undefined,
            superProxyImage: undefined,
            gender: undefined,
            color: undefined,
            pattern: scene?.pattern,
            subCategory: undefined,
            attributes: scene?.CoordinateHasProducts[0]?.tag,
            adMatch1: scene?.CoordinateHasProducts[1]?.matchedImageUrl,
            adMatchAdv1: scene?.CoordinateHasProducts[1]?.Product.Retailer.name,
            adMatchScore1: scene?.CoordinateHasProducts[1]?.vzotScore,
            adMatch2: scene?.CoordinateHasProducts[2]?.matchedImageUrl,
            adMatchAdv2: scene?.CoordinateHasProducts[2]?.Product.Retailer.name,
            adMatchScore2: scene?.CoordinateHasProducts[2]?.vzotScore,
            adMatch3: scene?.CoordinateHasProducts[3]?.matchedImageUrl,
            adMatchAdv3: scene?.CoordinateHasProducts[3]?.Product.Retailer.name,
            adMatchScore3: scene?.CoordinateHasProducts[3]?.vzotScore,
            brand: scene?.CoordinateHasProducts[0]?.Product?.Brand?.name,
            price: scene?.CoordinateHasProducts[0]?.Product?.ProductImage?.prices.actualPrice,
            sceneThumbId: scene?.proxyImageUrl.split('/').pop(),
            proxyId1: scene?.proxyImageUrl.split('/').pop(),
            superProxyId1: undefined,
            superProxyId2: undefined,
            superProxyId3: undefined,
            posterImageId: this.videosListing[this.selectedIndex].thumbnail.split('/').pop(),
            description: scene?.CoordinateHasProducts[0]?.Product?.description
          }
        }
        // console.log("Object: ",obj)
        this.coordinatesSceneData.push(obj)
      })
    }
    console.log(this.selectedEpisodeScenes)
  }

  selectedIndex: any;
  selectedSeason: any;
  selectedSeasonEpisodes: any;
  selectEpisode(index: any) {
    console.log(this.selectedIndex)
    this.selectedScenes = []
    this.selectedScene = null
    console.log(index)
    if (this.selectedIndex != null && this.selectedIndex != index) {
      this.videosListing[this.selectedIndex].clicked = !this.videosListing[this.selectedIndex].clicked
      this.videosListing[this.selectedIndex].icon = "bi bi-chevron-right"
    }
    this.selectedIndex = index == this.selectedIndex ? null : index;
    this.selectedSeason = null;
    this.selectedEpisodeScenes = [];
    this.selectedSeasonEpisodes = null;
    this.selectedScenes = null;
    this.videosListing[index].clicked = !this.videosListing[index].clicked
    if (this.videosListing[index].clicked) {
      this.videosListing[index].icon = "icon-Down"
      console.log(index)
    }
    else {
      this.videosListing[index].icon = "bi bi-chevron-right"
    }
    console.log(this.videosListing)
  }
  goToTagger(id?: any, sceneId?: any) {
    if (id)
      sessionStorage.setItem('showId', id)
    if (sceneId)
      sessionStorage.setItem('sceneId', sceneId)
    this.router.navigate(['/tagger/tag-video'])
  }
  clearSearch(episode?: any) {
    console.log('cleared')
    episode.taggerPagination.pageNo = 1
    episode.taggerPagination.taggerName = undefined
    this.getEpisodeTaggers('', episode)
  }
  selectSecondChild(index: any, key) {
    this.selectedEpisode = null
    this.selectedEpisodeScenes = []
    this.selectedAnnotators = []
    this.selectedScenes = []
    this.selectedScene = null
    this.selectedSeason = index == this.selectedSeason ? null : index;
    this.selectedSeasonEpisodes = this.videosListing[this.selectedIndex].Seasons[key].Episodes
    for (const episode of this.selectedSeasonEpisodes) {
      const user = [];
      for (const tagger of episode.TaggerTagsShows) {
        const userTemp = {
          fullName: tagger.User.fullName,
          id: tagger.User.id,
          selected: true
        }
        console.log(tagger.User)
        user.push(userTemp)
      }
      episode.taggers = this.allTaggers
      episode.taggerPagination = this.taggerPagination
      console.log(user)
      this.selectedAnnotators.push(user)
    }
  }
  assignedMovieTaggers(index: number) {
    const user = []
    for (const tagger of this.videosListing[index]?.TaggerTagsShows) {
      console.log(tagger.User)
      user.push(tagger.User)
    }
    this.videosListing[index].taggers = this.allTaggers
    this.videosListing[index].taggerPagination = this.taggerPagination
    this.videosListing[index].selectedTaggers = user
  }
  selectEpisodeChild(index: any) {
    this.scenePagination.limit = 10
    this.selectedScene = null
    this.selectedEpisodeScenes = []
    this.selectedEpisode = index == this.selectedEpisode ? null : index;
    // this.selectedEpisodeScenes = this.videos[0].seasons[0].episodes[0].scenes;
    this.fetchShowScenes(this.selectedSeasonEpisodes[index]['id'])
    // this.fetchSceneDetails(this.selectedSeasonEpisodes[index]['id'])

  }
  selectEpisodeScene(index: any) {
    // this.selectedEpisodeScenes=[]
    this.selectedScenes = []
    this.selectedScene = index == this.selectedScene ? null : index;
    // this.selectedScenes = this.videos[0].seasons[0].episodes[0].scenes[0].screens;
    // console.log()
    this.selectedSceneId = this.selectedEpisodeScenes[index]['id'];
    this.fetchSceneDetails(this.selectedEpisodeScenes[index]['id'])
  }

  openModal(id?: number, seriesId?: number) {
    if (id != 3) {
      const modal = this.modalService.open(VideoSeriesDetailsComponent, {
        windowClass: "modal-xl",
        backdrop: "static",
        keyboard: false,
        centered: true,
      });
      modal.componentInstance.seriesId = seriesId
      modal.componentInstance.passEntry.subscribe((receivedEntry) => {
        this.fetchVideos()
      })
    }



  }
  openTagSummaryModal(scene?: any, addModal?: any, showId?: number) {
    const modalRef = this.modalService.open(TagSummaryComponent, {
      windowClass: "modal-xl",
      backdrop: "static",
      keyboard: false,
      centered: true,
    });
    console.log("data in video: ", addModal);
    if (scene)
      this.sharedService.sceneId.next(scene.id)
    else
      this.sharedService.sceneId.next(addModal.id)

    this.sharedService.showId.next(showId)
    this.taggerService.coordinateIds.next(this.selectedScenes.map(item=>item.id))
    modalRef.componentInstance.data = addModal;
    modalRef.componentInstance.series = this.videosListing[this.selectedIndex];
    // modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
    //   // console.log("-==================>",receivedEntry);
    //   })
  }
  openEpisodePreview(id?: any, seasonId?: number, sceneId?: number) {
    console.log(id, seasonId, sceneId)
    this.modalService.open(EpisodePreviewComponent, {
      windowClass: "modal-xl",
      backdrop: "static",
      keyboard: false,
      centered: true,
    })
    if (seasonId) {
      this.sharedService.seasonId.next(seasonId)
    }
    //Observable to send data 
    sessionStorage.setItem('showId', JSON.stringify(id))
    this.sharedService.videoData.next(id)
    if (sceneId) {
      this.sharedService.sceneId.next(sceneId)
    }

  }

  openTaggerModal() {
    this.modalService.open(AddEditTaggerDetailsComponent, {
      windowClass: "modal-xl",
      backdrop: "static",
      keyboard: false,
      centered: true,
    })
  }
  openSceneNotesModal(sceneId: number) {
    const modalRef = this.modalService.open(SceneNotesModalComponent, {
      windowClass: "modal-md",
      backdrop: "static",
      keyboard: false,
      centered: true,
      scrollable: true,
    })
    modalRef.componentInstance.editOrNew = 'new'
    modalRef.componentInstance.sceneId = sceneId
  }
  updateTaggingStatus(scene, event, sceneId: number, id: number = null) {
    console.log(event)
    if (scene?.productRecordsCount && (event.id == 4 || event.id == 5)) {
      console.log(scene)
    }
    const body = {
      id: sceneId,
      taggingStatusId: event.id,
    }
    this.apiService.sendRequest(requests.updateSceneById, 'post', body)
      .subscribe((res) => {
        console.log(res)
        if (scene?.productRecordsCount == 0 && (event.id == 5)) {
          this.toastrService.error("No PR has been found to be approved or returned");
        }
        else {
          this.toastrService.success("Status updated successfully");
        }
        
        if (id) {
          this.fetchShowScenes(id)
          this.fetchSceneDetails(sceneId)
        }
        else {
          this.fetchShowScenes(this.selectedSeasonEpisodes[this.selectedEpisode]['id'])
          this.fetchSceneDetails(sceneId)
        }

      })
  }
  approveAllScenes(episode) {
    const body = {
      showId: episode.id,
      newTaggingStatusId: 5,
    }
    this.apiService.sendRequest(requests.updateSceneByShowId, 'post', body)
      .subscribe((res) => {
        this.fetchShowScenes(episode.id)
        this.toastrService.success("All scenes approved successfully");
    });
  }
  deleteEpisode(episode) {
    const body = {
      episodeId: episode.id
    }
    console.log("episodeId", episode.id)
    this.apiService.sendRequest(requests.deleteEpisode, 'post', body)
      .subscribe((res) => {
        this.fetchVideos()
        this.toastrService.success("Video deleted successfully");
      });
  }
  showNoVideo() {
    this.toastrService.error('No Video Available')
  }
  updatePRTaggingStatus($event, sceneId: number) {
    const body = {
      id: sceneId,
      taggingStatusId: $event.id,
    }
    this.apiService.sendRequest(requests.updateTagProductInScene, 'post', body)
      .subscribe((res) => {
        this.toastrService.success("Status updated successfully");
        this.fetchSceneDetails(this.selectedSceneId)
        this.fetchShowScenes()
      })
  }
  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(FILTER_PAG_REGEX, '');
  }
  selectPage(page: string, flag: boolean = false) {
    this.pagination.pageNo = parseInt(page, 10) || 1;
    this.body = {
      ...this.body,
      pageNo: this.pagination.pageNo
    }
    this.cdr.detectChanges();
    if (!flag)
      this.fetchVideos()
  }
  sorting(order?: number, heading?: number) {
    this.tableHeadings = [{ name: "Series/Movie", order: "" }, { name: "Active", order: "" }, { name: "Episodes", order: "" }, { name: "Percent Done", order: "" }, { name: "Scenes", order: "" }, { name: "Product Records", order: "" }, { name: "Scene View", order: "" }, { name: "Ad Views", order: "" }, { name: "Ad Likes", order: "" }, { name: "Ad Clicks", order: "" }]
    // console.log("Ascending Order Clicked")
    let sortingOrder: string;
    let percentageOrder;
    if (order === 1) {
      sortingOrder = "ASC"
      this.tableHeadings[heading].order = "ASC"
    } else {
      this.tableHeadings[heading].order = "DESC"
      sortingOrder = "DESC"
    }
    this.body = {
      ...this.body,
      pageNo: this.pagination.pageNo,
      limit: this.pagination.limit,
      order: [[this.backendHeadings[heading], sortingOrder]],
      sortByPercentageAsc: undefined
    }
    if (heading == 3 && order === 2) {
      this.body = {
        ...this.body,
        order: undefined,
        sortByPercentageAsc: false
      }
    }
    else if (heading === 3 && order === 1) {
      this.body = {
        ...this.body,
        order: undefined,
        sortByPercentageAsc: true
      }
    }
    this.fetchVideos()
  }
  convertSeason(season: any) {
    return this.sharedService.convertSeasonToNumeric(season)
  }
  convertEpisode(episode: any) {
    return this.sharedService.convertEpisodeToNumeric(episode)
  }
  changeShowStatus(event: any, showId: number) {
    console.log(event?.target?.checked)
    let showStatus = 0
    if (event?.target?.checked) {
      showStatus = 1
    }
    else {
      showStatus = 2
    }
    this.apiService.sendRequest(requests.updateShowStatus, 'post', {
      showId: showId,
      showStatusId: showStatus
    }).subscribe({
      next: (res: any) => {
        // console.log("files,r", res);

      },
      error: (err: any) => {
        this.toastrService.error(err.message, "Error!");
      },
      complete: () => {
        // console.log('completed');
        this.toastrService.success("Status Updated Successfully.")

      }
    })
  }
  goToDatabase(title?: string, seriesId?: number, seasonId?: any, episodeId?: number) {
    seasonId = parseInt(seasonId?.replace(/^\D+/g, ''));
    console.log(seriesId, seasonId, episodeId)
    const body = {
      pageNo: 1,
      limit: 10,
      seriesIds: [seriesId],
      episodeNo: [episodeId],
      seasonNo: [seasonId],
      seriesName: title
    }

    this.databaseService.databaseRecords.next(body)
    this.router.navigate(['/database/filtered'])
  }
  movieTaggerSelect(event: any, index: number) {
    console.log(event)
    this.taggerIds = this.videosListing[index]?.selectedTaggers.map((item) => item.id)
    this.AssignAnnotator(this.videosListing[index])
  }
  movieTaggerSelectAll(event: any, index: number) {
    this.taggerIds = this.allTaggers.map((item) => item.id)
    this.AssignAnnotator(this.videosListing[index])
  }
  movieTaggerUnSelect(event: any, index: number) {
    this.taggerIds = this.videosListing[index]?.taggers.map((item) => item.id)
    this.taggerIds.forEach((element, index) => {
      if (element == event.id) this.taggerIds.splice(index, 1);
      // console.log("element: ", element);
      // console.log("array: ", this.multiSelectArray);
    });
    this.AssignAnnotator(this.videosListing[index])
  }
  movieTaggerUnSelectAll(event: any, index: number) {
    this.taggerIds = []
    this.AssignAnnotator(this.videosListing[index])
  }
  changeLimit() {
    this.body = {
      ...this.body,
      pageNo: this.pagination.pageNo,
      limit: this.pagination.limit
    }
    this.fetchVideos()
  }
  onScrollEnd(e) {
    console.log(e.endReached);
    if (e.endReached) {
      this.prPagination.limit += 10
      this.prBody = {
        ...this.prBody,
        limit: this.prPagination.limit
      }
      this.fetchSceneDetails(this.sceneId, true)
    }
  }
  onTaggerScrollEnd($event, episode?: any) {
    console.log("hell")
    episode.taggerPagination.pageNo++
    this.getEpisodeTaggers(null, episode)
  }
  loaderMoreScenes(page) {
    this.selectedScene = null
    if (page == 1)
      this.scenePagination.pageNo++
    else {
      this.scenePagination.pageNo--
    }
    this.fetchShowScenes(null, null, null, true)
  }
  openActorsModal(showId) {
    console.log(this.sceneId, "sceneId")
    this.modalService.open(ActorsComponent, {
      windowClass: "modal-xl",
      backdrop: "static",
      keyboard: false,
      centered: true,
    })
    //Observable to send data 
    sessionStorage.setItem('showId', JSON.stringify(showId))
    this.sharedService.videoData.next(showId)
  }
}
