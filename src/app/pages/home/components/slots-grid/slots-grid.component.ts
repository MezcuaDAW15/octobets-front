import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-slots-grid',
  imports: [CommonModule],
  templateUrl: './slots-grid.component.html',
  styleUrl: './slots-grid.component.scss'
})
export class SlotsGridComponent {
  slots = Array(4);


}
