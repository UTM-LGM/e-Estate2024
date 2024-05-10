import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MyLesenIntegrationService } from '../_services/my-lesen-integration.service';

@Component({
  selector: 'app-labor-info',
  templateUrl: './labor-info.component.html',
  styleUrls: ['./labor-info.component.css'],
})
export class LaborInfoComponent implements OnInit {
  previousMonth = new Date()

  estate: any = {} as any

  isLoading = true

  constructor(
    private route: ActivatedRoute,
    private myLesenService: MyLesenIntegrationService
  ) { }

  ngOnInit() {
    this.getEstate()
  }

  getEstate() {
    setTimeout(() => {
      this.route.params.subscribe((routerParams) => {
        if (routerParams['id'] != null) {
          this.myLesenService.getOneEstate(routerParams['id'])
            .subscribe(
              Response => {
                this.estate = Response
                this.isLoading = false
              }
            )
        }
      });
    }, 2000)
  }
}
