import { Component, OnInit } from '@angular/core';
import { AuthGuard } from '../_interceptor/auth.guard.interceptor';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  role = ''

  constructor(
    private authGuard: AuthGuard,
  ) { }

  ngOnInit() {
    this.role = this.authGuard.getRole()
  }
}
