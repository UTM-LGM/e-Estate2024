import { Component, OnInit } from '@angular/core';
import { SharedService } from './_services/shared.service';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'E-EstateV2';

  constructor(private msalService: MsalService) {}

  ngOnInit() {
    this.initializeMSAL();
  }

  initializeMSAL() {
    this.msalService.instance.initialize().then(() => {
      console.log('MSAL initialization complete');
    }).catch(error => {
      console.error('MSAL initialization error:', error);
    });
  }

}
