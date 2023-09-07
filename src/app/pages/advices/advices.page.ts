import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { APIService, RequestResponse } from '../../services/api.service';
import { AdviceService } from '../../services/advice.service';
@Component({
  selector: 'app-advices',
  templateUrl: 'advices.page.html',
  styleUrls: ['advices.page.scss']
})
export class AdvicesPage {
  advices: any = null;
  base_url:string = '';
  constructor(private api: APIService, private adviceService: AdviceService, private router: Router) {
    this.base_url = this.api.base_url;
  }

  ngOnInit() {
    this.isLoggedIn();
    
  }

  isLoggedIn(){
    this.api.isLoggedIn().then(
      (loggedIn) => {
        if(!loggedIn){
          this.goLogin();
        }else{
          this.getAdvices();
        }
      }
    );
  }

  getAdvices(){
    
    this.adviceService.getAdvices().then(
      (response: RequestResponse) => {
        console.log('RESULTADO: ',response);
        if(response.success){
          this.advices = response.data;
        }
        
      },
      (error) => {
        console.log(error);
      }
    )
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
