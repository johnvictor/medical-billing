import {AfterViewInit, OnInit, Component, ViewChild, Input, Output, EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { BillingMaster, ModalitySlot } from '../model/medical-scan.model';

export interface MedicalScanDetails {
  sno: number;
  scanName: string;
  scanAmount: number;
  discount: number;
  totalAmount: number;
}


@Component({
  selector: 'app-medical-scan-details',
  templateUrl: './medical-scan-details.component.html',
  styleUrls: ['./medical-scan-details.component.scss']
})
export class MedicalScanDetailsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @Output() medicalScanAdded = new EventEmitter();
  medicalScanDetails: MedicalScanDetails[] = [];

  displayedColumns: string[] = ['sno', 'scanName', 'scanAmount', 'discount', 'totalAmount', 'symbol'];
  dataSource = new MatTableDataSource(this.medicalScanDetails);
  billingMaster: BillingMaster[];
  modalitySlot: ModalitySlot[];
  scanList: string[];
  addScanForm: FormGroup;
  scanAmount: number;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.addScanForm = this.formBuilder.group({
      scanName: ['', Validators.required],
      discount: ['', Validators.required]
    });

    this.getMedicalBillingMaster();
    this.getModalitySlotDetails();
  }

  getMedicalBillingMaster(): void {
    this.billingMaster = [{
      medicalBilling: 'CT BRAIN',
      scanAmount: 2000,
      maxDiscount: '100 INR ',
      modality: 'CT'
    },
    {
      medicalBilling: 'MRI BRAIN',
      maxDiscount: '300 INR ',
      scanAmount: 2500,
      modality: 'MRI'
    },
    {
      medicalBilling: 'GLUCOSE FASTING',
      maxDiscount: '10%',
      scanAmount: 1500,
      modality: 'LAB'
    }];
    this.scanList = this.billingMaster.map(bm => bm.medicalBilling);
  }

  getModalitySlotDetails(): void {
    this.modalitySlot = [{
      noOfSlotsPerDay: 7,
      modality: 'CT'
    },
    {
      noOfSlotsPerDay: 6,
      modality: 'MRI'
    },
    {
      noOfSlotsPerDay: null,
      modality: 'LAB'
    }];
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  onScanSelect(value): void {
    value = value.trim();
    const scanName = this.scanList.find(scan => scan === value);

    if (!scanName) {
      this.addScanForm.get('scanName').setValue('');
      this.scanAmount = null;
    } else {
      this.addScanForm.get('scanName').setValue(value);
      this.setScanAmount(scanName);
    }

  }

  setScanAmount(scanName): void {
    const { scanAmount } = this.billingMaster.find(scan => scan.medicalBilling === scanName);
    this.scanAmount = scanAmount;
  }

  addScan(): void {
    const form = this.addScanForm;
    form.markAllAsTouched();

    if (form.valid) {
      const scanName = form.get('scanName').value;
      const discount = form.get('discount');
      const scanDetails = this.billingMaster.find(scan => scan.medicalBilling === scanName);
      const isValidDiscount = this.validateDiscount(discount.value, scanDetails);

      if (isValidDiscount) {
        discount.setErrors(null);

        const medicalScanDetails: MedicalScanDetails = {
          discount: discount.value,
          scanAmount: scanDetails.scanAmount,
          scanName,
          sno: this.medicalScanDetails.length + 1,
          totalAmount: scanDetails.scanAmount - (+discount.value)
        };
        this.medicalScanDetails = [...this.medicalScanDetails, medicalScanDetails];
        this.medicalScanAdded.emit(this.medicalScanDetails);
        this.dataSource = new MatTableDataSource(this.medicalScanDetails);

        this.clearFormFields();
      } else {
        discount.setErrors({error: true});
      }
    }
  }

  clearFormFields(): void {
    this.addScanForm.reset();
    this.scanAmount = null;
  }

  deleteScan(index: number): void {
    this.medicalScanDetails.splice(index, 1);
    this.dataSource = new MatTableDataSource([...this.medicalScanDetails]);
    this.medicalScanAdded.emit(this.medicalScanDetails);
  }

  validateDiscount(disCount: number, scanDetails: BillingMaster): boolean {
    switch (scanDetails.medicalBilling) {
      case 'CT BRAIN':
        return disCount > 0 && disCount <= 100;

      case 'MRI BRAIN':
        return disCount > 0 && disCount <= 300;

      case 'GLUCOSE FASTING':
        return disCount > 0 && disCount <= scanDetails.scanAmount * 0.1;
    }
  }
}
