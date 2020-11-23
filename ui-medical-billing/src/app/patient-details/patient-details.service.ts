import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientDetailsService {

  constructor(private httpClient: HttpClient) { }

  savePatientDetails(payload): Observable<any> {
    return this.httpClient.post('/api/patient-details', payload);
  }
}
