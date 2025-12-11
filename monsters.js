/**
 * Monster Encounter System for Quit Journey
 * Random trigger challenges that appear during the journey
 */

class MonsterEncounterSystem {
  constructor(journeyInstance) {
    this.journey = journeyInstance;
    this.monstersDefeated = 0;
    this.encounterChance = 0.4; // 40% chance per milestone
    
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
      }
    ];
    
    this.initMonsterSystem();
  }
  
  initMonsterSystem() {
    // Add background monsters to journey path
    this.addBackgroundMonsters();
    
    // Hook into milestone system
    this.hookIntoMilestones();
    
    console.log('👾 Monster Encounter System activated');
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
    
    // Play encounter sound (if you want to add sound effects)
    console.log(`👾 ${monster.name} appeared!`);
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
      
      console.log(`⚔️ Defeated ${monster.name}! Total: ${this.monstersDefeated}`);
      
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
      
      console.log(`💔 Gave in to ${monster.name}. Keep trying!`);
    }
  }
  
  getStats() {
    return {
      monstersDefeated: this.monstersDefeated,
      encounterChance: this.encounterChance,
      totalMonsters: this.monsters.length
    };
  }
}

// Make available globally
window.MonsterEncounterSystem = MonsterEncounterSystem;
