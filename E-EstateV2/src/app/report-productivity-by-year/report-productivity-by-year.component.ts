import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../_services/shared.service';

@Component({
  selector: 'app-report-productivity-by-year',
  templateUrl: './report-productivity-by-year.component.html',
  styleUrls: ['./report-productivity-by-year.component.css']
})
export class ReportProductivityByYearComponent implements OnInit {

  role = ''

  constructor(
    private router: Router,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.role = this.sharedService.role
    this.router.navigateByUrl('/e-estate/report-productivity-by-year/clone-productivity-yearly')
  }
}
