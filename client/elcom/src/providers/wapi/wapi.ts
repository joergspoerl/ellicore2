import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the WapiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class WapiProvider {

//  baseUrl: string = '/api'; // proxy url
  baseUrl: string = 'http://192.168.1.10:8082'; // 

  constructor(public http: HttpClient) {
    console.log('Hello WapiProvider Provider');
  }

  getData(level:number,source_id:number,limit:number) {
    return this.http.get(
      `${this.baseUrl}/api/v1/history/data/${level}/${source_id}/${limit}`)
  }

  getSource() {
    return this.http.get(
      `${this.baseUrl}/api/v1/history/source/`)
  }


}
