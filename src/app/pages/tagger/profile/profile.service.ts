import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/core/api.service';
import { getAllCountries, getProfileDetails, updateProfileDetails } from './../../../core/constants';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    public updateProfileForm: FormGroup
    constructor(fb: FormBuilder, private apiService: ApiService) {
        this.updateProfileForm = fb.group({
            firstName: [undefined, [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
            lastName: [undefined, [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
            title: [undefined],
            profilePicture: [undefined],
            company: [undefined],
            email: [{value:undefined,disabled:true}, [Validators.required]],
            countryCode: [undefined],
            phoneNo: [undefined],
            address: [undefined, [Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
            state: [undefined],
            zipCode: [undefined],
            oldPassword: ['', Validators.minLength(8)],
            newPassword: ['', Validators.minLength(8)],
            confirmPassword: ['', Validators.minLength(8)],
            country: [undefined, ],
            bankCountry: [undefined, ],
            city: [undefined, [ Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
            province: [undefined, [Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
            bankRoutingNumber: [undefined, [ Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
            recipientAccountNumber: [undefined, [ Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
            recipientTaxId: [undefined, [ Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
        })
    }

    getProfileDetail = () => {
        return this.apiService.sendRequest(getProfileDetails, 'post')
    }
    updateProfileDetail = (body: any) => {
        return this.apiService.sendRequest(updateProfileDetails, 'post', body)
    }
    getCountries = () => {
        const body = {
            pageNo: 1,
            limit: 300
        }
        return this.apiService.sendRequest(getAllCountries, 'post', body)
    }
}
