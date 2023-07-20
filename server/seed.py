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
    ("NaVi", ["s1mple", "iM", "jL", "Aleskib", "B1T"]), 
    ("Astralis", ["device", "b0RUP", "blameF", "Staehr", "Buzz"]), 
    ("Cloud9", ["Buster", "Hobbit", "electronic", "Ax1le", "Perfecto"]),
    ("Heroic", ["cadiaN", "stavn", "TeSeS", "sjuush", "jabbi"]), 
    ("Virtus.pro", ["FL1T", "Qikert", "Jame", "n0rb3r7", "fame"]), 
    ("G2", ["huNter-", "m0nesy", "NiKo", "Hooxi", "jks"]), 
    ("Liquid", ["oSee", "NAF", "YEKINDAR", "Rainwaker", "Patsi"]), 
    ("FURIA", ["yuurih", "arT", "chelo", "KSCERATO", "Fallen"]),
    ("Complexity", ["EliGE", "JT", "floppy", "hallzerk", "Grim"]), 
    ("BIG", ["tabseN", "Krimbo", "prosus", "mantuu", "s1n"]),
    ("FaZe", ["rain", "ropz", "broky", "Twistzz", "karrigan"]),
    ("OG", ["FIKU", "regali", "k1to", "nexa", "FASHR"]),
    ("Mousesports", ["frozen", "siuhy", "torzsi", "Jimphat", "xertioN"]),
    ("Fnatic", ["KRIMZ", "dexter", "roej", "mezzi", "afro"]),
    ("Evil Geniuses", ["junior", "autimatic", "Jeorge", "HexT", "Walco"]),
    ("Vitality", ["ZywOo", "flameZ", "apEX", "SpinX", "Magisk"]),
    ("Ninjas in Pyjamas", ["REZ", "k0nfig", "hampus", "Brollan", "headtr1ck"]),
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
        
        # Seeding users
        for team_name, players in top_teams:
            # Create new team
            team = Team(name=team_name)
            db.session.add(team)
            # Create user for each player and add them to the team
            for player_name in players:
                player_email = f"{player_name}@example.com"
                existing_user = User.query.filter_by(username=player_name).first()
                if existing_user is None:  # only create user if not already in the database
                    player = User(username=player_name, email=player_email)
                    player.password = "password"  # use the property setter
                    db.session.add(player)
                    team.users.append(player)  # Add player to team

        db.session.commit()  # <-- Commit after adding users and teams

        db.session.commit()

        # Fetch teams from the database after they have been added
        teams = Team.query.all()


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
