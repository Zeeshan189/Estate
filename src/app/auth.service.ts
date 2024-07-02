import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = 'http://localhost:3000/signup';

  constructor(private http: HttpClient) {}
  onlogin$: BehaviorSubject<boolean> = new BehaviorSubject<boolean> (false)

  addagent(obj: any) {
    return this.http.post(`${this.apiUrl}`, obj);
  }

  addcustomer(obj: any) {
    return this.http.post(`${this.apiUrl}`, obj);
  }

  login(uname: string, password: string): Observable<boolean> {
    return this.http.get<any[]>(`${this.apiUrl}?uname=${uname}&password=${password}`)
      .pipe(
        map(users => {
          if (users.length > 0) {
            localStorage.setItem('currentUser', JSON.stringify(users[0]));
            return true;
          } else {
            return false;
          }
        })
      );
  }

}