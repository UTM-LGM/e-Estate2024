import { Component, OnInit } from '@angular/core';
import { SharedService } from '../_services/shared.service';
import { MyLesenIntegrationService } from '../_services/my-lesen-integration.service';
import { SubscriptionService } from '../_services/subscription.service';
import { RubberSale } from '../_interface/rubberSale';
import { RubberSaleService } from '../_services/rubber-sale.service';
import { ReportService } from '../_services/report.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-report-rubber-sale',
  templateUrl: './report-rubber-sale.component.html',
  styleUrls: ['./report-rubber-sale.component.css']
})
export class ReportRubberSaleComponent implements OnInit {

  role = ''
  startMonth = ''
  endMonth = ''

  order = ''
  currentSortedColumn = ''
  term = ''
  pageNumber = 1

  isLoading = true

  filterSales: RubberSale[] = []

  estate: any = {} as any

  sortableColumns = [
    { columnName: 'date', displayText: 'Date' },
    { columnName: 'buyerName', displayText: 'Buyer Name' },
    { columnName: 'rubberType', displayText: 'Rubber Type' },
    { columnName: 'letterOfConsentNo', displayText: 'Letter of Consent No (Form 1)' },
    { columnName: 'weightSlipNo', displayText: 'Weight Slip No' },
    { columnName: 'receiptNo', displayText: 'Receipt No' },
    { columnName: 'wetWeight', displayText: 'Wet Weight (Kg)' },
    { columnName: 'drc', displayText: 'DRC (%)' },
    { columnName: 'buyerWetWeight', displayText: 'Buyer Wet Weight (Kg)' },
    { columnName: 'buyerDRC', displayText: 'Buyer DRC (%)' },
    { columnName: 'buyerWeightDry', displayText: 'Buyer Weight Dry (Kg)' },
    { columnName: 'unitPrice', displayText: 'Unit Price (RM/kg)' },
    { columnName: 'total', displayText: 'Total Price (RM)' },
    { columnName: 'remark', displayText: 'Remark' }

  ];


  constructor(
    private sharedService: SharedService,
    private myLesenService: MyLesenIntegrationService,
    private subscriptionService: SubscriptionService,
    private rubberSaleService: RubberSaleService,
    private reportService: ReportService

  ) { }

  ngOnInit(): void {
    this.role = this.sharedService.role
    this.getEstate()
    this.isLoading = false
  }

  getEstate() {
    const getOneEstate = this.myLesenService.getOneEstate(this.sharedService.estateId)
      .subscribe(
        Response => {
          this.estate = Response
        }
      )
    this.subscriptionService.add(getOneEstate);

  }

  monthChange() {
    this.isLoading = true
    this.getSale()
  }

  chageStartMonth() {
    this.endMonth = ''
    // this.costInformations = []
  }

  getSale() {
    setTimeout(() => {
      const getSale = this.reportService.getAllRubberSale(this.startMonth, this.endMonth)
        .subscribe(
          Response => {
            const rubberSales = Response
            this.filterSales = rubberSales.filter((e) => e.estateId == this.sharedService.estateId && e.isActive == true)
            this.isLoading = false
          })
      this.subscriptionService.add(getSale);
    }, 2000)
  }

  toggleSort(columnName: string) {
    if (this.currentSortedColumn === columnName) {
      this.order = this.order === 'asc' ? 'desc' : 'asc'
    } else {
      this.currentSortedColumn = columnName;
      this.order = this.order === 'desc' ? 'asc' : 'desc'
    }
  }

  exportToExcelYear(data: any[], fileName: string) {
    const filteredData: any = data.map(row => ({
      Date: row.saleDateTime,
      BuyerName: row.buyerName,
      RubberType: row.rubberType,
      LetterOfConsentNo: row.letterOfConsentNo,
      WeightSlipNo: row.weightSlipNo,
      ReceiptNo: row.receiptNo,
      WetWeight: row.wetWeight,
      DRC: row.drc,
      BuyerWetWeight: row.buyerWetWeight,
      BuyerDRC: row.buyerDRC,
      BuyerWeightDry: row.buyerWeightDry,
      UnitPrice: row.unitPrice,
      Total: row.total,
      Remark: row.remark,
    }))

    const headerRow = [
      { Date: 'Start Month Year:', BuyerName: this.startMonth },
      { Date: 'End Month Year:', BuyerName: this.endMonth },
      {}, // Empty row for separation
      {
        Date: 'Date', BuyerName: 'BuyerName', RubberType: 'RubberType', LetterOfConsentNo: 'LetterOfConsentNo',
        WeightSlipNo: 'WeightSlipNo', ReceiptNo: 'ReceiptNo', WetWeight: 'WetWeight',
        DRC: 'DRC', BuyerWetWeight: 'BuyerWetWeight', BuyerDRC: 'BuyerDRC',
        BuyerWeightDry: 'BuyerWeightDry', UnitPrice: 'UnitPrice', Total: 'Total', Remark: 'Remark'
      }
    ];

    const exportData = headerRow.concat(filteredData);

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData, { skipHeader: true });

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const formattedFileName = `${fileName}_${this.startMonth}_${this.endMonth}.xlsx`;

    XLSX.writeFile(wb, formattedFileName);
  }

  printReceipt(sale:RubberSale){
    const url = 'generate-receipt/' + sale.id;
    window.open(url, '_blank');
  }



}
