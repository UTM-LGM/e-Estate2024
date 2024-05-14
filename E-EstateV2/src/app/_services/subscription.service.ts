import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService implements OnDestroy {

  private subscriptions: Subscription[] = [];

  constructor() { }

  // Method to add a subscription to the list
  add(subscription: Subscription): void {
    this.subscriptions.push(subscription);
  }

  // Unsubscribe from all subscriptions
  unsubscribeAll(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];
  }

  // Clean up when the service is destroyed
  ngOnDestroy(): void {
    this.unsubscribeAll();
  }
}
