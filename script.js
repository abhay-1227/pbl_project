// ========================================
// PANTRYPILOT AI - MAIN JAVASCRIPT
// ========================================

// Global State
const state = {
  currentUser: null,
  theme: 'dark',
  currentSpiceLevel: 'medium'
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const showToast = (message, duration = 3000) => {
  const toast = $('#toast');
  if (!toast) return;
  
  toast.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const round = (value, decimals = 0) => {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
};

const titleCase = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// ========================================
// LOCAL STORAGE
// ========================================

const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }
};

// ========================================
// THEME MANAGEMENT
// ========================================

const initTheme = () => {
  const savedTheme = storage.get('pantrypilot_theme') || 'dark';
  state.theme = savedTheme;
  document.documentElement.setAttribute('data-theme', savedTheme);
};

const toggleTheme = () => {
  const newTheme = state.theme === 'dark' ? 'light' : 'dark';
  state.theme = newTheme;
  document.documentElement.setAttribute('data-theme', newTheme);
  storage.set('pantrypilot_theme', newTheme);
  showToast(`Switched to ${newTheme} mode`);
};

// ========================================
// AUTHENTICATION
// ========================================

const auth = {
  login: (email, password) => {
    // Simulate authentication
    const users = storage.get('pantrypilot_users') || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const userData = { ...user };
      delete userData.password;
      state.currentUser = userData;
      storage.set('pantrypilot_current_user', userData);
      showToast(`Welcome back, ${userData.name}!`);
      return true;
    }
    
    showToast('Invalid email or password');
    return false;
  },
  
  signup: (name, email, password) => {
    const users = storage.get('pantrypilot_users') || [];
    
    // Check if email already exists
    if (users.some(u => u.email === email)) {
      showToast('Email already registered');
      return false;
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // In production, this should be hashed
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    storage.set('pantrypilot_users', users);
    
    // Auto login
    const userData = { ...newUser };
    delete userData.password;
    state.currentUser = userData;
    storage.set('pantrypilot_current_user', userData);
    
    showToast(`Welcome, ${name}!`);
    return true;
  },
  
  logout: () => {
    state.currentUser = null;
    storage.remove('pantrypilot_current_user');
    showToast('Logged out successfully');
    updateAuthUI();
  },
  
  getCurrentUser: () => {
    if (!state.currentUser) {
      state.currentUser = storage.get('pantrypilot_current_user');
    }
    return state.currentUser;
  }
};

// ========================================
// UI UPDATES
// ========================================

const updateAuthUI = () => {
  const loginBtn = $('#loginBtn');
  const userProfile = $('#userProfile');
  
  if (!loginBtn) return;
  
  const currentUser = auth.getCurrentUser();
  
  if (currentUser) {
    loginBtn.style.display = 'none';
    if (userProfile) {
      userProfile.style.display = 'flex';
      const initials = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
      $('#userInitials').textContent = initials;
      $('#userName').textContent = currentUser.name;
      $('#userEmail').textContent = currentUser.email;
    }
  } else {
    loginBtn.style.display = 'flex';
    if (userProfile) {
      userProfile.style.display = 'none';
    }
  }
};

// ========================================
// MODAL MANAGEMENT
// ========================================

const modal = {
  open: (modalId) => {
    const modalEl = $(`#${modalId}`);
    if (modalEl) {
      modalEl.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },
  
  close: (modalId) => {
    const modalEl = $(`#${modalId}`);
    if (modalEl) {
      modalEl.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
};

// ========================================
// RECIPE GENERATOR LOGIC
// ========================================

const recipeGenerator = {
  normalizeItems: (rawInput) => {
    return rawInput
      .toLowerCase()
      .split(/[,;\n]+/)
      .map(item => item.trim())
      .filter(Boolean);
  },
  
  guessCuisine: (items) => {
    const itemSet = new Set(items);
    
    if (itemSet.has('paneer') || itemSet.has('turmeric') || itemSet.has('cumin') || itemSet.has('curry')) {
      return 'indian';
    }
    if (itemSet.has('pasta') || itemSet.has('basil') || itemSet.has('parmesan') || itemSet.has('mozzarella')) {
      return 'italian';
    }
    if (itemSet.has('soy sauce') || itemSet.has('ginger') || itemSet.has('sesame')) {
      return 'chinese';
    }
    if (itemSet.has('lime') || itemSet.has('cilantro') || itemSet.has('tortilla')) {
      return 'mexican';
    }
    if (itemSet.has('olive oil') || itemSet.has('feta') || itemSet.has('lemon')) {
      return 'mediterranean';
    }
    
    return 'fusion';
  },
  
  pickMainIngredient: (items, diet) => {
    const proteins = ['chicken', 'paneer', 'tofu', 'fish', 'beef', 'pork', 'chickpeas', 'lentils', 'egg', 'shrimp'];
    const veggieProteins = ['paneer', 'tofu', 'chickpeas', 'lentils', 'mushroom'];
    const veganProteins = ['tofu', 'chickpeas', 'lentils', 'tempeh'];
    
    let pool = proteins;
    if (diet === 'vegetarian') pool = veggieProteins;
    if (diet === 'vegan') pool = veganProteins;
    
    for (let protein of pool) {
      if (items.includes(protein)) return protein;
    }
    
    return items.length > 0 ? items[0] : 'vegetables';
  },
  
  getCookingMethod: (minutes, cuisine) => {
    if (minutes <= 15) {
      return cuisine === 'indian' ? 'tawa' : cuisine === 'chinese' ? 'stir-fry' : 'quick sauté';
    } else if (minutes <= 30) {
      return cuisine === 'indian' ? 'kadhai' : cuisine === 'italian' ? 'sauté & simmer' : 'pan cook';
    } else {
      return cuisine === 'indian' ? 'dum' : cuisine === 'chinese' ? 'wok toss' : 'slow simmer';
    }
  },
  
  buildIngredients: (items, servings, cuisine, spiceLevel) => {
    const selectedItems = items.slice(0, Math.min(8, items.length));
    const spiceMultiplier = { mild: 0.6, medium: 1.0, hot: 1.5 }[spiceLevel] || 1.0;
    
    const ingredients = selectedItems.map(item => ({
      name: item,
      quantity: servings > 2 ? `${round(100 + servings * 20)}g` : `${round(80 + servings * 15)}g`,
      calories: 40 + Math.random() * 60,
      protein: 2 + Math.random() * 8,
      carbs: 5 + Math.random() * 15,
      fats: 1 + Math.random() * 5
    }));
    
    // Add spices for Indian cuisine
    if (cuisine === 'indian' && !items.includes('spices')) {
      ingredients.push({
        name: 'garam masala',
        quantity: `${round(servings * 1.5 * spiceMultiplier)}g`,
        calories: 10,
        protein: 0.5,
        carbs: 2,
        fats: 0.5
      });
    }
    
    return ingredients;
  },
  
  balanceNutrition: (ingredients, servings, targetCalories, diet) => {
    const totalCalories = ingredients.reduce((sum, ing) => sum + ing.calories, 0);
    const perServing = totalCalories / servings;
    
    if (Math.abs(perServing - targetCalories) < 50) {
      return { ingredients, note: null };
    }
    
    const diff = targetCalories - perServing;
    
    if (diff > 0) {
      const extra = {
        name: diet === 'vegan' ? 'nuts' : 'butter',
        quantity: `${round(servings * 5)}g`,
        calories: round(diff * 0.5),
        protein: 2,
        carbs: 1,
        fats: round(diff * 0.05)
      };
      
      return {
        ingredients: [...ingredients, extra],
        note: `Added ${extra.quantity} ${extra.name} to reach ~${targetCalories} kcal/serving`
      };
    } else {
      const adjusted = ingredients.map((ing, i) => {
        if (i === 0) {
          return {
            ...ing,
            calories: round(ing.calories * 0.8),
            quantity: `${round(parseFloat(ing.quantity) * 0.8)}g`
          };
        }
        return ing;
      });
      
      return {
        ingredients: adjusted,
        note: `Reduced portions to target ~${targetCalories} kcal/serving`
      };
    }
  },
  
  calculateNutrition: (ingredients, servings) => {
    const total = ingredients.reduce((acc, ing) => ({
      calories: acc.calories + ing.calories,
      protein: acc.protein + ing.protein,
      carbs: acc.carbs + ing.carbs,
      fats: acc.fats + ing.fats
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
    
    return {
      total,
      perServing: {
        calories: total.calories / servings,
        protein: total.protein / servings,
        carbs: total.carbs / servings,
        fats: total.fats / servings
      }
    };
  },
  
  generateSteps: (main, cuisine, method, minutes, spiceLevel) => {
    const steps = [];
    
    steps.push(`Prep your ingredients: wash and chop ${main} and vegetables into bite-sized pieces.`);
    
    if (cuisine === 'indian') {
      steps.push(`Heat oil in a ${method === 'tawa' ? 'flat pan' : 'kadhai'}, add cumin seeds until they crackle.`);
      steps.push(`Add onions and sauté until golden, then add ginger-garlic paste.`);
      steps.push(`Toss in ${main} and cook on medium heat for ${round(minutes * 0.4)} minutes.`);
      
      if (spiceLevel === 'hot') {
        steps.push(`Stir in chopped green chillies and extra red chilli powder for heat.`);
      }
      
      steps.push(`Add tomatoes, spices (turmeric, coriander, garam masala), and simmer until done.`);
      steps.push(`Garnish with fresh cilantro and serve hot with rice or roti.`);
    } else if (cuisine === 'italian') {
      steps.push(`Heat olive oil in a pan, sauté garlic until fragrant.`);
      steps.push(`Add ${main} and cook for ${round(minutes * 0.35)} minutes.`);
      steps.push(`Toss in tomatoes and herbs (basil, oregano), simmer gently.`);
      steps.push(`Finish with a drizzle of olive oil and grated cheese.`);
    } else if (cuisine === 'chinese') {
      steps.push(`Heat a wok on high, add a splash of oil.`);
      steps.push(`Stir-fry ${main} quickly for ${round(minutes * 0.3)} minutes.`);
      steps.push(`Add soy sauce, ginger, garlic, and vegetables. Toss rapidly.`);
      steps.push(`Serve immediately over steamed rice.`);
    } else {
      steps.push(`Cook ${main} in a pan with your choice of seasoning.`);
      steps.push(`Add vegetables and simmer for ${round(minutes * 0.5)} minutes.`);
      steps.push(`Taste and adjust salt, pepper, and herbs as needed.`);
      steps.push(`Plate and enjoy your fusion creation!`);
    }
    
    return steps;
  },
  
  getSubstitutions: (items, diet) => {
    const subs = [];
    
    if (diet === 'vegan' && items.includes('paneer')) {
      subs.push({ from: 'paneer', to: 'tofu', reason: 'vegan preference' });
    }
    if (diet === 'vegan' && items.includes('butter')) {
      subs.push({ from: 'butter', to: 'coconut oil', reason: 'vegan preference' });
    }
    if (diet === 'vegetarian' && items.includes('chicken')) {
      subs.push({ from: 'chicken', to: 'paneer or chickpeas', reason: 'vegetarian preference' });
    }
    if (diet === 'glutenfree' && items.includes('pasta')) {
      subs.push({ from: 'pasta', to: 'rice noodles or quinoa', reason: 'gluten-free diet' });
    }
    
    return subs;
  },
  
  getTips: (items, minutes) => {
    const tips = [];
    
    tips.push(`Taste and season as you go — don't add all salt at once.`);
    tips.push(`Let the dish rest for 2-3 minutes before serving to let flavors meld.`);
    
    if (minutes < 20) {
      tips.push(`For a quick meal, keep ingredients prepped in advance.`);
    } else {
      tips.push(`Store leftovers in an airtight container; stays fresh for 2-3 days.`);
    }
    
    if (items.includes('garlic') || items.includes('ginger')) {
      tips.push(`Fresh garlic/ginger paste beats store-bought for flavor.`);
    }
    
    tips.push(`Garnish with fresh herbs (cilantro, basil, parsley) for a vibrant finish.`);
    
    return tips;
  },
  
  generateTitle: (main, cuisine) => {
    const templates = {
      indian: ['Masala', 'Curry', 'Tikka', 'Biryani-style', 'Tandoori-style'],
      italian: ['Pasta', 'Risotto-style', 'Arrabbiata', 'Pesto', 'Caprese-style'],
      chinese: ['Stir-fry', 'Szechuan-style', 'Sweet & Sour', 'Kung Pao', 'Chow Mein'],
      mediterranean: ['Herb-Crusted', 'Mezze-style', 'Grilled', 'Feta & Olive', 'Lemon-Herb'],
      mexican: ['Taco-style', 'Burrito Bowl', 'Quesadilla-style', 'Salsa-topped', 'Fajita-style'],
      thai: ['Pad Thai-style', 'Green Curry', 'Tom Yum-style', 'Basil', 'Coconut'],
      fusion: ['Fusion', 'Global', 'Pan-Asian', 'Modern', 'Creative']
    };
    
    const pool = templates[cuisine] || templates.fusion;
    const variant = pool[Math.floor(Math.random() * pool.length)];
    
    return `${titleCase(main)} ${variant}`;
  }
};

// ========================================
// RECIPE RENDERING
// ========================================

const renderRecipe = (recipe) => {
  const output = $('#recipeOutput');
  if (!output) return;
  
  const { title, cuisine, method, servings, minutes, ingredients, steps, nutrition, substitutions, tips, balanceNote } = recipe;
  
  output.innerHTML = `
    <div class="glass" style="padding: 2rem; border-radius: var(--radius-xl);">
      <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h3 style="font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem; color: var(--text-primary);">${title}</h3>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 1rem;">
            <span style="padding: 0.5rem 1rem; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: var(--radius-full); font-size: 0.875rem; font-weight: 600;">🌍 ${titleCase(cuisine)}</span>
            <span style="padding: 0.5rem 1rem; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: var(--radius-full); font-size: 0.875rem; font-weight: 600;">⚙️ ${titleCase(method)}</span>
            <span style="padding: 0.5rem 1rem; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: var(--radius-full); font-size: 0.875rem; font-weight: 600;">⏱️ ${minutes} min</span>
            <span style="padding: 0.5rem 1rem; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: var(--radius-full); font-size: 0.875rem; font-weight: 600;">👥 ${servings} servings</span>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 2.5rem; font-weight: 700; color: var(--primary);">${round(nutrition.total.calories)} kcal</div>
          <div style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.25rem;">Total calories</div>
        </div>
      </div>
      
      ${balanceNote ? `<div style="padding: 1rem 1.5rem; background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: var(--radius-md); margin-bottom: 2rem; color: var(--text-secondary); font-size: 0.875rem;">
        ⚖️ ${balanceNote}
      </div>` : ''}
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
        <div>
          <h4 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
            🥘 Ingredients
          </h4>
          <ul style="list-style: none; padding: 0;">
            ${ingredients.map(ing => `
              <li style="padding: 0.75rem 1rem; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: var(--radius-md); margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: 600; color: var(--text-primary);">${titleCase(ing.name)}</span>
                <span style="color: var(--text-secondary);">${ing.quantity}</span>
              </li>
            `).join('')}
          </ul>
        </div>
        
        <div>
          <h4 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
            📊 Nutrition (per serving)
          </h4>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
            <div style="padding: 1rem; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: var(--radius-md); text-align: center;">
              <div style="font-size: 1.75rem; font-weight: 700; color: var(--warning);">${round(nutrition.perServing.calories)}</div>
              <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; margin-top: 0.25rem;">Calories</div>
            </div>
            <div style="padding: 1rem; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: var(--radius-md); text-align: center;">
              <div style="font-size: 1.75rem; font-weight: 700; color: var(--primary);">${round(nutrition.perServing.protein, 1)}g</div>
              <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; margin-top: 0.25rem;">Protein</div>
            </div>
            <div style="padding: 1rem; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: var(--radius-md); text-align: center;">
              <div style="font-size: 1.75rem; font-weight: 700; color: var(--secondary);">${round(nutrition.perServing.carbs, 1)}g</div>
              <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; margin-top: 0.25rem;">Carbs</div>
            </div>
            <div style="padding: 1rem; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: var(--radius-md); text-align: center;">
              <div style="font-size: 1.75rem; font-weight: 700; color: var(--accent);">${round(nutrition.perServing.fats, 1)}g</div>
              <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; margin-top: 0.25rem;">Fats</div>
            </div>
          </div>
        </div>
      </div>
      
      <div style="margin-bottom: 2rem;">
        <h4 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
          👨‍🍳 Cooking Steps
        </h4>
        <ol style="padding-left: 1.5rem; color: var(--text-secondary); line-height: 1.8;">
          ${steps.map(step => `<li style="margin-bottom: 0.75rem;">${step}</li>`).join('')}
        </ol>
      </div>
      
      ${substitutions.length > 0 ? `
        <div style="margin-bottom: 2rem;">
          <h4 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
            🔄 Substitutions
          </h4>
          <ul style="list-style: none; padding: 0;">
            ${substitutions.map(sub => `
              <li style="padding: 0.75rem 1rem; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: var(--radius-md); margin-bottom: 0.5rem; color: var(--text-secondary);">
                <strong style="color: var(--text-primary);">${titleCase(sub.from)}</strong> → ${titleCase(sub.to)} <span style="color: var(--text-tertiary);">(${sub.reason})</span>
              </li>
            `).join('')}
          </ul>
        </div>
      ` : ''}
      
      <div style="margin-bottom: 2rem;">
        <h4 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
          💡 Pro Tips
        </h4>
        <ul style="padding-left: 1.5rem; color: var(--text-secondary); line-height: 1.8;">
          ${tips.map(tip => `<li style="margin-bottom: 0.75rem;">${tip}</li>`).join('')}
        </ul>
      </div>
      
      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
        <button class="btn-primary" id="copyRecipeBtn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          Copy Recipe
        </button>
        <button class="btn-secondary" id="saveRecipeBtn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          Save Recipe
        </button>
      </div>
    </div>
  `;
  
  // Add event listeners
  const copyBtn = $('#copyRecipeBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const text = `
${title}
Cuisine: ${cuisine} | Method: ${method} | Time: ${minutes} min | Servings: ${servings}

Ingredients:
${ingredients.map(ing => `- ${titleCase(ing.name)} — ${ing.quantity}`).join('\n')}

Steps:
${steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}

Nutrition (per serving):
Calories: ${round(nutrition.perServing.calories)} kcal
Protein: ${round(nutrition.perServing.protein, 1)}g | Carbs: ${round(nutrition.perServing.carbs, 1)}g | Fats: ${round(nutrition.perServing.fats, 1)}g

${substitutions.length ? `Substitutions:\n${substitutions.map(s => `- ${titleCase(s.from)} → ${titleCase(s.to)} (${s.reason})`).join('\n')}` : ''}

Tips:
${tips.map(t => `- ${t}`).join('\n')}
      `.trim();
      
      navigator.clipboard.writeText(text)
        .then(() => showToast('Recipe copied to clipboard! ✅'))
        .catch(() => showToast('Failed to copy recipe'));
    });
  }
  
  const saveBtn = $('#saveRecipeBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const user = auth.getCurrentUser();
      if (!user) {
        showToast('Please login to save recipes');
        modal.open('loginModal');
        return;
      }
      
      const savedRecipes = storage.get(`recipes_${user.id}`) || [];
      savedRecipes.push({ ...recipe, savedAt: new Date().toISOString() });
      storage.set(`recipes_${user.id}`, savedRecipes);
      showToast('Recipe saved! 💾');
    });
  }
};

// ========================================
// EVENT LISTENERS
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme
  initTheme();
  
  // Initialize auth UI
  updateAuthUI();
  
  // Theme toggle
  const themeToggle = $('#themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  // Mobile menu toggle
  const mobileMenuToggle = $('#mobileMenuToggle');
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
      const navLinks = $('.nav-links');
      if (navLinks) {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
      }
    });
  }
  
  // Login button
  const loginBtn = $('#loginBtn');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => modal.open('loginModal'));
  }
  
  // Get started button
  const getStartedBtn = $('#getStartedBtn');
  if (getStartedBtn) {
    getStartedBtn.addEventListener('click', () => {
      const user = auth.getCurrentUser();
      if (user) {
        document.getElementById('recipegen')?.scrollIntoView({ behavior: 'smooth' });
      } else {
        modal.open('loginModal');
      }
    });
  }
  
  // Login modal
  const loginForm = $('#loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = $('#loginEmail').value;
      const password = $('#loginPassword').value;
      
      if (auth.login(email, password)) {
        modal.close('loginModal');
        updateAuthUI();
        loginForm.reset();
      }
    });
  }
  
  const modalClose = $('#modalClose');
  if (modalClose) {
    modalClose.addEventListener('click', () => modal.close('loginModal'));
  }
  
  const modalOverlay = $('#modalOverlay');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', () => modal.close('loginModal'));
  }
  
  // Signup modal
  const signupForm = $('#signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#signupName').value;
      const email = $('#signupEmail').value;
      const password = $('#signupPassword').value;
      
      if (auth.signup(name, email, password)) {
        modal.close('signupModal');
        updateAuthUI();
        signupForm.reset();
      }
    });
  }
  
  const signupClose = $('#signupClose');
  if (signupClose) {
    signupClose.addEventListener('click', () => modal.close('signupModal'));
  }
  
  const signupOverlay = $('#signupOverlay');
  if (signupOverlay) {
    signupOverlay.addEventListener('click', () => modal.close('signupModal'));
  }
  
  // Toggle between login and signup
  const showSignup = $('#showSignup');
  if (showSignup) {
    showSignup.addEventListener('click', (e) => {
      e.preventDefault();
      modal.close('loginModal');
      modal.open('signupModal');
    });
  }
  
  const showLogin = $('#showLogin');
  if (showLogin) {
    showLogin.addEventListener('click', (e) => {
      e.preventDefault();
      modal.close('signupModal');
      modal.open('loginModal');
    });
  }
  
  // Logout
  const logoutBtn = $('#logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      auth.logout();
    });
  }
  
  // Spice level toggle
  const toggleBtns = $$('.toggle-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentSpiceLevel = btn.dataset.value;
    });
  });
  
  // Recipe generator
  const generateBtn = $('#generateBtn');
  if (generateBtn) {
    generateBtn.addEventListener('click', () => {
      const itemsRaw = $('#ingredients')?.value || '';
      const diet = $('#diet')?.value || 'none';
      const cuisineSelect = $('#cuisine')?.value || 'auto';
      const minutes = clamp(parseInt($('#time')?.value || '25'), 5, 180);
      const servings = clamp(parseInt($('#servings')?.value || '2'), 1, 10);
      const targetCalories = clamp(parseInt($('#calGoal')?.value || '450'), 150, 1200);
      const spiceLevel = state.currentSpiceLevel;
      
      const items = recipeGenerator.normalizeItems(itemsRaw);
      
      if (items.length < 3) {
        showToast('Please add at least 3 ingredients');
        return;
      }
      
      const cuisine = cuisineSelect === 'auto' ? recipeGenerator.guessCuisine(items) : cuisineSelect;
      const main = recipeGenerator.pickMainIngredient(items, diet);
      const method = recipeGenerator.getCookingMethod(minutes, cuisine);
      const baseIngredients = recipeGenerator.buildIngredients(items, servings, cuisine, spiceLevel);
      const balanced = recipeGenerator.balanceNutrition(baseIngredients, servings, targetCalories, diet);
      const nutrition = recipeGenerator.calculateNutrition(balanced.ingredients, servings);
      const steps = recipeGenerator.generateSteps(main, cuisine, method, minutes, spiceLevel);
      const substitutions = recipeGenerator.getSubstitutions(items, diet);
      const tips = recipeGenerator.getTips(items, minutes);
      const title = recipeGenerator.generateTitle(main, cuisine);
      
      renderRecipe({
        title,
        cuisine,
        method,
        servings,
        minutes,
        ingredients: balanced.ingredients,
        steps,
        nutrition,
        substitutions,
        tips,
        balanceNote: balanced.note
      });
      
      showToast('Recipe generated! ⚡');
    });
  }
  
  // Random recipe button
  const randomBtn = $('#randomBtn');
  if (randomBtn) {
    randomBtn.addEventListener('click', () => {
      const samples = [
        { 
          items: 'rice, tomato, onion, paneer, spinach, garlic, cumin, turmeric, ginger',
          diet: 'vegetarian',
          cuisine: 'indian',
          time: 25,
          servings: 2,
          calories: 450,
          spice: 'medium'
        },
        {
          items: 'pasta, tomato, garlic, onion, mushroom, olive oil, cheese',
          diet: 'none',
          cuisine: 'italian',
          time: 20,
          servings: 2,
          calories: 520,
          spice: 'mild'
        },
        {
          items: 'tofu, rice, garlic, ginger, capsicum, carrot, onion, soy sauce',
          diet: 'vegan',
          cuisine: 'chinese',
          time: 18,
          servings: 2,
          calories: 420,
          spice: 'hot'
        },
        {
          items: 'chickpeas, tomato, onion, lemon, olive oil, spinach, garlic',
          diet: 'vegan',
          cuisine: 'mediterranean',
          time: 28,
          servings: 2,
          calories: 380,
          spice: 'mild'
        }
      ];
      
      const sample = samples[Math.floor(Math.random() * samples.length)];
      
      if ($('#ingredients')) $('#ingredients').value = sample.items;
      if ($('#diet')) $('#diet').value = sample.diet;
      if ($('#cuisine')) $('#cuisine').value = sample.cuisine;
      if ($('#time')) $('#time').value = sample.time;
      if ($('#servings')) $('#servings').value = sample.servings;
      if ($('#calGoal')) $('#calGoal').value = sample.calories;
      
      // Update spice level
      $$('.toggle-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.value === sample.spice);
      });
      state.currentSpiceLevel = sample.spice;
      
      showToast('Sample loaded! 🎲');
      
      // Auto-generate
      setTimeout(() => {
        generateBtn?.click();
      }, 500);
    });
  }
  
  // Reset button
  const resetBtn = $('#resetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if ($('#ingredients')) $('#ingredients').value = '';
      if ($('#diet')) $('#diet').value = 'none';
      if ($('#cuisine')) $('#cuisine').value = 'auto';
      if ($('#time')) $('#time').value = '25';
      if ($('#servings')) $('#servings').value = '2';
      if ($('#calGoal')) $('#calGoal').value = '450';
      
      $$('.toggle-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.value === 'medium');
      });
      state.currentSpiceLevel = 'medium';
      
      const output = $('#recipeOutput');
      if (output) {
        output.innerHTML = `
          <div class="placeholder glass">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <h3>Recipe Ready to Generate</h3>
            <p>Enter your ingredients and preferences, then click "Generate Recipe" to get personalized meal suggestions</p>
          </div>
        `;
      }
      
      showToast('Form reset! 🧹');
    });
  }
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { auth, storage, showToast, modal };
}