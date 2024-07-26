import { Component, OnInit } from '@angular/core';
import { SharedService } from './_services/shared.service';
import { MsalService } from '@azure/msal-angular';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'E-EstateV2';

  constructor(private msalService: MsalService, private router:Router) {}

  ngOnInit() {

  }


}
