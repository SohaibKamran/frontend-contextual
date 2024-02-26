import { Component } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
import { WishlistService } from '../my-wishlist/wishlist.service';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { first, tap, catchError } from 'rxjs/operators';


@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss']
})
export class ExploreComponent {
  loader = false;
  text: string = '';
  searchResults: any[] = [];
  wishlistData: any[] = [];
  wishlistIds: any[] = [];

  constructor(
    private apiService: ApiService,
    private wishlistService: WishlistService,
    private toastr: ToastrService,
    ) { 
      this.getWishlistProducts().subscribe(
        () => {}, // Empty handler for initial load
        (err) => this.toastr.error(err?.message, "Error")
      );
    }

    getWishlistProducts() {
      const body = {
        pageNo: 1,
        limit: 1000,
        "approvedOnly": true
      };
  
      return this.wishlistService.getWishlistProducts(body).pipe(
        tap((response: any) => {
          this.wishlistData = response?.data?.rows.map((item) => item?.ProxyCoordinate?.id);
          this.wishlistIds = response?.data?.rows.map((item) => item?.id);
        }),
        catchError((err) => {
          if (err.status !== 404) {
            this.wishlistData = [];
            this.toastr.error(err?.message, "Error");
          }
          return of(err); // Emit the error using 'of'
        })
      );
    }

    addProduct(item) {
      const body = {
        "productId": item?.id,
        "showId": item?.Show?.id,
        "coordinateId": item?.ProxyCoordinate?.id,
        "retailerId": item?.Retailer?.id,
        "sceneId": item?.Scene?.id,
        "productImageId": item?.ProductImage?.id,
        "actorId": item?.ProxyCoordinate?.Actor?.id,
        "matchedImageUrl": item?.matchedImageUrl,
      }
      this.wishlistService.addToWishlist(body).pipe(first())
      .subscribe({
        next: () => {
          this.toastr.success('Product added to wishlist');
          this.getWishlistProducts().subscribe({
            next: () => this.refreshListing(),
            error: (err) => this.toastr.error(err.message, "Error")
          });
        },
        error: (error) => {
          this.searchResults = [];
          this.toastr.error(error.message, "Error");
        }
      });
  }
  removeProduct(item) {
    const body = {
      "favoriteProductId": item?.favoriteProductId,
    }
    this.wishlistService.removeWishlistProduct(body).pipe(first())
      .subscribe({
        next: () => {
          this.toastr.success('Product removed from wishlist')
          this.refreshListing();
          item.heart = false;
        },
        error: (error) => {
          // this.error = error;
          // this.loading = false;
          this.searchResults = []
        }
      });
  }
  refreshListing(){
    for (let result of this.searchResults) {
      if(this.wishlistData.includes(result?.ProxyCoordinate?.id)){
        result.heart=true
        result.favoriteProductId=this.wishlistIds[this.wishlistData.indexOf(result?.ProxyCoordinate?.id)];
      }
      else{
        result.heart=false
      }
    }
  }
  onSearch() {
    this.loader = true;
    const body = {
      text: this.text,
      limit: 10000,
    }
    this.apiService.sendRequest(requests.searchProductsInScenes, 'post', body).subscribe((res: any) => {
      const uniqueById = new Set();
      this.searchResults = res.data.filter(item => {
        if (!uniqueById.has(item?.Product?.id)) {
            uniqueById.add(item?.Product?.id);
            return true;
        }
        return false;
    });
      this.refreshListing();
      this.loader = false;
    }, err => {
      this.loader = false;
    });
  }
}
