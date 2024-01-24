from pydantic import BaseModel


class User(BaseModel):
    id: int
    nickname: str
    password_hash: str
    username: str | None


class UserInput(BaseModel):
    nickname: str
    password: str
    username: str | None


class UserOut(User):

    @staticmethod
    async def convert(orig: User):
        ret = UserOut(
            nickname=orig.nickname,
            password_hash=orig.password_hash,
            username=orig.username
        )
        return ret
