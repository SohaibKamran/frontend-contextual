import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FileUploadValidators } from '@iplab/ngx-file-upload';
import { FormBuilder, FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { UploadService } from 'src/app/core/services/upload.service';
import { BehaviorSubject, Subscription, concatMap, forkJoin, map, of } from 'rxjs';
import { requests } from 'src/app/core/config/config';
import { ApiService } from 'src/app/core/api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FileUploadControl } from '@iplab/ngx-file-upload';
import { VideoSeriesDetailsComponent } from '../../videos/video-series-details/video-series-details.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/core/services/shared.service';
@Component({
  selector: 'app-add-new-episode',
  templateUrl: './add-new-episode.component.html',
  styleUrls: ['./add-new-episode.component.scss']
})
export class AddNewEpisodeComponent implements OnInit, OnDestroy {
  breadCrumbItems: ({ label: string; active?: undefined } | { label: string; active: boolean })[];
  filesArray = [];
  seriesNames = [];
  seriesId: any;
  tagger = [];
  taggerId: any;
  progressObservable;
  progress;
  formSubmitted: boolean = false
  keyFrame: string = ""
  newEpisodeForm: FormGroup
  movieThumbnail: string = ""
  dropDownSettings: any
  seriesPagination: { pageNo: number, limit: number, onlySeries?:boolean,offset?: number, seriesName?: string } = { pageNo: 1, limit: 10, onlySeries:true }
  taggerPagination: { pageNo: number, limit: number,  offset?: number, taggerName?: string } = { pageNo: 1, limit: 10 }
  seriesLoader: boolean = false
  taggerLoader: boolean = false
  totalTaggerCount = 0
  fetchedTaggerCount = 0
  totalSeriesCount = 0
  fetchedSeriesCount = 0


  @ViewChild('keyframe', { static: false }) fileInputKeyFrame: ElementRef;
  @ViewChild('video', { static: false }) fileInputMovieFile: ElementRef;
  private subscription: Subscription
  constructor(
    private formBuilder: FormBuilder,
    private fileUploadService: UploadService,
    private apiService: ApiService,
    public router: Router,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private sharedService: SharedService
  ) {
    this.breadCrumbItems = [
      { label: 'Admin' },
      { label: 'Videos' },
      { label: 'Add New Video' },
      { label: 'Add New TV Episode', active: true }
    ];
  }
  ngOnInit(): void {
    this.getSeriesName();
    this.getTagger();
    this.getYear();
    this.getProgress()
    this.initForm()
    this.dropDownSettings = {
      // singleSelection: false,
      idField: 'id',
      textField: 'fullName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
    };
  }
  removeTagger(tagger: any) {
    // console.log(tagger)

    console.log(this.newEpisodeForm.value.tagger, "hi")

  }
  clearSearch(){
    this.taggerPagination={pageNo:1,limit:10,taggerName:undefined}
    this.getTagger('')
  }
  removeAllTaggers($event) {
    console.log($event, 'remove')
    this.newEpisodeForm.controls['tagger'].setValue($event)
    console.log(this.newEpisodeForm.value.tagger)


  }
  selectAllTaggers($event) {
    console.log($event, 'select')
    this.newEpisodeForm.controls['tagger'].setValue($event)
    console.log(this.newEpisodeForm.value.tagger)

  }

  selectTagger(data: any) {
    // this.taggerId = data?.value
    console.log(this.newEpisodeForm.value.tagger)
    // console.log(this.taggerId)
  }
  getProgress() {
    this.progressObservable = this.fileUploadService.episodeUploadProgress.subscribe((res) => {
      if (res)
        this.progress = res;
      // console.log(this.progress);
    });
  }
  searchSeries($event) {
    this.fetchedSeriesCount=0
    this.totalSeriesCount=0
    this.seriesPagination.pageNo=1
    if ($event.term != '')
      this.seriesPagination.seriesName = $event.term
    else
      this.seriesPagination.seriesName = undefined
    this.seriesPagination.pageNo = 1
    this.getSeriesName($event.term)
    console.log($event)
  }
  getYear() {
    // Reference the DropDownList.
    const ddlYears = document.getElementById('ddlYears') as HTMLSelectElement;

    // Determine the Current Year.
    const currentYear = new Date().getFullYear();

    // Loop and add the Year values to DropDownList.
    for (let i = 1950; i <= currentYear; i++) {
      const option = document.createElement('option');
      option.innerHTML = i.toString();
      option.value = i.toString();
      ddlYears.appendChild(option);
    }
  }



  initForm() {
    this.newEpisodeForm = this.formBuilder.group({
      episodeKeyFrame: [null, Validators.required],
      episodeVideo: [null, Validators.required],
      series: [null, Validators.required],
      season: ['', Validators.required],
      episode: ['', Validators.required],
      month: ['', Validators.required],
      year: ['', Validators.required],
      episodeTitle: ['', Validators.required],
      episodeDescription: ['', Validators.required],
      tagger: [[]]
    });
  }
  openAddSeriesModal(addModal?: any) {
    const componentRef = this.modalService.open(VideoSeriesDetailsComponent, {
      windowClass: "modal-xl",
      backdrop: "static",
      keyboard: false,
      centered: true,
    });
    componentRef.componentInstance.passEntry?.subscribe((res) => {
      console.log(res)
      const seriesObject = {
        title: res?.title,
        id: res?.id
      }
      this.fetchedSeriesCount=0
      this.totalSeriesCount=0
      this.newEpisodeForm.controls['series'].setValue(seriesObject)
      this.seriesId = res.id
      console.log(this.seriesId)
      this.getSeriesName()
    })
  }

  getSeriesName(seriesName?: string) {
    this.seriesLoader = true
    if (this.totalSeriesCount != this.fetchedSeriesCount || this.totalSeriesCount == 0) {
      this.apiService.sendRequest(requests.getSeriesName, 'post', this.seriesPagination).subscribe((res: any) => {
        if (seriesName || seriesName === '') {
          this.seriesNames = []
        
        }
        this.seriesLoader = false
        this.totalSeriesCount = res?.data?.count
        for (let i = 0; i < res?.data?.rows?.length; i++) {
          const obj = {
            title: res?.data?.rows[i].title,
            id: res?.data?.rows[i].id
          }
          this.seriesNames = [...this.seriesNames, obj]
          this.fetchedSeriesCount++
        }
      });
    }
    else
      this.seriesLoader=false
  }

  clearSeries() {

    this.fetchedSeriesCount=0
    this.totalSeriesCount=0
    this.seriesPagination = { pageNo: 1, limit: 10,seriesName: undefined }
    this.getSeriesName('')
  }

  selectSeries(series: any) {
    // console.log('Value: ', event.value);
    if (series) {
      this.seriesId = series.id
      this.newEpisodeForm.controls['series'].setValue(series.title)
    }
  }

  // private method


  uploadDocuments(files: Array<any>) {
    const apis = [];
    files.forEach((file) => {
      apis.push(this.fileUploadService.uploadEpisode({ file: file }));
    });
    return forkJoin(apis).pipe(
      map(
        (res) => {
          // console.log('file response', res);
          // [{
          //   "documentTypeId": 1,
          //   "documentId": 1
          // },
          // {
          //   "documentTypeId": 2,
          //   "documentId": 2
          // }]
          return res;
        },
        (err) => {
          // console.log(err);
        }
      )
    );
  }

  SubmitEpisode() {
    console.log(this.newEpisodeForm)
    if (this.newEpisodeForm.valid) {
      // console.log("Valid form")
      this.formSubmitted=true
      this.uploadFilesOfForm().subscribe({
        next: (res: any) => {
          // console.log("files,r",res);

        },
        error: (err: any) => {
          this.toastrService.error(err.message, "Error!");
        },
        complete: () => {
          // console.log('completed');
          this.fileUploadService.episodeUploadProgress.next(null)
          this.toastrService.success("Episode Added Successfully.")
          this.router.navigate(['/videos'])
        }
      });
    }
  }


  private uploadFilesOfForm() {
    const customName = this.generateCustomName();
    this.filesArray = []
    this.filesArray.push({"file": this.newEpisodeForm.value.episodeKeyFrame, customName, "type": "poster"})
    this.filesArray.push({"file": this.newEpisodeForm.value.episodeVideo, customName, "type": "video"})



    return this.uploadDocuments(this.filesArray).pipe(
      concatMap((res: any) => {
        // this.urlArray.push()
        // console.log('signed urlsss', res);
        // res.forEach(doc => {
        //   const id = this.filesArray.find(x => doc?.fileName.includes(x.file.name)).id ? this.filesArray.find(x => doc?.fileName.includes(x.file.name)).id : doc.fileName;
        //   // console.log("id", id);

        // });
        const month = this.newEpisodeForm.value.month;
        const year = this.newEpisodeForm.value.year;
        const timeStamp = new Date(+year, +month);
        let taggerIds = this.newEpisodeForm.value?.tagger?.map(item => item.id)
        if (taggerIds.length == 0) {
          taggerIds = undefined
        }
        const body = {
          releaseTimestamp: timeStamp,
          type: 2,
          title: this.newEpisodeForm.value.episodeTitle.trim(),
          description: this.newEpisodeForm.value.episodeDescription.trim(),
          seriesId: this.seriesId,
          seasonNo: this.newEpisodeForm.value.season,
          episodeNo: this.newEpisodeForm.value.episode,
          // yearReleased: this.newEpisodeForm.value.year,
          thumbnail: res[0][0],
          videoUrl: res[1][0],
          taggerIds: taggerIds
          // posterUrl: res[2][0],
        };
        return this.apiService.sendRequest(requests.addNewVideo, 'post', body);
      }),
      concatMap((res: any) => {
        // console.log('response');
        return of(res);
      })
    );
  }
  private generateCustomName() {
    const title = this.seriesNames.find(x => x.id === this.seriesId).title.trim().replace(/\s/g, '_');
    const season = this.newEpisodeForm.value.season;
    const episode = this.newEpisodeForm.value.episode;
    return `${title}_s${season}_e${episode}`.toLowerCase();
}

  getTagger(searchTagger?: string) {
    const tag = []
    this.taggerLoader = true
    if (this.totalTaggerCount != this.fetchedTaggerCount || this.totalTaggerCount == 0) {
      this.apiService.sendRequest(requests.getTagger, 'post', this.taggerPagination).subscribe((res: any) => {
        if (searchTagger || searchTagger === '')
          this.tagger = []
        this.taggerLoader = false
        this.totalTaggerCount = res?.data?.count
        for (let i = 0; i < res?.data?.rows?.length; i++) {
          const obj = {
            id: res?.data?.rows[i]?.id, fullName: res?.data?.rows[i]?.fullName
          }
          this.tagger = [...this.tagger, obj]
          this.fetchedTaggerCount++
        }
        // this.tagger = tag;
        // this.tagger = res?.data
        // console.log("Tag Api res", res.data)
      })
    }
    else
      this.taggerLoader=false
  }
  searchTagger($event) {
    this.taggerPagination.pageNo=1
    this.fetchedTaggerCount = 0
    if ($event.term != '')
      this.taggerPagination.taggerName = $event.term
    else
      this.taggerPagination.taggerName = undefined
    this.getTagger($event.term)
  }
  ngOnDestroy() {
    this.progressObservable.unsubscribe();
  }
  showImage(event, typeOfImage: string) {
    const file = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    if (typeOfImage === 'keyFrame') {
      this.newEpisodeForm.patchValue({
        episodeKeyFrame: file
      });
      console.log(file)
      // File Preview
      reader.onload = () => {
        this.keyFrame = reader.result as string;
      }
      reader.readAsDataURL(file)
    }
    else if (typeOfImage === 'video') {
      this.newEpisodeForm.patchValue({
        episodeVideo: file
      });
      console.log(file)
      this.sharedService.generateThumbnail(file).then(thumbnailData => {
        //console.dir(thumbnailData);
        this.movieThumbnail = thumbnailData;
      })
    }

  }
  CheckNumber(e) {
    const charCode = e.which ? e.which : e.keyCode;
    if (charCode == 43) {
      return true
    }
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false
    }
    return true
  }

  removeImage(typeOfImage: string) {
    if (typeOfImage === 'keyFrame') {
      this.keyFrame = null
      this.newEpisodeForm.controls['episodeKeyFrame'].setValue(null)
      this.fileInputKeyFrame.nativeElement.value = null
    }
    else {
      this.movieThumbnail = null
      this.newEpisodeForm.controls['episodeVideo'].setValue(null)
      this.fileInputMovieFile.nativeElement.value = null
    }
  }
  trimSpaces(event) {
    this.newEpisodeForm.controls[event.target.name].setValue(event.target.value.trimStart())
  }
  onSeriesScrollEnd(e) {
    this.seriesPagination.pageNo++
    this.getSeriesName()
  }
  onTaggerScrollEnd(e) {
    this.taggerPagination.pageNo++
    this.getTagger()
  }
}
