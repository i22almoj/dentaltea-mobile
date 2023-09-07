import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { APIService } from '../../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  checkLoggedIn: boolean = false;
  
  constructor(private api: APIService, private router: Router) {}

  ngOnInit() {
    this.isLoggedIn();
  }

  isLoggedIn(){
    this.api.isLoggedIn().then(
      (loggedIn) => {
        if(!loggedIn){
          this.goLogin();
        }else{
          this.checkLoggedIn = true;
        }
        
      }
    );
  }

  goHome(){
    this.redirect('/app/home');
  }

  goLogin(){
    this.redirect('/acceder');
  }

  redirect(path){
    const navigationExtras: NavigationExtras = { replaceUrl : true };
    this.router.navigateByUrl(path, navigationExtras);
  }

}
