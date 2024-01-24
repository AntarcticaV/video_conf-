-- CreateEnum
CREATE TYPE "Status" AS ENUM ('USER', 'GUEST');

-- CreateTable
CREATE TABLE "Attachment" (
    "id" SERIAL NOT NULL,
    "message_id" INTEGER,
    "type" VARCHAR(50),
    "url" VARCHAR(255),

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "content" TEXT,
    "timestamp" TIMESTAMP(6),
    "user_id" INTEGER,
    "group_id" INTEGER,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "nickname" VARCHAR(50) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "username" VARCHAR(255),
    "status" "Status" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_nickname_key" ON "User"("nickname");

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "Message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
