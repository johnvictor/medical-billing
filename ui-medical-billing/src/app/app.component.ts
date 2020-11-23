import { Component } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  selectedTabIndex: number;

  routeConfig = [{
    label: 'Patient Details',
    path: '/patient-details',
    index: 0
  }, {
    label: 'Billing Transaction',
    path: '/transaction-details',
    index: 1
  }];

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.setActiveTab();
  }

  tabClick(event: MatTabChangeEvent): void {
    this.router.navigate([this.routeConfig[event.index].path]);
  }

  setActiveTab(): void {
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd){
        const route = this.routeConfig.find(r => r.path === this.router.url);
        if (route) {
          this.selectedTabIndex = route.index;
        }
      }
    });
  }
}
