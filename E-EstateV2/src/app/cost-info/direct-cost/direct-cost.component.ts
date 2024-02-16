import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-direct-cost',
  templateUrl: './direct-cost.component.html',
  styleUrls: ['./direct-cost.component.css'],
})
export class DirectCostComponent implements OnInit {

  @Input() costTypeId: number = 0
  @Input() selectedYear = ''

  clickedCostTypeId = 0
  activeButton = ''

  constructor(
  ) { }

  ngOnInit() {
    this.clickedCostTypeId = this.costTypeId
  }

  setActiveButton(button: string): void {
    this.activeButton = button
  }

}




