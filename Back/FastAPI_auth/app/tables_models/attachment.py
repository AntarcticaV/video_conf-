from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class Attachment(Base):
    __tablename__ = 'Attachment'
    id = Column(Integer, primary_key=True, autoincrement=True)
    message_id = Column(Integer, ForeignKey('Message.id'))
    type = Column(String(50))
    url = Column(String(255))

    message = relationship('Message', backref='attachments')
