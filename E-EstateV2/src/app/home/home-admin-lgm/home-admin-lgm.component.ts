import { Component, OnInit } from '@angular/core';
import { Company } from 'src/app/_interface/company';
import { Estate } from 'src/app/_interface/estate';
import { CompanyService } from 'src/app/_services/company.service';
import { EstateService } from 'src/app/_services/estate.service';

@Component({
  selector: 'app-home-admin-lgm',
  templateUrl: './home-admin-lgm.component.html',
  styleUrls: ['./home-admin-lgm.component.css']
})
export class HomeAdminLGMComponent implements OnInit {

  totalEstate = 0
  totalCompany = 0

  filterEstates: Estate[] = []

  filterCompanies: Company[] = []

  isLoadingCompany = true
  isLoadingEstate = true

  constructor(
    private estateService: EstateService,
    private companyService: CompanyService
  ) { }

  ngOnInit() {
    this.getCompany()
    this.getEstate()
  }

  getCompany() {
    this.companyService.getCompany()
      .subscribe(
        Response => {
          const companies = Response
          this.filterCompanies = companies.filter(x => x.isActive == true)
          this.totalCompany = this.filterCompanies.length
          this.isLoadingCompany = false
        });
  }

  getEstate() {
    this.estateService.getEstate()
      .subscribe(
        Response => {
          const estates = Response
          this.filterEstates = estates.filter(x => x.isActive == true)
          this.totalEstate = this.filterEstates.length
          this.isLoadingEstate = false
        }
      )
  }

}
