import { Component, OnInit } from '@angular/core';
import { Estate } from '../_interface/estate';
import { ActivatedRoute } from '@angular/router';
import { EstateService } from '../_services/estate.service';

@Component({
  selector: 'app-labor-info',
  templateUrl: './labor-info.component.html',
  styleUrls: ['./labor-info.component.css'],
})
export class LaborInfoComponent implements OnInit {
  previousMonth = new Date()

  estate: Estate = {} as Estate

  isLoading = true

  constructor(
    private route: ActivatedRoute,
    private estateService: EstateService
  ) { }

  ngOnInit() {
    this.getEstate()
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

}
