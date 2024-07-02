import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { EnquiryService } from './enquiry.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})

export class HomeComponent implements OnInit {
  enquiryForm!: FormGroup;
  filterForm!: FormGroup;
  propertylist: any[] = [];
  loggeduserdata: any;
  totalpages!: number;
  currentpage: number = 1;
  pagesize: number = 8;
  pagesizes: Array<Number> = [5, 10, 20];

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private enq: EnquiryService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.enquiryForm = this.fb.group({
      propertyId: [null],
      userId: [null],
      enquirymessage: [''],
      joinDate: [new Date()],
    });

    this.filterForm = this.fb.group({
      city: [''],
      address: [''],
      ptype: [''],
      state: [''],
      price: [''],
    });

    const localdata = localStorage.getItem('currentUser');
    if (localdata != null) {
      this.loggeduserdata = JSON.parse(localdata);
      this.enquiryForm.patchValue({ userId: this.loggeduserdata.userId });
    }
    this.viewAllProperties();
    this.visibledata();
    this.pagenumbers();
    this.calculateTotalPages();
  }

  openEnquirymodel(id: string) {
    const localdata = localStorage.getItem('currentUser');
    if (localdata == null) {
      alert('Please first create an account!');
      this.route.navigate(['register']);
    } else {
      this.enquiryForm.patchValue({ propertyId: id });
      const model = document.getElementById('myModal');
      if (model != null) {
        model.style.display = 'block';
      }
    }
  }

  closeEnquirymodel() {
    const model = document.getElementById('myModal');
    if (model != null) {
      model.style.display = 'none';
    }
  }

  makeEnquiry() {
    this.enquiryForm.patchValue({ joinDate: new Date() });
    this.enq.addEnquiry(this.enquiryForm.value).subscribe((res: any) => {
      if (res) {
        alert('Enquiry sent successfully');
        this.enquiryForm.reset();
        this.closeEnquirymodel();
      } else {
        alert('Something went wrong!');
      }
    });
  }

  // viewAllProperties() {
  //   this.api.getallproperty().subscribe((res: any) => {
  //     this.propertylist = res;
  //     if (this.loggeduserdata) {
  //       this.propertylist = res.filter((property: any) => property.agentId === this.loggeduserdata.userId);
  //     }
  //   });
  // }

  viewAllProperties() {
    this.api.getallproperty().subscribe((res: any) => {
      if (this.loggeduserdata && this.loggeduserdata.role === 'agent') {
        // If the logged in user is an agent, show only their properties
        this.propertylist = res.filter(
          (property: any) => property.agentId === this.loggeduserdata.userId
        );
      } else {
        // Otherwise, show all properties
        this.propertylist = res;
      }
    });
  }

  applyFilters() {
    const filters = this.filterForm.value;
    console.log('Applying filters', filters);
    this.api.getallproperty().subscribe((res: any) => {
      this.propertylist = res.filter((property: any) => {
        return (
          (!filters.city || property.city === filters.city) &&
          (!filters.address || property.address === filters.address) &&
          (!filters.ptype || property.ptype === filters.ptype) &&
          (!filters.state || property.state === filters.state) &&
          (!filters.price || property.price === +filters.price)
        );
      });
      if (this.loggeduserdata) {
        this.propertylist = this.propertylist.filter(
          (property: any) => property.agentId === this.loggeduserdata.userId
        );
      }

      console.log('Filtered properties', this.propertylist);
    });
  }

  visibledata() {
    let startindex = (this.currentpage - 1) * this.pagesize;
    let endindex = startindex + this.pagesize;
    return this.propertylist.slice(startindex, endindex);
  }

  nextpage() {
    this.currentpage++;
    this.visibledata();
  }

  previouspage() {
    this.currentpage--;
    this.visibledata();
  }

  pagenumbers() {
    this.calculateTotalPages();
    return Array(this.totalpages)
      .fill(0)
      .map((x, i) => i + 1);
  }

  changepage(pagenumber: number) {
    this.currentpage = pagenumber;
    this.visibledata();
  }

  calculateTotalPages() {
    this.totalpages = Math.ceil(this.propertylist.length / this.pagesize);
  }

  changepagesize(pageSize: any) {
    this.pagesize = pageSize;
    this.visibledata();
  }
}