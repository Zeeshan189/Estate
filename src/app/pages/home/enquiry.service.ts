import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnquiryService {

  private apiUrl = 'http://localhost:3000/enquiry';

  constructor(private http: HttpClient) {}

  addEnquiry(obj: any) {
    return this.http.post(`${this.apiUrl}`, obj);
  }
}
