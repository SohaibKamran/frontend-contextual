import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { requests } from 'src/app/core/config/config';
import { ApiService } from 'src/app/core/api.service';
import { title } from 'process';
import { Router } from '@angular/router';
import { TagSummaryComponent } from '../../videos/tag-summary/tag-summary.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/core/services/shared.service';
import { EpisodePreviewComponent } from '../../episode-preview/episode-preview.component';
const FILTER_PAG_REGEX = /[^1-9]/g;

@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.scss']
})


export class MyTasksComponent implements OnInit {

  pagination: { pageNo: number, limit: number, offset?: number, showOrder?: string[][], sceneOrder?: string[][], taggingStatusId?: number, productRecordReturnId?: number, coordinateOrder?: number } = { limit: 10, pageNo: 1, showOrder: undefined, sceneOrder: undefined, productRecordReturnId: 4 }
  @ViewChild('myDropdown', { static: false }) myDropdown: ElementRef;
  @ViewChild('tableResponsive', { static: true }) tableResponsive: ElementRef;

  isDropdownOpen = false;

  dtResponsiveOptions = {}
  tableListingData = [];
  season: any;
  episode: any;
  sceneNo: any;
  loader = true
  totalCount: any;
  showProductRecords = true
  isDropdownOpened: boolean = false;


  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;

    if (this.isDropdownOpen && this.tableResponsive) {
      this.tableResponsive.nativeElement.style.overflow = 'inherit';
    } else if(this.tableResponsive) {
      this.tableResponsive.nativeElement.style.overflow = 'auto';
    }
  }

  closeDropdown() {
    this.isDropdownOpen = false;
    if(this.tableResponsive) this.tableResponsive.nativeElement.style.overflow = 'auto';
  }

  @HostListener('document:click', ['$event.target']) onDocumentClick(target: HTMLElement) {
    if (this.isDropdownOpen && !this.myDropdown.nativeElement.contains(target)) {
      this.closeDropdown();
    }
  }

  taggingStatuses = [
    {
      id: 3,
      title: "PR In Review",
      class: "review"
    },
  ]
  selectedFilter = 0
  tableHeadings = ["Pr ID", "Super Proxy", "Scene/Preview", "Top VZoT Score", "PR Status", "Series", "Season", "Episode", "Scene "]

  loading = false
  constructor(private apiService: ApiService,
    private router: Router, public modalService: NgbModal, private sharedService: SharedService) {

  }

  ngOnInit() {
    this.getTaggerStats();
    this.getTaggerSceneListing();
  }


  tableHeadingsBackend = ["id", "id", "id", "topVzotScore", "taggingStatusId", "title", "seasonNo", "episodeNo", "id"]
  widgets = [
    {
      title: 'Ad Matches',
      amount: '0',
      background: 'my-tasks-bg ',
      border: ['my-tasks-border', 'selected-widget'],
      icon: 'ti ti-trending-down',
      content: 'Product Records Returned',
      color: 'text-danger',
      number: '$2,395',
      height: '75',
      active: true

    },
    {
      title: 'Total Scenes',
      amount: '0',
      background: 'my-tasks-bg ',
      border: ['my-tasks-border', 'selected-widget'],
      icon: 'ti ti-trending-up',
      content: 'Scenes To Do',
      color: 'text-primary',
      number: '3,000',
      height: '75',
      active: false,
    },
    {
      title: 'Scenes Indexed',
      amount: '0',
      background: 'my-tasks-bg ',
      border: ['my-tasks-border', 'selected-widget'],
      icon: 'ti ti-trending-up',
      content: 'Scenes In Progress',
      color: 'text-success',
      number: '8,900',
      height: '75',
      active: false
    },
    {
      title: 'Ad Positions',
      amount: '0',
      background: 'my-tasks-bg ',
      border: ['my-tasks-border', 'selected-widget'],
      icon: 'ti ti-trending-down',
      content: 'Scenes Returned ',
      color: 'text-warning',
      number: '1,943',
      height: '75',
      active: false

    },

  ];


  resetFilters() {

    this.tableListingData = []
    this.widgets[this.selectedFilter].active = false
    this.widgets[0].active = true
    this.selectedFilter = 0
    this.pagination.productRecordReturnId = 4
    this.pagination.taggingStatusId = undefined
    this.pagination.coordinateOrder = undefined
    this.pagination.sceneOrder = undefined
    this.pagination.showOrder = undefined
    this.showProductRecords = true
    this.tableHeadings = ["Pr ID", "Super Proxy", "Scene/Preview", "Top VZoT Score", "PR Status", "Series", "Season", "Episode", "Scene "]
    this.tableHeadingsBackend = ["id", "id", "id", "topVzotScore", "taggingStatusId", "title", "seasonNo", "episodeNo", "id"]

    this.getTaggerSceneListing()
  }
  filterScenes(id: number) {

    this.widgets[this.selectedFilter].active = false
    this.widgets[id].active = true
    this.selectedFilter = id
    this.pagination.pageNo = 1
    // console.log(id)

    if (id == 3) {

      id = id + 1
    }
    this.pagination.taggingStatusId = id
    this.pagination.productRecordReturnId = undefined
    this.tableListingData = []
    if (id == 0) {
      this.pagination.taggingStatusId = undefined
      this.pagination.productRecordReturnId = 4
      this.showProductRecords = true
      this.tableHeadings = ["Pr ID", "Super Proxy", "Scene/Preview", "Top VZoT Score", "PR Status", "Series", "Season", "Episode", "Scene "]
      this.tableHeadingsBackend = ["id", "id", "id", "topVzotScore", "taggingStatusId", "title", "seasonNo", "episodeNo", "id"]
      this.taggingStatuses = [
        {
          id: 3,
          title: "In Review",
          class: "review"
        }
      ]
    }
    else {
      this.showProductRecords = false
      this.tableHeadings = ["Scene ID", "Scene/Preview", "Top VZoT Score", "Scene Status", "Series", "Season", "Episode", "Scene #"]
      this.tableHeadingsBackend = ["id", "id", "topVzotScore", "taggingStatusId", "title", "seasonNo", "episodeNo", "id"]
      this.taggingStatuses = [

        {
          id: 1,
          title: "Scene To Do",
          class: "todo",
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
    }
    this.getTaggerSceneListing()

  }
  getTaggerStats() {
    this.apiService.sendRequest(requests.getTaggerStats, 'post').subscribe((res: any) => {
      // console.log(res)
      this.widgets[1].amount = res.data[0].scenesTodo
      this.widgets[2].amount = res.data[0].scenesInprogress
      this.widgets[3].amount = res.data[0].scenesReturned
      this.widgets[0].amount = res.data[0].productRecordsReturned

    })
  }

  getTaggerSceneListing() {

    this.loader = true
    this.apiService.sendRequest(requests.getTaggerSceneListing, 'post', this.pagination)
      .subscribe((res: any) => {
        this.loader = false
        // console.log(res, 'res')
        if (this.pagination.productRecordReturnId != 3) {

          this.tableListingData = res?.data?.rows;
          this.totalCount = res?.data?.count;

          // console.log(this.tableListingData, "Table Data")
          for (let i = 0; i < this.tableListingData.length; i++) {
            if (this.tableListingData[i]?.Show?.Series) {
              const tableRow = this.tableListingData[i]
              this.tableListingData[i].scene_id = tableRow.Show.Series.title.toUpperCase() + "S" + tableRow.Show.seasonNo + "E" +
                tableRow.Show.episodeNo + tableRow.id
              this.tableListingData[i].product_id = tableRow.Show.Series.title.toUpperCase() + "S" + tableRow.Show.seasonNo + "E" +
                tableRow.Show.episodeNo + tableRow.id
              this.tableListingData[i].taggingStatusValue = this.taggingStatuses[this.tableListingData[i].taggingStatusId - 1]?.title
              this.tableListingData[i].taggingStatusColor = this.taggingStatuses[this.tableListingData[i].taggingStatusId - 1].class
            }
            else {
              if (this.tableListingData[i].taggingStatusValue == "RETURNED") {
                this.tableListingData[i].taggingStatusValue = "PR Returned";
                this.tableListingData[i].taggingStatusColor = "returned";
              }
              else {
                this.tableListingData[i].Scene.taggingStatusValue = this.taggingStatuses[this.tableListingData[i].Scene.taggingStatusId - 4].title
                this.tableListingData[i].Scene.taggingStatusColor = this.taggingStatuses[this.tableListingData[i].Scene.taggingStatusId - 4].class
              }
              // console.log(this.tableListingData[i].Scene.taggingStatusValue)
            }
          }

        }
        else {

          this.tableListingData = res.data.rows
          // console.log(this.tableListingData, "thumbnail")
        }
        //this.createTable()


      }
      )
  }

  updateTaggingStatus(scene: any, statusId: number) {
    const updateStatusBody = {
      id: scene?.id,
      taggingStatusId: statusId
    }
    if (scene?.Scene?.id) {
      this.apiService.sendRequest(requests.updateTagProductInScene, 'post', updateStatusBody).subscribe((res) => {
        this.getTaggerSceneListing()
        this.getTaggerStats()
      })
    }
    else {
      this.apiService.sendRequest(requests.updateSceneById, 'post', updateStatusBody).subscribe((res) => {
        this.getTaggerSceneListing()
        this.getTaggerStats()
      })
    }
  }

  sortOrder: string[] = ["", "", "", "", "", "", "", "", ""];

  sort(heading: any, sortingOrder: any) {


    if (sortingOrder == 1) {

      sortingOrder = "ASC"
      this.sortOrder[heading] = "ASC";
    }
    else {
      sortingOrder = "DESC"
      this.sortOrder[heading] = "DESC"
    }

    // console.log(heading)
    if (heading == 7) {
      this.pagination.showOrder = undefined
      this.pagination.sceneOrder = [[this.tableHeadingsBackend[heading], sortingOrder]]
    }
    if (this.tableHeadingsBackend[heading] == "taggingStatusId") {
      this.pagination.showOrder = undefined
      this.pagination.sceneOrder = [[this.tableHeadingsBackend[heading], sortingOrder]]
    }
    else if (heading < 4) {
      this.pagination.showOrder = undefined
      this.pagination.sceneOrder = [[this.tableHeadingsBackend[heading], sortingOrder]]

    }
    else if (heading >= 4) {
      this.pagination.sceneOrder = undefined
      this.pagination.showOrder = [[this.tableHeadingsBackend[heading], sortingOrder]]

    }

    this.getTaggerSceneListing()

  }

  sortDescending(heading: any) {

    // console.log("asda");
  }
  onPageChange(event: any) {
    this.pagination.pageNo = event;
    // let page = this.pagination.pageNo == 1 ? 0 : this.pagination.pageNo - 1;
    // this.pagination.limit = event == 1 ? 0 : (event - 1) * this.pagination.limit;
    this.getTaggerSceneListing()
  }
  getPageSymbol(current: number) {
    return ['A', 'B', 'C', 'D', 'E', 'F', 'G'][current - 1];
  }

  selectPage(page: string) {
    this.pagination.pageNo = parseInt(page, 10) || 1;
    this.getTaggerSceneListing()
  }

  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(FILTER_PAG_REGEX, '');
  }

  routeToAnnotator(id: any, sceneId: any) {
    sessionStorage.setItem('showId', id)
    sessionStorage.setItem('sceneId', sceneId)
    this.router.navigate(['/tagger/tag-video'])

  }

  openTagSummaryModal(addModal?: any) {
    const modalRef = this.modalService.open(TagSummaryComponent, {
      windowClass: "modal-xl",
      backdrop: "static",
      keyboard: false,
      centered: true,
    });

    // if (addModal?.CoordinateHasProducts) {
    //   this.sharedService.proxyCordinateId.next(addModal.CoordinateHasProducts[0].proxyCoordinateId)
    // }
    // else if (this.droppedImgUrl) {
    //   // console.log(this.droppedImgUrl)
    //   this.sharedService.droppedImageUrl = this.droppedImgUrl;
    // }
    // else {
    //   this.sharedService.proxyCordinateId.next(addModal.proxyCoordinateId)
    // }
    this.sharedService.sceneId.next(addModal.id)

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

}
