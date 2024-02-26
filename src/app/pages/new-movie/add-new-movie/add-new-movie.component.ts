import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FileUploadValidators } from '@iplab/ngx-file-upload';
import { FormBuilder, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
import { UploadService } from 'src/app/core/services/upload.service';
import { BehaviorSubject, Subscription, concatMap, forkJoin, map, of } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FileUploadControl } from '@iplab/ngx-file-upload';
import { SharedService } from 'src/app/core/services/shared.service';
@Component({
  selector: 'app-add-new-movie',
  templateUrl: './add-new-movie.component.html',
  styleUrls: ['./add-new-movie.component.scss']
})
export class AddNewMovieComponent implements OnInit, OnDestroy {

  breadCrumbItems: ({ label: string; active?: undefined; } | { label: string; active: boolean; })[];
  @ViewChild('addDirectorModal') addDirectorModal: any;
  selectedYear: number;
  directorForm: FormGroup;
  newMovieForm: FormGroup;
  tagger = [];
  taggerId: any;
  filesArray = [];
  urlArray = [];
  writersData = [];
  DirectorsData = [];
  writerId: any;
  directorId: any;
  activeColor = 'green';
  optionSelected: any;
  progressObservable
  progress
  formSubmitted: boolean = false;
  writer = ""
  selectedDirector = null
  keyFrame: string = ""
  moviePoster: string = ""
  keyFrameSubscription: Subscription
  moviePosterSubscription: Subscription
  moviePosterStatus: boolean = true
  movieThumbnail: string = ""
  totalTaggerCount = 0
  fetchedTaggerCount = 0
  totalSeriesCount = 0
  fetchedSeriesCount = 0
  taggerPagination: { pageNo: number, limit: number, offset?: number, taggerName?: string } = { pageNo: 1, limit: 10 }
  directorPagination: { pageNo: number, limit: number, creatorTypeId?: number, name?: string } = { pageNo: 1, limit: 10, creatorTypeId: 1 }
  directorLoader: boolean = false
  writerPagination: { pageNo: number, limit: number, creatorTypeId?: number, name?: string } = { pageNo: 1, limit: 10, creatorTypeId: 2 }
  writerLoader: boolean = false
  directorCount: number = 0
  fetchedDirectorCount: number = 0
  writerCount: number = 0
  fetchedWriterCount: number = 0

  taggerLoader: boolean = false
  @ViewChild('files', { static: false }) fileInputPoster: ElementRef;
  @ViewChild('keyframe', { static: false }) fileInputKeyFrame: ElementRef;
  @ViewChild('video', { static: false }) fileInputMovieFile: ElementRef;
  isAddDirector: boolean = false
  dropDownSettings: any

  constructor(
    public fb: FormBuilder,
    private apiService: ApiService,
    private fileUploadService: UploadService,
    public modalService: NgbModal,
    public router: Router,
    private toastrService: ToastrService,
    private sharedService: SharedService) {

    this.breadCrumbItems = [
      { label: 'Admin', active: false },
      { label: 'Videos' },
      { label: 'Add New Video' },
      { label: 'Add New Movie', active: true }
    ];
  }
  ngOnInit(): void {
    // console.log("asdf")
    this.initialForm();
    this.getTagger();
    this.getAllDirector();
    this.getAllWriter();
    this.getYear();
    this.getProgress()
    this.dropDownSettings = {
      // singleSelection: false,
      idField: 'id',
      textField: 'fullName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
    };
  }

  getProgress() {
    this.progressObservable = this.fileUploadService.movieUploadProgress.subscribe((res) => {
      if (res)
        this.progress = res
      // console.log(this.progress)
    })
  }
  filesssControl = new FileUploadControl(
    { listVisible: true, accept: ['video/*', '.mkv'], discardInvalid: true, multiple: false },
    [FileUploadValidators.accept(['video/*', '.mkv']), FileUploadValidators.filesLimit(1)])

  private initialForm() {
    this.newMovieForm = this.fb.group({
      movieFrame: [null, Validators.required],
      movieTitle: ['', Validators.required],
      year: ['', Validators.required],
      director: [null, Validators.required],
      writer: [null, Validators.required],
      episodeDescription: ['', Validators.required],
      aignTagger: [''],
      moviePoster: [null, Validators.required],
      movieFile: [null, Validators.required],
      tagger: [[]]
    });
  }

  private inItForm() {
    this.directorForm = this.fb.group({
      addDirector: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
    })
  }

  getYear() {
    // document.addEventListener("DOMContentLoaded", function() {
    // Reference the DropDownList.
    const ddlYears = document.getElementById("ddlYears") as HTMLSelectElement;

    // Determine the Current Year.
    const currentYear = new Date().getFullYear();

    // Loop and add the Year values to DropDownList.
    for (let i = 1950; i <= currentYear; i++) {
      const option = document.createElement("option");
      option.innerHTML = i.toString();
      option.value = i.toString();
      ddlYears.appendChild(option);
    }
    // });

  }
  onChange(director) {
    console.log(director)
    this.newMovieForm.controls['director'].setValue(director.name);
    this.selectedDirector = director.id
  }
  openAddModal(choice: number) {
    this.optionSelected = choice
    this.inItForm();
    this.modalService.open(this.addDirectorModal, {
      backdrop: true,
      keyboard: true,
      centered: true,
      windowClass: 'modal-sm'
    });
  }
  onSubmit(writer) {
    console.log(writer)
    this.newMovieForm.controls['writer'].setValue(writer.name);
    this.writer = writer.id
  }

  newCreate() {
    if (this.optionSelected === 1) {
      this.newMovieForm.controls['director'].setValue(this.directorForm.value.addDirector)
      const body = {
        name: this.directorForm.value.addDirector,
        creatorTypeId: 1,
      }
      this.apiService.sendRequest(requests.addNewCreator, 'post', body)
        .subscribe((res: any) => {
          // console.log("Directors add response", res)
          this.selectedDirector = res?.data?.id
          console.log(this.selectedDirector)
          this.getAllDirector();
        })
    }
    else if (this.optionSelected === 2) {
      this.newMovieForm.controls['writer'].setValue(this.directorForm.value.addDirector)
      const body = {
        name: this.directorForm.value.addDirector,
        creatorTypeId: 2,
      }
      this.apiService.sendRequest(requests.addNewCreator, 'post', body)
        .subscribe((res: any) => {
          // console.log("Directors add response", res)
          this.writer = res?.data?.id
          this.getAllWriter();
        })
    }
  }
  // uploadForm = new UntypedFormGroup({
  //   moviePoster: this.filesControl
  // });
  // movieForm = new UntypedFormGroup({
  //   movieFile: this.filesControl
  // });

  // private method
  staticModal(addDirectorModal: any) {
    this.modalService.open(addDirectorModal, {
      backdrop: true,
      keyboard: true,
      centered: true,
      windowClass: 'modal-sm'
    });
  }

  getAllDirector(director?:string) {
    this.directorLoader = true
    if (this.directorCount != this.fetchedDirectorCount || this.fetchedDirectorCount == 0) {
      this.apiService.sendRequest(requests.getAllCreator, 'post', this.directorPagination)
        .subscribe(res => {
          if(director || director==''){
            this.DirectorsData=[]
          }
          
          this.directorLoader = false
          const result = JSON.parse(JSON.stringify(res))
          for (let i = 0; i < result?.data?.rows.length; i++) {
            let obj = {
              id:result?.data?.rows[i].id,
              name:result?.data?.rows[i].name
            }
            this.directorCount=result?.data?.count
            this.DirectorsData = [...this.DirectorsData,obj]
            this.fetchedDirectorCount++
          }
        })
    }
    else
      this.directorLoader=false
  }
  clearSearch(){
    this.taggerPagination={pageNo:1,limit:10,taggerName:undefined}
    this.getTagger('')
  }
  clearDirector($event){
    this.directorPagination={pageNo:1,limit:10, creatorTypeId:1, name:undefined}
    this.fetchedDirectorCount=0
    this.getAllDirector('')

  }
  clearWriter($event){
    this.writerPagination={pageNo:1,limit:10, creatorTypeId:2, name:undefined}
    this.fetchedDirectorCount=0
    this.getAllWriter('')

  }
  searchDirector($event) {
    this.fetchedDirectorCount=0
    this.directorCount=0
    this.directorPagination.pageNo=1
    if ($event.term != '')
      this.directorPagination.name = $event.term
    else
      this.directorPagination.name = undefined
    this.getAllDirector('')
  }
  searchWriter($event) {
    this.writerPagination.pageNo=1
    this.fetchedWriterCount=0
    this.writerCount=0
    if ($event.term != '')
      this.writerPagination.name = $event.term
    else
      this.writerPagination.name = undefined
    this.getAllWriter('')
  }
  getAllWriter(writer?:string) {
    this.writerLoader = true
    if (this.writerCount != this.fetchedWriterCount || this.fetchedWriterCount == 0) {
      this.apiService.sendRequest(requests.getAllCreator, 'post', this.writerPagination)
        .subscribe(res => {
          if(writer || writer==''){
            this.writersData=[]
          }
          this.writerLoader = false
          const result = JSON.parse(JSON.stringify(res))
          for (let i = 0; i < result?.data?.rows.length; i++) {
            let obj = {
              id:result?.data?.rows[i].id,
              name:result?.data?.rows[i].name
            }
            this.writerCount=result?.data?.count
            this.writersData = [...this.writersData,obj]
            this.fetchedWriterCount++
          }
        })
    }
    else
      this.writerLoader=false
  }

  getTagger(searchTagger?: string) {
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
  removeTagger(tagger: any) {
    // console.log(tagger)

  }
  removeAllTaggers($event) {
    this.newMovieForm.controls['tagger'].setValue($event)
  }
  selectAllTaggers($event) {
    this.newMovieForm.controls['tagger'].setValue($event)
  }

  selectTagger(data: any) {
    // this.taggerId = data?.value
    console.log(this.newMovieForm.value.tagger)
    // console.log(this.taggerId)
  }

  // selectWriter(data: any){
  //   this.writerId = data?.value
  // }
  // selectDirector(data: any){
  //   this.directorId = data?.value
  // }

  uploadDocuments(files: Array<any>) {
    const apis = []
    files.forEach(file => {
      apis.push(this.fileUploadService.uploadMovie({ file: file }))
    });
    return forkJoin(apis).pipe(
      map((res) => {
        // console.log("file response", res);
        // [{
        //   "documentTypeId": 1,
        //   "documentId": 1
        // },
        // {
        //   "documentTypeId": 2,
        //   "documentId": 2
        // }]
        return res
      }, err => {
        // console.log(err);

      })
    )
  }
  submitMovie() {
    if (this.newMovieForm.valid) {
      this.formSubmitted = true
      this.uploadFilesOfForm().subscribe({
        next: (res: any) => {
          // console.log("files,r", res);

        },
        error: (err: any) => {
          this.toastrService.error(err.message, "Error!");
        },
        complete: () => {
          // console.log('completed');
          this.fileUploadService.movieUploadProgress.next(null)
          this.toastrService.success("Movie Added Successfully.")
          this.router.navigate(['/videos'])
        }
      });
    }

  }
  private uploadFilesOfForm() {
    const customName = this.generateCustomName();
    this.filesArray = []
    this.filesArray.push({"file": this.newMovieForm.value.movieFrame, customName, "type": "frame"})
    this.filesArray.push({"file": this.newMovieForm.value.moviePoster, customName, "type": "poster"})
    this.filesArray.push({"file": this.newMovieForm.value.movieFile, customName, "type": "video"})
    return this.uploadDocuments(this.filesArray).pipe(concatMap((res: any) => {
      // console.log("signed urlsss", res);
      const body = this.apiBody(res);
      return this.apiService.sendRequest(requests.addNewVideo, 'post', body);
    }), concatMap((res: any) => {
      // console.log("response");
      return of(res);
    }));
  }
  private generateCustomName() {
    return this.newMovieForm.value.movieTitle.trim().replace(/\s/g, '_').toLowerCase();
}

  private apiBody(res: any) {
    const year = parseInt(this.newMovieForm.value.year)
    let taggerIds = this.newMovieForm.value?.tagger?.map(item => item.id)
    if (taggerIds.length == 0) {
      taggerIds = undefined
    }
    const timeStamp = new Date(year, 0, 1)
    return {
      type: 3,
      title: this.newMovieForm.value.movieTitle.trim(),
      description: this.newMovieForm.value.episodeDescription.trim(),
      // writer: this.demoForm.value.writer,
      // director: this.demoForm.value.director,
      releaseTimestamp: timeStamp,
      writerId: this.writer,
      directorId: this.selectedDirector,
      thumbnail: res[0][0],
      posterUrl: res[1][0],
      videoUrl: res[2][0],
      taggerIds: taggerIds
    };
  }
  ngOnDestroy() {
    this.progressObservable.unsubscribe()
  }
  showImage(event, typeOfImage: string) {
    const file = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    if (typeOfImage === 'poster') {
      this.newMovieForm.patchValue({
        moviePoster: file
      });
      console.log(file)
      // File Preview
      reader.onload = () => {
        this.moviePoster = reader.result as string;
      }
      reader.readAsDataURL(file)
    }
    else if (typeOfImage === 'keyFrame') {
      this.newMovieForm.patchValue({
        movieFrame: file
      });
      console.log(file)
      // File Preview
      reader.onload = () => {
        this.keyFrame = reader.result as string;
      }
      reader.readAsDataURL(file)
    }
    else if (typeOfImage === 'video') {

      this.newMovieForm.patchValue({
        movieFile: file
      });
      this.sharedService.generateThumbnail(file).then(thumbnailData => {
        //console.dir(thumbnailData);
        this.movieThumbnail = thumbnailData;
      })
    }
  }
  removeImage(typeOfImage: string) {
    if (typeOfImage === 'poster') {
      this.moviePoster = null
      this.newMovieForm.controls['moviePoster'].setValue(null)
      console.log(this.newMovieForm.get('moviePoster').value, 'Movie Poster Value')
      this.fileInputPoster.nativeElement.value = null;
    }
    else if (typeOfImage === 'keyFrame') {
      this.keyFrame = null
      this.newMovieForm.controls['movieFrame'].setValue(null)
      this.fileInputKeyFrame.nativeElement.value = null
    }
    else {
      this.movieThumbnail = null
      this.newMovieForm.controls['movieFile'].setValue(null)
      this.fileInputMovieFile.nativeElement.value = null
    }
  }
  trimSpaces(event) {
    this.newMovieForm.controls[event.target.name].setValue(event.target.value.trimStart())
  }
  onTaggerScrollEnd(e) {
    this.taggerPagination.pageNo++
    this.getTagger()
  }
  directorScrollEnd() {
    this.directorPagination.pageNo++
    this.getAllDirector()
  }
  writerScrollEnd() {
    this.writerPagination.pageNo++
    this.getAllWriter()
  }
}
