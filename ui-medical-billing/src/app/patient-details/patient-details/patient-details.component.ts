import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/utils.service';
import { MedicalScanDetails } from '../medical-scan-details/medical-scan-details.component';
import { PatientDetailsService } from '../patient-details.service';

enum SalutationType {
  mr = 'Mr',
  mrs = 'Mrs'
}

enum GenderType {
  male = 'Male',
  female = 'Female'
}

enum AgeType {
  years = 'Years',
  months = 'Months'
}


@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.scss']
})

export class PatientDetailsComponent implements OnInit {
  salutations = [SalutationType.mr, SalutationType.mrs];
  ageTypes = [AgeType.years, AgeType.months];
  countries = [
    'Australia',
    'China',
    'Dubai',
    'India',
    'Malasia',
    'Singapore',
    'USA'
  ];
  medicalScanDetails: MedicalScanDetails[] = [];
  genders = [{
    label: GenderType.male,
    checked: false
  }, {
    label: GenderType.female,
    checked: false
  }];
  medicalScanError: string;
  patientDetialsForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private patientDetailsService: PatientDetailsService,
              private router: Router) { }

  ngOnInit(): void {
    this.patientDetialsForm = this.formBuilder.group({
      salutation: ['', Validators.required],
      name: ['', Validators.required],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      age: ['', Validators.required],
      ageType: ['', Validators.required],
      appointmentDate: ['', Validators.required],
      phoneNo: ['', [Validators.required, Validators.pattern(/[0-9]+/)]],
      streetAddress1: ['', Validators.required],
      streetAddress2: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required]
    });
  }

  submitForm(): void {
    this.patientDetialsForm.markAllAsTouched();

    if (this.patientDetialsForm.valid) {
      if (this.isMedicalScanValid()) {
        const payload = { patientDetails: this.patientDetialsForm.value, medicalScanDetails: this.medicalScanDetails};
        this.patientDetailsService.savePatientDetails(payload).subscribe(res => {
          this.router.navigate(['/transaction-details']);
        });
      }
    } else {}
  }

  isMedicalScanValid(): boolean {
    if (!this.medicalScanDetails.length) {
      this.medicalScanError = 'At least one medical billing should be selected in the list';
      return false;
    } else {
      this.medicalScanError = '';
      return true;
    }
  }

  salutionChange(value: string): void {
    this.setGenderBySalutation(value);
  }

  genderChange(value: string): void {
    this.setSalutationByGender(value);
  }

  setGenderBySalutation(salutation: string): void {
    this.genders[0].checked = false;
    this.genders[1].checked = false;

    if (salutation === SalutationType.mr) {
      this.genders[0].checked = true;
      this.patientDetialsForm.get('gender').setValue(GenderType.male);
    } else {
      this.genders[1].checked = true;
      this.patientDetialsForm.get('gender').setValue(GenderType.female);
    }
  }

  setSalutationByGender(gender: string): void {
    if (gender === GenderType.male) {
      this.patientDetialsForm.get('salutation').setValue(SalutationType.mr);
    } else {
      this.patientDetialsForm.get('salutation').setValue(SalutationType.mrs);
    }
  }

  numberOnly(event): boolean {
    return UtilsService.numberOnly(event);
  }

  setAge(dob): void {
    const dobControl = this.patientDetialsForm.get('dob');

    if (this.isNotFutureDate(dob)) {
      this.patientDetialsForm.get('age').setValue(this.calculateAge(dob, new Date()));
      dobControl.setErrors(null);
    } else {
      dobControl.setErrors({error: true});
    }
  }

  validateFutureDate(appointmentDate): void {
    const appointmentDateControl = this.patientDetialsForm.get('appointmentDate');

    if (this.isNotFutureDate(appointmentDate)) {
      console.log('not future date');
      appointmentDateControl.setErrors(null);
    } else {
      appointmentDateControl.setErrors({error: true});
    }
  }

  isNotFutureDate(date): boolean {
    return new Date(date) < new Date();
  }

  calculateAge(birthDate, otherDate): number {
    const ageType = this.patientDetialsForm.get('ageType');
    const age = this.patientDetialsForm.get('age');

    if (!ageType.value || ageType.value === AgeType.years) {
      ageType.setValue(AgeType.years);
      return this.getAgeInYears(birthDate, otherDate);
    } else {
      return this.getAgeInMonths(birthDate, otherDate);
    }
  }

  getAgeInYears(birthDate, today): number {
    birthDate = new Date(birthDate);
    let years = (today.getFullYear() - birthDate.getFullYear());
    if (today.getMonth() < birthDate.getMonth() ||
      today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate()) {
      years--;
    }
    return years;
  }

  getAgeInMonths(birthDate, today): number {
    let months;
    months = (today.getFullYear() - birthDate.getFullYear()) * 12;
    months -= birthDate.getMonth();
    months += today.getMonth();
    return months <= 0 ? 0 : months;
  }

  ageTypeChange(value: string): void {
    const dob = this.patientDetialsForm.get('dob').value;

    if (dob) {
      this.setAge(dob);
    }
  }

  medicalScanAdded(value): void {
    this.medicalScanDetails = value;
    this.isMedicalScanValid();
  }
}
