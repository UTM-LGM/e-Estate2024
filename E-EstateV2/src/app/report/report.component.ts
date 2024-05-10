import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../_services/shared.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  role = ''

  constructor(
    private router: Router,
    private sharedService: SharedService

  ) { }

  ngOnInit() {
    this.role = this.sharedService.role
    this.router.navigateByUrl('/e-estate/reports/estate-by-state')
  }
}
