import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stream',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stream.component.html',
  styleUrl: './stream.component.scss',
})
export class StreamComponent {
  videoOption: MediaTrackConstraints = {
    width: 640,
    height: 480,
    facingMode: 'user',
  };
}
