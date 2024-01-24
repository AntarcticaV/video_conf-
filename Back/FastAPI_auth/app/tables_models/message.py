from sqlalchemy import Column, Integer, Text, TIMESTAMP, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class Message(Base):
    __tablename__ = 'Message'
    id = Column(Integer, primary_key=True, autoincrement=True)
    content = Column(Text)
    timestamp = Column(TIMESTAMP)
    user_id = Column(Integer, ForeignKey('User.id'))
    group_id = Column(Integer, ForeignKey('Group.id'))

    user = relationship('User', backref='messages')
    group = relationship('Group', backref='messages')
