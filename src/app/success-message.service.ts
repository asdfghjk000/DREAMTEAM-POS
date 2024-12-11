import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuccessMessageService {
  private successMessageSubject = new BehaviorSubject<string>('');  // Store the message
  successMessage$ = this.successMessageSubject.asObservable(); // Observable to watch the message

  // Method to set the success message
  setSuccessMessage(message: string): void {
    this.successMessageSubject.next(message);
    
    // Clear the message after 5 seconds
    setTimeout(() => {
      this.successMessageSubject.next('');
    }, 5000); // 5 seconds
  }
}
