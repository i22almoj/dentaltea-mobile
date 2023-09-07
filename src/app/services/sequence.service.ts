import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { APIService, RequestResponse } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class SequenceService {

  constructor(public http: HttpClient, public storage: Storage, public api: APIService) { 
    this.storage.create();
    
  }

  getSequences(): Promise<RequestResponse>  {
    return new Promise( (resolve, reject) => {
      this.api.getRequest('sequences').then(
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

  getSequence(sequence_id): Promise<RequestResponse>  {
    return new Promise( (resolve, reject) => {
      this.api.getRequest('sequences/item', {'sequence_id': parseInt(sequence_id) }).then(
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

  addSequence(params): Promise<RequestResponse>  {
    return new Promise( (resolve, reject) => {
      this.api.postRequest('sequences/add', params).then(
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

  editSequence(params): Promise<RequestResponse>  {
    return new Promise( (resolve, reject) => {
      this.api.putRequest('sequences/edit', params).then(
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

  deleteSequence(id): Promise<RequestResponse>  {
    return new Promise( (resolve, reject) => {
      this.api.deleteRequest('sequences/delete', {sequence_id: id} ).then(
        (response: RequestResponse) => {
          if(response.success){
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
