import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
})

export class RegistrationComponent implements OnInit {
  signupform!: FormGroup;
  isagent: Boolean = false;
  
  constructor(
    private formbuilder: FormBuilder,
    private http: HttpClient,
    private route: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.signupform = this.formbuilder.group({
      userId: [], // userId is initialized as an empty array
      uname: ['', [Validators.required]],
      email: ['', [Validators.required]],
      fname: ['', Validators.required],
      role: ['', Validators.required],
      joinDate: [new Date(), Validators.required],
      password: ['', Validators.required],
    });
  }

// on Submit
  onregister() {

    if (this.isagent) {
      this.signupform.patchValue({ role: 'agent' });
    } else {
      this.signupform.patchValue({ role: 'customer' });
    }
    const userId = Math.floor(Math.random() * 100) + 1;
    this.signupform.patchValue({ userId: userId.toString() });

    if (this.isagent) {
      this.auth.addagent(this.signupform.value).subscribe((res: any) => {
        alert('Registration Success');
        this.signupform.reset();
        this.route.navigate(['login']);
      });
    } else {
      this.auth.addcustomer(this.signupform.value).subscribe((res: any) => {
        alert('Registration Success');
        this.signupform.reset();
        this.route.navigate(['login']);
      });
    }
  }
}