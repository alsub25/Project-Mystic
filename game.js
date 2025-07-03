// game.js

window.addEventListener('DOMContentLoaded', () => {

  // ==============================
  // DATA DEFINITIONS
  // ==============================

  const raceData = {
    Human:      { Strength:1, Vitality:1, Agility:1, Defense:1, Intelligence:1, Luck:1, "Critical Strike":1, Speed:1, Mana:1, Endurance:1 },
    Elf:        { Agility:2, Intelligence:2, Luck:1 },
    Dwarf:      { Vitality:2, Defense:2, Endurance:1 },
    Orc:        { Strength:2, Vitality:1, Defense:1 },
    Gnome:      { Intelligence:2, Mana:2, Agility:1 }
  };

  const classData = {
    Warrior:     { maxHp:120, attackMin:12, attackMax:18, maxMana:0   },
    Mage:        { maxHp: 80, attackMin: 8, attackMax:14, maxMana:100 },
    Rogue:       { maxHp: 90, attackMin:10, attackMax:16, maxMana:0   },
    Paladin:     { maxHp:110, attackMin:10, attackMax:15, maxMana:50  },
    Hunter:      { maxHp:100, attackMin:11, attackMax:17, maxMana:0   },
    Necromancer: { maxHp: 85, attackMin: 9, attackMax:13, maxMana:80  },
    Monk:        { maxHp: 95, attackMin:10, attackMax:16, maxMana:30  }
  };

  const spellsList = {
    Mage: [
      { name:"Fireball",        cost:20, type:"damage", min:25, max:40, msg:"Fireball scorches!" },
      { name:"Ice Spike",       cost:18, type:"damage", min:20, max:35, msg:"Ice Spike impales!" },
      { name:"Lightning Bolt",  cost:25, type:"damage", min:30, max:45, msg:"Lightning Bolt strikes!" },
      { name:"Arcane Missiles", cost:15, type:"damage", min:15, max:30, msg:"Arcane Missiles barrage!" },
      { name:"Frost Nova",      cost:22, type:"damage", min:10, max:20, msg:"Frost Nova chills!" },
      { name:"Meteor Shower",   cost:35, type:"damage", min:40, max:60, msg:"Meteor Shower crashes!" },
      { name:"Magic Missiles",  cost:12, type:"damage", min:10, max:25, msg:"Magic Missiles fly!" },
      { name:"Arcane Explosion",cost:18, type:"damage", min:20, max:30, msg:"Arcane Explosion roars!" },
      { name:"Thunderstorm",    cost:30, type:"damage", min:35, max:50, msg:"Thunderstorm rages!" },
      { name:"Mana Blast",      cost:25, type:"damage", min:15, max:30, msg:"Mana Blast pulses!" }
    ],
    Paladin: [
      { name:"Holy Light",           cost:15, type:"heal",   amount:30, msg:"Holy Light heals!" },
      { name:"Judgement",            cost:20, type:"damage", min:25, max:35, msg:"Judgement smites!" },
      { name:"Divine Storm",         cost:22, type:"damage", min:20, max:30, msg:"Divine Storm crashes!" },
      { name:"Holy Wrath",           cost:28, type:"damage", min:30, max:45, msg:"Holy Wrath unleashes!" },
      { name:"Consecration",         cost:18, type:"damage", min:15, max:25, msg:"Consecration burns!" },
      { name:"Hammer of Justice",    cost:12, type:"damage", min:10, max:20, msg:"Hammer of Justice lands!" },
      { name:"Holy Nova",            cost:20, type:"damage", min:20, max:30, msg:"Holy Nova pulses!" },
      { name:"Seal of Righteousness",cost:16, type:"damage", min:15, max:25, msg:"Seal of Righteousness strikes!" },
      { name:"Lay on Hands",         cost:30, type:"heal",   amount:50, msg:"Lay on Hands restores!" },
      { name:"Blessed Hammer",       cost:18, type:"damage", min:15, max:30, msg:"Blessed Hammer spins!" }
    ],
    Rogue: [
      { name:"Backstab",         cost: 0, type:"damage", min:20, max:30, msg:"Backstab pierces!" },
      { name:"Shadowstep",       cost: 5, type:"damage", min:10, max:20, msg:"Shadowstep strikes!" },
      { name:"Poisoned Blade",   cost: 0, type:"damage", min:15, max:25, msg:"Poisoned Blade infects!" },
      { name:"Garrote",          cost: 0, type:"damage", min:20, max:30, msg:"Garrote chokes!" },
      { name:"Fan of Knives",    cost: 0, type:"damage", min:10, max:20, msg:"Fan of Knives whirl!" },
      { name:"Shadow Dance",     cost: 5, type:"damage", min:25, max:35, msg:"Shadow Dance swirls!" },
      { name:"Ambush",           cost: 0, type:"damage", min:30, max:40, msg:"Ambush devastates!" },
      { name:"Cloak of Shadows", cost: 5, type:"damage", min:10, max:15, msg:"Cloak of Shadows flits!" },
      { name:"Crippling Poison", cost: 0, type:"damage", min:15, max:25, msg:"Crippling Poison weakens!" },
      { name:"Evasion",          cost: 5, type:"heal",   amount:20, msg:"Evasion steadies!" }
    ],
    Hunter: [
      { name:"Piercing Arrow",   cost: 0, type:"damage", min:20, max:30, msg:"Piercing Arrow flies!" },
      { name:"Multi-Shot",       cost: 0, type:"damage", min:10, max:20, msg:"Multi-Shot volleys!" },
      { name:"Snipe",            cost: 0, type:"damage", min:30, max:40, msg:"Snipe hits!" },
      { name:"Camouflage",       cost: 0, type:"heal",   amount:25, msg:"Camouflage recovers!" },
      { name:"Animal Companion", cost: 0, type:"damage", min:15, max:25, msg:"Companion bites!" },
      { name:"Volley",           cost: 0, type:"damage", min:20, max:30, msg:"Volley rains!" },
      { name:"Explosive Trap",   cost: 0, type:"damage", min:30, max:45, msg:"Explosive Trap blasts!" },
      { name:"Frost Trap",       cost: 0, type:"damage", min:10, max:15, msg:"Frost Trap freezes!" },
      { name:"Poison Arrow",     cost: 0, type:"damage", min:15, max:25, msg:"Poison Arrow strikes!" },
      { name:"Rapid Fire",       cost: 0, type:"damage", min:5,  max:15, msg:"Rapid Fire spams!" }
    ],
    Necromancer: [
      { name:"Drain Life",       cost:15, type:"drain",  amount:15, msg:"Drain Life saps!" },
      { name:"Summon Skeleton",  cost:10, type:"damage", min:10, max:20, msg:"Skeleton attacks!" },
      { name:"Bone Armor",       cost:10, type:"heal",   amount:20, msg:"Bone Armor steadies!" },
      { name:"Corpse Explosion", cost:20, type:"damage", min:25, max:35, msg:"Corpse Explosion erupts!" },
      { name:"Curse of Weakness",cost:10, type:"damage", min:5,  max:10, msg:"Curse weakens!" },
      { name:"Poison Nova",      cost:15, type:"damage", min:15, max:25, msg:"Poison Nova erupts!" },
      { name:"Raise Dead",       cost:20, type:"heal",   amount:30, msg:"Raise Dead restores!" },
      { name:"Blood Pact",       cost:15, type:"drain",  amount:20, msg:"Blood Pact steals!" },
      { name:"Life Tap",         cost:10, type:"drain",  amount:10, msg:"Life Tap saps!" },
      { name:"Shadow Bolt",      cost:12, type:"damage", min:20, max:30, msg:"Shadow Bolt hurls!" }
    ],
    Monk: [
      { name:"Chi Blast",        cost:10, type:"damage", min:15, max:25, msg:"Chi Blast strikes!" },
      { name:"Healing Wave",     cost:15, type:"heal",   amount:25, msg:"Healing Wave flows!" },
      { name:"Inner Peace",      cost:10, type:"heal",   amount:15, msg:"Inner Peace calms!" },
      { name:"Zen Meditation",   cost:12, type:"heal",   amount:20, msg:"Zen Meditation heals!" },
      { name:"Palm Strike",      cost: 5, type:"damage", min:10, max:20, msg:"Palm Strike hits!" },
      { name:"Aura of Serenity", cost:15, type:"heal",   amount:30, msg:"Aura of Serenity glows!" },
      { name:"Crescent Kick",    cost: 8, type:"damage", min:20, max:30, msg:"Crescent Kick whirls!" },
      { name:"Rising Dragon",    cost:12, type:"damage", min:25, max:35, msg:"Rising Dragon ascends!" },
      { name:"Qi Heal",          cost:15, type:"heal",   amount:35, msg:"Qi Heal pulses!" },
      { name:"Tranquility",      cost:20, type:"heal",   amount:40, msg:"Tranquility soothes!" }
    ]
  };

  // Gear definitions
  const gearSlots = ['helmet','weapon','chest','hands','feet','ring','necklace'];
  const lootPool = [
    { name:'Iron Helmet',     slot:'helmet',   stats:{ defense:2 } },
    { name:'Steel Helmet',    slot:'helmet',   stats:{ defense:4 } },
    { name:'Mage Hood',       slot:'helmet',   stats:{ maxMana:10 } },
    { name:'Wooden Staff',    slot:'weapon',   stats:{ attackMin:2, attackMax:5 } },
    { name:'Iron Sword',      slot:'weapon',   stats:{ attackMin:5, attackMax:10 } },
    { name:'Great Axe',       slot:'weapon',   stats:{ attackMin:8, attackMax:12 } },
    { name:'Leather Armor',   slot:'chest',    stats:{ defense:3 } },
    { name:'Chainmail',       slot:'chest',    stats:{ defense:6 } },
    { name:'Robe of Wisdom',  slot:'chest',    stats:{ intelligence:2, maxMana:5 } },
    { name:'Leather Gloves',  slot:'hands',    stats:{ defense:1 } },
    { name:'Gauntlets',       slot:'hands',    stats:{ defense:3 } },
    { name:'Boots of Speed',  slot:'feet',     stats:{ speed:0.1 } },
    { name:'Iron Greaves',    slot:'feet',     stats:{ defense:2 } },
    { name:'Ring of Luck',    slot:'ring',     stats:{ luck:0.05 } },
    { name:'Ring of Power',   slot:'ring',     stats:{ attackMin:1, attackMax:2 } },
    { name:'Necklace of Health',slot:'necklace',stats:{ maxHp:20 } },
    { name:'Amulet of Protection',slot:'necklace',stats:{ defense:2 } }
    // … expand as desired …
  ];

  const skillDefinitions = [
    { name:'Strength',        desc:'+2 Attack',         apply:()=>{ hero.attackMin+=2; hero.attackMax+=2; } },
    { name:'Vitality',        desc:'+10 Max HP',        apply:()=>{ hero.maxHp+=10; hero.hp+=10; } },
    { name:'Agility',         desc:'+2% Crit Chance',   apply:()=>{ hero.critChance+=0.02; } },
    { name:'Defense',         desc:'+1 Damage Reduction',apply:()=>{ hero.defense+=1; } },
    { name:'Intelligence',    desc:'+5% XP Gain',       apply:()=>{ hero.xpGainBonus+=0.05; } },
    { name:'Luck',            desc:'+1% Luck & Crit',   apply:()=>{ hero.luck+=0.01; hero.critChance+=0.01; } },
    { name:'Critical Strike', desc:'+3% Crit Chance',   apply:()=>{ hero.critChance+=0.03; } },
    { name:'Speed',           desc:'+5% Speed',         apply:()=>{ hero.speed+=0.05; } },
    { name:'Mana',            desc:'+10 Max Mana',      apply:()=>{ if(hero.maxMana>0){hero.maxMana+=10; hero.mana+=10;} } },
    { name:'Endurance',       desc:'-5 XP Next Level',   apply:()=>{ hero.xpToNext=Math.max(1,hero.xpToNext-5); } }
  ];

  const enemyTypes = [
    { name:"Goblin",   baseHp:50,  baseAtkMin:3,  baseAtkMax:7,  baseXp:15 },
    { name:"Skeleton", baseHp:70,  baseAtkMin:5,  baseAtkMax:10, baseXp:25 },
    { name:"Orc",      baseHp:100, baseAtkMin:7,  baseAtkMax:14, baseXp:40 },
    { name:"Troll",    baseHp:150, baseAtkMin:12, baseAtkMax:20, baseXp:70 },
    { name:"Dragon",   baseHp:250, baseAtkMin:20, baseAtkMax:30, baseXp:120 }
  ];

  const autoPriorities = {
    Warrior:     ['Strength','Vitality','Defense','Agility','Endurance','Luck','Critical Strike','Speed','Intelligence','Mana'],
    Mage:        ['Intelligence','Mana','Critical Strike','Agility','Luck','Endurance','Defense','Vitality','Strength','Speed'],
    Rogue:       ['Agility','Critical Strike','Luck','Speed','Strength','Defense','Endurance','Vitality','Intelligence','Mana'],
    Paladin:     ['Defense','Vitality','Strength','Intelligence','Agility','Endurance','Critical Strike','Luck','Speed','Mana'],
    Hunter:      ['Agility','Critical Strike','Luck','Strength','Speed','Defense','Vitality','Endurance','Intelligence','Mana'],
    Necromancer: ['Intelligence','Mana','Critical Strike','Agility','Luck','Endurance','Defense','Vitality','Strength','Speed'],
    Monk:        ['Endurance','Speed','Vitality','Agility','Strength','Defense','Critical Strike','Intelligence','Luck','Mana']
  };

  // ==============================
  // STATE & DOM REFERENCES
  // ==============================
  let hero = {}, enemy = {};
  let difficulty = 'normal', sfxEnabled = true;
  let pendingLoot = null;

  const mainMenu        = document.getElementById('main-menu');
  const menuNew         = document.getElementById('menu-new');
  const menuLoad        = document.getElementById('menu-load');
  const menuOptions     = document.getElementById('menu-options');
  const optionsMenu     = document.getElementById('options-menu');
  const optBack         = document.getElementById('opt-back');
  const optMusic        = document.getElementById('opt-music');
  const optSfx          = document.getElementById('opt-sfx');
  const optDiff         = document.getElementById('opt-difficulty');
  const optMusicVol     = document.getElementById('opt-music-volume');
  const optSfxVol       = document.getElementById('opt-sfx-volume');

  const creationArea    = document.getElementById('creation-area');
  const heroNameInput   = document.getElementById('hero-name-input');
  const randomNameBtn   = document.getElementById('random-name-btn');
  const raceSelect      = document.getElementById('race-select');
  const classSelect     = document.getElementById('class-select');
  const startBtn        = document.getElementById('start-btn');

  const battleSection   = document.getElementById('battle');
  const heroClassTitle  = document.getElementById('hero-class-title');
  const heroNameDisp    = document.getElementById('hero-name-display');
  const heroLevelSpan   = document.getElementById('hero-level');
  const heroXpText      = document.getElementById('hero-xp-text');
  const heroXpNext      = document.getElementById('hero-xp-next');
  const heroXpBar       = document.getElementById('hero-xp-bar');
  const heroHpText      = document.getElementById('hero-hp-text');
  const heroMaxHpText   = document.getElementById('hero-maxhp-text');
  const heroHpBar       = document.getElementById('hero-hp-bar');

  const heroManaRow          = document.getElementById('hero-mana-row');
  const heroManaText         = document.getElementById('hero-mana-text');
  const heroMaxManaText      = document.getElementById('hero-maxmana-text');
  const heroManaBar          = document.getElementById('hero-mana-bar');
  const heroManaBarContainer = document.getElementById('hero-mana-bar-container');

  const enemyTypeSpan  = document.getElementById('enemy-type');
  const enemyLevelSpan = document.getElementById('enemy-level');
  const enemyHpText    = document.getElementById('enemy-hp');
  const enemyMaxHp     = document.getElementById('enemy-maxhp');
  const enemyHpBar     = document.getElementById('enemy-hp-bar');

  const attackBtn      = document.getElementById('attack-btn');
  const charSheetBtn   = document.getElementById('char-sheet-btn');
  const spellsContainer= document.getElementById('spells-container');
  const optMainMenu    = document.getElementById('opt-main-menu');
  const optNewGame     = document.getElementById('opt-new-game');
  const optSave        = document.getElementById('opt-save');
  const optLoad        = document.getElementById('opt-load');
  const logEl          = document.getElementById('log');

  const bgm            = document.getElementById('bgm');

  // ==============================
  // SOUND EFFECTS
  // ==============================
  const sfx = {
    click:    new Audio('sfx/click.wav'),
  };

  bgm.volume = optMusicVol.value / 100;
  Object.values(sfx).forEach(a => a.volume = optSfxVol.value / 100);

  function playSfx(name) {
    if (sfxEnabled && sfx[name]) {
      sfx[name].currentTime = 0;
      sfx[name].play().catch(() => {});
    }
  }
  document.body.addEventListener('click', function initMusicOnce() {
    if (optMusic.checked) bgm.play().catch(() => {});
    document.body.removeEventListener('click', initMusicOnce);
  });
  document.body.addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON') playSfx('click');
  });

  // ==============================
  // OPTIONS CONTROLS
  // ==============================
  optMusic.addEventListener('change', () => {
    if (optMusic.checked) bgm.play().catch(() => {}); else bgm.pause();
  });
  optSfx.addEventListener('change', () => { sfxEnabled = optSfx.checked; });
  optDiff.addEventListener('change', () => { difficulty = optDiff.value; });
  optMusicVol.addEventListener('input', () => { bgm.volume = optMusicVol.value / 100; });
  optSfxVol.addEventListener('input', () => { Object.values(sfx).forEach(a => a.volume = optSfxVol.value / 100); });

  // ==============================
  // RANDOM NAME GENERATOR
  // ==============================
  const namePrefixes = ["Ara","Eli","Gal","Ser","Kael","Rha","Mira","Thal","Zan","Lor","Val","Ner","Del","Fen","Ori","Ari","Tar","Sol","Mal","Kor","Ly","Jor","Bri","Xan","Nia","Zor","Vel","Rin","Cai","Kri"];
  const nameSuffixes = ["gorn","wen","dor","thos","riel","nor","mir","dus","fiel","ion","as","or","ean","ith","an","ius","am","on","er","us","ara","ael","orin","eth","arae","alos","amir","essa","ondra","elis"];
  function generateRandomName(){
    return namePrefixes[Math.floor(Math.random()*namePrefixes.length)]
         + nameSuffixes[Math.floor(Math.random()*nameSuffixes.length)];
  }
  randomNameBtn.addEventListener('click', () => {
    heroNameInput.value = generateRandomName();
  });

  // ==============================
  // UTILITIES
  // ==============================
  function getRandom(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }

  // ==============================
  // GEAR FUNCTIONS
  // ==============================
  function equipItem(slot, item) {
    const old = hero.gear[slot];
    if (old) Object.entries(old.stats).forEach(([k,v]) => hero[k] -= v);
    hero.gear[slot] = item;
    Object.entries(item.stats).forEach(([k,v]) => hero[k] = (hero[k]||0) + v);
    updateUI();
    refreshCharSheetOverlay();
  }
  function unequipItem(slot) {
    const old = hero.gear[slot];
    if (!old) return;
    Object.entries(old.stats).forEach(([k,v]) => hero[k] -= v);
    hero.gear[slot] = null;
    updateUI();
    refreshCharSheetOverlay();
  }

  // ==============================
  // UI UPDATE
  // ==============================
  function updateUI(){
    heroNameDisp.textContent   = hero.name;
    heroLevelSpan.textContent  = hero.level;
    heroXpText.textContent     = hero.xp;
    heroXpNext.textContent     = hero.xpToNext;
    heroXpBar.style.width      = `${(hero.xp/hero.xpToNext)*100}%`;
    heroHpText.textContent     = hero.hp;
    heroMaxHpText.textContent  = hero.maxHp;
    heroHpBar.style.width      = `${(hero.hp/hero.maxHp)*100}%`;

    if(hero.maxMana>0){
      heroManaRow.style.display          = '';
      heroManaBarContainer.style.display = '';
      heroManaText.textContent           = hero.mana;
      heroMaxManaText.textContent        = hero.maxMana;
      heroManaBar.style.width            = `${(hero.mana/hero.maxMana)*100}%`;
    } else {
      heroManaRow.style.display          = 'none';
      heroManaBarContainer.style.display = 'none';
    }

    enemyTypeSpan.textContent  = enemy.name;
    enemyLevelSpan.textContent = enemy.level;
    enemyHpText.textContent    = enemy.hp;
    enemyMaxHp.textContent     = enemy.maxHp;
    enemyHpBar.style.width     = `${(enemy.hp/enemy.maxHp)*100}%`;
  }

  // ==============================
  // DIFFICULTY & SPAWN ENEMY
  // ==============================
  function applyDifficulty(e){
    let hpM=1, atkM=1, xpM=1;
    if(difficulty==='easy'){ hpM=0.8; atkM=0.8; xpM=0.8; }
    if(difficulty==='hard'){ hpM=1.3; atkM=1.2; xpM=1.2; }
    e.maxHp     = Math.floor(e.maxHp * hpM);
    e.hp        = e.maxHp;
    e.attackMin = Math.floor(e.attackMin * atkM);
    e.attackMax = Math.floor(e.attackMax * atkM);
    e.xpReward  = Math.floor(e.xpReward  * xpM);
  }
  function spawnEnemy(){
    const idx      = Math.min(enemyTypes.length-1, Math.floor((hero.level-1)/2));
    const arche    = enemyTypes[idx];
    const boost    = getRandom(0,2);
    const eLevel   = hero.level + boost;
    const baseHp   = arche.baseHp    + eLevel*10;
    const baseMin  = arche.baseAtkMin + eLevel;
    const baseMax  = arche.baseAtkMax + eLevel;

    enemy = {
      name:       arche.name,
      level:      eLevel,
      maxHp:      baseHp,
      hp:         baseHp,
      attackMin:  baseMin,
      attackMax:  baseMax,
      xpReward:   arche.baseXp + eLevel*5,
      critChance: 0.05,
      defense:    0
    };
    applyDifficulty(enemy);
    updateUI();
    attackBtn.disabled = false;
  }

  // ==============================
  // HOTKEYS & SPELL BUTTONS
  // ==============================
  function hotkeyHandler(e){
    let idx = null;
    if(e.key>='1'&&e.key<='9') idx = +e.key-1;
    else if(e.key==='0') idx = 9;
    if(idx!==null && hero.spells[idx]) castSpell(idx);
  }
  function createSpellButtons(){
    spellsContainer.innerHTML = '';
    hero.spells.forEach((sp,i)=>{
      const hot = i<9? i+1:0;
      const btn = document.createElement('button');
      btn.textContent = `[${hot}] ${sp.name} (${sp.cost} MP)`;
      btn.addEventListener('click', ()=>castSpell(i));
      spellsContainer.appendChild(btn);
    });
    document.addEventListener('keydown',hotkeyHandler);
  }

  // ==============================
  // ATTACK HANDLER
  // ==============================
  attackBtn.addEventListener('click', ()=>{
    playSfx('attack');
    if(hero.hp<=0||enemy.hp<=0) return;

    let dmgE = getRandom(hero.attackMin,hero.attackMax);
    if(Math.random()<hero.critChance){
      dmgE*=2;
      logEl.textContent='💥 Hero Critical! ';
    } else logEl.textContent='';

    enemy.hp=Math.max(0,enemy.hp-dmgE);
    playSfx('hit');

    let rawDmgH=getRandom(enemy.attackMin,enemy.attackMax);
    if(Math.random()<enemy.critChance){
      rawDmgH*=2;
      logEl.textContent+='👹 Enemy Critical! ';
    }
    const dmgH=Math.max(0,rawDmgH-hero.defense);
    hero.hp=Math.max(0,hero.hp-dmgH);
    playSfx('hit');

    logEl.textContent+=`You dealt ${dmgE}, took ${dmgH}.`;
    updateUI();
    checkBattleEnd();
  });

  // ==============================
  // CAST SPELL
  // ==============================
  function castSpell(i){
    playSfx('spell');
    if(hero.hp<=0||enemy.hp<=0) return;
    const sp=hero.spells[i];
    if(sp.cost>hero.mana){
      logEl.textContent='⚠️ Not enough Mana!';
      return;
    }
    hero.mana-=sp.cost;
    if(sp.type==='damage'){
      const d=getRandom(sp.min,sp.max);
      enemy.hp=Math.max(0,enemy.hp-d);
      logEl.textContent=`${sp.msg} (-${d} HP, -${sp.cost} MP)`;
    } else if(sp.type==='heal'){
      hero.hp=Math.min(hero.maxHp,hero.hp+sp.amount);
      logEl.textContent=`${sp.msg} (+${sp.amount} HP, -${sp.cost} MP)`;
    } else {
      enemy.hp=Math.max(0,enemy.hp-sp.amount);
      hero.hp=Math.min(hero.maxHp,hero.hp+sp.amount);
      logEl.textContent=`${sp.msg} (drain ${sp.amount}, -${sp.cost} MP)`;
    }
    updateUI();
    if(enemy.hp>0){
      let raw=getRandom(enemy.attackMin,enemy.attackMax);
      if(Math.random()<enemy.critChance) raw*=2;
      const dh=Math.max(0,raw-hero.defense);
      hero.hp=Math.max(0,hero.hp-dh);
      logEl.textContent+=` Counter: ${dh}.`;
      updateUI();
    }
    checkBattleEnd();
  }

  // ==============================
  // BATTLE END & LEVEL UP
  // ==============================
  function checkBattleEnd(){
    if(enemy.hp === 0){
      playSfx('levelUp');
      const xpGain = Math.floor(enemy.xpReward * (1 + hero.xpGainBonus));
      hero.xp += xpGain;
      logEl.textContent += ` 🎉 Defeated Level ${enemy.level} ${enemy.name}! +${xpGain} XP`;

      let leveled = false;
      while(hero.xp >= hero.xpToNext){
        playSfx('levelUp');
        hero.xp -= hero.xpToNext;
        hero.level++; hero.skillPoints++;
        hero.maxHp += 20; hero.hp = hero.maxHp;
        hero.attackMin += 2; hero.attackMax += 2;
        hero.xpToNext = Math.floor(hero.xpToNext * 1.5);
        logEl.textContent += ` 🎊 Level ${hero.level}!`;
        leveled = true;
      }
      updateUI();

      // stash loot until after picks
      pendingLoot = lootPool[Math.floor(Math.random() * lootPool.length)];

      if(leveled){
        showSkillAllocation();
      } else {
        showLootPick(pendingLoot);
        pendingLoot = null;
      }

    } else if(hero.hp === 0){
      playSfx('death');
      logEl.textContent += ' 💀 You died!';
      attackBtn.disabled = true;
      document.removeEventListener('keydown',hotkeyHandler);
    }
  }

  // ==============================
  // LOOT PICK OVERLAY
  // ==============================
  function showLootPick(item) {
    attackBtn.disabled = true;
    const overlay = document.createElement('div');
    overlay.id = 'loot-overlay';
    Object.assign(overlay.style, {
      position:'fixed', inset:0, background:'#000b',
      display:'flex', alignItems:'center', justifyContent:'center', zIndex:10000
    });
    overlay.innerHTML = `
      <div style="background:#1e1e1e;padding:20px;border-radius:8px;color:#eee;max-width:300px;text-align:center">
        <h3>Loot Found!</h3>
        <p><strong>${item.name}</strong> (${item.slot})</p>
        <button id="loot-equip">Equip</button>
        <button id="loot-skip">Skip</button>
      </div>`;
    document.body.appendChild(overlay);

    document.getElementById('loot-equip').addEventListener('click', () => {
      playSfx('click');
      equipItem(item.slot, item);
      close();
    });
    document.getElementById('loot-skip').addEventListener('click', () => {
      playSfx('click');
      close();
    });
    function close(){
      document.body.removeChild(overlay);
      setTimeout(() => {
        spawnEnemy();
        attackBtn.disabled = false;
      }, 600);
    }
  }

  // ==============================
  // SKILL ALLOCATION OVERLAY
  // ==============================
  function showSkillAllocation(){
    attackBtn.disabled = true;
    document.removeEventListener('keydown',hotkeyHandler);

    // build overlay
    const overlay = document.createElement('div');
    overlay.id = 'skill-overlay';
    Object.assign(overlay.style,{
      position:'fixed', inset:0, background:'#000',
      display:'flex', alignItems:'center', justifyContent:'center',
      zIndex:10000
    });

    let html = `<div id="skill-box" style="background:#1e1e1e;padding:20px;border-radius:8px;color:#eee;max-width:400px">
        <h3>Use SP (<span id="rem-sp">${hero.skillPoints}</span>)</h3>
        <ul style="list-style:none;padding:0">`;
    skillDefinitions.forEach((sd,i)=>{
      html += `<li style="margin:8px 0">
        <strong>${sd.name}</strong> — <em>${sd.desc}</em><br>
        <span id="lvl-${i}">${hero.skills[sd.name]||0}</span>
        <button id="plus-${i}"${hero.skillPoints===0?' disabled':''}>+</button>
      </li>`;
    });
    html += `</ul><button id="auto-btn">Auto-Allocate</button> <button id="ok-btn">OK</button></div>`;
    overlay.innerHTML = html;
    document.body.appendChild(overlay);

    skillDefinitions.forEach((sd,i)=>{
      document.getElementById(`plus-${i}`).addEventListener('click',()=>{
        playSfx('click');
        if(hero.skillPoints>0){
          hero.skillPoints--;
          hero.skills[sd.name] = (hero.skills[sd.name]||0) + 1;
          sd.apply();
          document.getElementById(`lvl-${i}`).textContent = hero.skills[sd.name];
          document.getElementById('rem-sp').textContent = hero.skillPoints;
          if(hero.skillPoints===0){
            document.querySelectorAll("[id^='plus-']").forEach(b=>b.disabled = true);
          }
        }
      });
    });

    document.getElementById('auto-btn').addEventListener('click',()=>{
      playSfx('click');
      const top = autoPriorities[hero.className][0];
      const sd = skillDefinitions.find(s=>s.name===top);
      while(hero.skillPoints>0){
        hero.skillPoints--;
        hero.skills[top] = (hero.skills[top]||0)+1;
        sd.apply();
      }
      document.getElementById(`lvl-${skillDefinitions.indexOf(sd)}`).textContent = hero.skills[top];
      document.getElementById('rem-sp').textContent = hero.skillPoints;
      document.querySelectorAll("[id^='plus-']").forEach(b=>b.disabled=true);
    });

    document.getElementById('ok-btn').addEventListener('click',()=>{
      playSfx('click');
      document.body.removeChild(overlay);
      const hasSpells = Array.isArray(spellsList[hero.className]) && spellsList[hero.className].length>0;
      if(hasSpells){
        showSpellPick();
      } else {
        attackBtn.disabled = false;
        setTimeout(spawnEnemy,600);
        if(pendingLoot){
          showLootPick(pendingLoot);
          pendingLoot = null;
        }
      }
    });
  }

  // ==============================
  // SPELL PICK OVERLAY
  // ==============================
  function showSpellPick(){
    attackBtn.disabled = true;
    document.removeEventListener('keydown',hotkeyHandler);

    const overlay = document.createElement('div');
    overlay.id = 'spell-pick';
    Object.assign(overlay.style,{
      position:'fixed', inset:0, background:'#000',
      display:'flex', alignItems:'center', justifyContent:'center',
      zIndex:10000
    });

    const available = spellsList[hero.className] || [];
    let html = `<div id="spell-box" style="background:#1e1e1e;padding:20px;border-radius:8px;color:#eee;max-width:400px">
        <h3>Learn a New Spell</h3><ul style="list-style:none;padding:0">`;

    available.filter(sp=>!hero.spells.find(s=>s.name===sp.name)).forEach((sp,i)=>{
      html += `<li style="margin:8px 0"><button data-i="${i}">${sp.name} (${sp.cost} MP)</button></li>`;
    });
    html += `</ul><button id="skip-spell">Skip</button></div>`;
    overlay.innerHTML = html;
    document.body.appendChild(overlay);

    overlay.querySelectorAll('button[data-i]').forEach(btn=>{
      btn.addEventListener('click', e=>{
        playSfx('click');
        const idx = +e.currentTarget.dataset.i;
        hero.spells.push(available[idx]);
        closePick();
      });
    });
    document.getElementById('skip-spell').addEventListener('click',()=>{
      playSfx('click');
      closePick();
    });

    function closePick(){
      document.body.removeChild(overlay);
      attackBtn.disabled = false;
      createSpellButtons();
      setTimeout(spawnEnemy,600);
      document.addEventListener('keydown',hotkeyHandler);

      if(pendingLoot){
        showLootPick(pendingLoot);
        pendingLoot = null;
      }
    }
  }

  // ==============================
  // CHARACTER SHEET OVERLAY & HELPER
  // ==============================
  function refreshCharSheetOverlay(){
    const overlay = document.getElementById('char-sheet-overlay');
    if(!overlay) return;
    const core = overlay.querySelector('.sheet-section.core');
    core.querySelector('p:nth-of-type(1)').innerHTML = `<strong>Level:</strong> ${hero.level}`;
    core.querySelector('p:nth-of-type(2)').innerHTML = `<strong>XP:</strong> ${hero.xp} / ${hero.xpToNext}`;
    core.querySelector('p:nth-of-type(3)').innerHTML = `<strong>HP:</strong> ${hero.hp} / ${hero.maxHp}`;
    core.querySelector('p:nth-of-type(4)').innerHTML = `<strong>Attack:</strong> ${hero.attackMin} – ${hero.attackMax}`;
    core.querySelector('p:nth-of-type(5)').innerHTML = `<strong>Defense:</strong> ${hero.defense}`;
    core.querySelector('p:nth-of-type(6)').innerHTML = `<strong>Crit %:</strong> ${Math.round(hero.critChance*100)}%`;
  }

  charSheetBtn.addEventListener('click',()=>{
    playSfx('click');
    attackBtn.disabled = true;
    document.removeEventListener('keydown',hotkeyHandler);

    const overlay = document.createElement('div');
    overlay.id = 'char-sheet-overlay';
    Object.assign(overlay.style,{
      position:'fixed', inset:0, background:'#000',
      display:'flex', alignItems:'center', justifyContent:'center',
      zIndex:2000
    });
let gearHtml = `
  <section class="sheet-section gear"><h3>Gear</h3>
    <div class="gear-container">
      <img src="clip-art/gear.png" alt="gear slots" style="max-width:200px;opacity:0.8;">
      ${gearSlots.map(slot=>`
        <button class="gear-slot" data-slot="${slot}">
          ${hero.gear[slot]?.name || slot.charAt(0).toUpperCase()+slot.slice(1)}
        </button>`).join('')}
    </div>
  </section>`;

    overlay.innerHTML = `<div class="sheet-container"><header class="sheet-header">
          <h2>${hero.name} the ${hero.className}</h2></header><div class="sheet-content">
          <section class="sheet-section core"><h3>Core Stats</h3>
            <p><strong>Level:</strong> ${hero.level}</p>
            <p><strong>XP:</strong> ${hero.xp} / ${hero.xpToNext}</p>
            <p><strong>HP:</strong> ${hero.hp} / ${hero.maxHp}</p>
            <p><strong>Attack:</strong> ${hero.attackMin} – ${hero.attackMax}</p>
            <p><strong>Defense:</strong> ${hero.defense}</p>
            <p><strong>Crit %:</strong> ${Math.round(hero.critChance*100)}%</p>
            <p><strong>SP:</strong> ${hero.skillPoints}</p>
          </section>
          <section class="sheet-section skills"><h3>Skills</h3><ul>
            ${skillDefinitions.map(sd=>`<li><strong>${sd.name}:</strong> ${hero.skills[sd.name]||0}</li>`).join('')}
          </ul></section>
          <section class="sheet-section spells"><h3>Spells</h3><ul>
            ${hero.spells.map(sp=>`<li>${sp.name} <span class="spell-cost">(${sp.cost} MP)</span></li>`).join('')}
          </ul></section>
          ${gearHtml}
        </div><button id="close-char-sheet">Close</button></div>`;

    document.body.appendChild(overlay);

    document.querySelectorAll('.gear-slot').forEach(btn=>{
      btn.addEventListener('click', e=>{
        const slot = e.currentTarget.dataset.slot;
        unequipItem(slot);
        e.currentTarget.textContent = slot.charAt(0).toUpperCase()+slot.slice(1);
      });
    });

    document.getElementById('close-char-sheet').addEventListener('click',()=>{
      playSfx('click');
      document.body.removeChild(overlay);
      attackBtn.disabled = false;
      createSpellButtons();
      document.addEventListener('keydown',hotkeyHandler);
    });
  });

  // ==============================
  // SAVE / LOAD SLOTS OVERLAY
  // ==============================
  function showSlotOverlay(type){
    playSfx('click');
    const overlay = document.createElement('div');
    overlay.id = 'slot-overlay';
    Object.assign(overlay.style,{
      position:'fixed', inset:0, background:'#000',
      display:'flex', alignItems:'center', justifyContent:'center',
      zIndex:2000
    });
    let html = `<div style="background:#1e1e1e;padding:20px;border-radius:8px;color:#eee;max-width:300px">
        <h3>${type==='save'?'Save':'Load'} Slot</h3><ul style="list-style:none;padding:0">`;
    for(let i=1;i<=3;i++){
      const key=`rpg_slot${i}`, raw=localStorage.getItem(key);
      let label=`Slot ${i}`;
      if(type==='load'&&raw){
        const h=JSON.parse(raw);
        label=`${h.name}_${h.className}_Lv${h.level}`;
      }
      html += `<li style="margin:8px 0"><button data-slot="${i}">${label}</button></li>`;
    }
    html += `</ul><button id="slot-cancel">Cancel</button></div>`;
    overlay.innerHTML = html;
    document.body.appendChild(overlay);

    overlay.querySelectorAll('button[data-slot]').forEach(btn=>{
      btn.addEventListener('click', e=>{
        playSfx('click');
        const slot = e.currentTarget.dataset.slot;
        const key  = `rpg_slot${slot}`;
        const raw  = localStorage.getItem(key);
        if(type==='save'){
          localStorage.setItem(key,JSON.stringify(hero));
          logEl.textContent = `💾 Saved to ${hero.name}_${hero.className}_Lv${hero.level}`;
        } else if(raw){
          hero = JSON.parse(raw);
          mainMenu.style.display = 'none';
          creationArea.style.display = 'none';
          battleSection.style.display = 'block';
          beginBattle();
          logEl.textContent = `📂 Loaded ${hero.name}_${hero.className}_Lv${hero.level}`;
        } else {
          logEl.textContent = '⚠️ Empty Slot';
        }
        document.body.removeChild(overlay);
      });
    });

    document.getElementById('slot-cancel').addEventListener('click',()=>{
      playSfx('click');
      document.body.removeChild(overlay);
    });
  }

  // ==============================
  // MENU HANDLERS
  // ==============================
  menuNew.addEventListener('click',()=>{ playSfx('click'); mainMenu.style.display='none'; creationArea.style.display='block'; });
  menuLoad.addEventListener('click',()=>{ playSfx('click'); showSlotOverlay('load'); });
  menuOptions.addEventListener('click',()=>{ playSfx('click'); optionsMenu.style.display='flex'; });
  optBack.addEventListener('click',()=>{ playSfx('click'); optionsMenu.style.display='none'; });
  optMainMenu.addEventListener('click',()=>{ playSfx('click'); battleSection.style.display='none'; creationArea.style.display='none'; mainMenu.style.display='flex'; });
  optNewGame.addEventListener('click',()=>{ playSfx('click'); battleSection.style.display='none'; mainMenu.style.display='none'; creationArea.style.display='block'; });
  optSave.addEventListener('click',()=>{ playSfx('click'); showSlotOverlay('save'); });
  optLoad.addEventListener('click',()=>{ playSfx('click'); showSlotOverlay('load'); });

  // ==============================
  // CHARACTER CREATION & START
  // ==============================
  startBtn.addEventListener('click',()=>{
    playSfx('click');
    const name  = heroNameInput.value.trim();
    if(!name){ alert('Enter a name'); return; }
    const race  = raceSelect.value;
    const cls   = classSelect.value;
    const base  = classData[cls];

    hero = {
      name, className:cls,
      level:1, xp:0, xpToNext:50,
      maxHp:base.maxHp, hp:base.maxHp,
      attackMin:base.attackMin, attackMax:base.attackMax,
      maxMana:base.maxMana, mana:base.maxMana,
      critChance:0, defense:0, xpGainBonus:0,
      luck:0, speed:1, skillPoints:0,
      spells:[], skills:{}, gear:{}
    };
    skillDefinitions.forEach(sd=>hero.skills[sd.name]=0);
    gearSlots.forEach(s=>hero.gear[s]=null);

    Object.entries(raceData[race]||{}).forEach(([sk,amt])=>{
      hero.skills[sk] = (hero.skills[sk]||0)+amt;
      const sd = skillDefinitions.find(s=>s.name===sk);
      for(let i=0;i<amt;i++) sd.apply();
    });

    hero.spells = (spellsList[cls]||[]).slice(0,3);

    mainMenu.style.display     = 'none';
    creationArea.style.display = 'none';
    battleSection.style.display= 'block';
    beginBattle();
  });

  // ==============================
  // BEGIN BATTLE
  // ==============================
  function beginBattle(){
    spellsContainer.innerHTML = '';
    document.removeEventListener('keydown',hotkeyHandler);
    createSpellButtons();
    spawnEnemy();
    updateUI();
  }

});
