import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { APIService, RequestResponse } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AdviceService {

  constructor(public http: HttpClient, public storage: Storage, public api: APIService) { 
    this.storage.create();
    
  }
  
  getAdvices(): Promise<RequestResponse> {
    return new Promise( (resolve, reject) => {
      this.api.getRequest('advices').then(
        (response: RequestResponse) => {
          if(response.success && response.data){
            resolve(response);
          }else{
            response.success = false;
            reject(response);
          }
        },
        (error) => {
          reject(error);
        }
      )
    });
  }

}
