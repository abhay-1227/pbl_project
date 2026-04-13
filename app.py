from flask import Flask
from config import Config
from extensions import db, login_manager, bcrypt
import os

def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(Config)

    # Ensure instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # Init extensions
    db.init_app(app)
    login_manager.init_app(app)
    bcrypt.init_app(app)

    # Register routes
    from routes import register_routes
    register_routes(app)

    # Create DB tables
    with app.app_context():
        db.create_all()

    return app