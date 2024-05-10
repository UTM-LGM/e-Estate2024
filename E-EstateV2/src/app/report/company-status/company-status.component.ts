import { Component } from '@angular/core';
import { Company } from 'src/app/_interface/company';
import { CompanyService } from 'src/app/_services/company.service';

@Component({
  selector: 'app-company-status',
  templateUrl: './company-status.component.html',
  styleUrls: ['./company-status.component.css']
})
export class CompanyStatusComponent {

  status = '0'
  term = ''
  isLoading = false
  isActiveChoosen = false
  pageNumber = 1

  companies: Company[] = []

  constructor(
    private companyService: CompanyService,
  ) { }

  ngOnInit(): void {

  }

  statusSelected(event: any) {
    this.isLoading = true
    this.isActiveChoosen = false
    this.getCompany(event)
  }

  getCompany(isActive: boolean) {
    setTimeout(() => {
      this.companyService.getCompany()
        .subscribe(
          Response => {
            this.isActiveChoosen = true
            const companies = Response
            this.companies = companies.filter(x => x.isActive == isActive)
            this.isLoading = false
          });
    }, 2000)
  }
}
