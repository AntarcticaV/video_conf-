from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class User(Base):
    __tablename__ = 'User'
    id = Column(Integer, primary_key=True, autoincrement=True)
    nickname = Column(String(50), nullable=False)
    password_hash = Column(String(255), nullable=False)
    username = Column(String(255))
