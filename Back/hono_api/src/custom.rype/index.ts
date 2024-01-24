import { $Enums } from "@prisma/client";

export type RegistrationConfirm = {
  nickname: string;
  password_hash: string;
  status: $Enums.Status;
};
