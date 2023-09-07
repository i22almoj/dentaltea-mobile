import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { AlertController, NavController, ItemReorderEventDetail, IonModal } from '@ionic/angular';
import { SequenceService } from '../../../services/sequence.service';
import { PictogramService } from '../../../services/pictogram.service';
import { APIService, RequestResponse } from '../../../services/api.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {
  
  id: number = 0;
  sequence: any = null;
  base_url: string = '';
  edit = true;
  isDisabled: Boolean = false;
  pictograms: any = [];
  addPosition:string = 'top';
  modalOpen = false;

  @ViewChild(IonModal) modal: IonModal;
  constructor(public router: Router, public route: ActivatedRoute, public atrCtrl: AlertController, private api: APIService, private sequenceService: SequenceService, private pictogramService: PictogramService) {
    this.base_url = this.api.base_url;
    this.sequence = {
      id: 0,
      description: '',
      sequencePictograms: []
    }
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
          this.loadPictograms();
        }
      }
    );
  }

  setAddPosition(position:string){
    this.addPosition = position;
  }

  save(){
    let items = document.querySelectorAll('#sequence-pictograms ion-item');

    if(this.sequence.description==''||this.sequence.description==null){
      this.showAlert('Error', 'Debes introducir una descripción');
      return false;
    }

    if(items.length==0){
      this.showAlert('Error', 'Debes añadir al menos un pictograma');
      return false;
    }

    let sequencePictograms = [];
    items.forEach(function (item, i, items) {
      sequencePictograms.push({
        'pictogram_id': item.querySelector('input').value,
        'description': item.querySelector('ion-textarea').value,
        'sort_number': (i+1)
      });
    });

    let data = {
      sequence_id: this.sequence.id,
      description: this.sequence.description,
      sequencePictograms: sequencePictograms
    }
    console.log('Datos a enviar:', data);

    this.sequenceService.addSequence(data).then( 
      (response) => {
        console.log(response);
        this.goBack();
      },
      (error) => {
        console.log(error);
      }
    );

  }

  closeModal(){
    this.modal.dismiss(null, 'cancel');
    this.modalOpen = false;
  }

  openModal(position='top'){ console.log('position', position);
    this.addPosition = position;
    this.modalOpen = true;
  }

  addPictogram(pictogram){
    console.log(this.sequence.sequencePictograms[0]);
    
    let item = {
      description: pictogram.description,
      pictogram: pictogram,
      pictogram_id: pictogram.id,
      sequence_id: this.sequence.id,
      sortNumber: 0
    };

    if(this.addPosition=='top'&& this.sequence.sequencePictograms && this.sequence.sequencePictograms.length>0){
      this.sequence.sequencePictograms.unshift(item);
    }else{
      this.sequence.sequencePictograms.push(item);
    }

    this.closeModal();
  }

  loadPictograms(){
    this.pictogramService.getPictograms().then(
      (response: RequestResponse) => {
        this.pictograms = response.data;
      },
      (error) => {
        console.log('Error', error);
      }
    );
  }

  deleteElement( position: number){
    if(this.sequence.sequencePictograms[position])
      this.sequence.sequencePictograms.splice(position, 1);
  }

  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    ev.detail.complete();
  }

  toggleReorder() {
    this.isDisabled = !this.isDisabled;
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
    window.location.href = "/app/apoyos-visuales";
//    this.redirect('/app/apoyos-visuales');
  }

  goSequence(){
    this.redirect('/app/apoyos-visuales/ver/'+this.sequence.id);
  }

  redirect(path){
    const navigationExtras: NavigationExtras = { replaceUrl : true };
    this.router.navigateByUrl(path, navigationExtras);
  }

}
