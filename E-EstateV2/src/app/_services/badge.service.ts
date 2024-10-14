import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BadgeService {

  private badgeCountSubject = new BehaviorSubject<number>(0)
  badgeCount$ = this.badgeCountSubject.asObservable()

  constructor() { }

  updateBadgeCount(count: number) {
    this.badgeCountSubject.next(count)
  }
}
