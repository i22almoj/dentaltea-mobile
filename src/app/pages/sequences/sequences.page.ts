import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { APIService, RequestResponse } from '../../services/api.service';
import { SequenceService } from '../../services/sequence.service';

@Component({
  selector: 'app-sequences',
  templateUrl: 'sequences.page.html',
  styleUrls: ['sequences.page.scss']
})
export class SequencesPage {
  sequences: any = null;
  base_url: string = '';
  
  constructor(private api: APIService, private sequenceService: SequenceService, private router: Router) {
    this.base_url = this.api.base_url;
  }

  numbers(size): Array<number>{
    if(size>9) size = 9;
    let numbers = [];

    for(let i=0;i<size; i++)
      numbers.push(i);

    return numbers;
  }
  
  ngOnInit() {
    this.isLoggedIn();
  }

  isLoggedIn(){
    this.api.isLoggedIn().then(
      (loggedIn) => {
        if(!loggedIn){
          this.goLogin();
        }else{
          this.getSequences();
        }
      }
    );
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

  openItem(id){
    this.redirect('/app/apoyos-visuales/ver/'+id);
  }

  goHome(){
    this.redirect('/app/home');
  }

  goLogin(){
    this.redirect('/acceder');
  }

  redirect(path){
    const navigationExtras: NavigationExtras = { replaceUrl : true };
    this.router.navigateByUrl(path, navigationExtras);
  }

}
