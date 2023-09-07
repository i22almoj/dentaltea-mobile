import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import * as moment from 'moment';
import { AlertController, NavController } from '@ionic/angular';
import { DateService } from '../../../services/date.service';
import { APIService, RequestResponse } from '../../../services/api.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.page.html',
  styleUrls: ['./item.page.scss'],
})
export class ItemPage implements OnInit {
  id: number = 0;
  date: any = null;
  base_url: string = '';
  edit = true;

  constructor(public router: Router, public route: ActivatedRoute, public atrCtrl: AlertController, private api: APIService, private dateService: DateService) {
    this.isLoggedIn();
   }


   isLoggedIn(){
    this.api.isLoggedIn().then(
      (loggedIn) => {
        if(!loggedIn){
          this.goLogin();
        }else{
          this.loadData();
        }
      }
    );
  }

  loadData(){
    this.route.params.subscribe(params => {
      this.id = parseInt(params['id']);
      this.base_url = this.api.base_url;
      this.route.params.subscribe(params => {
        this.id = parseInt(params['id']);
        this.dateService.getDate(this.id).then(
          (response: RequestResponse) => {

            if(response.data){
              this.date = response.data;
              this.date.date = moment(this.date.dateTime.date).format('DD/MM/YYYY');
              this.date.hour = moment(this.date.dateTime.date).format('HH:mm');
              console.log(this.date);
              console.log(this.date.dateTime.date);
            }else{
              this.goBack();
            }
          },
          (error) => {
            console.log(error);
            this.goBack();
          }
        );
      });
  
      console.log(this.id);
    });
  }

  ngOnInit() {
  }

  async deleteItem(date_id){
    const alert = await this.atrCtrl.create({
      header: '',
      message: '¿Seguro que quieres eliminar esta cita?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {},
        },
        {
          text: 'Sí',
          role: 'confirm',
          handler: () => {
           console.log('ok!');

           this.dateService.deleteDate( this.date.id ).then( 
              (response: RequestResponse) => {
                console.log(response);
                this.goBack();
              },
              (error) => {
                console.log(error);
                this.goBack();
              }
            );
          },
        },
      ],
    });

    await alert.present();
  }

  goHome(){
    this.redirect('/app/home');
  }

  goLogin(){
    this.redirect('/acceder');
  }

  goBack(){
    this.redirect('/app/citas');
  }

  redirect(path){
    const navigationExtras: NavigationExtras = { replaceUrl : true };
    this.router.navigateByUrl(path, navigationExtras);
  }
  
}
