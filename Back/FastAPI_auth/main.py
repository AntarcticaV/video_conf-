from fastapi import FastAPI
from dotenv import load_dotenv
import os
from core.router import set_routers
from core.postgres_connect import session
from contextlib import asynccontextmanager

load_dotenv("./env")


@asynccontextmanager
async def lifespan(app: FastAPI):
    set_routers(app)
    yield
    session.close()


app = FastAPI(lifespan=lifespan)


@app.get("/")
async def root():
    return {"message": "Hello World"}

if __name__ == "__main__":
    uvicorn.run("main:app", port=os.getenv('POST'),
                host=os.getenv('HOST'), reload=True)
