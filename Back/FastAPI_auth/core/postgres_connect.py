from dotenv import load_dotenv
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

load_dotenv("./.env")

engine = create_engine(os.getenv("DB_URL"))

Session = sessionmaker(bind=engine)
session = Session()
