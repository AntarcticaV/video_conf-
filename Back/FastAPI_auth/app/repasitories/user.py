from app.model.model_user import UserOut, UserInput
from app.repasitories.base_user import BaseUserRepasitories
from app.function.convert_to_sha256 import convert_to_sha256
from core.postgres_connect import session
from app.tables_models.user import User
from sqlalchemy import select


class UserTmpRepasitories(BaseUserRepasitories):

    async def post_creat_user(self, user_input: UserInput) -> UserOut:
        print("dsf")
        query = select(User).where(User.nickname.in_([user_input.nickname]))
        response = session.scalars(query)
        print(response)
        if response.nickname != None:
            print("dsf")
            password_hash = convert_to_sha256(user_input.password)
            if user_input.username != None:
                new_user = User(
                    nickname=user_input.nickname,
                    password_hash=password_hash,
                    username=user_input.nickname
                )
                session.add(new_user)
            else:
                new_user = User(
                    nickname=user_input.nickname,
                    password_hash=password_hash
                )
                session.add(new_user)
                session.commit()
            print("dsf")
            user_out = session.query(User).filter_by(
                User.nickname == user_input.nickname).first()
            print(user_out)
            return await UserOut.convert(user_out)
