import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
import { SharedService } from 'src/app/core/services/shared.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-add-edit-tagger-details',
  templateUrl: './add-edit-tagger-details.component.html',
  styleUrls: ['./add-edit-tagger-details.component.scss']
})
export class AddEditTaggerDetailsComponent implements OnInit {

  taggerDetailsForm: FormGroup
  onboardingColor = '#1890FF';
  activeColor = 'green';
  inactiveColor = 'red';
  taggerId: any;
  taggerData: any;
  countries: any = []
  selectedCountry: any;
  initialFormValue: any
  hasChange: boolean = false;

  constructor(public modalService: NgbModal,
    private formbuilder: FormBuilder,
    public modal: NgbActiveModal,
    private apiService: ApiService,
    private sharedService: SharedService,
    private toastrService: ToastrService) {

  }
  ngOnDestroy() {
    this.taggerId.unsubscribe();
  }
  ngOnInit(): void {

    this.taggerId = this.sharedService.taggerId.subscribe((data) => {
      if (data) {
        this.initForm();
        this.getCountries()
      } else {
        this.initForm();
      }
    });
  }

  getCountries() {
    this.apiService.sendRequest(requests.getCountries, 'get')
      .subscribe((res: any) => {
        this.countries = res?.data?.countries;
        this.fetchData();
      },(err:any)=>{
        console.log('no countries loaded');
        this.fetchData()
      })
  }

  onCountryChange(country: any) {
    const countryName = this.getCountryNameById(country?.id)
    this.taggerDetailsForm.controls['country'].patchValue(countryName);
  }

  getCountryNameById(countryId) {
    for (let country of this.countries) {
      if (country?.id == countryId) {
        return country?.name;
      }
    }
  }

  getCountryIdByName(name: string): number {
    const country = this.countries.find(c => c.name === name);
    return country ? country.id : 0; // Return 0 or a default value in case the country name is not found
  }

  closeModal() {
    this.modal.close('Close click')
  }

  fetchData() {
    this.apiService.sendRequest(requests.getUserProfile, 'post')
      .subscribe((res: any) => {
        this.taggerData = res?.data;
        this.countries?.forEach(country => {
          if (country?.id == this.taggerData?.countryId) {
            this.selectedCountry = country?.name
            return;
          }
        });
        // console.log("taggerData: " , this.taggerData);
        this.taggerDetailsForm = this.formbuilder.group({
          firstName: [this.taggerData?.firstName, [Validators.required]],
          lastName: [this.taggerData?.lastName, [Validators.required]],
          email: [this.taggerData?.email, [Validators.required]],
          phoneNo: [this.taggerData?.phoneNo, [Validators.required]],
          address: [this.taggerData?.address, [Validators.required]],
          city: [this.taggerData?.city, [Validators.required]],
          state: [this.taggerData?.provinceOrRegion, [Validators.required]],
          zipCode: [this.taggerData?.zipCode, [Validators.required]],
          country: [this.getCountryNameById(this.taggerData?.countryId), [Validators.required]],
          dateStarted: [this.getDateFromDateTimeString(this.taggerData?.startedDate), [Validators.required]],
          status: [this.taggerData?.userStatusId, [Validators.required]],
          notes: [this.taggerData?.notes, [Validators.required]],
        })
        this.initialFormValue = this.taggerDetailsForm.value
        this.taggerDetailsForm.valueChanges.subscribe(value => {
          if (value) {
            this.hasChange = Object.keys(this.initialFormValue).some(key => this.taggerDetailsForm.value[key] !=
              this.initialFormValue[key])
          }
        });
      });
  }

  getDateFromDateTimeString(dateTimeString: string): string {
    const dateObj = new Date(dateTimeString);
    const year = dateObj.getFullYear();
    const month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
    const day = ('0' + dateObj.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  private initForm() {
    this.taggerDetailsForm = this.formbuilder.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      email: [null, [Validators.required]],
      phoneNo: [null, [Validators.required]],
      address: [null, [Validators.required]],
      city: [null, [Validators.required]],
      state: [null, [Validators.required]],
      zipCode: [null, [Validators.required]],
      country: [null, [Validators.required]],
      dateStarted: [null, [Validators.required]],
      status: [null, [Validators.required]],
      notes: [null, [Validators.required]],
    })
  }

  submit() {
    if (!this.hasChange) {
      this.sharedService.sceneId.next(this.sharedService.sceneId)
      this.toastrService.success("No Change Occur")
      this.closeModal()
    }
    else {
      const body = {
        firstName: this.taggerDetailsForm.value.firstName,
        lastName: this.taggerDetailsForm.value.lastName,
        phoneNo: this.taggerDetailsForm.value.phoneNo,
        address: this.taggerDetailsForm.value.address,
        city: this.taggerDetailsForm.value.city,
        countryId: this.getCountryIdByName(this.taggerDetailsForm.value.country),
        provinceOrRegion: this.taggerDetailsForm.value.state,
        zipCode: this.taggerDetailsForm.value.zipCode,
        startedDate: this.taggerDetailsForm.value.dateStarted,
        // notes: this.taggerDetailsForm.value.notes,
      }
      this.apiService.sendRequest(requests.updateUser, 'post', body)
        .subscribe((res: any) => {
          // console.log(res);
          this.sharedService.sceneId.next(this.sharedService.sceneId)
          this.toastrService.success("Updated Successfully")
          this.closeModal()
        })
    }
  }
}
