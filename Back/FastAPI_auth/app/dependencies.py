from app.repasitories.user import UserTmpRepasitories

TMP_USER_REPASITORIES = UserTmpRepasitories()


def get_user_repo() -> UserTmpRepasitories:
    return TMP_USER_REPASITORIES
