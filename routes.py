from flask import render_template, request, jsonify, redirect, url_for
from flask_login import login_user, logout_user, login_required, current_user
from extensions import db, bcrypt
from models import User, FoodEntry
from services import parse_meal_with_gemini
from datetime import date

def register_routes(app):
    
    @app.route('/')
    def index():
        # Serve the main page
        return render_template('index.html')

    # --- Authentication API ---
    @app.route('/api/auth/login', methods=['POST'])
    def login():
        data = request.json
        user = User.query.filter_by(email=data.get('email')).first()
        if user and user.check_password(data.get('password')):
            login_user(user)
            return jsonify({'status': 'success', 'name': user.name})
        return jsonify({'status': 'error', 'message': 'Invalid credentials'}), 401

    @app.route('/api/auth/signup', methods=['POST'])
    def signup():
        data = request.json
        if User.query.filter_by(email=data.get('email')).first():
            return jsonify({'status': 'error', 'message': 'Email already exists'}), 400
        
        user = User(email=data.get('email'), name=data.get('name'))
        user.set_password(data.get('password'))
        db.session.add(user)
        db.session.commit()
        login_user(user)
        return jsonify({'status': 'success', 'name': user.name})

    @app.route('/api/auth/guest', methods=['POST'])
    def guest():
        # Logic for guest access (optional: create a temp user or just allow frontend state)
        return jsonify({'status': 'success', 'name': 'Guest'})

    @app.route('/api/logout')
    @login_required
    def logout():
        logout_user()
        return jsonify({'status': 'success'})

    # --- Nutrition API ---
    @app.route('/api/data/today', methods=['GET'])
    @login_required
    def get_today():
        today = date.today()
        foods = FoodEntry.query.filter_by(user_id=current_user.id, date=today).all()
        return jsonify([f.to_dict() for f in foods])

    @app.route('/api/nutrition/add', methods=['POST'])
    @login_required
    def add_food():
        data = request.json
        entry = FoodEntry(
            user_id=current_user.id,
            name=data.get('name'),
            calories=float(data.get('calories', 0)),
            protein=float(data.get('protein', 0)),
            carbs=float(data.get('carbs', 0)),
            fats=float(data.get('fats', 0)),
            fiber=float(data.get('fiber', 0)),
            sugar=float(data.get('sugar', 0)),
            sodium=float(data.get('sodium', 0))
        )
        db.session.add(entry)
        db.session.commit()
        return jsonify(entry.to_dict())

    @app.route('/api/nutrition/delete/<int:id>', methods=['DELETE'])
    @login_required
    def delete_food(id):
        entry = FoodEntry.query.filter_by(id=id, user_id=current_user.id).first()
        if entry:
            db.session.delete(entry)
            db.session.commit()
            return jsonify({'status': 'deleted'})
        return jsonify({'status': 'error'}), 404

    # --- AI Endpoint ---
    @app.route('/api/ai/parse', methods=['POST'])
    @login_required
    def ai_parse():
        data = request.json
        text = data.get('text', '')
        result = parse_meal_with_gemini(text)
        if result:
            return jsonify(result)
        return jsonify({'error': 'Could not parse meal'}), 400