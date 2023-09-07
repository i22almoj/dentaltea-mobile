import { Component, OnInit } from '@angular/core';
import { AlertController  } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { UserService, User } from '../../services/user.service';
import { APIService, RequestResponse } from '../../services/api.service';

@Component({
  selector: 'app-resetpass',
  templateUrl: './resetpass.page.html',
  styleUrls: ['./resetpass.page.scss'],
})
export class ResetpassPage implements OnInit {
  email: string = '';
  constructor(private atrCtrl: AlertController, private userService: UserService, private router: Router) { }

  ngOnInit() {
  }

  send(){

    if(this.email==''){
      this.showAlert("", "Debes introducir un email");
      return false;
    }else if(!this.validateEmail(this.email)){
      this.showAlert('Error', 'El email introducido no es correcto'); 
      return false;
    }

    this.userService.resetpass(this.email).then(
      async (response: RequestResponse) => {
        console.log(response);
        this.email = '';
        const confirm = await this.atrCtrl.create({
          header: '',
          message: 'Hemos enviado un correo electrónico con la información para recuperar tu contraseña.',
          buttons: [
            {
              text: 'OK',
              role: 'confirm',
              handler: () => {
               this.goLogin();
              },
            },
          ],
        });
        confirm.present();
      },
      (error) => {
        console.log(error);
        if(error.msg){
          this.showAlert('Error', error.msg);
        }else{
          this.showAlert('Error', 'Error enviando la petición. Vuelve a intentarlo de nuevo más tarde.');
        }
      }
    );

  }

  goLogin(){
    this.redirect('/acceder');
  }

  redirect(path){
    const navigationExtras: NavigationExtras = { replaceUrl : true };
    this.router.navigateByUrl(path, navigationExtras);
  }

  /*! function for showing popup alerts*/
  async showAlert(title: string, message: string) {
    const alert = await this.atrCtrl.create({
      header: title,
      message,
      cssClass:'customalert',
      buttons: ['OK']
    });
    await alert.present();
  }

  validateEmail(email) 
  {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
    {
      return (true)
    }
      return (false)
  }

}
