import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthGuard } from "./auth.guard.interceptor";
import { SharedService } from "../_services/shared.service";
import { HistoryLogService } from "../_services/history-log.service";
import { HistoryLog } from "../_interface/historyLog";


@Injectable()
export class HistoryLogInterceptor implements HttpInterceptor {
  historyLog = {} as HistoryLog

  constructor(private historyLogService: HistoryLogService,
    private sharedService: SharedService,
  ) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      headers: req.headers.set('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE,OPTIONS')
    })

    if (req.method === 'POST' && req.url.includes('/Login') || req.url.includes('/Register')) {
      return next.handle(req)
    }

    if (req.method === 'PUT' && !req.url.includes('/useractivitylogs')) {
      this.extractEntityType(req.url)
      this.extractEntityId(req.body)
      this.historyLog.dateTime = new Date()
      this.historyLog.method = req.method
      this.historyLog.body = JSON.stringify(req.body);
      this.historyLog.url = req.url
      this.historyLog.userId = this.sharedService.userId.toString()

      this.historyLogService.addHistoryLog(this.historyLog)
        .subscribe(
          {

          }
        )
    }

    if (req.method === 'DELETE' && !req.url.includes('/useractivitylogs')) {
      const pathSegments = new URL(req.url).pathname.split('/')
      this.historyLog.entityId = parseInt(pathSegments[pathSegments.length - 1])
      this.historyLog.entityType = pathSegments[pathSegments.length - 2]
      this.historyLog.dateTime = new Date()
      this.historyLog.method = req.method
      this.historyLog.body = JSON.stringify(req.body)
      this.historyLog.url = req.url
      this.historyLog.userId = this.sharedService.userId.toString()

      this.historyLogService.addHistoryLog(this.historyLog)
        .subscribe(
          {

          }
        )
    }
    return next.handle(req);
  }

  private extractEntityType(url: string) {
    // Assuming the entity type is the last segment of the URL path
    const pathSegments = new URL(url).pathname.split('/')
    this.historyLog.entityType = pathSegments[pathSegments.length - 1];
  }

  private extractEntityId(body: any) {
    this.historyLog.entityId = body && body.id ? body.id : null
  }

  //     if (req.method === 'POST' && !req.url.includes('/login') && !req.url.includes('/register') && this.flagged == true && !req.url.includes('/useractivitylogs')) {
  //       this.flagged = false
  //       this.extractEntityType(req.url)
  //       this.extractEntityId(req.body)
  //       this.historyLog.entityId = 0
  //       this.historyLog.dateTime = new Date()
  //       this.historyLog.method = req.method;
  //       this.historyLog.body = JSON.stringify(req.body);
  //       this.historyLog.url = req.url;
  //       this.historyLog.userId = this.sharedService.userId.toString();

  //       this.historyLogService.addHistoryLog(this.historyLog)
  //       .subscribe(
  //         Response=>{

  //         }
  //       )
  //       this.flagged = true
  //     }



}
