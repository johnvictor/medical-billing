import {AfterViewInit, OnInit, Component, ViewChild} from '@angular/core';
import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { PaymentComponent } from '../payment/payment.component';
import { TransactionDetailsService } from '../transaction-details.service';
import { TransactionDetailsUtils } from '../transaction-details.utils';

export interface AppointmentDetails {
  sno: number;
  patientName: string;
  ageGender: string;
  appointmentDate: string;
  balanceAmount: number;
  paymentDetails: [];
  medicalScanDetails: [];
}

enum BillTypes {
  notYetBilled = 'Not yet Billed',
  dueBilled = 'Due Billed',
  fullyBilled = 'Fully Billed',
}

let APPOINTMENT_DETAILS: AppointmentDetails[] = [];

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss']
})
export class TransactionDetailsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  appointmentDetails = [];
  displayedColumns: string[] = ['sno', 'patientName', 'ageGender', 'appointmentDate', 'balanceAmount', 'symbol'];
  dataSource = new MatTableDataSource(APPOINTMENT_DETAILS);
  options: string[] = [BillTypes.notYetBilled, BillTypes.dueBilled, BillTypes.fullyBilled];
  filterForm: FormGroup;

  constructor(public dialog: MatDialog,
              private transactionDetailsService: TransactionDetailsService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getAppointmentDetails();
    this.createFilterForm();
  }

  createFilterForm(): void {
    this.filterForm = this.formBuilder.group({
      fromDate: '',
      toDate: '',
      status: '',
      commonSearch: ''
    });
  }

  // TODO
  search(): void {
  }

  filterbyStatus(value: string): void {
    let result;
    switch (value) {
      case BillTypes.notYetBilled:
        result = APPOINTMENT_DETAILS.filter(data => !data.paymentDetails);
        this.dataSource = new MatTableDataSource(result);
        break;

      case BillTypes.dueBilled:
        result = APPOINTMENT_DETAILS.filter(data => {
          if (data.paymentDetails && data.paymentDetails.length) {
            return TransactionDetailsUtils.getBalanceAmount(data.medicalScanDetails, data.paymentDetails) > 0;
          } else {
            return false;
          }
        });
        this.dataSource = new MatTableDataSource(result);
        break;

      case BillTypes.fullyBilled:
        result = APPOINTMENT_DETAILS.filter(data => {
          if (data.paymentDetails && data.paymentDetails.length) {
            return TransactionDetailsUtils.getBalanceAmount(data.medicalScanDetails, data.paymentDetails) === 0;
          } else {
            return false;
          }
        });
        this.dataSource = new MatTableDataSource(result);
        break;
      default:
        this.dataSource = new MatTableDataSource(APPOINTMENT_DETAILS);
        break;
    }
  }

  getAppointmentDetails(): void {
    this.transactionDetailsService.getAppointmentDetails().subscribe((res: any) => {
      this.appointmentDetails = res;
      APPOINTMENT_DETAILS = res.map(data => {
        console.log(TransactionDetailsUtils.getTotalAmount(data.medicalScanDetails));
        return {
          patientName: data.patientDetails.name,
          ageGender: `${data.patientDetails.age}${this.getAgeType(data.patientDetails.ageType)}-${data.patientDetails.gender}`,
          appointmentDate: data.patientDetails.appointmentDate,
          balanceAmount: TransactionDetailsUtils.getBalanceAmount(data.medicalScanDetails, data.paymentDetails),
          uuid: data.uuid,
          paymentDetails: data.paymentDetails,
          medicalScanDetails: data.medicalScanDetails
        };
      });
      this.dataSource = new MatTableDataSource(APPOINTMENT_DETAILS);
    });

  }

  getAgeType(ageType): string {
    return ageType === 'Years' ? 'Y' : 'M';
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  pay(uuid: number): void {
    const dialogRef = this.dialog.open(PaymentComponent, {
      // height: '700px',
      width: '900px',
      data: this.appointmentDetails.find(ad => ad.uuid === uuid)
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAppointmentDetails();
    });
  }

}
