import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EstateService } from './estate.service';
import { RrimgeorubberIntegrationService } from './rrimgeorubber-integration.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  userId = ''
  companyId = 0
  estateId = 0
  email = ''
  fullName = ''
  userName = ''
  role = ''
  position = ''
  licenseNo = ''
  roles: any[] = []

  private dialogClosedSubject = new BehaviorSubject<boolean>(false)

  dialogClosed$ = this.dialogClosedSubject.asObservable()

  constructor(
    private estateService: EstateService,
    private rrimGeoRubberService: RrimgeorubberIntegrationService,
  ) { }

  notifyDialogClosed() {
    this.dialogClosedSubject.next(true)
  }

  
}