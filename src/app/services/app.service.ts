import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(
    private httpClient: HttpClient
  ) { }

  public getInfo(): Observable<any> {
    return this.httpClient.get(`${environment.API_URL}/api/info`);
  }

  public getNetworkInfo(): Observable<any> {
    return this.httpClient.get(`${environment.API_URL}/api/network`);
  }

  public getInfoChart(): Observable<any> {
    return this.httpClient.get(`${environment.API_URL}/api/info/chart`);
  }
}
