import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../_services/shared.service';

@Component({
  selector: 'app-report-labor-information',
  templateUrl: './report-labor-information.component.html',
  styleUrls: ['./report-labor-information.component.css']
})
export class ReportLaborInformationComponent {

  role = ''

  constructor(
    private router: Router,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.role = this.sharedService.role
    this.router.navigateByUrl('/report-labor-information/labor-information-yearly')
  }
}
