import { Component, OnInit } from '@angular/core';
import { SharedService } from '../_services/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  role = ''

  constructor(
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.role = this.sharedService.role
  }
}
