import { Injectable } from '@angular/core';
import { APIService, RequestResponse } from './api.service';

export interface User{
    id: number,
    name: string,
    email: string
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(public api: APIService) { }

  getUserData(): Promise<RequestResponse>  {
    return new Promise( (resolve, reject) => {
      this.api.getRequest('user').then(
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

  editUser(params): Promise<RequestResponse>  {
    return new Promise( (resolve, reject) => {
      this.api.putRequest('user/edit', params ).then(
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

  changePassword(password): Promise<RequestResponse>  {
    return new Promise( (resolve, reject) => {
      this.api.putRequest('user/change-password', { password: password} ).then(
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

  deleteUser(): Promise<RequestResponse>  {
    return new Promise( (resolve, reject) => {
      this.api.deleteRequest('user/delete', {} ).then(
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

  register(params): Promise<RequestResponse>  {
    return new Promise( (resolve, reject) => {
      this.api.postRequest('user/register', params ).then(
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

  resetpass(email) {
    return new Promise((resolve, reject) => {
      
      this.api.postRequest('user/resetpass', { email: email } ).then(
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
      );
    });
  }

}
