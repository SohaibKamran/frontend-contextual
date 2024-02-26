import { ElementRef, EventEmitter, Output, Renderer2 } from '@angular/core';
/* eslint-disable prefer-const */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-this-alias */
import { Component, Input, OnInit } from '@angular/core';
import { fabric } from 'fabric';
// import { BsModalRef, ModalOptions, BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'app-tagger-canvas',
  templateUrl: './tagger-canvas.component.html',
  styleUrls: ['./tagger-canvas.component.scss']
})
export class TaggerCanvasComponent implements OnInit {
  @Input() mainImageInCanvas;
  @Input() index;
  @Input() showCross;
  @Input() coordinateColor;
  @Output() getCoordinates = new EventEmitter<any>();
  @Output() removeTag = new EventEmitter<any>();
  canvasMade = true;
  scaleRatio:any;
  canvas : any;
  currentColor: any;
  colorArray: any = [];
  constructor(private el: ElementRef, private renderer: Renderer2){
    // this.constructcanvas();
  }
  ngOnInit(): void {
    this.constructcanvas();
  }
  constructcanvas(){
    const canvasId = `canvas_${this.index}`;
    this.renderer.setAttribute(this.el.nativeElement.querySelector('canvas'), 'id', canvasId);
    this.canvas = new fabric.Canvas(canvasId,{ selection: false });
    this.canvas?.setWidth(260);
    this.canvas?.setHeight(150);
    let img = new Image();
    var self = this;
    img.onload = function () {
      self.scaleRatio = Math.min((self.canvas.width / img.width), (self.canvas.height / img.height))
      img.width = self.canvas.width
      img.height = self.canvas.height
      self.canvas.setDimensions({ width: self.canvas.width, height: self.canvas.height });
      var fabricImage = new fabric.Image(img);
      fabricImage.set({
        scaleX: self.scaleRatio,
        scaleY: self.scaleRatio,
      });
      self.canvas?.setBackgroundImage(fabricImage, self.canvas?.renderAll.bind(self.canvas));
      self.canvas.renderAll();
    };
    img.src = this.mainImageInCanvas;
    this.canvas?.on('mouse:down', (options) => {
      this.handleCanvasClick(options.e);
    });
  }
  handleCanvasClick(event: MouseEvent) {
    event.preventDefault()
    const rect = this.canvas.upperCanvasEl.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    this.removeCanvasObj()
    let coordinates = {
      x : x/this.scaleRatio,
      y : y/this.scaleRatio
    }
    this.getCoordinates.emit(coordinates)
    const circle = new fabric.Circle({
      radius: 5,
      fill: this.coordinateColor,
      left: x-5,
      top: y-5
    });
    this.canvas?.add(circle);
  }
  deleteTag(){
    this.removeTag.emit()
    this.removeCanvasObj()
  }
  removeCanvasObj(){
    this.canvas.forEachObject((obj) => {
      if (obj instanceof fabric.Circle) {
          this.canvas.remove(obj); // Remove the existing circle
      }
    });
  }
  getNewColor() {
    let n = (Math.random() * 0xfffff * 1000000).toString(16);
    this.currentColor = '#' + n.slice(0, 6);
    while (this.colorArray.includes(this.currentColor)) {
      n = (Math.random() * 0xfffff * 1000000).toString(16);
      this.currentColor = '#' + n.slice(0, 6);
    }
    this.colorArray.push(this.currentColor);
    return this.currentColor;
  }
}
