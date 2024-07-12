import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class UpperCaseInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (request.method === 'POST' &&
      (request.url.includes('/Login') ||
       request.url.includes('/Register') ||
       request.url.includes('/SendEmailVerification') ||
       request.url.includes('/AddUserRole') ||
       request.url.includes('/AddUser') ||
       request.url.includes('/ResetPassword'))) {
    return next.handle(request);
  }

    // Check if the request method is POST or PUT
    if (request.method === 'POST' || request.method === 'PUT') {
      const modifiedRequest = request.clone({
        body: this.convertBodyToUppercase(request.body),
      });

      // Pass the modified request to the next handler
      return next.handle(modifiedRequest);
    }

    // If the request method is not POST or PUT, proceed without modification
    return next.handle(request);
  }

  //To exclude createdBy and UpdatedBy because userId using GUID
  private convertBodyToUppercase(body: any): any {
    if (body && typeof body === 'object') {
      for (const key in body) {
        if (body.hasOwnProperty(key)) {
          if (key !== 'createdBy' && key !== 'updatedBy' && key !== 'token' && typeof body[key] === 'string') {
            body[key] = body[key].toUpperCase();
          } else if (typeof body[key] === 'object') {
            body[key] = this.convertBodyToUppercase(body[key]); // Recursively process nested objects
          }
        }
      }
    }
    return body;
  }
  
}
