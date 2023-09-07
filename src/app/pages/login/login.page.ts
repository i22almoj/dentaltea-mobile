import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, NavController, MenuController, IonModal  } from '@ionic/angular';
import { APIService } from '../../services/api.service';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss']
})
export class LoginPage {
  checkLoggedIn: boolean = false;

  data = {
    email: '',
    password: ''
  };
  passwordType = 'password';
  passwordIcon = 'eye-off';
  
  @ViewChild(IonModal) modal: IonModal;
  constructor( public atrCtrl: AlertController, public navCtrl: NavController, public menuCtrl: MenuController, public api: APIService, public router: Router) { 
   
  }

  ngOnInit() {
    this.isLoggedIn();
  }

  login() {
    this.api.login(this.data.email, this.data.password).then(
      (response) => {
        this.checkLoggedIn = true;
        console.log(JSON.stringify(response));
        this.goHome();
      },
      (error) =>{
        this.checkLoggedIn = true;
        console.log(error);
        this.showAlert('', error.msg);
      }
    )
  }

  isLoggedIn(){
    this.api.isLoggedIn().then(
      (loggedIn) => {
         this.checkLoggedIn = true;
        if(loggedIn){
          this.goHome();
        }
      }
    );
  }

  /*! function for showing popup alerts*/
  async showAlert(title: string, message: string, className:string = 'customalert', buttontext:string = 'OK') {
    const alert = await this.atrCtrl.create({
      header: title,
      message,
      cssClass: className,
      buttons: [buttontext]
    });
    await alert.present();
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }
  
  validateEmail(email) 
  {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
    {
      return (true)
    }
      return (false)
  }

  redirect(path){
    const navigationExtras: NavigationExtras = { replaceUrl : true };
    this.router.navigateByUrl(path, navigationExtras);
  }

  goHome(){
    this.redirect('/app/home');
  }

  closeModal(){
    this.modal.dismiss(null, 'cancel');
  }
}

