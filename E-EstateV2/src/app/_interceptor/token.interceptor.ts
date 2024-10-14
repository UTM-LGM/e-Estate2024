import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (localStorage.getItem('accessToken') != null) {
            const cloneReq = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + localStorage.getItem('accessToken'))
            });
            return next.handle(cloneReq)
        }
        else if (localStorage.getItem('token') != null) {
            const cloneReq = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'))
            });
            return next.handle(cloneReq)
        }
        else
            return next.handle(req.clone());
    }
}