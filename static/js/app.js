(function () {
    'use strict';

    // ==================== OFFLINE AI MEAL PARSER DATABASE ====================
    const FOOD_DB = {
        'roti': { cal: 120, protein: 3.5, carbs: 25, fats: 3.7, fiber: 3.2, sugar: 0.5, sodium: 160 },
        'chapati': { cal: 120, protein: 3.5, carbs: 25, fats: 3.7, fiber: 3.2, sugar: 0.5, sodium: 160 },
        'rice': { cal: 130, protein: 2.7, carbs: 28, fats: 0.3, fiber: 0.4, sugar: 0, sodium: 1 },
        'dal': { cal: 120, protein: 9, carbs: 20, fats: 1.5, fiber: 7, sugar: 2, sodium: 300 },
        'rajma': { cal: 140, protein: 8.5, carbs: 22, fats: 2.5, fiber: 8, sugar: 1, sodium: 350 },
        'paneer': { cal: 265, protein: 18, carbs: 1.2, fats: 20, fiber: 0, sugar: 1, sodium: 18 },
        'chicken': { cal: 165, protein: 31, carbs: 0, fats: 3.6, fiber: 0, sugar: 0, sodium: 74 },
        'egg': { cal: 78, protein: 6, carbs: 0.6, fats: 5, fiber: 0, sugar: 0.6, sodium: 62 },
        'milk': { cal: 150, protein: 8, carbs: 12, fats: 8, fiber: 0, sugar: 12, sodium: 105 },
        'curd': { cal: 98, protein: 11, carbs: 3.4, fats: 4.3, fiber: 0, sugar: 3.4, sodium: 46 },
        'sabzi': { cal: 80, protein: 3, carbs: 10, fats: 3, fiber: 4, sugar: 3, sodium: 250 },
        'dal makhani': { cal: 180, protein: 7, carbs: 18, fats: 10, fiber: 5, sugar: 2, sodium: 400 },
        'palak paneer': { cal: 220, protein: 14, carbs: 8, fats: 16, fiber: 3, sugar: 2, sodium: 500 },
        'chole': { cal: 160, protein: 8, carbs: 24, fats: 4, fiber: 6, sugar: 4, sodium: 450 },
        'samosa': { cal: 260, protein: 4, carbs: 25, fats: 17, fiber: 2, sugar: 2, sodium: 350 },
        'paratha': { cal: 200, protein: 5, carbs: 30, fats: 7, fiber: 3, sugar: 1, sodium: 200 },
        'idli': { cal: 40, protein: 2, carbs: 8, fats: 0.1, fiber: 0.5, sugar: 0, sodium: 50 },
        'dosa': { cal: 120, protein: 3, carbs: 18, fats: 4, fiber: 1, sugar: 1, sodium: 300 },
        'biryani': { cal: 290, protein: 12, carbs: 40, fats: 10, fiber: 1, sugar: 2, sodium: 450 },
        'lassi': { cal: 120, protein: 5, carbs: 15, fats: 4, fiber: 0, sugar: 12, sodium: 80 },
        'chai': { cal: 90, protein: 3, carbs: 10, fats: 4, fiber: 0, sugar: 8, sodium: 50 }
    };

    function parseMealText(text) {
        const regex = /(\d+)\s*(bowl|cup|glass|plate|pieces?|slices?|servings?)?\s*of\s+([a-zA-Z\s]+)/gi;
        let match;
        let totals = { cal: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, sugar: 0, sodium: 0 };
        let parsedItems = [];

        // Simple fallback for "2 roti" format without "of"
        const simpleRegex = /(\d+)\s+([a-zA-Z]+)/gi;

        while ((match = regex.exec(text)) !== null) {
            const qty = parseInt(match[1]);
            const foodName = match[3].trim().toLowerCase();
            if (FOOD_DB[foodName]) {
                parsedItems.push(`${qty} ${foodName}`);
                for (let key in totals) {
                    totals[key] += FOOD_DB[foodName][key] * qty;
                }
            }
        }

        // Reset regex index for simple parser
        if (parsedItems.length === 0) {
            while ((match = simpleRegex.exec(text)) !== null) {
                const qty = parseInt(match[1]);
                const foodName = match[2].trim().toLowerCase();
                if (FOOD_DB[foodName]) {
                    parsedItems.push(`${qty} ${foodName}`);
                    for (let key in totals) {
                        totals[key] += FOOD_DB[foodName][key] * qty;
                    }
                }
            }
        }

        if (parsedItems.length === 0) return null;

        return {
            name: parsedItems.join(', '),
            ...totals
        };
    }

    // ==================== DATA ====================
    const yogaExercises = [
        { id: 1, name: "Surya Namaskar", sanskrit: "Sun Salutation", category: "yoga", difficulty: "beginner", duration: "15-20 min", calories: "150-200", description: "A flowing sequence of 12 poses that warms up the entire body, improves flexibility, and energizes the mind.", benefits: ["Full body workout", "Improves flexibility", "Boosts metabolism"], instructions: ["Stand at the front of your mat with feet together", "Inhale, raise arms overhead", "Exhale, fold forward to Uttanasana", "Inhale, step right foot back for Anjaneyasana", "Exhale, step left foot back to Plank", "Lower through Chaturanga", "Inhale to Upward Dog", "Exhale to Downward Dog", "Step right foot forward, repeat on left side"] },
        { id: 2, name: "Padmasana", sanskrit: "Lotus Pose", category: "yoga", difficulty: "intermediate", duration: "5-15 min", calories: "20-30", description: "A seated meditation pose that promotes calmness, opens the hips, and improves posture.", benefits: ["Calms the mind", "Opens hips", "Improves posture"], instructions: ["Sit with legs extended", "Bend right knee, place foot on left thigh", "Bend left knee, place foot on right thigh", "Keep spine straight and hands on knees", "Breathe deeply and hold"] },
        { id: 3, name: "Bhujangasana", sanskrit: "Cobra Pose", category: "yoga", difficulty: "beginner", duration: "1-3 min", calories: "30-40", description: "A gentle backbend that strengthens the spine, opens the chest, and relieves stress.", benefits: ["Strengthens back", "Opens chest", "Relieves stress"], instructions: ["Lie face down on the mat", "Place hands under shoulders", "Inhale, lift chest off the ground", "Keep elbows slightly bent", "Hold for 15-30 seconds"] },
        { id: 4, name: "Anulom Vilom", sanskrit: "Alternate Nostril Breathing", category: "pranayama", difficulty: "beginner", duration: "10-15 min", calories: "10-15", description: "A balancing breathing technique that purifies the nadis and calms the nervous system.", benefits: ["Balances energy", "Reduces anxiety", "Improves focus"], instructions: ["Sit in a comfortable position", "Close right nostril with thumb", "Inhale through left nostril", "Close left nostril, exhale through right", "Inhale through right, close, exhale left", "Continue for 5-10 minutes"] },
        { id: 5, name: "Kapalbhati", sanskrit: "Skull Shining Breath", category: "pranayama", difficulty: "intermediate", duration: "5-10 min", calories: "50-70", description: "An energizing breathing technique that cleanses the respiratory system and boosts metabolism.", benefits: ["Detoxifies lungs", "Boosts energy", "Improves digestion"], instructions: ["Sit with spine straight", "Take a deep breath in", "Forcefully exhale through nose", "Let inhalation happen naturally", "Start with 20 breaths, increase gradually"] },
        { id: 6, name: "Dandasana", sanskrit: "Staff Pose", category: "yoga", difficulty: "beginner", duration: "1-2 min", calories: "15-20", description: "A foundational seated pose that improves posture and strengthens the core and back muscles.", benefits: ["Improves posture", "Strengthens core", "Stretches hamstrings"], instructions: ["Sit with legs extended forward", "Flex feet, press through heels", "Place hands beside hips", "Lengthen spine, engage core", "Hold for 30-60 seconds"] },
        { id: 7, name: "Dand Baithak", sanskrit: "Indian Squats", category: "exercise", difficulty: "intermediate", duration: "10-15 min", calories: "100-150", description: "Traditional Indian squats that build leg strength, improve flexibility, and enhance cardiovascular fitness.", benefits: ["Builds leg strength", "Improves flexibility", "Cardiovascular health"], instructions: ["Stand with feet shoulder-width apart", "Lower into a deep squat", "Keep heels flat on ground", "Stand back up with control", "Repeat for 20-50 repetitions"] },
        { id: 8, name: "Surya Bhedana", sanskrit: "Right Nostril Breathing", category: "pranayama", difficulty: "beginner", duration: "5-10 min", calories: "10-15", description: "A warming breathing technique that activates the sympathetic nervous system and increases energy.", benefits: ["Increases energy", "Warms the body", "Improves digestion"], instructions: ["Sit comfortably with spine straight", "Close left nostril with ring finger", "Inhale slowly through right nostril", "Close right nostril, hold briefly", "Exhale through left nostril", "Repeat for 5-10 minutes"] },
        { id: 9, name: "Vrikshasana", sanskrit: "Tree Pose", category: "yoga", difficulty: "beginner", duration: "1-3 min", calories: "20-30", description: "A balancing pose that improves concentration, strengthens legs, and opens the hips.", benefits: ["Improves balance", "Strengthens legs", "Enhances focus"], instructions: ["Stand on one leg", "Place other foot on inner thigh", "Bring hands to prayer position", "Focus on a fixed point", "Hold for 30-60 seconds each side"] },
        { id: 10, name: "Bethak", sanskrit: "Indian Push-ups", category: "exercise", difficulty: "advanced", duration: "10-15 min", calories: "120-180", description: "Traditional Indian push-ups that build upper body strength, core stability, and shoulder mobility.", benefits: ["Upper body strength", "Core stability", "Shoulder mobility"], instructions: ["Start in a crouch position", "Lower body to ground in an arc", "Push up to crouch position", "Keep core engaged throughout", "Start with 10, build up to 50+"] },
        { id: 11, name: "Trikonasana", sanskrit: "Triangle Pose", category: "yoga", difficulty: "intermediate", duration: "1-2 min", calories: "25-35", description: "A standing pose that stretches the sides, strengthens legs, and improves balance.", benefits: ["Stretches sides", "Strengthens legs", "Improves balance"], instructions: ["Stand with feet wide apart", "Turn right foot out 90 degrees", "Extend arms to sides", "Reach right hand to right ankle", "Look up at left hand, hold"] },
        { id: 12, name: "Agnisar Kriya", sanskrit: "Fire Essence Technique", category: "pranayama", difficulty: "advanced", duration: "5 min", calories: "30-40", description: "An advanced technique that strengthens the digestive fire and massages internal organs.", benefits: ["Improves digestion", "Strengthens core", "Massages organs"], instructions: ["Stand with feet hip-width apart", "Exhale completely and hold", "Pump abdomen in and out rapidly", "Continue until you need to inhale", "Practice on empty stomach only"] }
    ];

    // ==================== API LAYER ====================
    const API = {
        async post(url, data) {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res.json();
        },
        async get(url) {
            return (await fetch(url)).json();
        },
        async delete(url) {
            return (await fetch(url, { method: 'DELETE' })).json();
        }
    };

    // ==================== STATE ====================
    const State = {
        user: null, // Set by checking UI state or initial load
        foods: [],

        async init() {
            // Try to load today's data from backend
            try {
                const data = await API.get('/api/data/today');
                this.foods = data;
                UI.render();
            } catch (e) {
                console.log("User not logged in or session expired");
            }
            UI.setDate();
        },

        getTotals() {
            return this.foods.reduce((acc, f) => ({
                calories: acc.calories + (f.calories || 0),
                protein: acc.protein + (f.protein || 0),
                carbs: acc.carbs + (f.carbs || 0),
                fats: acc.fats + (f.fats || 0),
                fiber: acc.fiber + (f.fiber || 0),
                sugar: acc.sugar + (f.sugar || 0),
                sodium: acc.sodium + (f.sodium || 0)
            }), { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, sugar: 0, sodium: 0 });
        }
    };

    // ==================== UI ====================
    const UI = {
        elements: {},
        // Keep your existing cacheElements, updateNutrition, updateBar, renderFoodList, etc.
        // Just ensure renderFoodList uses State.foods

        render() {
            const totals = State.getTotals();
            this.updateNutrition(totals);
            this.renderFoodList(State.foods);
        }
    };

    // ==================== UI METHODS ====================
    UI.cacheElements = function() {
        this.elements.aiParseBtn = document.getElementById('aiParseBtn');
        this.elements.aiMealInput = document.getElementById('aiMealInput');
        this.elements.foodList = document.getElementById('foodList');
    };

    UI.updateNutrition = function(totals) {
        // Update nutrition display
    };

    UI.renderFoodList = function(foods) {
        // Render food list items
    };

    UI.renderYogaGrid = function() {
        // Render yoga exercises grid
    };

    UI.setupScrollAnimations = function() {
        // Setup scroll animations
    };

    function showPage(pageId) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

        document.getElementById(pageId + 'Page').classList.add('active');
        const activeLink = document.querySelector(`.nav-links .nav-link[data-page="${pageId}"]`);
        if (activeLink) activeLink.classList.add('active');

        window.scrollTo({ top: 0, behavior: 'smooth' });

        setTimeout(() => {
            document.querySelectorAll('.reveal').forEach(el => el.classList.remove('visible'));
            UI.setupScrollAnimations();
        }, 50);
    }

    // ==================== EVENT HANDLERS ====================
    function setupEvents() {
        // Auth Logic
        document.getElementById('authForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const isLogin = document.querySelector('.auth-tab.active').dataset.auth === 'login';
            const url = isLogin ? '/api/auth/login' : '/api/auth/signup';

            const res = await API.post(url, {
                email: document.getElementById('authEmail').value,
                password: document.getElementById('authPassword').value,
                name: document.getElementById('authName').value
            });

            if (res.status === 'success') {
                window.location.reload(); // Reload to establish server session
            } else {
                alert(res.message || 'Error');
            }
        });

        // AI Parser (Gemini)
        UI.elements.aiParseBtn.addEventListener('click', async () => {
            const text = UI.elements.aiMealInput.value.trim();
            if (!text) return;

            UI.elements.aiParseBtn.textContent = 'Analyzing...';
            UI.elements.aiParseBtn.disabled = true;

            const res = await API.post('/api/ai/parse', { text });

            if (res.name) {
                document.getElementById('foodName').value = res.name;
                document.getElementById('foodCalories').value = res.calories;
                document.getElementById('foodProtein').value = res.protein;
                document.getElementById('foodCarbs').value = res.carbs;
                document.getElementById('foodFats').value = res.fats;
                document.getElementById('foodFiber').value = res.fiber;
                document.getElementById('foodSugar').value = res.sugar;
                document.getElementById('foodSodium').value = res.sodium;
            } else {
                alert("AI couldn't parse that description.");
            }

            UI.elements.aiParseBtn.textContent = 'Analyze';
            UI.elements.aiParseBtn.disabled = false;
        });

        // Add Food
        UI.elements.foodList.addEventListener('click', async (e) => {
            const btn = e.target.closest('[data-delete-id]');
            if (btn) {
                const id = btn.dataset.deleteId;
                await API.delete(`/api/nutrition/delete/${id}`);
                State.foods = State.foods.filter(f => f.id != id);
                UI.render();
            }
        });
    }

    // ==================== INITIALIZATION ====================
    document.addEventListener('DOMContentLoaded', () => {
        UI.cacheElements();
        setupEvents();
        State.init();
        UI.renderYogaGrid();
        UI.setupScrollAnimations();
    });
    
    })();