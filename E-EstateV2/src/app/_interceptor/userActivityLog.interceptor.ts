import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserActivityLog } from "../_interface/userActivityLog";
import { UserActivityLogService } from "../_services/user-activity-log.service";
import { AuthGuard } from "./auth.guard.interceptor";
import { SharedService } from "../_services/shared.service";

@Injectable()
export class UserActivityLogInterceptor implements HttpInterceptor {
  userActivity = {} as UserActivityLog
  flagged = true

  constructor(
    private userActivityLogService: UserActivityLogService,
    private sharedService: SharedService,
  ) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      headers: req.headers.set('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE,OPTIONS')
    })

    if (req.method === 'POST' && (req.url.includes('/Login') || req.url.includes('/Register'))) {
      return next.handle(req)
    }

    if (req.method === 'PUT' || req.method === 'DELETE') {
      this.flagged = false
      this.userActivity.dateTime = new Date()
      this.userActivity.method = req.method
      this.userActivity.body = JSON.stringify(req.body)
      this.userActivity.url = req.url
      this.userActivity.userName = this.sharedService.userName
      this.userActivity.role = this.sharedService.role
      this.userActivity.userId = this.sharedService.userId.toString()
      this.userActivityLogService.logActivity(this.userActivity)
        .subscribe(
          {
            next: (Response) => {

            },
            error: (err) => {
              console.error('Error logging user activity:', Error)
            }
          }
        );
    }

    if (req.method === 'POST' && !req.url.includes('/login') && !req.url.includes('/register') && this.flagged == true) {
      this.flagged = false
      this.userActivity.dateTime = new Date()
      this.userActivity.method = req.method
      this.userActivity.body = JSON.stringify(req.body)
      this.userActivity.url = req.url
      this.userActivity.userName = this.sharedService.userName
      this.userActivity.role = this.sharedService.role
      this.userActivity.userId = this.sharedService.userId.toString()

      this.userActivityLogService.logActivity(this.userActivity)
        .subscribe(
          Response => {
          }
        );

      this.flagged = true
    }

    return next.handle(req)
  }
}
