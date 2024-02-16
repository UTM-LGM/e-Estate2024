import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuard } from '../_interceptor/auth.guard.interceptor';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  role = ''

  constructor(
    private router: Router,
    private auth: AuthGuard,

  ) { }

  ngOnInit() {
    this.role = this.auth.getRole()
    this.router.navigateByUrl('/e-estate/reports/yield-production-yearly')
  }
}
