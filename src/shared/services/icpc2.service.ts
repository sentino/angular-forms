import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { statementsMock } from './getIcpc2.mock';
import { IIcpc2 } from '../interfaces/icpc2.interface';

@Injectable({
  providedIn: 'root',
})
export class Icpc2Service {
  constructor(private http: HttpClient) {}

  public getIcpc2(
  ): Observable<IIcpc2> {
    // ----------------------------------------------------
    // CORS ERROR for localhost
    // -------------------------
    // return this.http.get<any>(
    //   `https://global.lakmus.org/Dictionaries/icpc2`,
    //   {
    //     params: {
    //       'IsPublic': 'true',
    //       'Search': 'Ост'
    //     }
    //   }
    // );
    // ----------------------------------------------------
    return of<IIcpc2>(statementsMock);
  }

}
