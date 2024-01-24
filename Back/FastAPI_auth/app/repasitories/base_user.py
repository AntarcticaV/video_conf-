from app.model.model_user import User


class BaseUserRepasitories:

    async def post_creat_user(self, nickname: str, password_hash: str, username: str | None):
        raise NotImplementedError
