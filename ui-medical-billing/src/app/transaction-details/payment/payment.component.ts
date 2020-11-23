import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TransactionDetailsUtils } from '../transaction-details.utils';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionDetailsService } from '../transaction-details.service';
import { UtilsService } from 'src/app/utils.service';

export interface PreviousTransaction {
  sno: number;
  date: string;
  paidAmount: number;
  paymentMode: string;
}

export enum CardTypes {
  card = 'Card',
  cash = 'Cash'
}

let PREVIOUS_TRANSACTION_DETAILS: PreviousTransaction[] = [];

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  displayedColumns: string[] = ['sno', 'date', 'paidAmount', 'paymentMode'];
  paymentModes: string[] = [CardTypes.card, CardTypes.cash];
  dataSource = new MatTableDataSource(PREVIOUS_TRANSACTION_DETAILS);
  isCashPayment = false;
  patientDetails;
  paymentDetails;
  previousTransactions;
  paymentForm: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<PaymentComponent>,
              private formBuilder: FormBuilder,
              private transactionDetailsService: TransactionDetailsService) { }

  ngOnInit(): void {
    console.log(this.data);
    this.createPaymentForm();
    this.setPreviousTransaction();
    this.setPatientDetails();
  }

  createPaymentForm(): void {
    this.paymentForm = this.formBuilder.group({
      payableAmount: ['', Validators.required],
      paymentMode: ['', Validators.required],
      cardHolderName: ['', Validators.required],
      cardNumber: ['', Validators.required],
      expiry: ['', Validators.required],
      cvc: ['', Validators.required],
    });
  }

  setPatientDetails(): void {
    this.patientDetails = {
      patientName: this.data.patientDetails.name,
      patientID: this.data.patientDetails.id,
      ageGender: `${this.data.patientDetails.age}${this.getAgeType()}-${this.data.patientDetails.gender}`,
      totalAmount: TransactionDetailsUtils.getTotalAmount(this.data.medicalScanDetails),
      discount: TransactionDetailsUtils.getTotalDiscount(this.data.medicalScanDetails),
      paidAmount: TransactionDetailsUtils.getPaidAmount(this.data.paymentDetails),
      balanceAmount: TransactionDetailsUtils.getBalanceAmount(this.data.medicalScanDetails, this.data.paymentDetails),
      uuid: this.data.uuid.slice(0, 5)
    };
  }

  getAgeType(): string {
    return this.data.patientDetails.ageType === 'Years' ? 'Y' : 'M';
  }

  setPreviousTransaction(): void {
    if (this.data.paymentDetails) {
      PREVIOUS_TRANSACTION_DETAILS = this.data.paymentDetails.map(data => {
        return {
          sno: 1,
          date: data.paidDate,
          paidAmount: data.payableAmount,
          paymentMode: data.paymentMode
        };
      });
    } else {
      PREVIOUS_TRANSACTION_DETAILS = [];
    }

    this.dataSource = new MatTableDataSource(PREVIOUS_TRANSACTION_DETAILS);
  }

  openDatePicker(dp): void {
    dp.open();
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    const paymentForm = this.paymentForm;
    paymentForm.markAllAsTouched();

    this.isPayableAmountValid();

    if (paymentForm.valid) {
      this.transactionDetailsService.postPaymentDetails({paymentDetail: paymentForm.value, uuid: this.data.uuid}).subscribe(res => {
        console.log(res);
        this.dialogRef.close();
      });
    }
  }

  numberOnly(event): boolean {
    return UtilsService.numberOnly(event);
  }

  isPayableAmountValid(): boolean {
    const paymentForm = this.paymentForm;
    const totalAmount =  this.patientDetails.totalAmount;
    const balanceAmount =  this.patientDetails.balanceAmount;
    const minAmountToPay = totalAmount * 0.2;
    const payableAmountControl = paymentForm.get('payableAmount');
    const paymentAmount = payableAmountControl.value ? +payableAmountControl.value : 0;

    if (paymentAmount > balanceAmount) {
      this.setError(payableAmountControl, `Max. amount to pay is ${balanceAmount}`);
      return false;
    } else if (this.data.paymentDetails && this.data.paymentDetails.length === 2 && balanceAmount !== paymentAmount) {
      this.setError(payableAmountControl, `Min. amount to pay is ${balanceAmount}`);
      return false;
    } else if (paymentAmount < minAmountToPay && minAmountToPay < balanceAmount) {
      this.setError(payableAmountControl, `Min. amount to pay is ${minAmountToPay}`);
      return false;
    } else {
      payableAmountControl.setErrors(null);
      return true;
    }
  }

  setError(control, message): void {
    control.setErrors({
      error: {
        message
      }
    });
  }

  paymentModeChange(value: string): void {
    if (value === CardTypes.cash) {
      this.isCashPayment = true;
      this.clearCardPaymentValidation();
    } else {
      this.isCashPayment = false;
      this.addCardPaymentValidation();
    }
  }

  clearCardPaymentValidation(): void {
    const paymentForm = this.paymentForm;
    paymentForm.get('cardHolderName').clearValidators();
    paymentForm.get('cardNumber').clearValidators();
    paymentForm.get('expiry').clearValidators();
    paymentForm.get('cvc').clearValidators();

    paymentForm.get('cardHolderName').updateValueAndValidity();
    paymentForm.get('cardNumber').updateValueAndValidity();
    paymentForm.get('expiry').updateValueAndValidity();
    paymentForm.get('cvc').updateValueAndValidity();
  }

  addCardPaymentValidation(): void {
    const paymentForm = this.paymentForm;
    paymentForm.get('cardHolderName').setValidators([Validators.required, ]);
    paymentForm.get('cardNumber').setValidators([Validators.required, ]);
    paymentForm.get('expiry').setValidators([Validators.required, ]);
    paymentForm.get('cvc').setValidators([Validators.required, Validators.minLength(3), Validators.maxLength(3)]);

    paymentForm.get('cardHolderName').updateValueAndValidity();
    paymentForm.get('cardNumber').updateValueAndValidity();
    paymentForm.get('expiry').updateValueAndValidity();
    paymentForm.get('cvc').updateValueAndValidity();
  }

}
