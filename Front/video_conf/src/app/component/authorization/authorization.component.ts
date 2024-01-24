import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ButtonBackComponent } from '../button-back/button-back.component';
import { FormsModule } from '@angular/forms';
import { User } from '../../../class/user.class';
import $api from '../../../http';
import { AuthorizationUser, RegistrationConfirm } from '../../../custom.type';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-authorization',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    ButtonBackComponent,
    FormsModule,
  ],
  templateUrl: './authorization.component.html',
  styleUrl: './authorization.component.scss',
})
export class AuthorizationComponent {
  user: User = new User('', '');
  statusUser: boolean = true;
  private router: Router = new Router();

  async chackUser() {
    try {
      const res: AuthorizationUser | any = await $api.post<AuthorizationUser>(
        '/authorization',
        {
          nickname: this.user.nickname,
          password: this.user.password,
        }
      );

      console.log(res);
      if (res.data.out) {
        localStorage.clear;
        localStorage.setItem('nickname', res.data.conUser.nickname);
        localStorage.setItem('password_hash', res.data.conUser.password_hash);
        localStorage.setItem('status', res.data.conUser.status);
        this.router.navigate(['/']);
      } else {
        this.statusUser = false;
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  async createGuest() {
    try {
      const res: RegistrationConfirm | any =
        await $api.post<RegistrationConfirm>('create_guest', {});

      console.log(res);
      if (res.data) {
        this.router.navigate(['/']);
      } else {
        this.statusUser = false;
      }
    } catch (ex) {
      console.log(ex);
    }
  }
}
