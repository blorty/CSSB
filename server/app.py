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
from flask_login import login_user, UserMixin, LoginManager, login_required, logout_user, current_user
from sqlalchemy import join
from sqlalchemy.orm import joinedload


# Local imports
from config import app, db, api
from models import Strategy, Team, Comment, Map, User

import logging

@app.errorhandler(Exception)
def handle_exception(e):
    # pass through HTTP errors
    if isinstance(e, HTTPException):
        return e

    # now you're handling non-HTTP exceptions only
    app.logger.error(e)

    return jsonify(error=str(e)), 500

# Define a custom decorator
def login_required(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        # 'current_user' is set by Flask-Login's 'login_user()'
        if not current_user.is_authenticated:
            return {"message": "Please login first."}, 403  # HTTP 403 FORBIDDEN
        return func(*args, **kwargs)
    return decorated

def custom_login_required(func):
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

# Setup Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

def get_user(id):
    return User.query.options(joinedload('strategies')).get(id)

# Classes with RESTful methods
class SignupResource(Resource):
    def post(self):
        try:
            data = request.get_json()
            user = User.query.filter_by(email=data['email']).first()

            print(f"User: {user}")

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
        except Exception as e:
            app.logger.error(f"Error in SignupResource: {e}")
            return jsonify(error=str(e)), 500


class LoginResource(Resource):
    def post(self):
        try:
            data = request.get_json()
            user = User.query.filter_by(username=data['username']).first()

            if user and user.check_password(data['password']):
                login_user(user)
                return {"message": "Logged in successfully"}, 200
            else:
                return {"message": "Invalid username or password"}, 401
        except Exception as e:
            app.logger.error(f"Error in LoginResource: {e}")
            return {"message": str(e)}, 500


class LogoutResource(Resource):
    def post(self):
        logout_user()
        return {"message": "Logged out successfully"}, 200

# ^^^^ User Signup/Login/Logout ^^^^

class UserResource(UserMixin, Resource):
    @custom_login_required
    def get(self, id):
        if current_user.id != id:
            abort(403, description="Unauthorized action.")
        user = User.query.filter(User.id == id, User.deleted_at.is_(None)).first()
        if not user:
            abort(404, description="User not found.")
        return user.serialize()
    
    @custom_login_required
    def put(self, id):
        if current_user.id != id:
            abort(403, description="Unauthorized action.")
        data = request.get_json()
        User.query.filter_by(id=id).update(data)
        db.session.commit()
        return {"message": "User updated successfully"}, 200
        
    @custom_login_required
    def delete(self, id):
        if current_user.id != id:
            abort(403, description="Unauthorized action.")
        user = User.query.filter(User.id == id, User.deleted_at.is_(None)).first()
        if not user:
            abort(404, description="User not found.")
        user.delete()
        return {'message': 'User deleted'}, 200
    
# ^^^^ User CRUD ^^^^
    
class StrategiesResource(Resource):
    @login_required
    def get(self, id=None):
        if id is None:
            # Get all strategies
            try:
                strategies = db.session.query(Strategy, Map).join(Map, Strategy.map_id==Map.id).all()
                print(strategies)  # <-- Add print statement here
                return {'strategies': [{'strategy': strategy.serialize(), 'map': map.serialize()} for strategy, map in strategies]}
            except Exception as e:
                app.logger.error(f"Error getting all strategies: {e}")
                return {"message": str(e)}, 500
        else:
            # Get a specific strategy
            try:
                strategy = Strategy.query.get(id)
                if not strategy:
                    return {"message": "Strategy not found"}, 404
                return strategy.serialize()
            except Exception as e:
                app.logger.error(f"Error getting strategy {id}: {e}")
                return {"message": str(e)}, 500

    @login_required
    def post(self):
        data = request.get_json()
        if 'team_id' in data:
            team = Team.query.get(data['team_id'])
            if not team or current_user.id not in [user.id for user in team.users]:
                return {"message": "You are not part of the team."}, 403
        try:
            new_strategy = Strategy(
                title=data['title'],
                content=data['content'],
                map_id=data['map_id'],
                user_id=current_user.id,
                team_id=data.get('team_id', None)  # if team_id is not provided, it will be None
            )
            db.session.add(new_strategy)
            db.session.commit()
            return new_strategy.serialize(), 201
        except Exception as e:
            app.logger.error(f"Error creating strategy: {e}")
            return {"message": str(e)}, 500

    @login_required
    def put(self, id):
        strategy = Strategy.query.get(id)
        if not strategy or strategy.user_id != current_user.id:
            return {"message": "Only the creator of a strategy can update it."}, 403
        data = request.get_json()
        try:
            Strategy.query.filter_by(id=id).update(data)
            db.session.commit()
            return {"message": "Strategy updated successfully"}, 200
        except Exception as e:
            app.logger.error(f"Error updating strategy {id}: {e}")
            return {"message": str(e)}, 500

    @login_required
    def delete(self, id):
        strategy = Strategy.query.get(id)
        if not strategy or strategy.user_id != current_user.id:
            return {"message": "Only the creator of a strategy can delete it."}, 403
        try:
            db.session.delete(strategy)
            db.session.commit()
            return {"message": "Strategy deleted successfully"}, 200
        except Exception as e:
            app.logger.error(f"Error deleting strategy {id}: {e}")
            return {"message": str(e)}, 500


# ^^^^ Strategy CRUD ^^^^

class TeamResource(Resource):
    @login_required
    def get(self, id):
        team = Team.query.get(id)
        if not team:
            abort(404, description="Team not found.")
        return team.serialize()
    
    @login_required
    def put(self, id):
        team = Team.query.get(id)
        if not team or team.owner_id != current_user.id:
            abort(403, description="Only the team owner can update the team.")
        data = request.get_json()
        Team.query.filter_by(id=id).update(data)
        db.session.commit()
        return {"message": "Team updated successfully"}, 200

    @login_required
    def post(self):
        data = request.get_json()
        new_team = Team(
            name=data['name'],
            game=data['game'],
            owner_id=current_user.id  # Set the current user as the owner
        )
        db.session.add(new_team)
        db.session.commit()
        return new_team.serialize(), 201

    @login_required
    def delete(self, id):
        team = Team.query.get(id)
        if not team or team.owner_id != current_user.id:
            abort(403, description="Only the team owner can delete the team.")
        db.session.delete(team)
        db.session.commit()
        return {"message": "Team deleted successfully"}, 200
    
class TeamInviteResource(Resource):
    @login_required
    def post(self):
        data = request.get_json()
        team = Team.query.get(data['team_id'])
        if team.owner_id != current_user.id:
            abort(403, description="Only the team owner can invite users.")
        if len(team.users) >= 5:
            abort(400, description="Maximum team size reached.")
        user_to_invite = User.query.get(data['user_id'])
        team.users.append(user_to_invite)
        db.session.commit()
        return {"message": "User successfully invited to the team."}, 200
    
class TeamKickResource(Resource):
    @login_required
    def post(self):
        data = request.get_json()
        team = Team.query.get(data['team_id'])
        if team.owner_id != current_user.id:
            abort(403, description="Only the team owner can kick users.")
        user_to_kick = User.query.get(data['user_id'])
        team.users.remove(user_to_kick)
        db.session.commit()
        return {"message": "User successfully kicked from the team."}, 200
    
# ^^^^ Team CRUD ^^^^

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

# ^^^^ Comment CRUD ^^^^

# Registering resources with the API
api.add_resource(LoginResource, '/login')
api.add_resource(LogoutResource, '/logout')
api.add_resource(SignupResource, '/signup')
api.add_resource(TeamInviteResource, '/team/invite')
api.add_resource(TeamKickResource, '/team/kick')
api.add_resource(StrategiesResource, '/strategies', '/strategies/<int:id>')
api.add_resource(UserResource, '/profile/<int:id>')
api.add_resource(TeamResource, '/team/<int:id>')
api.add_resource(CommentResource, '/comment/<int:id>')

@app.errorhandler(Exception)
def handle_error(e):
    return {'message': 'An unexpected error occurred: ' + str(e)}, 500

if __name__ == '__main__':
    app.run(port=5555, debug=True)
