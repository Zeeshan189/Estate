import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.css'],
})
export class PropertyListComponent implements OnInit {
  propertyForm!: FormGroup;
  islistview: boolean = true;
  loggedUserData!: any;
  propertylist: any[] = [];

  constructor(private fb: FormBuilder, private api: ApiService) {}

  ngOnInit(): void {
    this.propertyForm = this.fb.group({
      propertyId: [null],
      agentId: [null],
      title: ['', Validators.required],
      description: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      joinDate: [new Date(), Validators.required],
      pincode: ['', Validators.required],
      ptype: ['', Validators.required],
      price: ['', Validators.required],
      image: ['', Validators.required],
    });

    const localData = localStorage.getItem('currentUser');
    if (localData != null) {
      this.loggedUserData = JSON.parse(localData);
      this.propertyForm.patchValue({ agentId: this.loggedUserData.userId });
    }
    this.getproperty();
  }

  createproperty() {
    if (this.propertyForm.valid) {
      const randomPropertyId = Math.floor(Math.random() * 10) + 1;
      this.propertyForm.patchValue({ propertyId: randomPropertyId });
      this.api.addproperty(this.propertyForm.value).subscribe((res: any) => {
        alert('Property Created Successfully');
        this.propertyForm.reset();
        this.propertyForm.patchValue({ agentId: this.loggedUserData.userId }); // Resetting agentId after form reset
        this.getproperty();
      });
    }
  }

  getproperty() {
    this.api.getallproperty().subscribe((res: any) => {
      this.propertylist = res.filter(
        (property: any) => property.agentId === this.loggedUserData.userId
      );
    });
  }

  objid: any = '';
  onedit(item: any) {
    this.objid = item.id;
    this.propertyForm.patchValue({
      propertyId: item.propertyId,
      agentId: item.agentId,
      title: item.title,
      description: item.description,
      address: item.address,
      city: item.city,
      state: item.state,
      joinDate: item.joinDate,
      pincode: item.pincode,
      ptype: item.ptype,
      price: item.price,
      image: item.image,
    });
    this.islistview = false;
  }

  updatedataproperty() {
    if (this.propertyForm.valid) {
      this.api.updateproperty(this.propertyForm.value, this.objid).subscribe(
        (res: any) => {
          alert('Property Updated Successfully');
          this.propertyForm.reset();
          this.propertyForm.patchValue({ agentId: this.loggedUserData.userId });
          this.getproperty();
        },
        (error) => {
          console.error('Error updating property:', error);
        }
      );
    }
  }

  onDelete(id: number) {
    const isdelete = confirm('Are you sure want to delete');
    if (isdelete) {
      this.api.deleteproperty(id).subscribe((res: any) => {
        if (res) {
          alert('Property delete Successfully');
          this.getproperty();
        } else {
          alert('Something went wrong');
        }
      });
    }
  }
  
}
