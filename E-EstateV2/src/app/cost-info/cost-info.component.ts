import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Estate } from '../_interface/estate';
import { ActivatedRoute } from '@angular/router';
import { CostType } from '../_interface/costType';
import { EstateService } from '../_services/estate.service';
import { CostTypeService } from '../_services/cost-type.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-cost-info',
  templateUrl: './cost-info.component.html',
  styleUrls: ['./cost-info.component.css'],
})
export class CostInfoComponent implements OnInit {
  activeButton = ''
  clickedCostTypeId = 1
  selectedYear = ''

  estate: Estate = {} as Estate

  costType: CostType[] = []
  isLoading = true;

  @Output() yearChanged = new EventEmitter<string>()

  constructor(
    private route: ActivatedRoute,
    private estateService: EstateService,
    private costTypeService: CostTypeService
  ) { }

  ngOnInit() {
    this.getEstate()
    this.getCostType()
  }

  yearSelected() {
    const yearAsString = this.selectedYear.toString()
    if (yearAsString.length === 4) {
      this.yearChanged.emit(this.selectedYear)
    } else {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please insert correct year',
      });
      this.selectedYear = ''
    }

  }

  getEstate() {
    setTimeout(() => {
      this.route.params.subscribe((routerParams) => {
        if (routerParams['id'] != null) {
          this.estateService.getOneEstate(routerParams['id'])
            .subscribe(
              Response => {
                this.estate = Response
                this.isLoading = false
              });
        }
      });
    }, 2000)
  }

  buttonClicked(costType: string, id: number) {
    this.activeButton = costType
    this.clickedCostTypeId = id
  }

  getCostType() {
    this.costTypeService.getCostType()
      .subscribe(
        Response => {
          const costType = Response
          this.costType = costType.filter(x => x.isActive == true)
        }
      )
  }
}
