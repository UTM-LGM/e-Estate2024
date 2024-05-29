import { Component, OnInit, OnDestroy } from '@angular/core';
import { LaborInformation } from 'src/app/_interface/laborInformation';
import { LaborTypeService } from 'src/app/_services/labor-type.service';
import { MyLesenIntegrationService } from 'src/app/_services/my-lesen-integration.service';
import { ReportService } from 'src/app/_services/report.service';
import { SharedService } from 'src/app/_services/shared.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';
import swal from 'sweetalert2';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-labor-information-yearly',
  templateUrl: './labor-information-yearly.component.html',
  styleUrls: ['./labor-information-yearly.component.css']
})
export class LaborInformationYearlyComponent implements OnInit, OnDestroy {
  role = '';
  year = '';
  isLoading = true;

  filterTypes: LaborInformation[] = [];
  labors: any[] = [];

  companies: any[] = []
  filterLGMAdmin: any[] = []



  localTapperFieldWorker: any[] = [];
  foreignTapperFieldWorker: any[] = [];

  filterCompanyAdmin: any[] = [];
  company: any = {} as any;
  estate: any = {} as any;

  totalTapperWorker = 0;
  totalFieldWorker = 0;
  showAll = false;

  constructor(
    private laborTypeService: LaborTypeService,
    private reportService: ReportService,
    private sharedService: SharedService,
    private myLesenService: MyLesenIntegrationService,
    private subscriptionService: SubscriptionService
  ) { }

  ngOnInit(): void {
    this.role = this.sharedService.role;
    this.getLaborType();
    if (this.role == 'CompanyAdmin') {
      this.estate.companyId = this.sharedService.companyId;
      this.getAllEstate();
      this.getCompany();
    } else if (this.role == 'EstateClerk') {
      this.estate.id = this.sharedService.estateId;
      this.getEstate();
    }else{
      // this.getLaborInformation();
      this.getAllCompanies()

    }
  }

  yearSelected() {
    this.resetData();
    const yearAsString = this.year.toString();
    if (yearAsString.length === 4) {
      this.isLoading = true;
      this.getLaborInformation();
    } else {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please insert correct year',
      });
      this.year = '';
    }
  }

  resetData() {
    this.labors = [];
    this.localTapperFieldWorker = [];
    this.foreignTapperFieldWorker = [];
    this.totalTapperWorker = 0;
    this.totalFieldWorker = 0;
    this.showAll = false;
  }

  companySelected() {
    this.estate.id = 0
    this.getAllEstate()
    this.labors = []
    this.year = ''
    this.showAll = false
  }

  getAllEstate() {
    const getAllEstate = this.myLesenService.getAllEstate()
      .subscribe(Response => {
        this.filterLGMAdmin = Response.filter(x => x.companyId == this.estate.companyId)
        this.filterCompanyAdmin = Response.filter(x => x.companyId == this.estate.companyId);
      });
    this.subscriptionService.add(getAllEstate);
  }

  getEstate() {
    const getOneEstate = this.myLesenService.getOneEstate(this.estate.id)
      .subscribe(Response => {
        this.estate = Response;
        this.isLoading= false
      });
    this.subscriptionService.add(getOneEstate);
  }

  getCompany() {
    const getCompany = this.myLesenService.getOneCompany(this.estate.companyId)
      .subscribe(Response => {
        this.company = Response;
        this.isLoading = false;
      });
    this.subscriptionService.add(getCompany);
  }

  getAllCompanies() {
    const getAllCompany = this.myLesenService.getAllCompany()
      .subscribe(
        Response => {
          this.companies = Response
          this.isLoading = false
        }
      )
      this.subscriptionService.add(getAllCompany);
  }

  getLaborType() {
    const getLaborType = this.laborTypeService.getType()
      .subscribe(Response => {
        const types = Response;
        this.filterTypes = types.filter(x => x.isActive == true);
      });
    this.subscriptionService.add(getLaborType);
  }

  getLaborInformation() {
    const subscription = this.reportService.getLaborInformationCategory(this.year).subscribe({
      next: (Response) => {
        this.labors = Response;
        if (this.estate.id == undefined && this.estate.companyId == undefined) {
          const groupedResponse = Response.reduce((acc, obj) => {
            const existingItem = acc.find((item: any) => item.laborTypeId === obj.laborTypeId);
            if (existingItem) {
              existingItem.totalAmountLocal += obj.localNoOfWorkers;
              existingItem.totalAmountForeign += obj.foreignNoOfWorkers;
            } else {
              acc.push({
                laborTypeId: obj.laborTypeId,
                totalAmountLocal: obj.localNoOfWorkers,
                totalAmountForeign: obj.foreignNoOfWorkers,
                laborType: obj.laborType
              });
            }
            return acc;
          }, []);
          this.labors = groupedResponse;
          this.showAll = true;
          this.getTapperAndFieldWorkerAll();
        } else {
          this.labors = Response.filter(x => x.estateId == this.estate.id);
          this.getTapperAndFieldWorker();
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });
  
    this.subscriptionService.add(subscription);
  }
  

  getTapperAndFieldWorker() {
    const getWorker = this.reportService.getTapperAndFieldWorker(this.year)
      .subscribe(Response => {
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

  getTapperAndFieldWorkerAll() {
    const getWorker = this.reportService.getTapperAndFieldWorker(this.year)
      .subscribe(Response => {
        const groupedResponse = Response.reduce((acc, obj) => {
          const existingItem = acc.find((item:any) => item.isLocal === obj.isLocal);
          if (existingItem) {
            existingItem.totalTapperWorker += obj.tapperWorker;
            existingItem.totalFieldWorker += obj.fieldWorker;
          } else {
            acc.push({
              isLocal: obj.isLocal,
              totalTapperWorker: obj.tapperWorker,
              totalFieldWorker: obj.fieldWorker,
            });
          }
          return acc;
        }, []);
        this.localTapperFieldWorker = groupedResponse.filter((x:any) => x.isLocal == true);
        if(this.localTapperFieldWorker.length == 0){
          const local = {
            isLoacal:true,
            totalFieldWorker:0,
            totalTapperWorker:0
          }
          this.localTapperFieldWorker.push(local)
        }
        this.foreignTapperFieldWorker = groupedResponse.filter((x:any) => x.isLocal == false);
        if(this.foreignTapperFieldWorker.length == 0){
          const foreign ={
            isLocal:false,
            totalFieldWorker:0,
            totalTapperWorker:0
          }
          this.localTapperFieldWorker.push(foreign)
        }
        this.calculateTotalsAll();
        this.isLoading = false;
      },
      error => {
        console.error('Error fetching all tapper and field workers:', error);
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

  estateSelected() {
    this.resetData();
  }

  exportToExcelAdmin(labors: any[], localTapperFieldWorker: any[], foreignTapperFieldWorker: any[], fileName: string) {
    let bilCounter = 1;
    const filteredData = labors.map(labor => ({
      No: bilCounter++,
      Category: labor.laborType,
      Local: labor.totalAmountLocal,
      Foreign: labor.totalAmountForeign,
      Total: labor.totalAmountLocal + labor.totalAmountForeign
    }));
  
    // Add local and foreign tapper field worker data
    filteredData.push({
      No: bilCounter++,
      Category: 'TAPPER WORKER',
      ...this.calculateTotalTapperWorker(localTapperFieldWorker, foreignTapperFieldWorker)
    });
  
    filteredData.push({
      No: bilCounter++,
      Category: 'FIELD WORKER',
      ...this.calculateTotalFieldWorker(localTapperFieldWorker, foreignTapperFieldWorker)
    });
  
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, this.year.toString());
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }
  
  calculateTotalTapperWorker(localTapperFieldWorker: any[], foreignTapperFieldWorker: any[]) {
    const totalTapperWorker = {
      Local: 0,
      Foreign: 0,
      Total: 0
    };  

    if(this.role == 'Admin'){
      localTapperFieldWorker.forEach(worker => {
        totalTapperWorker.Local += worker.totalTapperWorker;
        totalTapperWorker.Total += worker.totalTapperWorker;
      });
    
      foreignTapperFieldWorker.forEach(worker => {
        totalTapperWorker.Foreign += worker.totalTapperWorker;
        totalTapperWorker.Total += worker.totalTapperWorker;
      });
    }else{
      localTapperFieldWorker.forEach(worker => {
        totalTapperWorker.Local += worker.tapperWorker;
        totalTapperWorker.Total += worker.tapperWorker;
      });
    
      foreignTapperFieldWorker.forEach(worker => {
        totalTapperWorker.Foreign += worker.tapperWorker;
        totalTapperWorker.Total += worker.tapperWorker;
      });
    }
  
    return totalTapperWorker;
  }
  
  calculateTotalFieldWorker(localTapperFieldWorker: any[], foreignTapperFieldWorker: any[]) {
    const totalFieldWorker = {
      Local: 0,
      Foreign: 0,
      Total: 0
    };
  
    if(this.role == 'Admin'){
      localTapperFieldWorker.forEach(worker => {
        totalFieldWorker.Local += worker.totalFieldWorker;
        totalFieldWorker.Total += worker.totalFieldWorker;
      });
    
      foreignTapperFieldWorker.forEach(worker => {
        totalFieldWorker.Foreign += worker.totalFieldWorker;
        totalFieldWorker.Total += worker.totalFieldWorker;
      });
    }else{
      localTapperFieldWorker.forEach(worker => {
        totalFieldWorker.Local += worker.fieldWorker;
        totalFieldWorker.Total += worker.fieldWorker;
      });
    
      foreignTapperFieldWorker.forEach(worker => {
        totalFieldWorker.Foreign += worker.fieldWorker;
        totalFieldWorker.Total += worker.fieldWorker;
      });
    }
    
  
    return totalFieldWorker;
  }

  exportToExcelCompanyAdmin(labors: any[], localTapperFieldWorker: any[], foreignTapperFieldWorker: any[], fileName: string) {
    let bilCounter = 1;
    const filteredData = labors.map(labor => ({
      No: bilCounter++,
      Category: labor.laborType,
      Local: labor.localNoOfWorkers,
      Foreign: labor.foreignNoOfWorkers,
      Total: labor.localNoOfWorkers + labor.foreignNoOfWorkers
    }));
  
     // Add local and foreign tapper field worker data
     filteredData.push({
      No: bilCounter++,
      Category: 'TAPPER WORKER',
      ...this.calculateTotalTapperWorker(localTapperFieldWorker, foreignTapperFieldWorker)
    });
  
    filteredData.push({
      No: bilCounter++,
      Category: 'FIELD WORKER',
      ...this.calculateTotalFieldWorker(localTapperFieldWorker, foreignTapperFieldWorker)
    });
      
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, this.year.toString() ); // Use 'Sheet1' as the sheet name
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }
}
