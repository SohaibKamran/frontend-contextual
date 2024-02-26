import { Injectable } from '@angular/core';
import { addToWishlist, getLimitedWishlistProducts, getTrendigBrands, getWishlistProducts, removeFromWishlist } from 'src/app/core/constants';
// import { addToWishlist, getLimitedWishlistProducts, getWishlistProducts, removeFromWishlist } from '';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
    providedIn: 'root'
})
export class WishlistService {
    constructor(private apiService: ApiService) { }
    addToWishlist = (body: any) => {
        return this.apiService.sendRequest(addToWishlist, 'post', body)
    }
    getWishlistProducts = (body: any) => {
        return this.apiService.sendRequest(getWishlistProducts, 'post', body)
    }
    getWishlistBrands = (body: any) => {
        return this.apiService.sendRequest(getTrendigBrands, 'post', body)
    }
    getLimitedWishlistProducts = (body?) => {
        return this.apiService.sendRequest(getLimitedWishlistProducts, 'post',body)
    }
    removeWishlistProduct = (body: any) => {
        return this.apiService.sendRequest(removeFromWishlist, 'post', body)
    }
}
