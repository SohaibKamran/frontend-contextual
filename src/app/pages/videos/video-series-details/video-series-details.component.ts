import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { FileUploadValidators } from '@iplab/ngx-file-upload';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
import { UploadService } from 'src/app/core/services/upload.service';
import { concatMap, of } from 'rxjs';
import { videoSeriesModal } from './videoseriesModal';
import { map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-video-series-details',
  templateUrl: './video-series-details.component.html',
  styleUrls: ['./video-series-details.component.scss']
})
export class VideoSeriesDetailsComponent implements OnInit {

  videoDetailsForm: FormGroup;
  imageUrl: string;
  companyName: any = [];
  moviePoster: string
  submitButton = false
  loader:boolean=false
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  @Input() seriesId: number
  checked: boolean = false
  constructor(
    public modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private fileUploadingService: UploadService,
    private toastrService: ToastrService,
    private activeModal: NgbActiveModal) {
  }


  ngOnInit(): void {

    this.initForm();
    // this.demoForm;
  }

  private initForm() {
    this.videoDetailsForm = this.formBuilder.group({
      thumbnail: [null, Validators.required],
      title: [null, [Validators.required]],
      director: [undefined,],
      director1: [undefined,],
      director2: [undefined,],
      showStatusId: [2, [Validators.required]],
    })
    if(this.seriesId)
      this.getSeriesById()
  }

  getSeriesById() {
    this.loader=true
    this.apiService.sendRequest(requests.getSeriesById, 'post', { id: this.seriesId }).subscribe((res: any) => {
      this.loader=false
      console.log(res)
      this.moviePoster = res?.data?.thumbnail
      this.videoDetailsForm.controls['title'].setValue(res?.data?.title)
      this.videoDetailsForm.controls['thumbnail'].setValue(res?.data?.thumbnail)
      this.videoDetailsForm.controls['director'].setValue(res?.data?.ShowHasProductionCompanies?.[0]?.companyName)
      this.videoDetailsForm.controls['director1'].setValue(res?.data?.ShowHasProductionCompanies?.[1]?.companyName)
      this.videoDetailsForm.controls['director2'].setValue(res?.data?.ShowHasProductionCompanies?.[2]?.companyName)
      this.videoDetailsForm.controls['showStatusId'].setValue(res?.data?.showStatusId)
      if (res?.data?.showStatusId == 1) {
        this.checked = true
        console.log(this.checked)
      }
      else {
        this.checked = false
      }

      //   this.videoDetailsForm = this.formBuilder.group({
      //     moviePoster: [res?.data?.thumbnail, Validators.required],
      //     seriesTitle: [res?.data?.title, [Validators.required]],
      //     director: [undefined,],
      //     director1: [undefined,],
      //     director2: [undefined,],
      //     showStatusId: [2, [Validators.required]],
      //   })
    })
  }
  close(): void {
    this.modalService.dismissAll("success");

  }
  delete(){
    if(this.seriesId){
      const body = {showId: this.seriesId};
      this.apiService.sendRequest(requests.deleteShow, 'post', body).subscribe((res: any) => {
        this.toastrService.success("Series Deleted Successfully.")
        this.activeModal.close()
        this.passBack(res?.data)
      });

    }
  }

  submit() {
    console.log(this.videoDetailsForm)
    if (this.videoDetailsForm.valid) {
      this.submitButton = true
      console.log(typeof (this.videoDetailsForm.value.thumbnail), "type")
      if (typeof (this.videoDetailsForm.value.thumbnail) != 'string') {
        this.uploadImage().subscribe((res: any) => {
          // console.log(res, "RESPONSE");
          if (res.url) {
            const videoToSave: videoSeriesModal = new videoSeriesModal
            if (this.videoDetailsForm.value.director)
              this.companyName?.push(this.videoDetailsForm.value.director?.trim()??undefined);
            if (this.videoDetailsForm.value.director1)
              this.companyName?.push(this.videoDetailsForm.value.director1?.trim()??undefined);
            if (this.videoDetailsForm.value.director2)
              this.companyName?.push(this.videoDetailsForm.value.director2?.trim()??undefined);
            if (this.companyName?.length == 0) {
              this.companyName = undefined
            }
            let videoSeriesData = videoToSave.toServerModel(this.videoDetailsForm.value, this.companyName, this.fileUploadingService.fileUrl, this.seriesId)
            this.saveSeries(videoSeriesData)
          }
          // const body = {
          //   seriesTitle: this.videoDetailsForm.value.seriesTitle,
          //   companyNameArray: this.companyName,
          //   imageUrl: this.fileUploadingService.fileUrl,
          //   availableOnPlatform: this.videoDetailsForm.value.available,
          // };
        });
      }
      else{
        console.log(this.videoDetailsForm)
        const videoToSave: videoSeriesModal = new videoSeriesModal
        if (this.videoDetailsForm.value.director)
          this.companyName?.push(this.videoDetailsForm.value.director?.trim()??undefined);
        if (this.videoDetailsForm.value.director1)
          this.companyName?.push(this.videoDetailsForm.value.director1?.trim()??undefined);
        if (this.videoDetailsForm.value.director2)
          this.companyName?.push(this.videoDetailsForm.value.director2?.trim()??undefined);
        if (this.companyName?.length == 0) {
          this.companyName = undefined
        }
        let videoSeriesData = videoToSave.toServerModel(this.videoDetailsForm.value, this.companyName,this.videoDetailsForm.value.thumbnail, this.seriesId)
        this.saveSeries(videoSeriesData)
      }
    }
  }

  saveSeries(videoSeriesData: any) {
    console.log(videoSeriesData)
    let series
    if (this.seriesId) {
      series = requests.updateSeriesById
    }
    else {
      series = requests.addNewSeries
    }
    console.log(series)
    this.apiService.sendRequest(series, 'post', videoSeriesData).subscribe({
      next: (res: any) => {
        console.log("files,r", res);
        this.passBack(res?.data)
      },
      error: (err: any) => {
        this.toastrService.error(err.message, "Error!");
      },
      complete: () => {
        this.activeModal.close()
        if(this.seriesId)
          this.toastrService.success("Series Updated Successfully.")
        else
          this.toastrService.success("Series Added Successfully.")

        this.initForm();
      }
      // console.log(res)
    })

  }

  // private uploadImage() {
  //   const videoToSave: videoSeriesModal = new videoSeriesModal
  //   return this.fileUploadingService.upload({ file: this.videoDetailsForm.value.movieFrame[0] }).pipe(concatMap((res: any) => {
  //     // console.log(res);

  //     this.companyName.push(this.videoDetailsForm.value.director);
  //     this.companyName.push(this.videoDetailsForm.value.director1);
  //     this.companyName.push(this.videoDetailsForm.value.director2);

  //     const videoSeriesData = videoToSave.toServerModel(this.videoDetailsForm.value, this.companyName, this.fileUploadingService.fileUrl)
  //     // const body = {
  //     //   seriesTitle: this.videoDetailsForm.value.seriesTitle,
  //     //   companyNameArray: this.companyName,
  //     //   imageUrl: this.fileUploadingService.fileUrl,
  //     //   availableOnPlatform: this.videoDetailsForm.value.available,
  //     // };
  //     return this.apiService.sendRequest(requests.addNewSeries, 'post', videoSeriesData);
  //   }), concatMap((res: any) => {
  //     // console.log("response successfully", res);
  //     return of(res);
  //   }));
  // }

  uploadImage() {
    const customName = this.videoDetailsForm.value.title.trim().replace(/\s/g, '_').toLowerCase();
    const file = { file: this.videoDetailsForm.value.thumbnail, customName, type: 'poster'}
    return this.fileUploadingService.uploadSeries({ file }).pipe(map((res: any) => {
      // console.log(res);
      return res
    }))
  }
  passBack(newSeries: any = null) {
    console.log(this.videoDetailsForm.value.seriesTitle)
    this.passEntry.emit(newSeries);
  }
  removeImage(type: string) {
    
    this.moviePoster = null
    this.videoDetailsForm.controls['thumbnail'].setValue(null)
  }
  showImage(event, typeOfImage: string) {

    console.log(event)
    const file = (event.target as HTMLInputElement).files[0];
    event.currentTarget.value = null
    const reader = new FileReader();
    if (typeOfImage === 'poster') {
      this.videoDetailsForm.patchValue({
        thumbnail: file
      });
      console.log(file)
      // File Preview
      reader.onload = () => {
        this.moviePoster = reader.result as string;
      }
      reader.readAsDataURL(file)
    }

  }
  changeStatus(event: any) {

    if (event.target.checked) {
      this.videoDetailsForm.controls['showStatusId'].setValue(1)
    }
    else {
      this.videoDetailsForm.controls['showStatusId'].setValue(2)
    }
  }
  trimSpaces(event) {
    this.videoDetailsForm.controls[event.target.name]?.setValue(event.target.value?.trimStart())
  }
}