#!/usr/bin/env python3

# Standard library imports
import os
from datetime import datetime
from os import environ
from dotenv import load_dotenv
from functools import wraps

# Remote library imports
from flask import request, session, abort
from flask_restful import Resource, Api
from flask_migrate import Migrate
from flask_login import login_user, LoginManager, login_required, logout_user, current_user

# Local imports
from config import app, db, api
from models import User, Strategy, Team, Comment, Map

# Define a custom decorator
def login_required(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        # 'current_user' is set by Flask-Login's 'login_user()'
        if not current_user.is_authenticated:
            return {"message": "Please login first."}, 403  # HTTP 403 FORBIDDEN
        return func(*args, **kwargs)
    return decorated

# Database configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE = os.environ.get("DB_URI", f"sqlite:///{os.path.join(BASE_DIR, 'instance/app.db')}")
migration = Migrate(app, db)

#Secret key configuration
app.secret_key = environ.get('SECRET_KEY')

# Setting up the API
api=Api(app)

# Classes with RESTful methods
class SignupResource(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(email=data['email']).first()

        if user:
            return {"message": "User with this email already exists."}, 400

        new_user = User(
            username=data['username'],
            email=data['email'],
            password=data['password']
        )
        db.session.add(new_user)
        db.session.commit()
        return new_user.serialize(), 201

class LoginResource(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(username=data['username']).first()

        if user and user.check_password(data['password']):
            login_user(user)
            return {"message": "Logged in successfully"}, 200
        return {"message": "Invalid username or password"}, 401

class LogoutResource(Resource):
    @login_required
    def get(self):
        logout_user()
        return {"message": "Logged out successfully"}, 200

class UserResource(Resource):
    @login_required
    def get(self, id):
        user = User.query.get(id)
        if not user:
            abort(404, description="User not found.")
        return user.serialize()

    def post(self):
        data = request.get_json()
        new_user = User(
            username=data['username'],
            email=data['email'],
            password=data['password']
        )
        db.session.add(new_user)
        db.session.commit()
        return new_user.serialize(), 201

    @login_required
    def delete(self, id):
        user = User.query.get(id)
        if not user or user.id != current_user.id:
            abort(404, description="User not found.")
        db.session.delete(user)
        db.session.commit()
        return {"message": "User deleted successfully"}, 200

class StrategyResource(Resource):
    @login_required
    def get(self, id):
        strategy = Strategy.query.get(id)
        if not strategy:
            abort(404, description="Strategy not found.")
        return strategy.serialize()

    @login_required
    def post(self):
        data = request.get_json()
        new_strategy = Strategy(
            title=data['title'],
            content=data['content'],
            map_id=data['map_id'],
            user_id=current_user.id  
        )
        db.session.add(new_strategy)
        db.session.commit()
        return new_strategy.serialize(), 201

    @login_required
    def delete(self, id):
        strategy = Strategy.query.get(id)
        if not strategy or strategy.user_id != current_user.id:
            abort(404, description="Strategy not found.")
        db.session.delete(strategy)
        db.session.commit()
        return {"message": "Strategy deleted successfully"}, 200

class TeamResource(Resource):
    @login_required
    def get(self, id):
        team = Team.query.get(id)
        if not team:
            abort(404, description="Team not found.")
        return team.serialize()

    @login_required
    def post(self):
        data = request.get_json()
        new_team = Team(
            name=data['name'],
            game=data['game']
        )
        db.session.add(new_team)
        db.session.commit()
        return new_team.serialize(), 201

    @login_required
    def delete(self, id):
        team = Team.query.get(id)
        if not team:
            abort(404, description="Team not found.")
        db.session.delete(team)
        db.session.commit()
        return {"message": "Team deleted successfully"}, 200

class CommentResource(Resource):
    @login_required
    def get(self, id):
        comment = Comment.query.get(id)
        if not comment:
            abort(404, description="Comment not found.")
        return comment.serialize()

    @login_required
    def post(self):
        data = request.get_json()
        new_comment = Comment(
            content=data['content'],
            user_id=current_user.id,
            strategy_id=data['strategy_id']
        )
        db.session.add(new_comment)
        db.session.commit()
        return new_comment.serialize(), 201

    @login_required
    def delete(self, id):
        comment = Comment.query.get(id)
        if not comment or comment.user_id != current_user.id:
            abort(404, description="Comment not found.")
        db.session.delete(comment)
        db.session.commit()
        return {"message": "Comment deleted successfully"}, 200

# Registering resources with the API
api.add_resource(LoginResource, '/login')
api.add_resource(LogoutResource, '/logout')
api.add_resource(SignupResource, '/signup')
api.add_resource(UserResource, '/user/<int:id>')
api.add_resource(StrategyResource, '/strategy/<int:id>')
api.add_resource(TeamResource, '/team/<int:id>')
api.add_resource(CommentResource, '/comment/<int:id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)
