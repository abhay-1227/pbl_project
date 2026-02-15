// ========================================
// NUTRITION TRACKER JAVASCRIPT
// ========================================

// State management
const nutritionState = {
  currentDate: new Date().toISOString().split('T')[0],
  dailyTargets: {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fats: 65
  },
  microTargets: {
    vitaminA: 900,
    vitaminC: 90,
    calcium: 1000,
    iron: 18,
    potassium: 3500,
    fiber: 30
  }
};

// Get user-specific storage key
const getUserKey = (key) => {
  const user = typeof auth !== 'undefined' ? auth.getCurrentUser() : null;
  return user ? `${key}_${user.id}` : key;
};

// Load daily data
const loadDailyData = (date) => {
  const key = getUserKey(`nutrition_${date}`);
  return storage.get(key) || {
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: []
  };
};

// Save daily data
const saveDailyData = (date, data) => {
  const key = getUserKey(`nutrition_${date}`);
  storage.set(key, data);
};

// Calculate totals for a meal
const calculateMealTotals = (items) => {
  return items.reduce((acc, item) => ({
    calories: acc.calories + item.calories,
    protein: acc.protein + item.protein,
    carbs: acc.carbs + item.carbs,
    fats: acc.fats + item.fats
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
};

// Calculate daily totals
const calculateDailyTotals = (data) => {
  const meals = ['breakfast', 'lunch', 'dinner', 'snacks'];
  return meals.reduce((acc, meal) => {
    const mealTotal = calculateMealTotals(data[meal] || []);
    return {
      calories: acc.calories + mealTotal.calories,
      protein: acc.protein + mealTotal.protein,
      carbs: acc.carbs + mealTotal.carbs,
      fats: acc.fats + mealTotal.fats
    };
  }, { calories: 0, protein: 0, carbs: 0, fats: 0 });
};

// Update summary cards
const updateSummaryCards = () => {
  const data = loadDailyData(nutritionState.currentDate);
  const totals = calculateDailyTotals(data);
  
  // Update calories
  const caloriesCurrent = $('#caloriesCurrent');
  const caloriesProgress = $('#caloriesProgress');
  if (caloriesCurrent) caloriesCurrent.textContent = Math.round(totals.calories);
  if (caloriesProgress) {
    const percent = (totals.calories / nutritionState.dailyTargets.calories) * 100;
    caloriesProgress.style.width = `${Math.min(percent, 100)}%`;
  }
  
  // Update protein
  const proteinCurrent = $('#proteinCurrent');
  const proteinProgress = $('#proteinProgress');
  if (proteinCurrent) proteinCurrent.textContent = Math.round(totals.protein);
  if (proteinProgress) {
    const percent = (totals.protein / nutritionState.dailyTargets.protein) * 100;
    proteinProgress.style.width = `${Math.min(percent, 100)}%`;
  }
  
  // Update carbs
  const carbsCurrent = $('#carbsCurrent');
  const carbsProgress = $('#carbsProgress');
  if (carbsCurrent) carbsCurrent.textContent = Math.round(totals.carbs);
  if (carbsProgress) {
    const percent = (totals.carbs / nutritionState.dailyTargets.carbs) * 100;
    carbsProgress.style.width = `${Math.min(percent, 100)}%`;
  }
  
  // Update fats
  const fatsCurrent = $('#fatsCurrent');
  const fatsProgress = $('#fatsProgress');
  if (fatsCurrent) fatsCurrent.textContent = Math.round(totals.fats);
  if (fatsProgress) {
    const percent = (totals.fats / nutritionState.dailyTargets.fats) * 100;
    fatsProgress.style.width = `${Math.min(percent, 100)}%`;
  }
  
  // Update micronutrients (estimated based on food intake)
  const microEstimates = {
    vitaminA: totals.calories * 0.45,
    vitaminC: totals.calories * 0.045,
    calcium: totals.calories * 0.5,
    iron: totals.calories * 0.009,
    potassium: totals.calories * 1.75,
    fiber: totals.carbs * 0.12
  };
  
  Object.keys(microEstimates).forEach(nutrient => {
    const el = $(`#${nutrient}`);
    const fill = $(`#${nutrient}Fill`);
    if (el) el.textContent = Math.round(microEstimates[nutrient]);
    if (fill) {
      const percent = (microEstimates[nutrient] / nutritionState.microTargets[nutrient]) * 100;
      fill.style.width = `${Math.min(percent, 100)}%`;
    }
  });
};

// Render meal items
const renderMealItems = (meal) => {
  const data = loadDailyData(nutritionState.currentDate);
  const items = data[meal] || [];
  const container = $(`#${meal}Items`);
  const caloriesEl = $(`#${meal}Calories`);
  
  if (!container) return;
  
  if (items.length === 0) {
    container.innerHTML = '<p class="empty-state">No items added yet</p>';
    if (caloriesEl) caloriesEl.textContent = '0 kcal';
    return;
  }
  
  const totalCalories = items.reduce((sum, item) => sum + item.calories, 0);
  if (caloriesEl) caloriesEl.textContent = `${Math.round(totalCalories)} kcal`;
  
  container.innerHTML = items.map((item, index) => `
    <div class="meal-item">
      <div class="item-info">
        <h4>${item.name}</h4>
        <p>${item.quantity} ${item.unit}</p>
      </div>
      <div class="item-nutrients">
        <div class="nutrient">
          <span class="nutrient-value">${Math.round(item.calories)}</span>
          <span class="nutrient-label">Cal</span>
        </div>
        <div class="nutrient">
          <span class="nutrient-value">${item.protein.toFixed(1)}</span>
          <span class="nutrient-label">P</span>
        </div>
        <div class="nutrient">
          <span class="nutrient-value">${item.carbs.toFixed(1)}</span>
          <span class="nutrient-label">C</span>
        </div>
        <div class="nutrient">
          <span class="nutrient-value">${item.fats.toFixed(1)}</span>
          <span class="nutrient-label">F</span>
        </div>
      </div>
      <div class="item-actions">
        <button class="btn-item delete" data-meal="${meal}" data-index="${index}" aria-label="Delete item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </div>
  `).join('');
  
  // Add delete listeners
  container.querySelectorAll('.btn-item.delete').forEach(btn => {
    btn.addEventListener('click', () => {
      const mealType = btn.dataset.meal;
      const index = parseInt(btn.dataset.index);
      deleteMealItem(mealType, index);
    });
  });
};

// Delete meal item
const deleteMealItem = (meal, index) => {
  const data = loadDailyData(nutritionState.currentDate);
  data[meal].splice(index, 1);
  saveDailyData(nutritionState.currentDate, data);
  renderMealItems(meal);
  updateSummaryCards();
  showToast('Item deleted');
};

// Add food item
const addFoodItem = (meal, foodData) => {
  const data = loadDailyData(nutritionState.currentDate);
  data[meal].push(foodData);
  saveDailyData(nutritionState.currentDate, data);
  renderMealItems(meal);
  updateSummaryCards();
};

// Change date
const changeDate = (days) => {
  const currentDate = new Date(nutritionState.currentDate);
  currentDate.setDate(currentDate.getDate() + days);
  nutritionState.currentDate = currentDate.toISOString().split('T')[0];
  updateDateDisplay();
  loadAndRenderData();
};

// Update date display
const updateDateDisplay = () => {
  const dateInput = $('#dateInput');
  if (dateInput) {
    dateInput.value = nutritionState.currentDate;
  }
};

// Load and render all data
const loadAndRenderData = () => {
  ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(meal => {
    renderMealItems(meal);
  });
  updateSummaryCards();
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  if (!window.location.pathname.includes('nutrition-tracker')) return;
  
  // Set initial date
  updateDateDisplay();
  loadAndRenderData();
  
  // Date navigation
  const prevDay = $('#prevDay');
  if (prevDay) {
    prevDay.addEventListener('click', () => changeDate(-1));
  }
  
  const nextDay = $('#nextDay');
  if (nextDay) {
    nextDay.addEventListener('click', () => changeDate(1));
  }
  
  const todayBtn = $('#todayBtn');
  if (todayBtn) {
    todayBtn.addEventListener('click', () => {
      nutritionState.currentDate = new Date().toISOString().split('T')[0];
      updateDateDisplay();
      loadAndRenderData();
      showToast('Jumped to today');
    });
  }
  
  const dateInput = $('#dateInput');
  if (dateInput) {
    dateInput.addEventListener('change', (e) => {
      nutritionState.currentDate = e.target.value;
      loadAndRenderData();
    });
  }
  
  // Add food buttons
  let currentMeal = '';
  $$('.btn-add').forEach(btn => {
    btn.addEventListener('click', () => {
      currentMeal = btn.dataset.meal;
      const label = $('#mealTypeLabel');
      if (label) {
        label.textContent = currentMeal.charAt(0).toUpperCase() + currentMeal.slice(1);
      }
      modal.open('addFoodModal');
    });
  });
  
  // Close add food modal
  const addFoodClose = $('#addFoodClose');
  if (addFoodClose) {
    addFoodClose.addEventListener('click', () => modal.close('addFoodModal'));
  }
  
  // Add food form
  const addFoodForm = $('#addFoodForm');
  if (addFoodForm) {
    addFoodForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const foodData = {
        name: $('#foodName').value,
        quantity: parseFloat($('#foodQuantity').value),
        unit: $('#foodUnit').value,
        calories: parseFloat($('#foodCalories').value),
        protein: parseFloat($('#foodProtein').value),
        carbs: parseFloat($('#foodCarbs').value),
        fats: parseFloat($('#foodFats').value)
      };
      
      addFoodItem(currentMeal, foodData);
      modal.close('addFoodModal');
      addFoodForm.reset();
      showToast('Food added! 🍽️');
    });
  }
});