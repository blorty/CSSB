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

# Seed execution
if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")

        # Ensure tables are created
        db.create_all()

        # Seeding maps
        map_names = ['Anubis', 'Inferno', 'Nuke', 'Overpass', 'Mirage', 'Ancient', 'Vertigo']
        maps = []
        for map_name in map_names:
            new_map = Map(name=map_name)
            maps.append(new_map)
            db.session.add(new_map)
        db.session.flush()  # Ensure Maps are persisted and IDs are assigned

        # Seeding Users and Strategies
        users = []
        for _ in range(10):
            new_user = User(
                username=fake.unique.user_name(),
                password=fake.password(length=10, special_chars=True, digits=True, upper_case=True, lower_case=True),
                email=fake.unique.email(),
                created_at=datetime.utcnow()
            )

            users.append(new_user)
            db.session.add(new_user)
        db.session.flush()  # Ensure Users are persisted and IDs are assigned

        for user in users:
            for _ in range(3):
                new_strategy = Strategy(
                    title=fake.sentence(),
                    content=fake.text(),
                    created_at=datetime.utcnow(),
                    map_id=choice(maps).id,
                    user_id=user.id  
                )
                db.session.add(new_strategy)

        # Seeding Teams
        teams = []
        for _ in range(5):
            new_team = Team(
                name=fake.company(),
            )
            teams.append(new_team)
            db.session.add(new_team)
        db.session.flush()  # Ensure Teams are persisted and IDs are assigned
        
        # Assigning Users to Teams
        for team in teams:
            team.users.append(users[randint(0, len(users)-1)])
            team.users.append(users[randint(0, len(users)-1)]) # Each team has two users
            
        # Seeding Comments
        for _ in range(30):
            new_comment = Comment(
                content=fake.sentence(),
                created_at=datetime.utcnow(),
                user_id=choice(users).id,
                strategy_id=choice(Strategy.query.all()).id
            )
            db.session.add(new_comment)


        db.session.commit()
        print("Seed complete!")
