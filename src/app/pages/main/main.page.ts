import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { APIService } from '../../services/api.service';

@Component({
  selector: 'app-Main',
  templateUrl: 'main.page.html',
  styleUrls: ['main.page.scss']
})
export class MainPage {
  showTabs = false;
  
  constructor(private api: APIService, private router: Router) {}
  
  ngOnInit() {
    this.isLoggedIn();
  }

  isLoggedIn(){
    this.api.isLoggedIn().then(
      (loggedIn) => {
        if(!loggedIn){
          this.api.unsubscribeNotifications();
          this.goLogin();
        }else{
          this.showTabs = true;
          this.api.subscribeNotifications();
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
