import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { SequenceService } from '../../../services/sequence.service';
import { APIService, RequestResponse } from '../../../services/api.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.page.html',
  styleUrls: ['./item.page.scss'],
})
export class ItemPage implements OnInit {
  id: number = 0;
  sequence: any = null;
  base_url: string = '';
  edit = true;

  constructor(public router: Router, public route: ActivatedRoute, public atrCtrl: AlertController, private api: APIService, private sequenceService: SequenceService) {
    this.base_url = this.api.base_url;
    this.isLoggedIn();

   }

  ngOnInit() {
  }

  isLoggedIn(){
    this.api.isLoggedIn().then(
      (loggedIn) => {
        if(!loggedIn){
          this.goLogin();
        }else{
          this.route.params.subscribe(params => {
            this.id = parseInt(params['id']);
            this.sequenceService.getSequence(this.id).then(
              (response: RequestResponse) => {
                this.sequence = response.data;
                console.log('ITEM', this.sequence);
              },
              (error) =>{
                console.log(error);
              }
            );
            
          });
        }
      }
    );
  }


  async deleteItem(sequence_id){
    const alert = await this.atrCtrl.create({
      header: '',
      message: '¿Seguro que quieres eliminar este apoyo visual?',
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

           this.sequenceService.deleteSequence( this.sequence.id ).then( 
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
    window.location.href = "/app/apoyos-visuales";
    //this.redirect('/app/apoyos-visuales');
  }

  redirect(path){
    const navigationExtras: NavigationExtras = { replaceUrl : true };
    this.router.navigateByUrl(path, navigationExtras);
  }

}
