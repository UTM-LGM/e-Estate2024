import { Component, OnInit } from '@angular/core';
import { forkJoin, map } from 'rxjs';
import { LaborInfo } from 'src/app/_interface/laborInfo';
import { LaborInfoService } from 'src/app/_services/labor-info.service';
import { MyLesenIntegrationService } from 'src/app/_services/my-lesen-integration.service';
import { ReportService } from 'src/app/_services/report.service';
import { SharedService } from 'src/app/_services/shared.service';

@Component({
  selector: 'app-worker-shortage-estate',
  templateUrl: './worker-shortage-estate.component.html',
  styleUrls: ['./worker-shortage-estate.component.css']
})
export class WorkerShortageEstateComponent implements OnInit {

  year = ''
  term = ''
  pageNumber = 1
  role = ''

  workerShortages: any[] = []
  isLoading = true

  localTapperFieldWorker: any[] = []
  foreignTapperFieldWorker: any[] = []
  filterLabors: LaborInfo[] = []
  filterCompanyAdmin: any[] = []

  estate = {} as any
  company: any = {} as any
  workerEstate = {} as any


  totalTapperWorker = 0
  totalFieldWorker = 0

  totalSumTapper = 0;
  totalSumField = 0;

  constructor(
    private reportService: ReportService,
    private myLesenService: MyLesenIntegrationService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.role = this.sharedService.role
    if (this.role == "Admin") {
      this.getWorkerShortage()
    }
    else if (this.role == "CompanyAdmin") {
      this.estate.companyId = this.sharedService.companyId
      this.getAllEstate()
      this.getCompany()
    }
    else if (this.role == "EstateClerk") {
      this.estate.id = this.sharedService.estateId
      this.getEstate()
      this.getLabor()
      this.getWorkerShortage()
    }
  }

  getAllEstate() {
    this.myLesenService.getAllEstate()
      .subscribe(
        Response => {
          this.filterCompanyAdmin = Response.filter(x => x.companyId == this.estate.companyId)
        }
      )
  }

  getEstate() {
    this.myLesenService.getOneEstate(this.estate.id)
      .subscribe(
        Response => {
          this.estate = Response
        }
      )
  }

  getCompany() {
    this.myLesenService.getOneCompany(this.estate.companyId)
      .subscribe(
        Response => {
          this.company = Response
          this.isLoading = false
        }
      )
  }

  getWorkerShortage() {
    this.reportService.getWorkerShortageEstate().subscribe(
      response => {
        this.workerShortages = response;
        if(this.role == 'CompanyAdmin' || this.role == 'EstateClerk')
          {
            this.workerShortages = response.filter(x=>x.estateId == this.estate.id)
          }
        const estateRequests = this.workerShortages.map(workerShortage => {
          return this.myLesenService.getOneEstate(workerShortage.estateId).pipe(
            map(estateResponse => {
              workerShortage.estateName = estateResponse.name; // Assuming estate name is in 'name' property
            })
          );
        });
        forkJoin(estateRequests).subscribe(() => {
          this.getLabor();
          this.isLoading = false;
        });
      }
    );
  }
  
  getLabor() {
    this.reportService.getCurrentTapperAndFieldWorker().subscribe(
      Response => {
        const labors = Response;
        this.workerShortages.forEach(workerShortage => {
          workerShortage.filterLabors = labors.filter(e => e.estateId == workerShortage.estateId);
        });
      }
    );
  }

  calculateTapperSum(worker: any): number {
    if (worker && worker.filterLabors && worker.tapperShortage) {
      return worker.filterLabors.reduce((sum:any, labor:any) => sum + labor.tapperCheckrole + labor.tapperContractor, 0) + worker.tapperShortage;
    } else {
      return 0; // Return 0 if any of the properties are undefined or null
    }
  }
  
  
  calculateFieldSum(worker: any) {
    if (worker && worker.filterLabors && worker.tapperShortage) {
      return worker.filterLabors.reduce((sum:any, labor:any) => sum + labor.fieldCheckrole + labor.fieldContractor, 0) + worker.fieldShortage;
    } else {
      return 0; // Return 0 if any of the properties are undefined or null
    }
  }

  estateSelected() {
    this.isLoading = true
    this.getLabor()
    this.getWorkerShortage()
  }
}
