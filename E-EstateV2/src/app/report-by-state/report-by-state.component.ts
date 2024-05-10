import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../_services/shared.service';

@Component({
  selector: 'app-report-by-state',
  templateUrl: './report-by-state.component.html',
  styleUrls: ['./report-by-state.component.css']
})
export class ReportByStateComponent {

  role = ''

  constructor(
    private router: Router,
    private sharedService: SharedService

  ) { }

  ngOnInit() {
    this.role = this.sharedService.role
    this.router.navigateByUrl('/e-estate/report-by-state/estate-by-state')
  }
}
