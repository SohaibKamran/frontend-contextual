import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-product-tag-info',
  templateUrl: './product-tag-info.component.html',
  styleUrls: ['./product-tag-info.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ProductTagInfoComponent {
  @Input() productData;
  @Output() hideAttributeSection: EventEmitter<any> = new EventEmitter()
  @Output() addTag: EventEmitter<any> = new EventEmitter()
  @Output() onAttributeDelete: EventEmitter<any> = new EventEmitter()
  @Input() tags;
  first_render: boolean = true;

  ngOnChanges(changes: SimpleChanges) {
    if (this.first_render) {
      for (let i = 0; i < this.productData?.attributes?.length; i++) {
        if(this.productData?.attributes[i]?.name) continue;
        const tag = this.productData.attributes[i]
        this.productData.attributes[i] = {
          name: tag,
          selected: false
        };
        for (let j = 0; j < this.tags.length; j++) {
          if (this.tags[j].name == this.productData?.attributes[i]?.name)
            this.productData.attributes[i].selected = true;
        }
      }
      this.first_render = false;
    }
    else {
      for (let i = 0; i < this.productData?.attributes?.length; i++) {
        this.productData.attributes[i].selected = false;
        for (let j = 0; j < this.tags.length; j++) {
          if (this.tags[j].name == this.productData?.attributes[i]?.name)
            this.productData.attributes[i].selected = true;
        }
      }
    }
  }

  addTagMethod(tag) {
    this.addTag.emit(tag)
    const index = this.productData?.attributes?.findIndex(a => a.name == tag)
    if (index != undefined) {
      this.productData.attributes[index].selected = true;
    }
  }
  hideSection($event) {
    this.hideAttributeSection.emit($event)
  }
  removeAttribute(tag) {
    const selectedTag = this.tags.find(t => t.name == tag)
    if (selectedTag != undefined)
      this.onAttributeDelete.emit(selectedTag)
  }
}

