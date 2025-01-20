import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../_services/shared.service';

@Component({
  selector: 'app-report-production-by-year',
  templateUrl: './report-production-by-year.component.html',
  styleUrls: ['./report-production-by-year.component.css']
})
export class ReportProductionByYearComponent implements OnInit {

  role = ''

  constructor(
    private router: Router,
    private sharedService: SharedService

  ) { }

  ngOnInit() {
    this.role = this.sharedService.role
    this.router.navigateByUrl('/report-production-by-year/rubber-production-by-estate')
  }
}
