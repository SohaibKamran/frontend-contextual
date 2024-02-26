import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';

@Injectable({
  providedIn: 'root'
})
export class ManageAdvertisersService {

  public advertiserId: number;
  constructor(
    private apiService: ApiService
  ) { }

}
