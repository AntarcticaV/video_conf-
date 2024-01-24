import { Context, Hono } from "hono";
import { prisma } from "../prisma_connect/index";
import { AuthAgain, InputUser } from "../interfaces/user_interfaces";
import * as bcrypt from "bcrypt";
import {
  NotFoundError,
  PrismaClientKnownRequestError,
} from "@prisma/client/runtime/library";
import { Prisma, User } from "@prisma/client";
import { RegistrationConfirm } from "../custom.rype";

const routersUser = new Hono();

routersUser.get("/test", (c) => {
  return c.json({ hi: "HI" });
});

routersUser.post("/create_account", async (context) => {
  const body: InputUser = await context.req.json();
  console.log(body);

  const passwordHash: string = await bcrypt.hash(body.password, 10);
  try {
    const user: User = await prisma.user.create({
      data: {
        nickname: body.nickname,
        password_hash: passwordHash,
        status: "USER",
      },
    });
    const conUser: RegistrationConfirm = {
      nickname: user.nickname,
      password_hash: user.password_hash,
      status: user.status,
    };
    return await context.json({ conUser });
  } catch (ex) {
    handleError(ex, context);
  }
});

routersUser.post("/authorization_again", async (context) => {
  const body: AuthAgain = await context.req.json();
  try {
    const user = prisma.user.findFirstOrThrow({
      where: { nickname: body.nickname },
    });
    const out: boolean = (await user).password_hash === body.password_hash;

    return await context.json({
      out: out,
      conUser: {
        nickname: (await user).nickname,
        password_hash: (await user).password_hash,
        status: (await user).status,
      },
    });
  } catch (ex) {
    handleError(ex, context);
  }
});

routersUser.post("/authorization", async (context) => {
  const body: InputUser = await context.req.json();
  try {
    const user = prisma.user.findFirstOrThrow({
      where: { nickname: body.nickname },
    });

    return await context.json({
      out: await bcrypt.compare(body.password, (await user).password_hash),
      conUser: {
        nickname: (await user).nickname,
        password_hash: (await user).password_hash,
        status: (await user).status,
      },
    });
  } catch (ex) {
    handleError(ex, context);
  }
});

routersUser.post("/create_guest", async (context) => {
  try {
    const passwordHash: string = await bcrypt.hash(
      (Math.random() * (99999999999 - 10000000000) - 10000000000).toString(),
      10
    );
    const guest = await prisma.user.create({
      data: {
        nickname:
          "guest" + (Math.random() * (999999 - 100000) - 100000).toString(),
        password_hash: passwordHash,
        status: "GUEST",
      },
    });
    const conUser: RegistrationConfirm = {
      nickname: guest.nickname,
      password_hash: guest.password_hash,
      status: guest.status,
    };
    return await context.json({ conUser });
  } catch (ex) {
    handleError(ex, context);
  }
});

function handleError(ex: any, context: any) {
  if (ex instanceof PrismaClientKnownRequestError) {
    return context.json({ out: ex.name });
  } else {
    return context.json(ex);
  }
}

export default routersUser;
