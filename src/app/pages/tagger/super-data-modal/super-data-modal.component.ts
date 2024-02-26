import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { TaggerService } from '../tagger.service';

@Component({
  selector: 'app-super-data-modal',
  templateUrl: './super-data-modal.component.html',
  styleUrls: ['./super-data-modal.component.scss']
})
export class SuperDataModalComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private taggerService: TaggerService) { }
allProducts=[];
currentProxyProduct=null
saveSuperData()
  {
    return;
    let obj=this.currentProxyProduct
    obj.products=[];
    for(let x in obj.CoordinateHasProducts)
    {
      let newobj={
        "productTag":obj.CoordinateHasProducts[x].tag,
        "productId":obj.CoordinateHasProducts[x].Product.id
      }
      obj.products.push(newobj)
    }
    obj.coordinates=
    {
      "x":obj.xCoordinate,
      "y":obj.yCoordinate
    }
    obj.xCoordinate;
    obj.yCoordinate;
    obj.Actor
    obj.actorId
    obj.id
    obj.tagIds=this.data.currentTagSelected    
    for(let x in obj.Tags)
    {
      obj.tagIds.push(obj.Tags[x].id)
    }
    // console.log(obj);
    
    this.taggerService.addProductOfScene(obj).subscribe(data=>{
    })
    
}
checkIfInList(product:any)
  {    
    let check=false;
    for(let x in this.currentProxyProduct?.CoordinateHasProducts)
    {
      if(this.currentProxyProduct.CoordinateHasProducts[x]?.Product?.id==product?.id)
      {
        check=true;
        break;
      }
    }
    return check;
}
getProductImages()
{
  this.taggerService.getProductsForTagger().subscribe(data=>{
    // console.log(data);
    this.allProducts=data['data']
  })
}
ngOnInit(): void {
  // console.log(this.data);
  // this.allProducts=this.data.allProducts
  //uncheck the above if you want all the products . for images and id select the following 
  this.currentProxyProduct=this.data.currentProxyProduct
  this.getProductImages()

}
selectedProducts:any[]=[]

selectProduct(product:any)
  {
    this.selectedProducts.push(product)
    let obj={
      "Product":product,
      "tag":this.data?.currentTagSelected
    }
    if(obj.tag=='' || !obj.tag)
    {
      obj.tag=''
    }
    let dontAdd=false;
    if(this.currentProxyProduct.CoordinateHasProducts)
    {
      for(let x in this.currentProxyProduct.CoordinateHasProducts)
      {
        if(this.currentProxyProduct.CoordinateHasProducts[x].Product.id==product.id)
        {
          dontAdd=true;
        }
      }
      if(dontAdd==false)
      {
        this.currentProxyProduct.CoordinateHasProducts.push(obj);
        //call api here 
        
      }
    }
    else if(this.currentProxyProduct.products)
    {
      this.currentProxyProduct.CoordinateHasProducts=[];
      for(let x in this.currentProxyProduct.products)
      {
        if(this.currentProxyProduct.products[x].Product.id==product.id)
        {
          dontAdd=true;
        }
      }
      if(dontAdd==false)
      {
        let str='';
        for(let t in obj.tag)
        {
          str=str+obj.tag[t]+' '
        }
        // console.log(str);
        
        let newObj={
          productTag: str,
          productId: obj.Product.id
        }
        this.currentProxyProduct.CoordinateHasProducts.push(obj)
        this.currentProxyProduct.products.push(newObj);
        //call api here 
        
      }
      // this.currentProxyProduct.CoordinateHasProducts=this.currentProxyProduct.products
    }

  }
removeProduct(product:any)
{ 
  for(let x in this.selectedProducts)
  {
    if(this.selectedProducts[x]==product)
    {
      this.selectedProducts.splice(parseInt(x),1)
    }
  }
  for(let x in this.currentProxyProduct.CoordinateHasProducts)
  {
    if(this.currentProxyProduct.CoordinateHasProducts[x].Product.id==product.id)
    {
      this.currentProxyProduct.CoordinateHasProducts.splice(parseInt(x),1)
    }
  }    
}
refreshButton()
{
  this.getProductImages()
}
}
