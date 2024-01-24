import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ButtonBackComponent } from '../button-back/button-back.component';
import {
  FormGroup,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import $api from '../.././../http/index';
import { User } from '../../../class/user.class/index';
import { RegistrationConfirm } from '../../../custom.type/index';
import { AxiosError } from 'axios';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonBackComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent {
  newUser: User = new User('', '');
  confirmPassword: string = '';
  chackPassword: boolean = false;
  chackCreateUser: boolean = true;
  constructor(private router: Router) {}

  isChackPassword() {
    if (this.newUser.password === this.confirmPassword) {
      this.chackPassword = true;
    } else {
      this.chackPassword = false;
    }
  }

  async creatUser() {
    try {
      const res: RegistrationConfirm | any =
        await $api.post<RegistrationConfirm>('/create_account', {
          nickname: this.newUser.nickname,
          password: this.newUser.password,
        });
      console.log(res);

      if (this.newUser.nickname == res.data.conUser.nickname) {
        this.chackCreateUser = true;
        localStorage.clear;
        localStorage.setItem('nickname', res.data.conUser.nickname);
        localStorage.setItem('password_hash', res.data.conUser.password_hash);
        localStorage.setItem('status', res.data.conUser.status);
        this.router.navigate(['/']);
      }
    } catch (ex) {
      this.chackCreateUser = false;
      console.log(this.chackPassword);
      console.log(ex);
    }
  }
}
