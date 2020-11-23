import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'patient-details',
    loadChildren: () => import('./patient-details/patient-details.module').then(m => m.PatientDetailsModule)
  },
  {
    path: 'transaction-details',
    loadChildren: () => import('./transaction-details/transaction-details.module').then(m => m.TransactionDetailsModule)
  },
  {
    path: '**', redirectTo: '/patient-details'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
