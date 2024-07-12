import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, map } from 'rxjs';
import { LaborInfo } from 'src/app/_interface/laborInfo';
import { LaborInfoService } from 'src/app/_services/labor-info.service';
import { MyLesenIntegrationService } from 'src/app/_services/my-lesen-integration.service';
import { ReportService } from 'src/app/_services/report.service';
import { SharedService } from 'src/app/_services/shared.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';
import swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-worker-shortage-estate',
  templateUrl: './worker-shortage-estate.component.html',
  styleUrls: ['./worker-shortage-estate.component.css']
})
export class WorkerShortageEstateComponent implements OnInit, OnDestroy {

  year = ''
  term = ''
  pageNumber = 1
  role = ''
  startMonth = ''
  endMonth = ''
  itemsPerPageShortage = 10

  workerShortages: any[] = []
  labors: any[] = [];
  workerTapperAndField:any[]=[]

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
    private sharedService: SharedService,
    private subscriptionService:SubscriptionService
  ) { }

  ngOnInit() {
    this.role = this.sharedService.role
    this.isLoading = false
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

  monthChange() {
    this.isLoading = true
    this.getTapperAndFieldWorker()
    this.getWorkerShortage()
    
  }

  chageStartMonth() {
    this.endMonth = ''
    this.workerShortages =[]
  }

  yearSelected() {
    const yearAsString = this.year.toString();
    if (yearAsString.length === 4) {
      this.isLoading = true;
      this.getTapperAndFieldWorker()
      this.getWorkerShortage()
    } else {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please insert correct year',
      });
      this.year = '';
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
    const getEstate = this.myLesenService.getOneEstate(this.estate.id)
      .subscribe(
        Response => {
          this.estate = Response
          this.isLoading = false
        }
      )
      this.subscriptionService.add(getEstate);

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

  getWorkerShortage() {
    const getShortage = this.reportService.getAllWorkerShortageEstate(this.startMonth, this.endMonth)
    .subscribe(
      response => {
        this.workerShortages = response;

        if(this.workerShortages.length === 0)
          {
            this.isLoading = false
          }
          else{
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
              this.getTapperAndFieldWorker();
              this.isLoading = false;
            });
          }
        }
    );
    this.subscriptionService.add(getShortage);

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
  
  getTapperAndFieldWorker() {
    const getWorker = this.reportService.getAllTapperAndFieldWorker(this.startMonth, this.endMonth)
      .subscribe(Response => {
        if(this.role =='Admin'){
          this.localTapperFieldWorker = Response
          const groupedData = Response.reduce((acc, currentValue) => {
            const { estateId, tapperWorker, fieldWorker } = currentValue;
            if (!acc[estateId]) {
              acc[estateId] = {
                estateId: estateId,
                tapperWorker: 0,
                fieldWorker: 0
              };
            }
            acc[estateId].tapperWorker += tapperWorker;
            acc[estateId].fieldWorker += fieldWorker;
            return acc;
          }, {});
          this.workerTapperAndField = Object.values(groupedData);
        }
        this.localTapperFieldWorker = Response.filter(x => x.isLocal == true && x.estateId == this.estate.id);
        if(this.localTapperFieldWorker.length == 0){
          const local = {
            isLoacal:true,
            tapperWorker:0,
            fieldWorker:0
          }
          this.localTapperFieldWorker.push(local)
        }
        this.foreignTapperFieldWorker = Response.filter(x => x.isLocal == false && x.estateId == this.estate.id);
        if(this.foreignTapperFieldWorker.length == 0){
          const foreign ={
            isLocal:false,
            tapperWorker:0,
            fieldWorker:0,
          }
          this.localTapperFieldWorker.push(foreign)
        }
        this.calculateTotals();
        this.isLoading = false;
      },
      error => {
        console.error('Error fetching tapper and field workers:', error);
        this.isLoading = false;
      });
    this.subscriptionService.add(getWorker);
  }
  

  calculateTotals() {
    this.totalTapperWorker = this.localTapperFieldWorker.reduce((total, worker) => total + worker.tapperWorker, 0) +
      this.foreignTapperFieldWorker.reduce((total, worker) => total + worker.tapperWorker, 0);

    this.totalFieldWorker = this.localTapperFieldWorker.reduce((total, worker) => total + worker.fieldWorker, 0) +
      this.foreignTapperFieldWorker.reduce((total, worker) => total + worker.fieldWorker, 0);
  }

  calculateTotalsAll() {
    this.totalTapperWorker = this.localTapperFieldWorker.reduce((total, worker) => total + worker.totalTapperWorker, 0) +
      this.foreignTapperFieldWorker.reduce((total, worker) => total + worker.totalTapperWorker, 0);

    this.totalFieldWorker = this.localTapperFieldWorker.reduce((total, worker) => total + worker.totalFieldWorker, 0) +
      this.foreignTapperFieldWorker.reduce((total, worker) => total + worker.totalFieldWorker, 0);
  }


  exportToExcel(workerShortages: any[], fileName: string) {
    let bilCounter = 1;
    const filteredData:any = workerShortages.map(worker => ({
      No: bilCounter++,
      EstateName: worker.estateName,
      CurrentTapperWorker: this.totalTapperWorker,
      CurrentFieldWorker: this.totalFieldWorker,
      TapperWorkerShortage: worker.tapperShortage,
      FieldWorkerShortage: worker.fieldShortage,
      TapperWorkerNeeded: this.totalTapperWorker + worker.tapperShortage,
      FieldWorkerNeeded: this.totalFieldWorker +   worker.fieldShortage,
      TotalWorkerNeeded: (this.totalTapperWorker + worker.tapperShortage) + (this.totalFieldWorker +   worker.fieldShortage)
    }));
  
    const headerRow = [
      { No: 'Start Month Year:', EstateName: this.startMonth},
      { No: 'End Month Year:', EstateName: this.endMonth},
      {}, // Empty row for separation
      { No: 'No', EstateName: 'EstateName', CurrentTapperWorker: 'CurrentTapperWorker', CurrentFieldWorker: 'CurrentFieldWorker', 
        TapperWorkerShortage: 'TapperWorkerShortage', FieldWorkerShortage: 'FieldWorkerShortage', TapperWorkerNeeded: 'TapperWorkerNeeded',
        FieldWorkerNeeded: 'FieldWorkerNeeded', TotalWorkerNeeded: 'TotalWorkerNeeded'
      }
    ];

    const exportData = headerRow.concat(filteredData);

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData, { skipHeader: true });

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const formattedFileName = `${fileName}_${this.startMonth}_${this.endMonth}.xlsx`;

    XLSX.writeFile(wb, formattedFileName);
  }

  exportToExcelAdmin(workerShortages: any[], workerTapperAndField: any[], fileName: string) {
    let bilCounter = 1;
    const filteredData:any = workerShortages.map(worker => {
      // Find the corresponding labor data for the current estate
      const laborData = workerTapperAndField.find(labor => labor.estateId === worker.estateId);
      // Calculate the total tapper and field workers needed
      const totalTapperNeeded = this.calculateTapperNeeded(workerShortages, workerTapperAndField, worker.estateId);
      const totalFieldNeeded = this.calculateFieldNeeded(workerShortages, workerTapperAndField, worker.estateId);
      return {
        No: bilCounter++,
        EstateName: worker.estateName,
        CurrentTapperWorker: laborData ? laborData.tapperWorker : 0,
        CurrentFieldWorker: laborData ? laborData.fieldWorker : 0,
        TapperWorkerShortage: worker.tapperShortage,
        FieldWorkerShortage: worker.fieldShortage,
        TapperWorkerNeeded: totalTapperNeeded,
        FieldWorkerNeeded: totalFieldNeeded,
        TotalWorkerNeeded: totalTapperNeeded + totalFieldNeeded
      };
    });
  
    const headerRow = [
      { No: 'Start Month Year:', EstateName: this.startMonth},
      { No: 'End Month Year:', EstateName: this.endMonth},
      {}, // Empty row for separation
      { No: 'No', EstateName: 'EstateName', CurrentTapperWorker: 'CurrentTapperWorker', CurrentFieldWorker: 'CurrentFieldWorker', 
        TapperWorkerShortage: 'TapperWorkerShortage', FieldWorkerShortage: 'FieldWorkerShortage', TapperWorkerNeeded: 'TapperWorkerNeeded',
        FieldWorkerNeeded: 'FieldWorkerNeeded', TotalWorkerNeeded: 'TotalWorkerNeeded'
      }
    ];

    const exportData = headerRow.concat(filteredData);

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData, { skipHeader: true });
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1'); // Set sheet name as needed
    const formattedFileName = `${fileName}_${this.startMonth}_${this.endMonth}.xlsx`;

    XLSX.writeFile(wb, formattedFileName);
  }
  

  calculateTapperNeeded(workerShortage:any[], workerTapperAndField:any[], estateId:number){
    const shortage = workerShortage.find(worker => worker.estateId === estateId)?.tapperShortage || 0;
    const tapperWorker = workerTapperAndField.find(worker => worker.estateId === estateId)?.tapperWorker || 0;
    return shortage + tapperWorker;
  }

  calculateFieldNeeded(workerShortage:any[], workerTapperAndField:any[], estateId:number){
    const shortage = workerShortage.find(worker => worker.estateId === estateId)?.fieldShortage || 0;
    const fieldWorker = workerTapperAndField.find(worker => worker.estateId === estateId)?.fieldWorker || 0;
    return shortage + fieldWorker;
  }
  

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }
  
}
