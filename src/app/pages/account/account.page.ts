import { Component } from '@angular/core';
import { APIService, RequestResponse } from '../../services/api.service';
import { UserService, User } from '../../services/user.service';
import { Router, NavigationExtras } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-account',
  templateUrl: 'account.page.html',
  styleUrls: ['account.page.scss']
})
export class AccountPage {

  passwordType = 'password';
  passwordIcon = 'eye-off';
  userNewPassword = '';
  userNewPassword2 = '';
  data: User = {id: 0, name: '', email: ''};
  deleteAccountResp:boolean = false;

  constructor(public api: APIService, public userService: UserService, private router: Router, public atrCtrl: AlertController) { }

  ngOnInit() {
    this.isLoggedIn();
    this.userNewPassword = '';
    this.updateData();
  }

  isLoggedIn(){
    this.api.isLoggedIn().then(
      (loggedIn) => {
        if(!loggedIn){
          this.goLogin();
        }else{
          this.getUserData()
        }
      }
    );
  }

  getUserData(){
    
    this.userService.getUserData().then(
      (response: RequestResponse) => {
        console.log('RESULTADO: ',response);
        if(response.success){
          this.data = response.data as User;
        }
        
      },
      (error) => {
        console.log(error);
      }
    )
  }

  
  async askDeleteAccount(){
    const alert = await this.atrCtrl.create({
      header: 'Eliminar cuenta',
      message: '¿Seguro que quieras eliminar tu cuenta de usuario?',
      cssClass:'customalert',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {  console.log("Eliminar cuenta cancelado"); }
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => { this.deleteAccount() }
        }
      ]
    });
    await alert.present();
  }

  async deleteAccount(){
    console.log('OK DELETE');

    await this.userService.deleteUser();

    this.api.logout();
    this.goLogin();
    
  }

  updateData(){

  }

  cleanData(){
    
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }
  
  save() {
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

    let data = {
      name: this.data.name,
      email: this.data.email
    }
    console.log('Datos a enviar:', data);

    this.userService.editUser(data).then(
      (response) => {
        console.log(response);
        this.showAlert('','Cambios guardados correctamente');
      },
      (error) => {
        console.log(error);
        if(error.msg){
          this.showAlert('Error', error.msg);
        }else{
          this.showAlert('Error', 'Error guardando los cambios. Vuelve a intentarlo de nuevo más tarde.');
        }
      }
    );
    
   
  }

  savePass() {
    if(this.userNewPassword!=this.userNewPassword2){
      this.showAlert("", "Las contraseñas no coinciden");
      return false;
    }
    if(this.userNewPassword.length < 6){
      this.showAlert("", "Las contraseña debe tener al menos 6 caracteres");
      return false;
    }
    this.userService.changePassword(this.userNewPassword).then(
      (data) => {
        this.showAlert("", "Contraseña cambiada correctamente");
      },
      (error) => {
        this.showAlert('Error', "Error conectando con el servidor");
      }
    );
  }



  logout() {
    this.api.logout();
    this.goLogin();
  }

  redirect(path){
    const navigationExtras: NavigationExtras = { replaceUrl : true };
    this.router.navigateByUrl(path, navigationExtras);
  }

  goHome(){
    this.redirect('/app/home');
  }

  goLogin(){
    this.redirect('/acceder');
  }

   /*! function for showing popup alerts*/
   async showConfirm(title: string, message: string) {
    const alert = await this.atrCtrl.create({
      header: title,
      message,
      cssClass:'customalert',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {  console.log("Eliminar cuenta cancelado"); }
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => { this.deleteAccount() }
        }
      ]
    });
    await alert.present();
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
