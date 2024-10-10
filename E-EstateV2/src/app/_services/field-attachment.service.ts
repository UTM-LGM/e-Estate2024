import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { FieldAttachment } from '../_interface/field-attachment';
import { CostType } from '../_interface/costType';

@Injectable({
  providedIn: 'root'
})
export class FieldAttachmentService {

  baseUrl = environment.apiUrl
  
  constructor(private http: HttpClient) { }

  getFieldAttachment():Observable<FieldAttachment[]>{
    return this.http.get<FieldAttachment[]>(this.baseUrl + '/FieldAttachments/GetFieldAttachment')
  }

  updateFieldAttachment(file:File, fieldGrantId:number, userId:string, attachmentId:number, status:boolean):Observable<FieldAttachment>{
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('fieldGrantId', fieldGrantId.toString());
    formData.append('userId', userId.toString());
    formData.append('attachmentId', attachmentId.toString());
    formData.append('status', status.toString())

    return this.http.put<FieldAttachment>(this.baseUrl + '/fields/UpdateFieldAttachments', formData)
  }

  deleteFieldAttachment(id:number){
    return this.http.put<FieldAttachment>(this.baseUrl + '/fields/DeleteFieldAttachment', id)
  }

}
