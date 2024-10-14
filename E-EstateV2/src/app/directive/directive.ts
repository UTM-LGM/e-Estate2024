import { Directive, Input, ElementRef, Renderer2, HostListener } from '@angular/core';
import { Sort } from './sort';

@Directive({
  selector: '[appSort]'
})
export class SortDirective {

  @Input()
  appSort !: Array<any>

  constructor(private targetElem: ElementRef) { }

  @HostListener("click")
  sortData() {

    const sort = new Sort()
    const elem = this.targetElem.nativeElement
    const order = elem.getAttribute("data-order")
    const property = elem.getAttribute("data-name")

    elem.setAttribute('data-order', order === 'asc' ? 'desc' : 'asc') // Toggle order

    this.appSort.sort(sort.startSort(property, order))
  }
}