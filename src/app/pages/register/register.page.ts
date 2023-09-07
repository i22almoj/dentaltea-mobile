import { Component, ViewChild } from '@angular/core';
import { APIService, RequestResponse } from '../../services/api.service';
import { UserService, User } from '../../services/user.service';
import { Router, NavigationExtras } from '@angular/router';
import { AlertController, IonModal  } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: 'register.page.html',
  styleUrls: ['register.page.scss']
})
export class RegisterPage {
  passwordType = 'password';
  passwordIcon = 'eye-off';
  password2 = '';
  data= {id: 0, name: '', email: '', password: ''};
  privacy = false;
  privacyPolicy = '';

  @ViewChild(IonModal) modal: IonModal;
  constructor(private userService: UserService, private api: APIService, private atrCtrl: AlertController, private router: Router) {}

  ngOnInit() {
    this.api.privacyPolicy().then(
      (content: string) => {
        console.log(content);
        this.privacyPolicy = content;
      }, 
      (error) => {
        console.log('Error de conexión', error);
      }
    );
  }

  save(){
    if(this.data.name==''){
      this.showAlert('Error', 'Debes introducir un nombre'); 
      return false;
    }else if(this.data.email==''){
      this.showAlert('Error', 'Debes introducir un email'); 
      return false;
    }else if(!this.validateEmail(this.data.email)){
      this.showAlert('Error', 'El email introducido no es correcto'); 
      return false;
    }

    if(this.data.password != this.password2){
      this.showAlert("", "Las contraseñas no coinciden");
      return false;
    }
    if(this.data.password.length < 6){
      this.showAlert("", "Las contraseña debe tener al menos 6 caracteres");
      return false;
    }
    if(!this.privacy){
      this.showAlert('Error', 'Debes aceptar la política de privacidad'); 
      return false;
    }

    console.log('Datos a enviar:', this.data);

    this.userService.register(this.data).then(
      async (response: RequestResponse) => {
        console.log(response);
        this.data= {id: 0, name: '', email: '', password: ''};
        this.password2 = '';
         const confirm = await this.atrCtrl.create({
          header: '',
          message: 'Tu cuenta ha sido registrada correctamente. Introduce tu email y contraseña para acceder.',
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
          this.showAlert('Error', 'Error en el registro. Vuelve a intentarlo de nuevo más tarde.');
        }
      }
    );

  }

  showPrivacy(event){

  }


  goLogin(){
    this.redirect('/acceder');
  }

  redirect(path){
    const navigationExtras: NavigationExtras = { replaceUrl : true };
    this.router.navigateByUrl(path, navigationExtras);
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
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

  closeModal(){
    this.modal.dismiss(null, 'cancel');
  }
}
