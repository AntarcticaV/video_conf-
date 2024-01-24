from fastapi import APIRouter, Depends
from app.model.model_user import UserOut, UserInput
from app.repasitories.base_user import BaseUserRepasitories
from app.dependencies import get_user_repo

router = APIRouter()


@router.post('/post_creat_user', response_model=UserOut)
async def post_creat_user(user: UserInput, user_repo: BaseUserRepasitories = Depends(get_user_repo)):
    return await user_repo.post_creat_user(user)
