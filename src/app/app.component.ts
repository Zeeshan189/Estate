import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
  loggeduserdata: any;
  constructor(private auth: AuthService, private router: Router){

    this.readuser()
    this.auth.onlogin$.subscribe(res =>{
      this.readuser()
    })
  }

  readuser(){
    const localdata = localStorage.getItem('currentUser');
    if (localdata != null) {
      this.loggeduserdata = JSON.parse(localdata)
    }
  }

  logOut(){
    localStorage.removeItem('currentUser');
    this.loggeduserdata = undefined;
    this.router.navigate(['/login']);
  }

}