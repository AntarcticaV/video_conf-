from fastapi import FastAPI
from app.routers import user_routers


def set_routers(app: FastAPI):
    app.include_router(user_routers.router, prefix="/user", tags=['User'])
    pass
