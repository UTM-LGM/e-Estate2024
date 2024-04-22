import { Component, OnInit } from '@angular/core';
import { Company } from 'src/app/_interface/company';
import { Estate } from 'src/app/_interface/estate';
import { CompanyService } from 'src/app/_services/company.service';
import { EstateService } from 'src/app/_services/estate.service';
import { MyLesenIntegrationService } from 'src/app/_services/my-lesen-integration.service';

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
    private companyService: CompanyService,
    private myLesenService:MyLesenIntegrationService
  ) { }

  ngOnInit() {
    this.getCompany()
    this.getEstate()
  }

  getCompany() {
    this.myLesenService.getAllCompany()
    .subscribe(
      Response =>{
        this.filterCompanies = Response
        this.totalCompany = this.filterCompanies.length
        this.isLoadingCompany = false
      } 
    )

  }

  getEstate() {
      this.myLesenService.getAllEstate()
      .subscribe(
        Response =>{
          this.filterEstates = Response
          this.totalEstate = this.filterEstates.length
          this.isLoadingEstate = false
        }
      )
  }

}
