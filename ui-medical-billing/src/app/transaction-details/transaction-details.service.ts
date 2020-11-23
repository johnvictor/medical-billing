import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionDetailsService {

  constructor(private http: HttpClient) { }

  getAppointmentDetails(): Observable<any> {
    return this.http.get('/api/patient-details');
  }

  postPaymentDetails(payload): Observable<any> {
    return this.http.post('/api/payment-details', payload);
  }
}
