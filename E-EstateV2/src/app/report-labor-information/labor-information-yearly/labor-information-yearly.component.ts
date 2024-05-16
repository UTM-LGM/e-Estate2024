import { Component, OnInit } from '@angular/core';
import { AuthGuard } from 'src/app/_interceptor/auth.guard.interceptor';
import { LaborInformation } from 'src/app/_interface/laborInformation';
import { LaborTypeService } from 'src/app/_services/labor-type.service';
import { MyLesenIntegrationService } from 'src/app/_services/my-lesen-integration.service';
import { ReportService } from 'src/app/_services/report.service';
import { SharedService } from 'src/app/_services/shared.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';

@Component({
  selector: 'app-labor-information-yearly',
  templateUrl: './labor-information-yearly.component.html',
  styleUrls: ['./labor-information-yearly.component.css']
})
export class LaborInformationYearlyComponent implements OnInit {

  role = ''
  isLoading = true

  filterTypes: LaborInformation[] = []
  labors: any[] = []

  localTapperFieldWorker: any[] = []
  foreignTapperFieldWorker: any[] = []

  filterCompanyAdmin: any[] = []
  company: any = {} as any
  estate: any = {} as any

  totalTapperWorker = 0
  totalFieldWorker = 0
  showAll =false

  constructor(
    private laborTypeService: LaborTypeService,
    private reportService: ReportService,
    private sharedService: SharedService,
    private myLesenService: MyLesenIntegrationService,
    private subscriptionService:SubscriptionService
  ) { }

  ngOnInit(): void {
    this.role = this.sharedService.role

    this.getLaborType()
    this.getLaborInformation()

    if (this.role == "CompanyAdmin") {
      this.estate.companyId = this.sharedService.companyId
      this.getAllEstate()
      this.getCompany()
    }
    else if (this.role == "EstateClerk") {
      this.estate.id = this.sharedService.estateId
      this.getEstate()
    }
  }

  getAllEstate() {
    const getAllEstate = this.myLesenService.getAllEstate()
      .subscribe(
        Response => {
          this.filterCompanyAdmin = Response.filter(x => x.companyId == this.estate.companyId)
        }
      )
      this.subscriptionService.add(getAllEstate);
      
  }

  getEstate() {
    const getOneEstate = this.myLesenService.getOneEstate(this.estate.id)
      .subscribe(
        Response => {
          this.estate = Response
        }
      )
      this.subscriptionService.add(getOneEstate);

  }

  getCompany() {
    const getCompany = this.myLesenService.getOneCompany(this.estate.companyId)
      .subscribe(
        Response => {
          this.company = Response
          this.isLoading = false
        }
      )
      this.subscriptionService.add(getCompany);

  }

  getLaborType() {
    const getLaborType = this.laborTypeService.getType()
      .subscribe(
        Response => {
          const types = Response
          this.filterTypes = types.filter(x => x.isActive == true)
        }
      )
      this.subscriptionService.add(getLaborType);

  }

  getLaborInformation() {
    const getLabor = this.reportService.getLaborInformationCategory()
      .subscribe(
        Response => {
          this.labors = Response
          if(this.estate.id == undefined && this.estate.companyId == undefined){
            const groupedResponse = Response.reduce((acc, obj) => {
              const existingItem = acc.find((item: any) => item.laborTypeId === obj.laborTypeId);
              if (existingItem) {
                existingItem.totalAmountLocal += obj.localNoOfWorkers;
                existingItem.totalAmountForeign += obj.foreignNoOfWorkers
              }else{
                acc.push({
                  laborTypeId : obj.laborTypeId,
                  totalAmountLocal: obj.localNoOfWorkers,
                  totalAmountForeign: obj.foreignNoOfWorkers,
                  laborType : obj.laborType
                });
              }
              return acc;
          }, []);
          this.labors = groupedResponse
          this.isLoading = false
          this.showAll = true 
          this.getTapperAndFieldWorkerAll()
        } else{
          this.isLoading = false
          this.labors = Response.filter(x => x.estateId == this.estate.id)
          this.getTapperAndFieldWorker()
        }
    })
    this.subscriptionService.add(getLabor);


  }

  getTapperAndFieldWorker() {
    const getWorker = this.reportService.getTapperAndFieldWorker()
      .subscribe(
        Response => {
          this.localTapperFieldWorker = Response.filter(x => x.isLocal == true && x.estateId == this.estate.id)
          this.foreignTapperFieldWorker = Response.filter(x => x.isLocal == false && x.estateId == this.estate.id)
          this.totalTapperWorker = this.getTotalTapperWorker();
          this.totalFieldWorker = this.getTotalFieldWorker();
          this.isLoading = false
        }
      )
      this.subscriptionService.add(getWorker);

  }

  getTapperAndFieldWorkerAll() {
    const getWorker = this.reportService.getTapperAndFieldWorker()
      .subscribe(
        Response => {
          const groupedResponse = Response.reduce((acc, obj) => {
          const existingItem = acc.find((item: any) => item.isLocal === obj.isLocal);
          if (existingItem) {
            existingItem.totalTapperWorker += obj.tapperWorker;
            existingItem.totalFieldWorker += obj.fieldWorker
          } else {
            acc.push({
              isLocal: obj.isLocal,
              totalTapperWorker: obj.tapperWorker,
              totalFieldWorker: obj.fieldWorker,
            });
          }
          return acc;
          }, []);
          this.localTapperFieldWorker = groupedResponse.filter((x:any) => x.isLocal == true)
          this.foreignTapperFieldWorker = groupedResponse.filter((x:any) => x.isLocal == false)
          this.totalTapperWorker = this.getTotalTapperWorkerAll();
          this.totalFieldWorker = this.getTotalFieldWorkerAll();
        }
      )
      this.subscriptionService.add(getWorker);

  }

  getTotalTapperWorkerAll() {
    let total = 0;
    for (let local of this.localTapperFieldWorker) {
      total += local.totalTapperWorker;
    }
    for (let foreign of this.foreignTapperFieldWorker) {
      total += foreign.totalTapperWorker;
    }
    return total;
  }

  getTotalFieldWorkerAll() {
    let total = 0;
    for (let local of this.localTapperFieldWorker) {
      total += local.totalFieldWorker;
    }
    for (let foreign of this.foreignTapperFieldWorker) {
      total += foreign.totalFieldWorker;
    }
    return total;
  }

  getTotalTapperWorker() {
    let total = 0;
    for (let local of this.localTapperFieldWorker) {
      total += local.tapperWorker;
    }
    for (let foreign of this.foreignTapperFieldWorker) {
      total += foreign.tapperWorker;
    }
    return total;
  }

  getTotalFieldWorker() {
    let total = 0;
    for (let local of this.localTapperFieldWorker) {
      total += local.fieldWorker;
    }
    for (let foreign of this.foreignTapperFieldWorker) {
      total += foreign.fieldWorker;
    }
    return total;
  }

  estateSelected() {
    this.labors = []
    this.localTapperFieldWorker = []
    this.foreignTapperFieldWorker = []
    this.isLoading = true
    this.getLaborInformation()
    this.showAll = false
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }
  
}
