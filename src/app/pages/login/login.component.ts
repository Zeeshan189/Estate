import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginform!: FormGroup;
  constructor(private formbuilder: FormBuilder, private http: HttpClient, private route: Router, private auth: AuthService) { }

  ngOnInit(): void {
    this.loginform = this.formbuilder.group({
      uname: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  logindata:any
  onlogin() {
    this.http.get<any>("http://localhost:3000/signup", this.loginform.value).subscribe(res => {
      // match email and password
      this.logindata=res
      this.logindata = this.logindata.find((a:any) => {
      return a.uname === this.loginform.value.uname && a.password === this.loginform.value.password
      })

      // condition for login
      if (this.logindata) {
        alert('successfully logged in');
        this.loginform.reset();

        localStorage.setItem("currentUser", JSON.stringify(this.logindata));
        this.auth.onlogin$.next(true);
        this.route.navigate(['home'])
      } else {
        alert('User not found with these records');
      }
    }, res => {
      alert('Something went wrong');
    })
  }

}
