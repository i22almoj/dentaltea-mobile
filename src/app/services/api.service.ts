import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { Push, PushObject, PushOptions } from '@awesome-cordova-plugins/push/ngx';

const secrets = require('../../../secrets.json');

export interface APIResponse {
  success: boolean;
  msg: string;
  data: object;
}

export interface RequestResponse {
  success: boolean;
  msg: string | null;
  data: object;
}


@Injectable({
  providedIn: 'root'
})
export class APIService {
  base_url = (secrets.url) ? secrets.url+'/' : '';
  api_url = (secrets.url) ? secrets.url+'/api/' : '';
  pushObject: PushObject;
  session_id = null;
  user_id = null;

  constructor(public http: HttpClient, public storage: Storage, private router: Router, private push: Push, private alert: AlertController) { 
    this.storage.create();
    const options: PushOptions = {android: { }, ios: {  } };
    this.pushObject = this.push.init(options);
  }

 /*
    Calls the API login method
 */ 
  login(email, password) {
    return new Promise( (resolve, reject) => {
      this.postRequest('login', {email, password} ).then(
        (response: RequestResponse) => {
          if(response.success && response.data && response.data['session_id']){
            this.storage.set('session_id', response.data['session_id']);
            this.storage.set('user_id', response.data['user_id']);
            console.log('LOGGEDIN = ', JSON.stringify(response));
            this.session_id = response.data['session_id'];
            this.subscribeNotifications();
            resolve(response);
          }else{
            response.success = false;
            reject(response);
          }
        },
        (error) => {
          console.log('LOGIN Error', JSON.stringify(error));
          reject(error);
        }
      )
    });
  }


  /*
    Returns the Privacy Policy text
 */ 
  privacyPolicy() {
    return new Promise( (resolve, reject) => {
      this.getRequest('privacy-policy', {} ).then(
        (response: RequestResponse) => {
          if(response.success && response.data && response.data['content']){
            resolve(response.data['content']);
          }else{
            reject("");
          }
        },
        (error) => {
          console.log('LOGIN Error', JSON.stringify(error));
          reject(error);
        }
      )
    });
  }

 /*
    Closes de user account session
 */  
  logout() {
    this.storage.clear();  
    this.session_id = null; 
    this.unsubscribeNotifications();
  }

  /* 
    Subscribes to notifications  
  */
  subscribeNotifications(){
    if(!this.session_id || this.session_id == null) return false;

    this.push.hasPermission().then((res: any) => {
      if (res.isEnabled) {
        console.log('We have permission to send push notifications');
      } else {
        console.log('We do not have permission to send push notifications');
        return false;
      }
    });
    
    const options: PushOptions = {android: { }, ios: {  } };
    this.pushObject = this.push.init(options);

  
    this.pushObject.on('registration').subscribe((registration: any) => { 
      console.log('Dispositivo registrado', JSON.stringify(registration));
          let topic = 'notification-'+this.user_id;
            this.pushObject.subscribe(topic).then ((info) => { 
            console.log('Suscripción realizada a '+topic, JSON.stringify(info));
          });  

          this.pushObject.subscribe('global').then ((info) => { 
            console.log('Suscripción realizada a "global"', JSON.stringify(info));
          });      
    });



    this.pushObject.on('notification').subscribe((notification: any) => {  
      console.log('[FCM] Notificación recibida, session.service', JSON.stringify(notification));

      if(typeof notification.additionalData == undefined || typeof notification.additionalData.date_id == undefined || notification.additionalData.date_id == '')
        return false;
      
      let path = '/app/citas/ver/'+notification.additionalData.date_id;  
      
      console.log('Alerta de Notificación ', JSON.stringify([notification.title, notification.message, notification.additionalData.date_id]));
      this.showNotificationAlert(notification.title, notification.message, notification.additionalData.date_id);
    }); 


  }

/*
  Gets the stored user ID
*/ 
  getUserId(): Promise<RequestResponse>  {
    return new Promise( (resolve, reject) => {
      this.storage.get('user_id').then(
        (user_id) => {
          if(user_id && user_id != '' && user_id != null){
            this.user_id = user_id;
            resolve(user_id);
          }else{
            this.user_id = null;
            resolve(null);
          }
        },
        (error) => {
          this.user_id = null;
          resolve(null);
        }
      );
    });
  }

/*
  Redirects to a new path
*/ 
  redirect(path){
    const navigationExtras: NavigationExtras = { replaceUrl : true };
    this.router.navigateByUrl(path, navigationExtras);
  }


/*
  Show a modal of the notification when the app is open
*/   
  async showNotificationAlert(title: string, message: string, date_id: string) {
    const alert = await this.alert.create({
      header: title,
      message,
      cssClass:'customalert',
      buttons: [
        {
          text: 'Ver cita',
          handler: () => {
            let path = '/app/citas/ver/'+date_id;  
            this.redirect(path);
          }
        },
        {
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary',
      }]
    });
    await alert.present();
  }

  async showAlert(title: string, message: string) {
    const alert = await this.alert.create({
      header: title,
      message,
      cssClass:'customalert',
      buttons: ['OK']
    });
    await alert.present();
  }

/*
  Unsubscribes from notifications
*/ 
  unsubscribeNotifications(){

    try {
      this.pushObject.unregister();
    } catch (error) {
      console.error(error);
    }
    
  }


/*
  Gets the session ID
*/   
  getSession(): Promise<any>{
    return new Promise( (resolve, reject) => {
      this.storage.get('session_id').then(
        (session_id) => {
          if(session_id && session_id.trim() != ''){
            this.session_id = session_id;
            resolve(session_id);
          }else{
            this.session_id = null;
            resolve(null);
          }
        },
        (error) => {
          this.session_id = null;
          resolve(null);
        }
      );
    });
  }


/*
  Checks if the user is logged in
*/   
  isLoggedIn(): Promise<Boolean>{
    return new Promise( async (resolve, reject) => {
      const session_id = await this.getSession();
      this.user_id = await this.getUserId();
      if(session_id && session_id != ''){
        this.getRequest('user').then(
          (response) => { 
            if(response.data && response.data && response.data.email){
              console.log('Session exists', response.data.email);
              resolve(true);
              this.subscribeNotifications();
              this.session_id = session_id;
            }else{
              this.storage.clear();
              this.session_id = null;
              reject(false);
            }
          },
          (error) => {
            this.session_id = null;
            resolve(false);
            this.storage.clear();  
          }
        );
      }else{
        this.session_id = null;
        resolve(false);
      }
    });
  }


/*
  Makes a call to the API with the POST method
*/ 
  postRequest(path: string, params: object = {}): Promise<any>{
    return new Promise( async(resolve, reject) => {

      const session_id = await this.getSession();
     
      const options = ( session_id && session_id != '') ? 
        { 
          headers : new HttpHeaders()
          .set("Content-Type", "application/json")
          .set("Authorization", "Bearer "+session_id)
        } : {};

      
      this.http.post<any>(this.api_url+path, JSON.stringify(params), options ).subscribe(
        (response: APIResponse) => {
          if(response.success){
            resolve(response);
          }else{
            reject(response);
          }
        },
        (error) => {
          if(error.error !== undefined && error.error.success != undefined){
            reject(error.error);
          }else{
            console.log("Error de conexión. Comprueba que tienes acceso a internet "+JSON.stringify(error));
            reject({ "success": false, "msg": "Error de conexión. Comprueba que tienes acceso a internet." });
          }

        }
      );
    });
  }

/*
  Makes a call to the API with the GET method
*/   
  getRequest(path: string, params: any = {}): Promise<any>{
    
    return new Promise( async (resolve, reject) => {
      
      const session_id = await this.getSession();

      const options = (session_id && session_id != '') ? 
        { 
          headers : new HttpHeaders()
          .set("Content-Type", "application/json")
          .set("Authorization", "Bearer "+session_id)
          ,
          'params' : new HttpParams({ fromObject: params })
        } : { 'params' : new HttpParams({ fromObject: params }) };

      this.http.get<APIResponse>(this.api_url+path, options).subscribe(
        (response: APIResponse) => {
          if(response.success){
            resolve(response);
          }else{
            reject(response);
          }
        },
        (error) => {
          if(error.error !== undefined && error.error.success != undefined){
            reject(error.error);
          }else{
            reject({ "success": false, "msg": "Error de conexión" });
          }

        }
      );
    });
  }


/*
  Makes a call to the API with the PUT method
*/   
  putRequest(path: string, params: object = {}): Promise<any>{
    return new Promise( async (resolve, reject) => {

      const session_id = await this.getSession();
      const options = ( session_id && session_id != '') ? 
        { 
          headers : new HttpHeaders()
          .set("Content-Type", "application/json")
          .set("Authorization", "Bearer "+session_id)
        } : {};

      this.http.put<APIResponse>(this.api_url+path, JSON.stringify(params), options).subscribe(
        (response: APIResponse) => {
          if(response.success){
            resolve(response);
          }else{
            console.log('No es true????', response, response.success);
            reject(response);
          }
        },
        (error) => {
          if(error.error !== undefined && error.error.success != undefined){
            reject(error.error);
          }else{
            reject({ "success": false, "msg": "Error de conexión" });
          }

        }
      );
    });
  }


/*
  Makes a call to the API with the PATCH method
*/ 
  patchRequest(path: string, params: object = {}): Promise<any>{
    return new Promise( async (resolve, reject) => {

      const session_id = await this.getSession();
      const options = ( session_id && session_id != '') ? 
        { 
          headers : new HttpHeaders()
          .set("Content-Type", "application/json")
          .set("Authorization", "Bearer "+session_id)
        } : {};

      this.http.patch<APIResponse>(this.api_url+path, JSON.stringify(params), options).subscribe(
        (response: APIResponse) => {
          if(response.success){
            resolve(response);
          }else{
            reject(response);
          }
        },
        (error) => {
          if(error.error !== undefined && error.error.success != undefined){
            reject(error.error);
          }else{
            reject({ "success": false, "msg": "Error de conexión" });
          }

        }
      );
    });
  }

/*
  Makes a call to the API with the DELETE method
*/   
  deleteRequest(path: string, params: any): Promise<any>{
   
    return new Promise( async (resolve, reject) => {

      const session_id = await this.getSession();
      const options = (session_id && session_id != '') ? 
      { 
        headers : new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer "+session_id)
        ,
        'params' : new HttpParams({ fromObject: params })
      } : { 'params' : new HttpParams({ fromObject: params }) };

      this.http.delete<APIResponse>(this.api_url+path, options).subscribe(
        (response: APIResponse) => {
          if(response.success){
            resolve(response);
          }else{
            reject(response);
          }
        },
        (error) => {
          if(error.error !== undefined && error.error.success != undefined){
            reject(error.error);
          }else{
            reject({ "success": false, "msg": "Error de conexión" });
          }

        }
      );
    });
  }

}
