import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']  // Corrected styleUrl to styleUrls
})
export class ModalComponent {
  isVisible: boolean = false;

  @Output() closeEvent = new EventEmitter<void>();

  show() {
    this.isVisible = true;

    // Automatically close the modal after 5 seconds
    setTimeout(() => {
      this.closeModal();
    }, 5000);  // 5000ms = 5 seconds
  }

  closeModal() {
    this.isVisible = false;
    this.closeEvent.emit(); // Emit close event to parent component
  }
}
