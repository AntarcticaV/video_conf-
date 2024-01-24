import { AfterContentInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthorizationUser } from '../../../custom.type';
import $api from '../../../http';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements AfterContentInit {
  checkUser: boolean = false;
  userNick: string = '';

  constructor(private router: Router) {}

  async ngAfterContentInit(): Promise<void> {
    try {
      const res: AuthorizationUser | any = await $api.post<AuthorizationUser>(
        '/authorization_again',
        {
          nickname: localStorage.getItem('nickname'),
          password: localStorage.getItem('password_hash'),
        }
      );

      this.userNick = res.data.conUser.nickname;
      this.checkUser = true;
    } catch (ex) {
      this.checkUser = false;
      console.warn(ex);
    }
  }

  confCreate() {
    if (localStorage.getItem('nickname')) {
      this.router.navigate(['/video_conf']);
    }
  }

  async singOut() {
    console.log('adda');

    localStorage.clear();
    location.reload();
  }
}
