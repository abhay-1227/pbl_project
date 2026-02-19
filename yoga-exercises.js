// ========================================
// YOGA & EXERCISES JAVASCRIPT
// ========================================

// Comprehensive yoga asanas database
const yogaDatabase = [
  // Surya Namaskar (Sun Salutation)
  {
    id: 1,
    name: 'Surya Namaskar',
    sanskrit: 'सूर्य नमस्कार',
    emoji: '🌅',
    level: 'beginner',
    duration: '10-15 mins',
    focus: ['flexibility', 'strength', 'balance'],
    description: 'A complete sequence of 12 powerful yoga poses that provide a great cardiovascular workout.',
    benefits: [
      'Improves blood circulation',
      'Strengthens muscles and joints',
      'Aids in weight loss',
      'Improves digestive system',
      'Enhances mental clarity'
    ],
    steps: [
      'Stand straight with feet together (Pranamasana)',
      'Raise arms overhead, arch back (Hasta Uttanasana)',
      'Bend forward, touch feet (Padahastasana)',
      'Right leg back, look up (Ashwa Sanchalanasana)',
      'Plank position (Dandasana)',
      'Lower body, 8 points touching ground (Ashtanga Namaskara)',
      'Lift chest, cobra pose (Bhujangasana)',
      'Hips up, downward dog (Adho Mukha Svanasana)',
      'Right foot forward (Ashwa Sanchalanasana)',
      'Forward fold (Padahastasana)',
      'Rise up, arms overhead (Hasta Uttanasana)',
      'Return to standing (Pranamasana)'
    ],
    precautions: [
      'Avoid if you have high blood pressure',
      'Not recommended during pregnancy',
      'Take it slow if you have back problems'
    ]
  },
  
  // Standing Asanas
  {
    id: 2,
    name: 'Tadasana',
    sanskrit: 'ताडासन (Mountain Pose)',
    emoji: '🧘',
    level: 'beginner',
    duration: '5-10 mins',
    focus: ['balance', 'strength'],
    description: 'The foundation of all standing poses, promoting proper alignment and posture.',
    benefits: ['Improves posture', 'Strengthens thighs and ankles', 'Increases awareness', 'Reduces flat feet'],
    steps: [
      'Stand with feet together, arms at sides',
      'Distribute weight evenly on both feet',
      'Engage thigh muscles, lift kneecaps',
      'Draw belly in, lift chest',
      'Relax shoulders, arms hanging',
      'Gaze forward, breathe steadily',
      'Hold for 30-60 seconds'
    ],
    precautions: ['Be careful if you have headaches or low blood pressure']
  },
  
  {
    id: 3,
    name: 'Vrikshasana',
    sanskrit: 'वृक्षासन (Tree Pose)',
    emoji: '🌳',
    level: 'beginner',
    duration: '5-10 mins',
    focus: ['balance', 'strength'],
    description: 'A balancing pose that builds focus and strengthens the legs.',
    benefits: ['Improves balance', 'Strengthens legs', 'Opens hips', 'Improves concentration'],
    steps: [
      'Stand in Tadasana',
      'Shift weight to left foot',
      'Bend right knee, place foot on inner left thigh',
      'Press foot and thigh together',
      'Hands in prayer position at chest',
      'Hold balance for 30 seconds',
      'Repeat on other side'
    ],
    precautions: ['Hold wall if needed for balance', 'Avoid if you have recent knee or hip injury']
  },
  
  {
    id: 4,
    name: 'Trikonasana',
    sanskrit: 'त्रिकोणासन (Triangle Pose)',
    emoji: '📐',
    level: 'intermediate',
    duration: '10-15 mins',
    focus: ['flexibility', 'strength'],
    description: 'A powerful standing pose that stretches and strengthens the entire body.',
    benefits: ['Stretches legs and hips', 'Improves digestion', 'Reduces anxiety', 'Strengthens core'],
    steps: [
      'Stand with feet 3-4 feet apart',
      'Turn right foot out 90 degrees',
      'Extend arms parallel to floor',
      'Reach right hand toward right foot',
      'Place hand on shin, ankle, or floor',
      'Extend left arm up',
      'Gaze at left thumb',
      'Hold 30 seconds, repeat other side'
    ],
    precautions: ['Avoid if you have low blood pressure', 'Modify if you have neck problems']
  },
  
  // Seated Asanas
  {
    id: 5,
    name: 'Padmasana',
    sanskrit: 'पद्मासन (Lotus Pose)',
    emoji: '🪷',
    level: 'advanced',
    duration: '10-20 mins',
    focus: ['flexibility', 'relaxation'],
    description: 'The classic meditation pose that calms the mind and opens the hips.',
    benefits: ['Improves posture', 'Opens hips', 'Calms mind', 'Improves digestion', 'Good for meditation'],
    steps: [
      'Sit on floor with legs extended',
      'Bend right knee, place foot on left thigh',
      'Bend left knee, place foot on right thigh',
      'Keep spine straight',
      'Rest hands on knees in mudra',
      'Close eyes, breathe deeply',
      'Hold as long as comfortable'
    ],
    precautions: ['Not for knee or ankle injuries', 'Start with half lotus if needed']
  },
  
  {
    id: 6,
    name: 'Paschimottanasana',
    sanskrit: 'पश्चिमोत्तानासन (Seated Forward Bend)',
    emoji: '🙇',
    level: 'beginner',
    duration: '10-15 mins',
    focus: ['flexibility'],
    description: 'A deep forward fold that stretches the entire back of the body.',
    benefits: ['Stretches spine and hamstrings', 'Calms mind', 'Improves digestion', 'Reduces stress'],
    steps: [
      'Sit with legs extended forward',
      'Inhale, raise arms overhead',
      'Exhale, fold forward from hips',
      'Reach for feet or shins',
      'Keep spine long',
      'Hold 1-3 minutes',
      'Breathe deeply throughout'
    ],
    precautions: ['Avoid if you have back injury', 'Bend knees if needed']
  },
  
  // Backbends
  {
    id: 7,
    name: 'Bhujangasana',
    sanskrit: 'भुजंगासन (Cobra Pose)',
    emoji: '🐍',
    level: 'beginner',
    duration: '5-10 mins',
    focus: ['flexibility', 'strength'],
    description: 'A gentle backbend that strengthens the spine and opens the chest.',
    benefits: ['Strengthens spine', 'Opens chest and lungs', 'Stimulates abdominal organs', 'Relieves stress'],
    steps: [
      'Lie face down, legs extended',
      'Place hands under shoulders',
      'Press tops of feet into floor',
      'Inhale, lift chest off floor',
      'Keep elbows slightly bent',
      'Draw shoulders back',
      'Hold 15-30 seconds',
      'Exhale to lower down'
    ],
    precautions: ['Avoid if pregnant', 'Be careful with back injuries']
  },
  
  {
    id: 8,
    name: 'Dhanurasana',
    sanskrit: 'धनुरासन (Bow Pose)',
    emoji: '🏹',
    level: 'intermediate',
    duration: '10-15 mins',
    focus: ['flexibility', 'strength'],
    description: 'An energizing backbend that stretches the entire front of the body.',
    benefits: ['Stretches entire front body', 'Strengthens back muscles', 'Improves posture', 'Stimulates organs'],
    steps: [
      'Lie on stomach, arms at sides',
      'Bend knees, bring heels toward buttocks',
      'Reach back, grab ankles',
      'Inhale, lift chest and legs',
      'Pull legs up and back',
      'Gaze forward',
      'Hold 20-30 seconds',
      'Exhale to release'
    ],
    precautions: ['Avoid if pregnant or have high blood pressure', 'Not for severe back problems']
  },
  
  // Twists
  {
    id: 9,
    name: 'Ardha Matsyendrasana',
    sanskrit: 'अर्ध मत्स्येन्द्रासन (Half Lord of Fishes)',
    emoji: '🌀',
    level: 'intermediate',
    duration: '10-15 mins',
    focus: ['flexibility'],
    description: 'A seated twist that improves spinal mobility and aids digestion.',
    benefits: ['Increases spinal flexibility', 'Stimulates digestive system', 'Energizes spine', 'Detoxifies organs'],
    steps: [
      'Sit with legs extended',
      'Bend right knee, place foot outside left thigh',
      'Bend left knee, tuck foot near right hip',
      'Twist torso to right',
      'Place left elbow outside right knee',
      'Right hand behind on floor',
      'Gaze over right shoulder',
      'Hold 30-60 seconds each side'
    ],
    precautions: ['Avoid if you have back or spine injury', 'Be gentle with the twist']
  },
  
  // Inversions
  {
    id: 10,
    name: 'Sirsasana',
    sanskrit: 'शीर्षासन (Headstand)',
    emoji: '🤸',
    level: 'advanced',
    duration: '10-20 mins',
    focus: ['balance', 'strength'],
    description: 'The king of asanas that improves blood flow to the brain.',
    benefits: ['Improves focus', 'Strengthens core and arms', 'Improves circulation', 'Calms nervous system'],
    steps: [
      'Start in tabletop position',
      'Interlace fingers, place forearms on floor',
      'Place crown of head on floor',
      'Walk feet toward head',
      'Slowly lift legs up',
      'Engage core for balance',
      'Hold for desired duration',
      'Come down slowly'
    ],
    precautions: ['Practice under supervision', 'Avoid if you have neck problems', 'Not for high blood pressure']
  },
  
  {
    id: 11,
    name: 'Sarvangasana',
    sanskrit: 'सर्वांगासन (Shoulder Stand)',
    emoji: '🕴️',
    level: 'intermediate',
    duration: '10-15 mins',
    focus: ['balance', 'flexibility'],
    description: 'The queen of asanas that benefits the entire body.',
    benefits: ['Improves thyroid function', 'Calms nervous system', 'Strengthens upper body', 'Improves digestion'],
    steps: [
      'Lie on back, arms at sides',
      'Lift legs to 90 degrees',
      'Press arms down, lift hips',
      'Support lower back with hands',
      'Walk shoulders under body',
      'Extend legs up',
      'Hold 1-5 minutes',
      'Lower slowly with control'
    ],
    precautions: ['Avoid during menstruation', 'Not for neck injuries', 'Use blanket under shoulders']
  },
  
  // Pranayama (Breathing Exercises)
  {
    id: 12,
    name: 'Anulom Vilom',
    sanskrit: 'अनुलोम विलोम (Alternate Nostril Breathing)',
    emoji: '🌬️',
    level: 'beginner',
    duration: '10-20 mins',
    focus: ['breathing', 'relaxation'],
    description: 'A calming breathing technique that balances the nervous system.',
    benefits: ['Reduces stress', 'Improves lung capacity', 'Balances energy', 'Enhances focus'],
    steps: [
      'Sit comfortably with spine straight',
      'Close right nostril with right thumb',
      'Inhale through left nostril',
      'Close left nostril with ring finger',
      'Release right nostril, exhale',
      'Inhale through right nostril',
      'Close right, exhale through left',
      'Continue for 10-20 minutes'
    ],
    precautions: ['Practice on empty stomach', 'Breathe naturally, don't force']
  },
  
  {
    id: 13,
    name: 'Kapalbhati',
    sanskrit: 'कपालभाति (Skull Shining Breath)',
    emoji: '💨',
    level: 'intermediate',
    duration: '5-10 mins',
    focus: ['breathing', 'strength'],
    description: 'An energizing breathing technique that cleanses the respiratory system.',
    benefits: ['Cleanses lungs', 'Energizes body', 'Improves digestion', 'Reduces belly fat'],
    steps: [
      'Sit in comfortable position',
      'Take deep breath in',
      'Exhale forcefully through nose',
      'Let inhalation happen passively',
      'Continue rapid exhalations',
      'Do 20-30 breaths per round',
      'Practice 3-5 rounds'
    ],
    precautions: ['Not for high blood pressure', 'Avoid during pregnancy', 'Stop if you feel dizzy']
  },
  
  {
    id: 14,
    name: 'Bhramari',
    sanskrit: 'भ्रामरी (Bee Breath)',
    emoji: '🐝',
    level: 'beginner',
    duration: '5-10 mins',
    focus: ['breathing', 'relaxation'],
    description: 'A calming breath that soothes the nervous system.',
    benefits: ['Reduces stress', 'Lowers blood pressure', 'Calms mind', 'Improves concentration'],
    steps: [
      'Sit comfortably, close eyes',
      'Place index fingers on ears',
      'Take deep breath in',
      'Exhale while making humming sound',
      'Feel vibration in head',
      'Continue for 5-10 breaths',
      'Practice daily for best results'
    ],
    precautions: ['Practice in quiet space', 'Don't press too hard on ears']
  },
  
  // Relaxation
  {
    id: 15,
    name: 'Shavasana',
    sanskrit: 'शवासन (Corpse Pose)',
    emoji: '😌',
    level: 'beginner',
    duration: '10-20 mins',
    focus: ['relaxation'],
    description: 'The ultimate relaxation pose that integrates the practice.',
    benefits: ['Deep relaxation', 'Reduces stress', 'Lowers blood pressure', 'Improves sleep'],
    steps: [
      'Lie on back, legs extended',
      'Let feet fall open naturally',
      'Arms at sides, palms up',
      'Close eyes gently',
      'Relax entire body',
      'Breathe naturally',
      'Stay for 10-20 minutes',
      'Come out slowly'
    ],
    precautions: ['Use blanket if cold', 'Support head if needed']
  },
  
  // Core Strengthening
  {
    id: 16,
    name: 'Navasana',
    sanskrit: 'नावासन (Boat Pose)',
    emoji: '⛵',
    level: 'intermediate',
    duration: '5-10 mins',
    focus: ['strength'],
    description: 'A powerful core strengthening pose.',
    benefits: ['Strengthens core', 'Improves digestion', 'Stimulates organs', 'Improves balance'],
    steps: [
      'Sit with knees bent, feet on floor',
      'Lean back slightly',
      'Lift feet off floor',
      'Extend legs to 45 degrees',
      'Reach arms forward',
      'Keep spine straight',
      'Hold 10-30 seconds',
      'Repeat 3-5 times'
    ],
    precautions: ['Not during pregnancy', 'Avoid with lower back pain']
  },
  
  {
    id: 17,
    name: 'Chaturanga Dandasana',
    sanskrit: 'चतुरंग दंडासन (Four-Limbed Staff Pose)',
    emoji: '💪',
    level: 'intermediate',
    duration: '5-10 mins',
    focus: ['strength'],
    description: 'A challenging arm balance that builds full-body strength.',
    benefits: ['Strengthens arms and core', 'Improves posture', 'Builds stamina', 'Tones body'],
    steps: [
      'Start in plank position',
      'Shift forward on toes',
      'Bend elbows to 90 degrees',
      'Keep elbows close to body',
      'Body in straight line',
      'Hold 10-30 seconds',
      'Lower to floor or push up'
    ],
    precautions: ['Not for wrist or shoulder injuries', 'Build strength gradually']
  },
  
  // Hip Openers
  {
    id: 18,
    name: 'Baddha Konasana',
    sanskrit: 'बद्ध कोणासन (Bound Angle Pose)',
    emoji: '🦋',
    level: 'beginner',
    duration: '10-15 mins',
    focus: ['flexibility'],
    description: 'A gentle hip opener that promotes relaxation.',
    benefits: ['Opens hips', 'Improves flexibility', 'Stimulates organs', 'Good for menstrual discomfort'],
    steps: [
      'Sit with legs extended',
      'Bend knees, bring soles together',
      'Hold feet with hands',
      'Bring heels close to pelvis',
      'Let knees drop toward floor',
      'Keep spine straight',
      'Hold 1-5 minutes',
      'Breathe deeply'
    ],
    precautions: ['Support knees with blocks if needed', 'Be gentle with tight hips']
  },
  
  {
    id: 19,
    name: 'Malasana',
    sanskrit: 'मालासन (Garland Pose)',
    emoji: '🧎',
    level: 'beginner',
    duration: '5-10 mins',
    focus: ['flexibility'],
    description: 'A deep squat that opens the hips and strengthens the lower body.',
    benefits: ['Opens hips and groin', 'Improves digestion', 'Strengthens ankles', 'Good for childbirth preparation'],
    steps: [
      'Stand with feet wider than hips',
      'Turn toes out slightly',
      'Squat down, keep heels on floor',
      'Bring palms together at chest',
      'Press elbows against inner knees',
      'Lengthen spine',
      'Hold 30 seconds to 1 minute'
    ],
    precautions: ['Support heels with blanket if needed', 'Avoid with knee problems']
  },
  
  {
    id: 20,
    name: 'Virabhadrasana I',
    sanskrit: 'वीरभद्रासन I (Warrior I)',
    emoji: '⚔️',
    level: 'beginner',
    duration: '10-15 mins',
    focus: ['strength', 'balance'],
    description: 'A powerful standing pose that builds strength and stamina.',
    benefits: ['Strengthens legs', 'Opens hips and chest', 'Improves focus', 'Builds stamina'],
    steps: [
      'Stand with feet 3-4 feet apart',
      'Turn right foot out 90 degrees',
      'Turn left foot in slightly',
      'Rotate hips to face right',
      'Bend right knee over right ankle',
      'Raise arms overhead',
      'Gaze up at hands',
      'Hold 30-60 seconds each side'
    ],
    precautions: ['Be careful with knee problems', 'Modify if you have neck issues']
  }
];

// Filter exercises
const filterExercises = () => {
  const level = $('#levelFilter')?.value || 'all';
  const duration = $('#durationFilter')?.value || 'all';
  const focus = $('#focusFilter')?.value || 'all';
  
  let filtered = yogaDatabase;
  
  if (level !== 'all') {
    filtered = filtered.filter(ex => ex.level === level);
  }
  
  if (duration !== 'all') {
    filtered = filtered.filter(ex => {
      const mins = parseInt(ex.duration);
      if (duration === 'short') return mins <= 15;
      if (duration === 'medium') return mins > 15 && mins <= 30;
      if (duration === 'long') return mins > 30;
      return true;
    });
  }
  
  if (focus !== 'all') {
    filtered = filtered.filter(ex => ex.focus.includes(focus));
  }
  
  return filtered;
};

// Render exercises
const renderExercises = () => {
  const grid = $('#exercisesGrid');
  if (!grid) return;
  
  const exercises = filterExercises();
  
  if (exercises.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 4rem;">No exercises found matching your filters.</p>';
    return;
  }
  
  grid.innerHTML = exercises.map(ex => `
    <div class="exercise-card fade-in" data-id="${ex.id}">
      <div class="exercise-header">
        <div class="exercise-emoji">${ex.emoji}</div>
        <div class="exercise-meta">
          <span class="exercise-level ${ex.level}">${ex.level}</span>
          <span class="exercise-duration">⏱️ ${ex.duration}</span>
        </div>
      </div>
      <h3>${ex.name}</h3>
      <p class="exercise-sanskrit">${ex.sanskrit}</p>
      <p>${ex.description}</p>
      <div class="exercise-benefits">
        ${ex.focus.map(f => `<span class="benefit-tag">${f}</span>`).join('')}
      </div>
    </div>
  `).join('');
  
  // Add click listeners
  grid.querySelectorAll('.exercise-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = parseInt(card.dataset.id);
      showExerciseDetail(id);
    });
  });
};

// Show exercise detail
const showExerciseDetail = (id) => {
  const exercise = yogaDatabase.find(ex => ex.id === id);
  if (!exercise) return;
  
  const detail = $('#exerciseDetail');
  if (!detail) return;
  
  detail.innerHTML = `
    <div class="exercise-detail-header">
      <div class="exercise-detail-emoji">${exercise.emoji}</div>
      <h2>${exercise.name}</h2>
      <p class="exercise-detail-sanskrit">${exercise.sanskrit}</p>
      <div class="detail-meta">
        <span class="exercise-level ${exercise.level}">${exercise.level}</span>
        <span class="exercise-duration">⏱️ ${exercise.duration}</span>
        ${exercise.focus.map(f => `<span class="benefit-tag">${f}</span>`).join('')}
      </div>
    </div>
    
    <div class="detail-section">
      <h3>Description</h3>
      <p>${exercise.description}</p>
    </div>
    
    <div class="detail-section">
      <h3>Benefits</h3>
      <ul>
        ${exercise.benefits.map(b => `<li>${b}</li>`).join('')}
      </ul>
    </div>
    
    <div class="detail-section">
      <h3>Step-by-Step Instructions</h3>
      <ol>
        ${exercise.steps.map(s => `<li>${s}</li>`).join('')}
      </ol>
    </div>
    
    ${exercise.precautions ? `
      <div class="detail-section">
        <h3>⚠️ Precautions</h3>
        <ul>
          ${exercise.precautions.map(p => `<li>${p}</li>`).join('')}
        </ul>
      </div>
    ` : ''}
  `;
  
  modal.open('exerciseModal');
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  if (!window.location.pathname.includes('yoga-exercises')) return;
  
  // Initial render
  renderExercises();
  
  // Filter listeners
  const filters = ['#levelFilter', '#durationFilter', '#focusFilter'];
  filters.forEach(selector => {
    const el = $(selector);
    if (el) {
      el.addEventListener('change', () => {
        renderExercises();
        showToast('Filters applied');
      });
    }
  });
  
  // Reset filters
  const resetFilters = $('#resetFilters');
  if (resetFilters) {
    resetFilters.addEventListener('click', () => {
      if ($('#levelFilter')) $('#levelFilter').value = 'all';
      if ($('#durationFilter')) $('#durationFilter').value = 'all';
      if ($('#focusFilter')) $('#focusFilter').value = 'all';
      renderExercises();
      showToast('Filters reset');
    });
  }
  
  // Close exercise modal
  const exerciseClose = $('#exerciseClose');
  if (exerciseClose) {
    exerciseClose.addEventListener('click', () => modal.close('exerciseModal'));
  }
  
  // Category cards
  $$('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      const category = card.dataset.category;
      
      // Set filters based on category
      if (category === 'suryanam') {
        $('#levelFilter').value = 'beginner';
        showExerciseDetail(1); // Surya Namaskar
      } else if (category === 'pranayama') {
        $('#focusFilter').value = 'breathing';
        renderExercises();
        showToast('Showing Pranayama exercises');
      } else if (category === 'asanas') {
        $('#focusFilter').value = 'all';
        renderExercises();
        showToast('Showing all asanas');
      } else if (category === 'meditation') {
        $('#focusFilter').value = 'relaxation';
        renderExercises();
        showToast('Showing meditation practices');
      }
    });
  });
});