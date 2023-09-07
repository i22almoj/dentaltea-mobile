import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { APIService, RequestResponse } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor(public http: HttpClient, public storage: Storage, public api: APIService) { 
    this.storage.create();
    
  }

  getDates(): Promise<RequestResponse>  {
    return new Promise( (resolve, reject) => {
      this.api.getRequest('dates').then(
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

  getDate(date_id): Promise<RequestResponse>  {
    return new Promise( (resolve, reject) => {
      this.api.getRequest('dates/item', {'date_id': parseInt(date_id) }).then(
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

  addDate(params): Promise<RequestResponse>  {
    return new Promise( (resolve, reject) => {
      this.api.postRequest('dates/add', params ).then(
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

  editDate(params): Promise<RequestResponse>  {
    return new Promise( (resolve, reject) => {
      this.api.putRequest('dates/edit', params ).then(
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

  deleteDate(id): Promise<RequestResponse>  {
    return new Promise( (resolve, reject) => {
      this.api.deleteRequest('dates/delete', {date_id: id} ).then(
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
