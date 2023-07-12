# Standard library imports
import flask_bcrypt as bcrypt
from random import randint, choice
from datetime import datetime

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import User, Strategy, Team, Comment, Map
from config import db

# Helper function to generate game-relevant strategy content
def generate_strategy_content():
    strats = [
        "Rush B no stop", 
        "Split A, 3 short 2 long", 
        "Fake B, go A through connector", 
        "Hold for picks then decide",
        "Rush A through palace",
        "Double fake, end B"
        "Default, then execute on call",
    ]
    return choice(strats)

# Top 30 teams
top_teams = [
    "NaVi", 
    "Astralis", 
    "Cloud9", 
    "Heroic", 
    "Virtus.pro", 
    "G2", 
    "Liquid", 
    "FURIA", 
    "Complexity", 
    "BIG",
    "FaZe",
    "OG",
    "Mousesports",
    "Fnatic",
    "Evil Geniuses",
    "Vitality",
    "Ninjas in Pyjamas",
    # Add more teams as needed
]

# Seed execution
if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")

        # Ensure tables are created
        db.create_all()

        # Seeding maps
        map_names = ['Anubis', 'Inferno', 'Nuke', 'Mirage', 'Overpass', 'Ancient', 'Vertigo']
        for map_name in map_names:
            map_obj = Map(name=map_name)
            db.session.add(map_obj)
        db.session.commit()

        # Seeding users and teams
        for _ in range(10):
            # Create users
            username = fake.unique.user_name()
            email = f"{username}@example.com"
            password = "password"
            user = User(username=username, email=email)
            user.password = password  # use the property setter
            db.session.add(user)

        # Create teams
        for team_name in top_teams:
            team = Team(name=team_name)
            db.session.add(team)

        db.session.commit()

        # Seeding strategies
        users = User.query.all()
        maps = Map.query.all()
        teams = Team.query.all()

        for _ in range(50):
            title = fake.sentence()
            content = generate_strategy_content()
            user_id = choice(users).id
            map_id = choice(maps).id
            team_id = choice(teams).id
            created_at = fake.date_time_this_year()

            strategy = Strategy(
                title=title, 
                content=content, 
                user_id=user_id, 
                map_id=map_id, 
                created_at=created_at
            )
            strategy.teams.append(Team.query.get(team_id))

            db.session.add(strategy)

        db.session.commit()

        # Seeding comments
        strategies = Strategy.query.all()

        for _ in range(100):
            content = fake.paragraph()
            user_id = choice(users).id
            strategy_id = choice(strategies).id
            created_at = fake.date_time_this_year()

            comment = Comment(
                content=content, 
                user_id=user_id, 
                strategy_id=strategy_id, 
                created_at=created_at
            )
            db.session.add(comment)

        db.session.commit()

        print("Seeding done!")
