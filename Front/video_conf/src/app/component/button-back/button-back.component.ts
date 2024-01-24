import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-button-back',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './button-back.component.html',
  styleUrl: './button-back.component.scss',
})
export class ButtonBackComponent {}
