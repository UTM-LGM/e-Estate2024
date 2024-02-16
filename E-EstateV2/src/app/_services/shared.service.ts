import { Injectable } from '@angular/core';
import { User } from '../_interface/user';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  userId = ''
  companyId: number = 0
  estateId: number = 0
  email = ''

  private dialogClosedSubject = new BehaviorSubject<boolean>(false)

  dialogClosed$ = this.dialogClosedSubject.asObservable()

  constructor(
  ) { }

  notifyDialogClosed() {
    this.dialogClosedSubject.next(true)
  }

}
