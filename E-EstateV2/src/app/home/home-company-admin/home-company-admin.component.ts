import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AuthGuard } from 'src/app/_interceptor/auth.guard.interceptor';
import { Estate } from 'src/app/_interface/estate';
import { FieldProduction } from 'src/app/_interface/fieldProduction';
import { CompanyService } from 'src/app/_services/company.service';
import { EstateService } from 'src/app/_services/estate.service';
import { FieldProductionService } from 'src/app/_services/field-production.service';
import { FieldService } from 'src/app/_services/field.service';
import { MyLesenIntegrationService } from 'src/app/_services/my-lesen-integration.service';
import { ReportService } from 'src/app/_services/report.service';
import { SharedService } from 'src/app/_services/shared.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';

@Component({
  selector: 'app-home-company-admin',
  templateUrl: './home-company-admin.component.html',
  styleUrls: ['./home-company-admin.component.css']
})
export class HomeCompanyAdminComponent implements OnInit {

  totalEstate = 0
  totalCrop = 0
  companyId = 0
  totalLatexDry = 0
  totalCuplumpDry = 0
  totalCuplumpDryMalaysia = 0
  totalLatexDryMalaysia = 0


  totalCompanyProductivity = 0

  filterEstates: Estate[] = []

  company: any = {} as any

  filterProductions: FieldProduction[] = []

  productionCompany:any[]=[]
  productivity: any[] = []


  isLoadingEstate = true
  isLoadingProduction = true
  isLoadingEstateName = true
  isLoadingTapped = true
  isLoadingCompany = true
  isLoadingMalaysia =true

  tappedArea = 0
  tappedAreaMalaysia = 0

  constructor(
    private sharedService: SharedService,
    private fieldProductionService: FieldProductionService,
    private myLesenService: MyLesenIntegrationService,
    private fieldService: FieldService,
    private reportService:ReportService,
    private subscriptionService:SubscriptionService
  ) { }

  ngOnInit() {
    if (this.sharedService.role != "Admin") {
      this.companyId = this.sharedService.companyId
      this.getCompany()
      this.getEstate()
      this.getProduction()
      this.getField()
    }
  }

  getField() {
    const getCurrentField = this.reportService.getCurrentField(new Date().getFullYear().toString())
    .subscribe(
      (Response: any[]) => {
        const filteredFields = Response.filter(x => x.fieldStatus.toLowerCase().includes('tapped area'));
        if(filteredFields.length ==0){
          this.tappedArea = 0
          this.tappedAreaMalaysia = 0
          this.isLoadingTapped = false
          this.isLoadingMalaysia = false
        }
        else{
          this.tappedAreaMalaysia = filteredFields.reduce((sum, field) => sum + field.area, 0);
          this.isLoadingMalaysia = false

        const observables = filteredFields.map(field => this.myLesenService.getOneEstate(field.estateId));

        forkJoin(observables)
        .subscribe(
          (responses: any[]) => {
            // Loop through the responses and push companyId into the corresponding field object
            responses.forEach((response, index) => {
              filteredFields[index].companyId = response.companyId;
            });

            // Calculate tapped area and set isLoadingTapped after all responses are received
            const tappedAreaField = filteredFields.filter(x => x.companyId == this.sharedService.companyId);
           
            this.tappedArea = tappedAreaField.reduce((sum, field) => sum + field.area, 0);

            this.isLoadingTapped = false;
            this.isLoadingCompany = false
          }
        )
        }
      }
    );
    this.subscriptionService.add(getCurrentField);
}


  getCompany() {
   const getCompany =  this.myLesenService.getOneCompany(this.companyId)
      .subscribe(
        Response => {
          this.company = Response
          this.isLoadingEstateName = false
        }
      )
    this.subscriptionService.add(getCompany);

  }

  getEstate() {
   const getEstate = this.myLesenService.getAllEstate()
      .subscribe(
        Response => {
          const estates = Response
          this.filterEstates = estates.filter(x => x.companyId == this.sharedService.companyId)
          this.totalEstate = this.filterEstates.length
          this.isLoadingEstate = false
        }
      )
    this.subscriptionService.add(getEstate);

  }

  getProduction() {
   const getCurrentProduction = this.reportService.getCurrentCropProduction()
      .subscribe(
        Response => {
          const productions = Response
          if(productions.length == 0){
            this.totalCuplumpDry = 0
            this.totalLatexDry = 0
            this.isLoadingProduction = false
            this.totalCuplumpDryMalaysia = 0
            this.totalLatexDryMalaysia = 0
            this.isLoadingCompany = false
          }
          this.totalCuplumpDryMalaysia = productions.reduce((sum, field) => sum + field.cuplumpDry, 0);
          this.totalLatexDryMalaysia = productions.reduce((sum, field) => sum + field.latexDry, 0)
          const observables = productions.map(productions => this.myLesenService.getOneEstate(productions.estateId));

          forkJoin(observables)
          .subscribe(
            (responses: any[]) => {
              // Loop through the responses and push companyId into the corresponding field object
              responses.forEach((response, index) => {
                productions[index].companyId = response.companyId;
              });

              // Calculate tapped area and set isLoadingTapped after all responses are received
              const productionCompany = productions.filter(x => x.companyId == this.sharedService.companyId);
              this.totalCuplumpDry = productionCompany.reduce((sum, field) => sum + field.cuplumpDry, 0);
              this.totalLatexDry = productionCompany.reduce((sum, field) => sum + field.latexDry, 0)
              this.isLoadingProduction = false
            }
          )
        }
      )
    this.subscriptionService.add(getCurrentProduction);

  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }

 



}
