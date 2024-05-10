import { Component, OnInit } from '@angular/core';
import { Estate } from '../_interface/estate';
import { MyLesenIntegrationService } from '../_services/my-lesen-integration.service';

@Component({
  selector: 'app-estate-list',
  templateUrl: './estate-list.component.html',
  styleUrls: ['./estate-list.component.css'],
})
export class EstateListComponent implements OnInit {
  estates: any[] = []
  activeEstates: Estate[] = []
  inactiveEstates: Estate[] = []

  term = ''
  pageNumber = 1
  isLoading = true
  showDefault = true
  showActive = false
  showInactive = false
  isBtnActive = false
  isBtnInactive = false

  constructor(
    private myLesenService: MyLesenIntegrationService
  ) { }

  ngOnInit() {
    this.getEstate()
  }

  getEstate() {
    setTimeout(() => {
      this.myLesenService.getAllEstate()
        .subscribe(
          Response => {
            this.estates = Response
            this.isLoading = false
          }
        )
    }, 2000)
  }

  filterActive(active: boolean) {
    this.activeEstates = this.estates.filter(x => x.isActive == active)
    this.showDefault = false
    this.showInactive = false
    this.showActive = true
    this.isBtnActive = true
    this.isBtnInactive = false
  }

  filterInactive(inactive: boolean) {
    this.inactiveEstates = this.estates.filter(x => x.isActive == inactive)
    this.showDefault = false
    this.showActive = false
    this.showInactive = true
    this.isBtnInactive = true
    this.isBtnActive = false
  }

  clearFilter() {
    this.term = ''
    this.showActive = false
    this.showInactive = false
    this.showDefault = true
    this.isBtnInactive = false
    this.isBtnActive = false
  }
}
