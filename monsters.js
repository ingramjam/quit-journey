/**
 * Monster Encounter System for Quit Journey
 * Random trigger challenges that appear during the journey
 */

class MonsterEncounterSystem {
  constructor(journeyInstance) {
    this.journey = journeyInstance;
    this.monstersDefeated = 0;
    this.encounterChance = 0.7; // 70% chance per milestone
    
    // Monster database
    this.monsters = [
      {
        name: 'Cigarette Demon',
        sprite: '🚬',
        svgPath: 'assets/monster-cigarette.svg',
        message: '"Just one won\'t hurt..."',
        trigger: 'The smell of smoke is tempting...',
        linkedProducts: ['cigarettes']
      },
      {
        name: 'Vape Wraith',
        sprite: '💨',
        svgPath: 'assets/monster-vape.svg',
        message: '"Everyone else is doing it..."',
        trigger: 'Your friends are vaping nearby...',
        linkedProducts: ['vapes']
      },
      {
        name: 'Stress Goblin',
        sprite: '😰',
        svgPath: 'assets/monster-stress.svg',
        message: '"You need this to relax..."',
        trigger: 'Work pressure is building up...',
        linkedProducts: ['cigarettes', 'vapes', 'marijuana']
      },
      {
        name: 'Craving Beast',
        sprite: '👹',
        svgPath: 'assets/monster-craving.svg',
        message: '"You\'re not strong enough to resist..."',
        trigger: 'A sudden intense craving appears!',
        linkedProducts: ['cigarettes', 'vapes', 'marijuana', 'nicotine-pouches']
      },
      {
        name: 'Social Pressure Shadow',
        sprite: '👥',
        svgPath: 'assets/monster-stress.svg',
        message: '"Don\'t be boring, join us..."',
        trigger: 'Friends are pressuring you...',
        linkedProducts: ['cigarettes', 'vapes', 'marijuana']
      },
      {
        name: 'Boredom Phantom',
        sprite: '😑',
        svgPath: 'assets/monster-craving.svg',
        message: '"You have nothing better to do..."',
        trigger: 'Restless and bored...',
        linkedProducts: ['cigarettes', 'vapes', 'marijuana', 'nicotine-pouches']
      },
      {
        name: 'Morning Ritual Demon',
        sprite: '☕',
        svgPath: 'assets/monster-cigarette.svg',
        message: '"Coffee isn\'t the same without it..."',
        trigger: 'Your morning routine feels incomplete...',
        linkedProducts: ['cigarettes', 'vapes']
      },
      {
        name: 'Party Monster',
        sprite: '🎉',
        svgPath: 'assets/monster-craving.svg',
        message: '"Everyone\'s having fun except you..."',
        trigger: 'At a party, everyone else is indulging...',
        linkedProducts: ['cigarettes', 'vapes', 'marijuana']
      },
      {
        name: 'Anxiety Specter',
        sprite: '😱',
        svgPath: 'assets/monster-stress.svg',
        message: '"This will calm your nerves..."',
        trigger: 'Anxious thoughts are racing...',
        linkedProducts: ['cigarettes', 'vapes', 'marijuana']
      },
      {
        name: 'Break Time Troll',
        sprite: '⏰',
        svgPath: 'assets/monster-cigarette.svg',
        message: '"What else will you do on break?"',
        trigger: 'Taking a work break feels empty...',
        linkedProducts: ['cigarettes', 'vapes', 'nicotine-pouches']
      },
      {
        name: 'Celebration Imp',
        sprite: '🥳',
        svgPath: 'assets/monster-craving.svg',
        message: '"You deserve to celebrate!"',
        trigger: 'Good news! Time to reward yourself...',
        linkedProducts: ['cigarettes', 'vapes', 'marijuana']
      },
      {
        name: 'Habit Haunter',
        sprite: '👻',
        svgPath: 'assets/monster-stress.svg',
        message: '"Old habits die hard..."',
        trigger: 'Your body remembers the routine...',
        linkedProducts: ['cigarettes', 'vapes', 'marijuana', 'nicotine-pouches']
      }
        trigger: 'Friends are pressuring you...',
        linkedProducts: ['cigarettes', 'vapes', 'marijuana']
      },
      {
        name: 'Boredom Phantom',
        sprite: '😑',
        svgPath: 'assets/monster-craving.svg',
        message: '"You have nothing better to do..."',
        trigger: 'Restless and bored...',
        linkedProducts: ['cigarettes', 'vapes', 'marijuana', 'nicotine-pouches']
      }
    ];
    
    this.initMonsterSystem();
  }
  
  initMonsterSystem() {
    // Add background monsters to journey path
    this.addBackgroundMonsters();
    
    // Hook into milestone system
    this.hookIntoMilestones();
  }
  
  addBackgroundMonsters() {
    const journeyPath = document.querySelector('.journey-path');
    if (!journeyPath) return;
    
    // Add floating background monsters
    const bgMonsters = ['🚬', '💨', '😰', '👹'];
    bgMonsters.forEach((sprite, index) => {
      const monster = document.createElement('div');
      monster.className = 'bg-monster';
      monster.textContent = sprite;
      monster.style.top = `${20 + (index * 20)}%`;
      monster.style.left = index % 2 === 0 ? '10%' : 'auto';
      monster.style.right = index % 2 === 1 ? '15%' : 'auto';
      journeyPath.appendChild(monster);
    });
  }
  
  hookIntoMilestones() {
    const milestones = document.querySelectorAll('.milestone');
    
    milestones.forEach((milestone, index) => {
      // Add event listener when milestone becomes visible
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !milestone.dataset.monsterChecked) {
            milestone.dataset.monsterChecked = 'true';
            
            // Random chance for monster encounter
            if (Math.random() < this.encounterChance) {
              setTimeout(() => {
                this.triggerEncounter(milestone);
              }, 1000);
            }
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(milestone);
    });
  }
  
  triggerEncounter(nearMilestone) {
    // Filter monsters based on selected products
    const selectedProducts = this.journey.state.products;
    let availableMonsters = this.monsters;
    
    if (selectedProducts.length > 0) {
      availableMonsters = this.monsters.filter(monster => 
        monster.linkedProducts.some(product => selectedProducts.includes(product))
      );
    }
    
    if (availableMonsters.length === 0) {
      availableMonsters = this.monsters;
    }
    
    // Select random monster
    const monster = availableMonsters[Math.floor(Math.random() * availableMonsters.length)];
    
    // Create encounter overlay
    this.showMonsterBattle(monster, nearMilestone);
  }
  
  showMonsterBattle(monster, nearMilestone) {
    // Create encounter container
    const encounter = document.createElement('div');
    encounter.className = 'monster-encounter active';
    encounter.style.position = 'fixed';
    encounter.style.top = '0';
    encounter.style.left = '0';
    encounter.style.width = '100%';
    encounter.style.height = '100vh';
    encounter.style.background = 'rgba(0, 0, 0, 0.85)';
    
    encounter.innerHTML = `
      <div class="monster-battle">
        <div class="monster-sprite">${monster.sprite}</div>
        <h3 class="monster-name">⚠️ ${monster.name.toUpperCase()} ⚠️</h3>
        <p class="monster-message">${monster.trigger}</p>
        <p class="monster-message" style="color: #FF6B6B; margin-top: 1rem;">${monster.message}</p>
        <div class="monster-battle-options">
          <button class="battle-btn resist" data-action="resist">
            ⚔️ RESIST ⚔️
          </button>
          <button class="battle-btn give-in" data-action="give-in">
            💔 GIVE IN 💔
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(encounter);
    
    // Add event listeners
    const resistBtn = encounter.querySelector('[data-action="resist"]');
    const giveInBtn = encounter.querySelector('[data-action="give-in"]');
    
    resistBtn.addEventListener('click', () => {
      this.handleBattleChoice('resist', monster, encounter);
    });
    
    giveInBtn.addEventListener('click', () => {
      this.handleBattleChoice('give-in', monster, encounter);
    });
  }
  
  handleBattleChoice(choice, monster, encounterElement) {
    if (choice === 'resist') {
      // Victory!
      this.monstersDefeated++;
      
      // Show victory message
      const battle = encounterElement.querySelector('.monster-battle');
      battle.style.border = '4px solid #00FF00';
      battle.style.animation = 'none';
      battle.innerHTML = `
        <div class="monster-sprite" style="animation: none; opacity: 0.3;">💀</div>
        <h3 class="monster-name" style="color: #00FF00;">✅ VICTORY! ✅</h3>
        <p class="monster-message">You defeated ${monster.name}!</p>
        <p class="monster-message" style="color: #FFD700;">+100 EXP  |  Strength +1</p>
        <button class="battle-btn resist" style="margin-top: 2rem;" onclick="this.closest('.monster-encounter').remove()">
          ➡️ CONTINUE ➡️
        </button>
      `;
      
      // Track in state
      if (!this.journey.state.monstersDefeated) {
        this.journey.state.monstersDefeated = [];
      }
      this.journey.state.monstersDefeated.push({
        monster: monster.name,
        timestamp: new Date().toISOString()
      });
      
    } else {
      // Gave in - show consequences
      const battle = encounterElement.querySelector('.monster-battle');
      battle.style.border = '4px solid #FF0000';
      battle.style.animation = 'none';
      battle.innerHTML = `
        <div class="monster-sprite" style="animation: none;">${monster.sprite}</div>
        <h3 class="monster-name" style="color: #FF6B6B;">💔 OH NO... 💔</h3>
        <p class="monster-message">The trigger won this time...</p>
        <p class="monster-message" style="color: #FF6B6B;">But every journey has setbacks.</p>
        <p class="monster-message" style="color: #778DA9;">You're learning and getting stronger!</p>
        <button class="battle-btn resist" style="margin-top: 2rem; background: #1B263B; color: #FFD700;" onclick="this.closest('.monster-encounter').remove()">
          ➡️ KEEP GOING ➡️
        </button>
      `;
      
      // Track in state
      if (!this.journey.state.triggersEncountered) {
        this.journey.state.triggersEncountered = [];
      }
      this.journey.state.triggersEncountered.push({
        monster: monster.name,
        resisted: false,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  getStats() {
    return {
      monstersDefeated: this.monstersDefeated,
      encounterChance: this.encounterChance,
      totalMonsters: this.monsters.length
    };
  }
  
  createStatsCard() {
    const stats = this.journey.state;
    const level = this.calculateLevel();
    const defeatedList = stats.monstersDefeated || [];
    const triggersEncountered = stats.triggersEncountered || [];
    const totalEncounters = defeatedList.length + triggersEncountered.length;
    const resistRate = totalEncounters > 0 ? Math.round((defeatedList.length / totalEncounters) * 100) : 0;
    
    const statsCard = document.createElement('div');
    statsCard.className = 'stats-recap-card';
    statsCard.innerHTML = `
      <div class="stats-header">
        <h2 class="stats-title">⭐ QUEST COMPLETE! ⭐</h2>
        <div class="level-display">
          <span class="level-badge">LVL ${level}</span>
          <div class="level-title">${this.getLevelTitle(level)}</div>
        </div>
      </div>
      
      <div class="stats-body">
        <div class="stat-row">
          <span class="stat-label">👾 Monsters Defeated:</span>
          <span class="stat-value">${defeatedList.length}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">⚔️ Battles Faced:</span>
          <span class="stat-value">${totalEncounters}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">💪 Resist Rate:</span>
          <span class="stat-value">${resistRate}%</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">🎒 Products Selected:</span>
          <span class="stat-value">${stats.products?.length || 0}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">🗺️ Milestones Answered:</span>
          <span class="stat-value">${Object.keys(stats.answers || {}).length}</span>
        </div>
      </div>
      
      ${defeatedList.length > 0 ? `
        <div class="defeated-monsters">
          <h3 class="defeated-title">🏆 Defeated Enemies:</h3>
          <div class="monster-badges">
            ${defeatedList.map(m => `<span class="monster-badge">${m.monster}</span>`).join('')}
          </div>
        </div>
      ` : ''}
      
      <div class="stats-footer">
        <p class="encouragement">${this.getEncouragementMessage(resistRate)}</p>
        <button class="stats-close-btn" onclick="this.closest('.stats-recap-card').remove()">
          ✨ CONTINUE ✨
        </button>
      </div>
    `;
    
    return statsCard;
  }
  
  calculateLevel() {
    // Level based on monsters defeated + milestones completed
    const defeatedCount = (this.journey.state.monstersDefeated || []).length;
    const milestonesCount = Object.keys(this.journey.state.answers || {}).length;
    const totalPoints = (defeatedCount * 10) + (milestonesCount * 5);
    
    if (totalPoints >= 100) return 10;
    if (totalPoints >= 80) return 9;
    if (totalPoints >= 60) return 8;
    if (totalPoints >= 50) return 7;
    if (totalPoints >= 40) return 6;
    if (totalPoints >= 30) return 5;
    if (totalPoints >= 20) return 4;
    if (totalPoints >= 10) return 3;
    if (totalPoints >= 5) return 2;
    return 1;
  }
  
  getLevelTitle(level) {
    const titles = {
      1: 'NOVICE WARRIOR',
      2: 'APPRENTICE FIGHTER',
      3: 'SKILLED DEFENDER',
      4: 'BRAVE CHAMPION',
      5: 'ELITE GUARDIAN',
      6: 'MASTER SLAYER',
      7: 'LEGENDARY HERO',
      8: 'MYTHIC CONQUEROR',
      9: 'DIVINE PROTECTOR',
      10: 'ULTIMATE LEGEND'
    };
    return titles[level] || 'WARRIOR';
  }
  
  getEncouragementMessage(resistRate) {
    if (resistRate >= 90) return '🌟 INCREDIBLE! You\'re a true champion of willpower!';
    if (resistRate >= 75) return '💪 AMAZING! Your strength is inspiring!';
    if (resistRate >= 50) return '⚔️ STRONG WORK! You\'re building powerful resistance!';
    if (resistRate >= 25) return '🛡️ GOOD START! Every battle makes you stronger!';
    return '💚 BRAVE EFFORT! The journey continues, warrior!';
  }
}

// Make available globally
window.MonsterEncounterSystem = MonsterEncounterSystem;
