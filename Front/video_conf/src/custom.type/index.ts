export type RegistrationConfirm = {
  conUser: {
    nickname: string;
    password_hash: string;
    status: Status;
  };
};

enum Status {
  USER,
  GUEST,
}

export type AuthorizationUser = {
  out: boolean;
  conUser: {
    nickname: string;
    password_hash: string;
    status: Status;
  };
};
