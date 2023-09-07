import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, NavController, IonModal } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import * as moment from 'moment';
import { DateService } from '../../../services/date.service';
import { SequenceService } from '../../../services/sequence.service';
import { APIService, RequestResponse } from '../../../services/api.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
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
    this.route.params.subscribe(params => {
      this.id = parseInt(params['id']);
      this.base_url = this.api.base_url;
      this.route.params.subscribe(params => {
        this.id = parseInt(params['id']);
        this.dateService.getDate(this.id).then(
          (response: RequestResponse) => {
            if(response.data){
              this.date = response.data;
              this.date.dateFormatted = moment(this.date.dateTime.date).format('YYYY-MM-DDTHH:mm')+':00';
              this.date.date = moment(this.date.dateTime.date).format('DD/MM/YYYY');
              this.date.hour = moment(this.date.dateTime.date).format('HH:mm');
              this.date.notificationsMobileBoolean = (this.date.notificationsMobile==1);
              this.date.notificationsEmailBoolean = (this.date.notificationsEmail==1);
              console.log(this.date);
              console.log(this.date.dateTime.date);
              this.getSequences();
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
      return false;
    }else if(this.date.description==''){
      this.showAlert('Error', 'Debes introducir una descripción');
      return false;
    }

    let data = {
      date_id: this.date.id,
      description: this.date.description,
      dateTime: this.date.dateFormatted.replace('T', ' ').substring(0, 19),
      sequence_id: (this.date.sequence) ? this.date.sequence.id : null,
      notificationsMobile: (this.date.notificationsMobileBoolean) ? 1 : 0,
      notificationsEmail: (this.date.notificationsEmailBoolean) ? 1 : 0
    }
    console.log('Datos a enviar:', data);

    this.dateService.editDate(data).then( 
      (response) => {
        console.log(response);
        this.goBack();
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
        this.showAlert('', 'Hubo un error guardando los cambios. Vuelve a intentarlo de nuevo');
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
    this.redirect('/app/citas/ver/'+this.date.id);
  }

  redirect(path){
    const navigationExtras: NavigationExtras = { replaceUrl : true };
    this.router.navigateByUrl(path, navigationExtras);
  }
  
}
