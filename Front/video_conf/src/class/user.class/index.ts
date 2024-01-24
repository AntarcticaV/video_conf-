import { IUser } from '../../interface/user.interface';

export class User implements IUser {
  nickname: string;
  password: string;

  constructor(nickname: string, password: string) {
    this.nickname = nickname;
    this.password = password;
  }
}
