import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';

@Injectable({
    providedIn: 'root'
})
export class AddsSliderService {
    constructor(private apiService: ApiService) { }
}