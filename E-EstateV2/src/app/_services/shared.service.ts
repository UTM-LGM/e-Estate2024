import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  userId = ''
  companyId = 0
  estateId = 0
  email = ''
  fullName = ''
  userName=''
  role = ''
  position = ''
  roles:any[]=[]

  private dialogClosedSubject = new BehaviorSubject<boolean>(false)

  dialogClosed$ = this.dialogClosedSubject.asObservable()

  constructor(
  ) { }

  notifyDialogClosed() {
    this.dialogClosedSubject.next(true)
  }

}