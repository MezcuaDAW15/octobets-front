import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export type AlertType = 'info' | 'success' | 'error' | 'confirm';

@Component({
  selector: 'app-alert-modal',
  imports: [CommonModule],
  templateUrl: './alert-modal.component.html',
  styleUrl: './alert-modal.component.scss'
})
export class AlertModalComponent {
  @Input() id!: string;
  @Input() title = '';
  @Input() message = '';
  @Input() type: AlertType = 'info';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  /** Gradiente según el tipo */
  get gradient() {
    switch (this.type) {
      case 'success': return 'from-success to-surface';
      case 'error': return 'from-danger to-surface';
      case 'confirm': return 'from-warning to-surface';
      default: return 'from-info to-surface';
    }
  }
}
