from flask import Flask
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, TIMESTAMP
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy import MetaData
from flask_sqlalchemy import SQLAlchemy
import flask_bcrypt as bcrypt
from datetime import datetime 


from config import db

# Models go here!

convention = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}

metadata = MetaData(naming_convention=convention)

strategy_team_association_table = db.Table('strategy_teams',
    db.Column('strategy_id', db.Integer, db.ForeignKey('strategies.id'), primary_key=True),
    db.Column('team_id', db.Integer, db.ForeignKey('teams.id'), primary_key=True),
)

team_members = db.Table('team_members',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('team_id', db.Integer, db.ForeignKey('teams.id'), primary_key=True)
)

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    is_active = db.Column(db.Boolean(), nullable=False, default=True)
    username = db.Column(db.String(128), unique=True, nullable=False)
    email = db.Column(db.String(128), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    
    strategies = db.relationship('Strategy', backref='user', lazy=True)
    teams = db.relationship('Team', secondary=team_members, backref=db.backref('users', lazy='dynamic'))
    comments = db.relationship('Comment', backref='user', lazy=True)
    
    def serialize(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'strategies': [strategy.serialize() for strategy in self.strategies],
            'teams': [team.serialize() for team in self.teams],
            'comments': [comment.serialize() for comment in self.comments]
        }

    @property
    def is_active(self):
        return True

    @property
    def is_anonymous(self):
        return False

    def get_id(self):
        return str(self.id)
    
    @property
    def password(self):
        raise AttributeError('password: write-only field')

    @password.setter
    def password(self, password):
        self.password_plaintext = password
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    # username validation
    @validates('username')
    def validate_username(self, key, username):
        if not username:
            raise AssertionError('No username provided')

        if User.query.filter(User.username == username).first():
            raise AssertionError('Username is already in use')

        return username

    # email validation
    @validates('email')
    def validate_email(self, key, email):
        if not email:
            raise AssertionError('No email provided')

        if User.query.filter(User.email == email).first():
            raise AssertionError('Email is already in use')

        return email

    # password validation
    @validates('password_hash')
    def validate_password(self, key, password_hash):
        password = self.password_plaintext
        if not password:
            raise AssertionError('Password not provided')

        if len(password) < 8 or len(password) > 32:
            raise AssertionError('Password must be between 8 and 32 characters')

        return password_hash
    
class Team(db.Model, SerializerMixin):
    __tablename__ = 'teams'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    # Many to Many relationship
    strategies = db.relationship('Strategy', secondary=strategy_team_association_table, back_populates="teams", lazy='dynamic')


class Map(db.Model, SerializerMixin):
    __tablename__ = 'maps'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    # One to Many relationship
    strategies = db.relationship('Strategy', backref='map', lazy=True)

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'strategies': [strategy.serialize() for strategy in self.strategies],
        }


class Strategy(db.Model, SerializerMixin):
    __tablename__ = 'strategies'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(TIMESTAMP, nullable=False)
    # Foreign Keys
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))  # the creator of the strategy
    map_id = db.Column(db.Integer, db.ForeignKey('maps.id'))
    # One to Many relationship
    comments = db.relationship('Comment', backref='strategy', lazy=True)
    # Many to Many relationship
    teams = db.relationship('Team', secondary=strategy_team_association_table, back_populates="strategies", lazy='dynamic')

    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),  # assuming it is a datetime object
            'user_id': self.user_id,
            'map_id': self.map_id,
            'comments': [comment.serialize() for comment in self.comments],
            'teams': [team.serialize() for team in self.teams],
        }

class Comment(db.Model, SerializerMixin):
    __tablename__ = 'comments'
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(TIMESTAMP, nullable=False)
    # Foreign Keys
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    strategy_id = db.Column(db.Integer, db.ForeignKey('strategies.id'))

    def serialize(self):
        return {
            'id': self.id,
            'content': self.content,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),  # assuming it is a datetime object
            'user_id': self.user_id,
            'strategy_id': self.strategy_id,
        }


