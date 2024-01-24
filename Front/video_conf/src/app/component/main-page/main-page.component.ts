import { AfterContentInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { BasementComponent } from '../basement/basement.component';
import $api from '../../../http';
import { AuthorizationUser } from '../../../custom.type/index';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent, BasementComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPageComponent {}
