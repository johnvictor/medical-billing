import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientDetailsRoutingModule } from './patient-details-routing.module';
import { MedicalScanDetailsComponent } from './medical-scan-details/medical-scan-details.component';
import { PatientDetailsComponent } from './patient-details/patient-details.component';
import { ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [MedicalScanDetailsComponent, PatientDetailsComponent],
  imports: [
    CommonModule,
    PatientDetailsRoutingModule,
    ReactiveFormsModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    MatDatepickerModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatNativeDateModule,
    MatCardModule,
    MatSortModule,
    MatIconModule,
    MatTableModule
  ]
})

export class PatientDetailsModule { }
