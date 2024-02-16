import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-utility-clerk',
  templateUrl: './utility-clerk.component.html',
  styleUrls: ['./utility-clerk.component.css']
})
export class UtilityClerkComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.router.navigateByUrl('/e-estate/utilities-clerk/register-buyer');
  }

}
