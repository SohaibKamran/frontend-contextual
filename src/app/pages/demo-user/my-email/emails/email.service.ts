import { Injectable } from "@angular/core"
import { ApiService } from "src/app/core/api.service"
import { getWishlistProducts } from "src/app/core/constants"

@Injectable({
    providedIn: 'root'
})
export class EmailService {
    constructor(private apiService: ApiService) { }
    getWishlistProducts = (body: any) => {
        return this.apiService.sendRequest(getWishlistProducts, 'post', body)
    }
}