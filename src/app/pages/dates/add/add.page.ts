import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, NavController, IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import * as moment from 'moment';
import { DateService } from '../../../services/date.service';
import { SequenceService } from '../../../services/sequence.service';
import { APIService, RequestResponse } from '../../../services/api.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  id: number = 0;
  date: any = null;
  base_url: string = '';
  edit = true;
  sequences: any = null;

  constructor(public router: Router, public route: ActivatedRoute, private navController:NavController, public atrCtrl: AlertController, private api: APIService, private dateService: DateService, private sequenceService: SequenceService) {
    this.isLoggedIn();
  }

  loadData(){
    this.date = {
      dateFormatted : moment().format('YYYY-MM-DDTHH:mm')+':00',
      description: '',
      sequence: null,
      notificationsMobile: 0,
      notificationsEmail: 0,
      notificationsMobileBoolean: false,
      notificationsEmailBoolean: false,
    }
    this.base_url = this.api.base_url;
    this.getSequences();
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

  ngOnInit() {
  }

  save(){
    if(this.date.dateFormatted==''){
      this.showAlert('Error', 'Debes introducir una fecha y una hora');
    }else if(this.date.description==''){
      this.showAlert('Error', 'Debes introducir una descripción');
    }

    let data = {
      description: this.date.description,
      dateTime: this.date.dateFormatted.replace('T', ' ').substring(0, 19),
      sequence_id: (this.date.sequence) ? this.date.sequence.id : null,
      notificationsMobile: (this.date.notificationsMobileBoolean) ? 1 : 0,
      notificationsEmail: (this.date.notificationsEmailBoolean) ? 1 : 0
    }
    console.log('Datos a enviar:', data);


    this.dateService.addDate(data).then( 
      (response) => {
        console.log(response);
        if(response.data['date_id'] !== undefined)
          this.redirect('/app/citas/ver/'+response.data['date_id']);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  selectItem(sequence){
    console.log(sequence);
    this.date.sequence = sequence;
    this.close();

  }

  getSequences(){
    
    this.sequenceService.getSequences().then(
      (response: RequestResponse) => {
        
        if(response.success){
          this.sequences = response.data;
          console.log('RESULTADO: ',this.sequences);
        }
        
      },
      (error) => {
        console.log(error);
      }
    )
  }

  numbers(size): Array<number>{
    if(size>9) size = 9;
    let numbers = [];

    for(let i=0;i<size; i++)
      numbers.push(i);

    return numbers;
  }

  close() {
    this.modal.dismiss(null, 'cancel');
  }

  async showAlert(title: string, message: string) {
    const alert = await this.atrCtrl.create({
      header: title,
      message,
      animated: true,
      buttons: ['CERRAR']
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
