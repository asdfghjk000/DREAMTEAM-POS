import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private refreshSubject = new Subject<void>();

  refreshDashboard$ = this.refreshSubject.asObservable();

  triggerDashboardRefresh() {
    this.refreshSubject.next();
  }
}
