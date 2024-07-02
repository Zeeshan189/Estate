import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:3000/posts';

  constructor(private http: HttpClient) {}
  addproperty(obj: any) {
    return this.http.post(`${this.apiUrl}`, obj);
  }

  getallproperty() {
    return this.http.get(`${this.apiUrl}`);
  }

  updateproperty(obj: any, id : any) {
    return this.http.put(`${this.apiUrl}/${id}`, obj);
  }

  deleteproperty(id : number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
