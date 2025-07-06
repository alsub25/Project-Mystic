// game.js

window.addEventListener('DOMContentLoaded', () => {

  // ─── UI MODE TOGGLE + AUTO-DETECT ───────────────────────
  const optUi = document.getElementById('opt-ui');
  function applyUi(mode) {
    // store preference
    localStorage.setItem('uiMode', mode);
    // clear classes
    document.body.classList.remove('phone-ui', 'pc-ui');
    if (mode === 'phone' ||
        (mode === 'auto' && /Mobi|Android/i.test(navigator.userAgent))
    ) {
      document.body.classList.add('phone-ui');
    } else {
      document.body.classList.add('pc-ui');
    }
  }
  if (optUi) {
    optUi.addEventListener('change', () => applyUi(optUi.value));
    const saved = localStorage.getItem('uiMode') || 'auto';
    optUi.value = saved;
    applyUi(saved);
  }
  // ────────────────────────────────────────────────────────

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
      { name:"Fireball",        cost:20, type:"damage", min:25, max:40, levelScale:2,   skillScale:{ Intelligence:1 },   msg:"Fireball scorches!" },
      { name:"Ice Spike",       cost:18, type:"damage", min:20, max:35, levelScale:1.5, skillScale:{ Intelligence:0.8 }, msg:"Ice Spike impales!" },
      { name:"Lightning Bolt",  cost:25, type:"damage", min:30, max:45, levelScale:2,   skillScale:{ Intelligence:1 },   msg:"Lightning Bolt strikes!" },
      { name:"Arcane Missiles", cost:15, type:"damage", min:15, max:30, levelScale:1,   skillScale:{ Intelligence:0.8 }, msg:"Arcane Missiles barrage!" },
      { name:"Frost Nova",      cost:22, type:"damage", min:10, max:20, levelScale:1,   skillScale:{ Intelligence:0.5 }, msg:"Frost Nova chills!" },
      { name:"Meteor Shower",   cost:35, type:"damage", min:40, max:60, levelScale:3,   skillScale:{ Intelligence:1.2 }, msg:"Meteor Shower crashes!" },
      { name:"Magic Missiles",  cost:12, type:"damage", min:10, max:25, levelScale:1,   skillScale:{ Intelligence:0.5 }, msg:"Magic Missiles fly!" },
      { name:"Arcane Explosion",cost:18, type:"damage", min:20, max:30, levelScale:1.5, skillScale:{ Intelligence:0.8 }, msg:"Arcane Explosion roars!" },
      { name:"Thunderstorm",    cost:30, type:"damage", min:35, max:50, levelScale:2.5, skillScale:{ Intelligence:1 },   msg:"Thunderstorm rages!" },
      { name:"Mana Blast",      cost:25, type:"damage", min:15, max:30, levelScale:1,   skillScale:{ Intelligence:0.5 }, msg:"Mana Blast pulses!" }
    ],
    Paladin: [
      { name:"Holy Light",           cost:15, type:"heal",   amount:30, levelScale:1,   skillScale:{ Intelligence:0.5 }, msg:"Holy Light heals!" },
      { name:"Judgement",            cost:20, type:"damage", min:25, max:35, levelScale:1,   skillScale:{ Strength:0.5 },     msg:"Judgement smites!" },
      { name:"Divine Storm",         cost:22, type:"damage", min:20, max:30, levelScale:1,   skillScale:{ Strength:0.3 },     msg:"Divine Storm crashes!" },
      { name:"Holy Wrath",           cost:28, type:"damage", min:30, max:45, levelScale:2,   skillScale:{ Strength:0.5 },     msg:"Holy Wrath unleashes!" },
      { name:"Consecration",         cost:18, type:"damage", min:15, max:25, levelScale:1,   skillScale:{ Intelligence:0.4 }, msg:"Consecration burns!" },
      { name:"Hammer of Justice",    cost:12, type:"damage", min:10, max:20, levelScale:1,   skillScale:{ Strength:0.2 },     msg:"Hammer of Justice lands!" },
      { name:"Holy Nova",            cost:20, type:"damage", min:20, max:30, levelScale:1.5, skillScale:{ Strength:0.4 },   msg:"Holy Nova pulses!" },
      { name:"Seal of Righteousness",cost:16, type:"damage", min:15, max:25, levelScale:1,   skillScale:{ Strength:0.3 },   msg:"Seal of Righteousness strikes!" },
      { name:"Lay on Hands",         cost:30, type:"heal",   amount:50, levelScale:2,   skillScale:{ Intelligence:0.5 }, msg:"Lay on Hands restores!" },
      { name:"Blessed Hammer",       cost:18, type:"damage", min:15, max:30, levelScale:1.5, skillScale:{ Strength:0.5 },   msg:"Blessed Hammer spins!" }
    ],
    Rogue: [
      { name:"Backstab",         cost: 0, type:"damage", min:20, max:30, levelScale:1,   skillScale:{ Agility:1.5 }, msg:"Backstab pierces!" },
      { name:"Shadowstep",       cost: 5, type:"damage", min:10, max:20, levelScale:1,   skillScale:{ Agility:1 },   msg:"Shadowstep strikes!" },
      { name:"Poisoned Blade",   cost: 0, type:"damage", min:15, max:25, levelScale:1,   skillScale:{ Agility:1 },   msg:"Poisoned Blade infects!" },
      { name:"Garrote",          cost: 0, type:"damage", min:20, max:30, levelScale:1,   skillScale:{ Agility:1.2 }, msg:"Garrote chokes!" },
      { name:"Fan of Knives",    cost: 0, type:"damage", min:10, max:20, levelScale:1,   skillScale:{ Agility:1 },   msg:"Fan of Knives whirl!" },
      { name:"Shadow Dance",     cost: 5, type:"damage", min:25, max:35, levelScale:1.5, skillScale:{ Agility:1.5 }, msg:"Shadow Dance swirls!" },
      { name:"Ambush",           cost: 0, type:"damage", min:30, max:40, levelScale:2,   skillScale:{ Agility:1 },   msg:"Ambush devastates!" },
      { name:"Cloak of Shadows", cost: 5, type:"damage", min:10, max:15, levelScale:1,   skillScale:{ Agility:0.5 }, msg:"Cloak of Shadows flits!" },
      { name:"Crippling Poison", cost: 0, type:"damage", min:15, max:25, levelScale:1,   skillScale:{ Agility:1 },   msg:"Crippling Poison weakens!" },
      { name:"Evasion",          cost: 5, type:"heal",   amount:20, levelScale:1,   skillScale:{ Agility:1 },   msg:"Evasion steadies!" }
    ],
    Hunter: [
      { name:"Piercing Arrow",   cost: 0, type:"damage", min:20, max:30, levelScale:1,   skillScale:{ Agility:1 },   msg:"Piercing Arrow flies!" },
      { name:"Multi-Shot",       cost: 0, type:"damage", min:10, max:20, levelScale:1,   skillScale:{ Agility:0.8 }, msg:"Multi-Shot volleys!" },
      { name:"Snipe",            cost: 0, type:"damage", min:30, max:40, levelScale:2,   skillScale:{ Agility:1 },   msg:"Snipe hits!" },
      { name:"Camouflage",       cost: 0, type:"heal",   amount:25, levelScale:1,   skillScale:{ Agility:0.5 }, msg:"Camouflage recovers!" },
      { name:"Animal Companion", cost: 0, type:"damage", min:15, max:25, levelScale:1,   skillScale:{ Agility:1 },   msg:"Companion bites!" },
      { name:"Volley",           cost: 0, type:"damage", min:20, max:30, levelScale:1.5, skillScale:{ Agility:0.5 },msg:"Volley rains!" },
      { name:"Explosive Trap",   cost: 0, type:"damage", min:30, max:45, levelScale:2,   skillScale:{ Agility:0.5 },msg:"Explosive Trap blasts!" },
      { name:"Frost Trap",       cost: 0, type:"damage", min:10, max:15, levelScale:1,   skillScale:{ Agility:0.3 }, msg:"Frost Trap freezes!" },
      { name:"Poison Arrow",     cost: 0, type:"damage", min:15, max:25, levelScale:1,   skillScale:{ Agility:0.8 }, msg:"Poison Arrow strikes!" },
      { name:"Rapid Fire",       cost: 0, type:"damage", min:5,  max:15, levelScale:1,   skillScale:{ Agility:0.5 },msg:"Rapid Fire spams!" }
    ],
    Necromancer: [
      { name:"Drain Life",       cost:15, type:"drain",  amount:15, levelScale:1,   skillScale:{ Intelligence:0.8 }, msg:"Drain Life saps!" },
      { name:"Summon Skeleton",  cost:10, type:"damage", min:10, max:20, levelScale:1,   skillScale:{ Intelligence:1 },    msg:"Skeleton attacks!" },
      { name:"Bone Armor",       cost:10, type:"heal",   amount:20, levelScale:1,   skillScale:{ Vitality:0.5 },      msg:"Bone Armor steadies!" },
      { name:"Corpse Explosion", cost:20, type:"damage", min:25, max:35, levelScale:1.5, skillScale:{ Intelligence:0.8 },    msg:"Corpse Explosion erupts!" },
      { name:"Curse of Weakness",cost:10, type:"damage", min:5,  max:10, levelScale:1,   skillScale:{ Intelligence:0.5 },        msg:"Curse weakens!" },
      { name:"Poison Nova",      cost:15, type:"damage", min:15, max:25, levelScale:1,   skillScale:{ Agility:0.5 },        msg:"Poison Nova erupts!" },
      { name:"Raise Dead",       cost:20, type:"heal",   amount:30, levelScale:1,   skillScale:{ Intelligence:0.5 },    msg:"Raise Dead restores!" },
      { name:"Blood Pact",       cost:15, type:"drain",  amount:20, levelScale:1,   skillScale:{ Intelligence:0.5 }, msg:"Blood Pact steals!" },
      { name:"Life Tap",         cost:10, type:"drain",  amount:10, levelScale:1,   skillScale:{ Intelligence:0.3 }, msg:"Life Tap saps!" },
      { name:"Shadow Bolt",      cost:12, type:"damage", min:20, max:30, levelScale:1,   skillScale:{ Intelligence:0.8 }, msg:"Shadow Bolt hurls!" }
    ],
    Monk: [
      { name:"Chi Blast",        cost:10, type:"damage", min:15, max:25, levelScale:1,   skillScale:{ Intelligence:0.5 },      msg:"Chi Blast strikes!" },
      { name:"Healing Wave",     cost:15, type:"heal",   amount:25, levelScale:1.5, skillScale:{ Vitality:0.8 },    msg:"Healing Wave flows!" },
      { name:"Inner Peace",      cost:10, type:"heal",   amount:15, levelScale:1,   skillScale:{ Intelligence:0.5 },      msg:"Inner Peace calms!" },
      { name:"Zen Meditation",   cost:12, type:"heal",   amount:20, levelScale:1,   skillScale:{ Intelligence:0.8 },      msg:"Zen Meditation heals!" },
      { name:"Palm Strike",      cost: 5, type:"damage", min:10, max:20, levelScale:1,   skillScale:{ Strength:0.5 },     msg:"Palm Strike hits!" },
      { name:"Aura of Serenity", cost:15, type:"heal",   amount:30, levelScale:1.5, skillScale:{ Intelligence:1 },    msg:"Aura of Serenity glows!" },
      { name:"Crescent Kick",    cost: 8, type:"damage", min:20, max:30, levelScale:1,   skillScale:{ Agility:0.5 },      msg:"Crescent Kick whirls!" },
      { name:"Rising Dragon",    cost:12, type:"damage", min:25, max:35, levelScale:1.5, skillScale:{ Strength:0.5 },     msg:"Rising Dragon ascends!" },
      { name:"Qi Heal",          cost:15, type:"heal",   amount:35, levelScale:1,   skillScale:{ Vitality:1 },       msg:"Qi Heal pulses!" },
      { name:"Tranquility",      cost:20, type:"heal",   amount:40, levelScale:2,   skillScale:{ Intelligence:1 },    msg:"Tranquility soothes!" }
    ]
  };

  const gearSlots = ['helmet','weapon','chest','hands','feet','ring','necklace'];
  const lootPool = [
    { name:'Iron Helmet',       slot:'helmet',    stats:{ defense:2 } },
    { name:'Steel Helmet',      slot:'helmet',    stats:{ defense:4 } },
    { name:'Mage Hood',         slot:'helmet',    stats:{ maxMana:10 } },
    { name:'Wooden Staff',      slot:'weapon',    stats:{ attackMin:2, attackMax:5 } },
    { name:'Iron Sword',        slot:'weapon',    stats:{ attackMin:5, attackMax:10 } },
    { name:'Great Axe',         slot:'weapon',    stats:{ attackMin:8, attackMax:12 } },
    { name:'Leather Armor',     slot:'chest',     stats:{ defense:3 } },
    { name:'Chainmail',         slot:'chest',     stats:{ defense:6 } },
    { name:'Robe of Wisdom',    slot:'chest',     stats:{ intelligence:2, maxMana:5 } },
    { name:'Leather Gloves',    slot:'hands',     stats:{ defense:1 } },
    { name:'Gauntlets',         slot:'hands',     stats:{ defense:3 } },
    { name:'Boots of Speed',    slot:'feet',      stats:{ speed:0.1 } },
    { name:'Iron Greaves',      slot:'feet',      stats:{ defense:2 } },
    { name:'Ring of Luck',      slot:'ring',      stats:{ luck:0.05 } },
    { name:'Ring of Power',     slot:'ring',      stats:{ attackMin:1, attackMax:2 } },
    { name:'Necklace of Health',slot:'necklace',  stats:{ maxHp:20 } },
    { name:'Amulet of Protection',slot:'necklace',stats:{ defense:2 } }
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
    { name:'Mana',            desc:'+10 Max Mana',      apply:()=>{ if(hero.maxMana>0){ hero.maxMana+=10; hero.mana+=10; } } },
    { name:'Endurance',       desc:'-5 XP Next Level',   apply:()=>{ hero.xpToNext=Math.max(1,hero.xpToNext-5); } }
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

  const enemyRaces = {
    Goblin:    { hpMult:1.0, atkMult:1.0, critChance:0.05, defense:0 },
    Skeleton:  { hpMult:1.1, atkMult:1.0, critChance:0.1,  defense:1 },
    Orc:       { hpMult:1.2, atkMult:1.1, critChance:0.05, defense:2 },
    Troll:     { hpMult:1.3, atkMult:1.2, critChance:0.05, defense:3 },
    Dragon:    { hpMult:1.5, atkMult:1.3, critChance:0.1,  defense:5 },
    Undead:    { hpMult:1.2, atkMult:1.0, critChance:0.1,  defense:1 },
    Beast:     { hpMult:1.4, atkMult:1.2, critChance:0.05, defense:2 },
    Elemental: { hpMult:1.3, atkMult:1.3, critChance:0.1,  defense:4 }
  };

  const enemyClasses = {
    Warrior: {
      baseHp:120, attackMin:12, attackMax:18, maxMana:0,  baseXp:40,
      spells:[
        { name:"Heroic Strike", cost:0, type:"damage", min:20, max:30, levelScale:1, skillScale:{ Strength:0.5 }, msg:"Warrior strikes heroically!", cooldown:3 },
        { name:"Shield Bash",    cost:0, type:"damage", min:10, max:20, levelScale:0.5, skillScale:{ Defense:1 },    msg:"Warrior slams with shield!",    cooldown:2 }
      ]
    },
    Sorcerer:{
      baseHp:80,  attackMin:8, attackMax:14, maxMana:80, baseXp:50,
      spells:[
        { name:"Fireball",   cost:10, type:"damage", min:25, max:35, levelScale:1, skillScale:{ Intelligence:0.8 }, msg:"Sorcerer hurls Fireball!",   cooldown:3 },
        { name:"Frost Bolt", cost:12, type:"damage", min:20, max:30, levelScale:1, skillScale:{ Intelligence:0.8 }, msg:"Sorcerer casts Frost Bolt!", cooldown:2 }
      ]
    },
    Assassin:{
      baseHp:90,  attackMin:10, attackMax:16, maxMana:0,  baseXp:45,
      spells:[
        { name:"Backstab",   cost:0, type:"damage", min:30, max:40, levelScale:1, skillScale:{ Agility:1.5 }, msg:"Assassin backstabs!", cooldown:3 },
        { name:"Smoke Bomb", cost:0, type:"heal",   amount:20, levelScale:0.5, skillScale:{ Agility:0.5 }, msg:"Assassin vanishes in smoke!", cooldown:4 }
      ]
    },
    Cleric:{
      baseHp:100, attackMin:8, attackMax:12, maxMana:60, baseXp:50,
      spells:[
        { name:"Smite", cost:10, type:"damage", min:20, max:30, levelScale:1, skillScale:{ Intelligence:0.5 }, msg:"Cleric smites!", cooldown:2 },
        { name:"Heal",  cost:12, type:"heal",   amount:25, levelScale:1, skillScale:{ Vitality:1 },       msg:"Cleric heals!", cooldown:3 }
      ]
    },
    Ranger:{
      baseHp:95, attackMin:11, attackMax:17, maxMana:0,  baseXp:45,
      spells:[
        { name:"Piercing Arrow", cost:0, type:"damage", min:25, max:35, levelScale:1, skillScale:{ Agility:1 }, msg:"Ranger fires Piercing Arrow!", cooldown:3 },
        { name:"Camouflage",     cost:0, type:"heal",   amount:20, levelScale:0.5, skillScale:{ Agility:0.5 }, msg:"Ranger fades into Camouflage!", cooldown:5 }
      ]
    },
    Warlock:{
      baseHp:85, attackMin:9,  attackMax:13, maxMana:70, baseXp:55,
      spells:[
        { name:"Shadow Bolt", cost:10, type:"damage", min:20, max:30, levelScale:1,   skillScale:{ Intelligence:0.8 }, msg:"Warlock casts Shadow Bolt!", cooldown:3 },
        { name:"Drain Life",  cost:15, type:"drain",  amount:15, levelScale:0.8, skillScale:{ Intelligence:0.5 }, msg:"Warlock uses Drain Life!", cooldown:4 }
      ]
    },
    Berserker:{
      baseHp:110,attackMin:14,attackMax:20, maxMana:0,  baseXp:50,
      spells:[
        { name:"Cleave", cost:0, type:"damage", min:25, max:35, levelScale:1, skillScale:{ Strength:1 }, msg:"Berserker Cleaves!", cooldown:2 },
        { name:"War Cry",cost:0, type:"damage", min:0,  max:0,  levelScale:0, skillScale:{ Fear:1 },      msg:"Berserker shouts War Cry!", cooldown:5 }
      ]
    },
    Shaman:{
      baseHp:90, attackMin:10, attackMax:14, maxMana:80, baseXp:55,
      spells:[
        { name:"Lightning Bolt", cost:12, type:"damage", min:25, max:35, levelScale:1, skillScale:{ Intelligence:0.8 }, msg:"Shaman casts Lightning Bolt!", cooldown:3 },
        { name:"Healing Rain",   cost:15, type:"heal",   amount:30, levelScale:1, skillScale:{ Vitality:1 },       msg:"Shaman calls Healing Rain!", cooldown:4 }
      ]
    }
  };

  const bossTypes = [
    {
      name: "Goblin King",
      baseHp:    300, baseAtkMin:15, baseAtkMax:25, baseXp:300,
      specialAttacks:[
        { name:"Royal Decree", min:20, max:35, msg:"👑 Goblin King shouts: Obey!" },
        { name:"Crown Smash",  min:30, max:45, msg:"👑 Crown Smash crashes!" }
      ],
      phases:[
        { threshold:0.75, buff:{ attackMin:5, attackMax:5 },    msg:"👑 Goblin King grows angry!" },
        { threshold:0.50, buff:{ critChance:0.1 },               msg:"👑 Goblin King enacts fury!" },
        { threshold:0.25, buff:{ attackMin:10, attackMax:10 },  msg:"👑 Goblin King unleashes desperation!" }
      ],
      maxMana: 0,
      spells:  []
    },
    {
      name: "Ancient Dragon",
      baseHp:    600, baseAtkMin:25, baseAtkMax:40, baseXp:800,
      specialAttacks:[
        { name:"Inferno Breath", min:40, max:60, msg:"🔥 Dragon breathes fire!" },
        { name:"Tail Swipe",     min:20, max:35, msg:"🔥 Dragon swipes tail!" }
      ],
      phases:[
        { threshold:0.80, buff:{ defense:5 },                          msg:"🔥 Dragon scales harden!" },
        { threshold:0.50, buff:{ attackMin:10, attackMax:10 },        msg:"🔥 Dragon roars in fury!" },
        { threshold:0.20, buff:{ critChance:0.15 },                    msg:"🔥 Dragon is blinded by rage!" }
      ],
      maxMana: 0,
      spells:  []
    }
  ];

  // ==============================
  // STATE & DOM REFERENCES
  // ==============================
  let hero = {}, enemy = {};
  let difficulty = 'normal', sfxEnabled = true;
  let pendingLoot = null, currentTurn = 'hero';
let autoBattle = false;
let autoBattleInterval = null;

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

  const enemyTypeSpan        = document.getElementById('enemy-type');
  const enemyLevelSpan       = document.getElementById('enemy-level');
  const enemyHpText          = document.getElementById('enemy-hp');
  const enemyMaxHpText       = document.getElementById('enemy-maxhp');
  const enemyHpBar           = document.getElementById('enemy-hp-bar');
  // NEW: enemy mana UI
  const enemyManaRow         = document.getElementById('enemy-mana-row');
  const enemyManaText        = document.getElementById('enemy-mana-text');
  const enemyMaxManaText     = document.getElementById('enemy-maxmana-text');
  const enemyManaBar         = document.getElementById('enemy-mana-bar');
  const enemyManaBarContainer= document.getElementById('enemy-mana-bar-container');

  const attackBtn      = document.getElementById('attack-btn');
  const charSheetBtn   = document.getElementById('char-sheet-btn');
  const spellsContainer= document.getElementById('spells-container');
  const optMainMenu    = document.getElementById('opt-main-menu');
  const optNewGame     = document.getElementById('opt-new-game');
  const optSave        = document.getElementById('opt-save');
  const optLoad        = document.getElementById('opt-load');
const optDeveloper   = document.getElementById('opt-developer');
const optOptions   = document.getElementById('opt-options');
  const logEl          = document.getElementById('log');
  const bgm            = document.getElementById('bgm');

  // ==============================
  // SOUND EFFECTS
  // ==============================
  const sfx = {
    click:    new Audio('sfx/click.wav'),
    attack:   new Audio('sfx/attack.wav'),
    hit:      new Audio('sfx/hit.wav'),
    spell:    new Audio('sfx/spell.wav'),
    levelUp:  new Audio('sfx/levelUp.wav'),
    death:    new Audio('sfx/death.wav')
  };
  bgm.volume = optMusicVol.value / 100;
  Object.values(sfx).forEach(a => a.volume = optSfxVol.value / 100);

  function playSfx(name){
    if(sfxEnabled && sfx[name]){
      sfx[name].currentTime = 0;
      sfx[name].play().catch(()=>{});
    }
  }
  document.body.addEventListener('click', function initMusicOnce(){
    if(optMusic.checked) bgm.play().catch(()=>{});
    document.body.removeEventListener('click', initMusicOnce);
  });
  document.body.addEventListener('click', e=>{
    if(e.target.tagName==='BUTTON') playSfx('click');
  });

  // ==============================
  // OPTIONS CONTROLS
  // ==============================
  optMusic.addEventListener('change', ()=>{
    if(optMusic.checked) bgm.play().catch(()=>{});
    else                bgm.pause();
  });
  optSfx.addEventListener('change', ()=>{ sfxEnabled = optSfx.checked; });
  optDiff.addEventListener('change', ()=>{ difficulty = optDiff.value; });
  optMusicVol.addEventListener('input', ()=>{ bgm.volume = optMusicVol.value/100; });
  optSfxVol.addEventListener('input', ()=>{ Object.values(sfx).forEach(a=>a.volume = optSfxVol.value/100); });

  // ==============================
  // RANDOM NAME GENERATOR
  // ==============================
  const namePrefixes=["Ara","Eli","Gal","Ser","Kael","Rha","Mira","Thal","Zan","Lor","Val","Ner","Del","Fen","Ori","Ari","Tar","Sol","Mal","Kor","Ly","Jor","Bri","Xan","Nia","Zor","Vel","Rin","Cai","Kri"];
  const nameSuffixes=["gorn","wen","dor","thos","riel","nor","mir","dus","fiel","ion","as","or","ean","ith","an","ius","am","on","er","us","ara","ael","orin","eth","arae","alos","amir","essa","ondra","elis"];
  function generateRandomName(){
    const pre=namePrefixes[Math.floor(Math.random()*namePrefixes.length)];
    const suf=nameSuffixes[Math.floor(Math.random()*nameSuffixes.length)];
    return pre+suf;
  }
  randomNameBtn.addEventListener('click', ()=>{ heroNameInput.value = generateRandomName(); });

  // ==============================
  // UTILITIES & AI
  // ==============================
  function getRandom(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
  function getScaledValue(base,scale,level){ return base + (scale||0)*level; }

  function getSpellDamage(spell,caster){
    let minD = getScaledValue(spell.min, spell.levelScale, caster.level);
    let maxD = getScaledValue(spell.max, spell.levelScale, caster.level);
    const skills = caster.skills||{};
    if(spell.skillScale){
      for(const [skill,scale] of Object.entries(spell.skillScale)){
        const pts = skills[skill]||0;
        minD += pts*scale;
        maxD += pts*scale;
      }
    }
    return getRandom(Math.floor(minD), Math.floor(maxD));
  }

  function getSpellHeal(spell,caster){
    let amt = getScaledValue(spell.amount, spell.levelScale, caster.level);
    const skills = caster.skills||{};
    if(spell.skillScale){
      for(const [skill,scale] of Object.entries(spell.skillScale)){
        const pts = skills[skill]||0;
        amt += pts*scale;
      }
    }
    return Math.floor(amt);
  }

  function scoreAttack(e,h){
    const avgDmg = ((e.attackMin+e.attackMax)/2) - h.defense;
    return Math.max(1, avgDmg);
  }

  function scoreSpell(sp,e,h){
    const baseAvg = (((sp.min||0)+(sp.max||0))/2) + (sp.levelScale||0)*e.level;
    const manaPct = e.maxMana>0 ? e.mana/e.maxMana : 0;
    let raw = 0;
    if(sp.type==='damage'){
      raw = baseAvg*(0.5 + manaPct*0.5);
    } else if(sp.type==='heal'){
      const miss = 1 - (e.hp/e.maxHp);
      raw = ((sp.amount||0) + (sp.levelScale||0)*e.level)*miss*2;
    } else if(sp.type==='drain'){
      raw = ((sp.amount||0) + (sp.levelScale||0)*e.level)*1.2;
    }
    return raw - ((sp.cost||0)*0.3);
  }

  function scoreDefend(e,h){
    const low = 1 - (e.hp/e.maxHp);
    return 5 + low*10;
  }

  function decideEnemyAction(enemy,hero){
    const cands = [];
    cands.push({ type:'attack', score: scoreAttack(enemy,hero) });
    enemy.spells.forEach(sp => {
      if(sp.cost <= enemy.mana && sp.currentCd === 0){
        const sc = scoreSpell(sp,enemy,hero);
        cands.push({ type:'spell', spell:sp, score:sc });
      }
    });
    cands.push({ type:'defend', score: scoreDefend(enemy,hero) });
    cands.sort((a,b)=>b.score - a.score);
    return cands[0];
  }

  function performEnemyAttack(){
    let dmg = getRandom(enemy.attackMin,enemy.attackMax), msg='';
    if(Math.random()<enemy.critChance){ dmg*=2; msg='👹 Enemy Critical! '; }
    const dealt = Math.max(0, dmg - hero.defense);
    hero.hp = Math.max(0, hero.hp - dealt);
    logEl.textContent = `${msg}Enemy dealt ${dealt} damage.`;
    playSfx('hit'); updateUI();
  }
  function performEnemyDefend(){
    enemy.defense += 2;
    logEl.textContent = 'Enemy braces for impact!';
  }
  function performEnemySpell(sp){
    if(sp.cost>enemy.mana) return;
    enemy.mana -= sp.cost;
    if(sp.type==='damage'){
      const d = getSpellDamage(sp,enemy);
      hero.hp = Math.max(0, hero.hp - d);
      logEl.textContent = `${sp.msg} (−${d} HP, −${sp.cost} MP)`;
    } else if(sp.type==='heal'){
      const h = getSpellHeal(sp,enemy);
      enemy.hp = Math.min(enemy.maxHp, enemy.hp + h);
      logEl.textContent = `${sp.msg} (+${h} HP, −${sp.cost} MP)`;
    } else if(sp.type==='drain'){
      const d = getSpellHeal(sp,enemy);
      hero.hp = Math.max(0, hero.hp - d);
      enemy.hp = Math.min(enemy.maxHp, enemy.hp + d);
      logEl.textContent = `${sp.msg} (drain ${d}, −${sp.cost} MP)`;
    }
    sp.currentCd = sp.cooldown; // start cooldown
    playSfx('hit'); updateUI();
  }

  // ==============================
  // GEAR FUNCTIONS
  // ==============================
  function equipItem(slot,item){
    const old = hero.gear[slot];
    if(old) Object.entries(old.stats).forEach(([k,v])=>hero[k]-=v);
    hero.gear[slot] = item;
    Object.entries(item.stats).forEach(([k,v])=>hero[k] = (hero[k]||0)+v);
    updateUI(); refreshCharSheetOverlay();
  }
  function unequipItem(slot){
    const old = hero.gear[slot];
    if(!old) return;
    Object.entries(old.stats).forEach(([k,v])=>hero[k]-=v);
    hero.gear[slot] = null;
    updateUI(); refreshCharSheetOverlay();
  }

  // ==============================
  // UI UPDATE
  // ==============================
  function updateUI(){
    // Hero
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

    // Enemy
    enemyTypeSpan.textContent  = enemy.name;
    enemyLevelSpan.textContent = enemy.level;
    enemyHpText.textContent    = enemy.hp;
    enemyMaxHpText.textContent = enemy.maxHp;
    enemyHpBar.style.width     = `${(enemy.hp/enemy.maxHp)*100}%`;
    if(enemy.isBoss) enemyHpBar.classList.add('boss');
    else             enemyHpBar.classList.remove('boss');

    if(enemy.maxMana>0){
      enemyManaRow.style.display              = '';
      enemyManaBarContainer.style.display     = '';
      enemyManaText.textContent               = enemy.mana;
      enemyMaxManaText.textContent            = enemy.maxMana;
      enemyManaBar.style.width                = `${(enemy.mana/enemy.maxMana)*100}%`;
    } else {
      enemyManaRow.style.display              = 'none';
      enemyManaBarContainer.style.display     = 'none';
    }
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
    e.xpReward  = Math.floor(e.xpReward * xpM);
  }

  function spawnEnemy(){
    if(hero.level>1 && hero.level%5===0) return spawnBoss(hero.level);
    const races   = Object.keys(enemyRaces);
    const classes = Object.keys(enemyClasses);
    const r       = races[getRandom(0,races.length-1)];
    const c       = classes[getRandom(0,classes.length-1)];
    const rm      = enemyRaces[r];
    const cd      = enemyClasses[c];
    const boost   = getRandom(0,2);
    const lvl     = hero.level + boost;
    const baseHp  = cd.baseHp    + lvl*10;
    const baseMin = cd.attackMin + lvl;
    const baseMax = cd.attackMax + lvl;
    enemy = {
      race:       r,
      className:  c,
      name:       `${r} ${c}`,
      level:      lvl,
      maxHp:      Math.floor(baseHp * rm.hpMult),
      hp:         Math.floor(baseHp * rm.hpMult),
      attackMin:  Math.floor(baseMin * rm.atkMult),
      attackMax:  Math.floor(baseMax * rm.atkMult),
      maxMana:    cd.maxMana,
      mana:       cd.maxMana,
      spells:     cd.spells.map(sp=>({ ...sp, currentCd: 0 })),
      xpReward:   cd.baseXp + lvl*5,
      critChance: rm.critChance,
      defense:    rm.defense,
      skills:     {},
      isBoss:     false
    };
    applyDifficulty(enemy);
    updateUI();
    logEl.textContent = `⚔️ A ${enemy.name} appears!`;
    currentTurn = 'hero';
    attackBtn.disabled = false;
    spellsContainer.querySelectorAll('button').forEach(b=>b.disabled=false);
  }

  function spawnBoss(level){
    const idx   = ((level/5)-1) % bossTypes.length;
    const arche = bossTypes[idx];
    enemy = {
      ...arche,
      level,
      maxHp:      arche.baseHp + level*20,
      hp:         arche.baseHp + level*20,
      attackMin:  arche.baseAtkMin + level*2,
      attackMax:  arche.baseAtkMax + level*2,
      xpReward:   Math.floor((arche.baseXp + level*20)*1.5),
      critChance: arche.critChance || 0.05,
      defense:    arche.defense    || 0,
      maxMana:    arche.maxMana    || 0,
      mana:       arche.maxMana    || 0,
      spells:     arche.spells.map(sp=>({ ...sp, currentCd: 0 })),
      specialAttacks: [...arche.specialAttacks],
      phases:          arche.phases.map(p=>({...p,triggered:false})),
      skills: {},
      isBoss:    true
    };
    applyDifficulty(enemy);
    updateUI();
    logEl.textContent = `⚔️ A boss appears: ${enemy.name}!`;
    currentTurn = 'hero';
    attackBtn.disabled = false;
    spellsContainer.querySelectorAll('button').forEach(b=>b.disabled=false);
  }

  // ==============================
  // HOTKEYS & SPELL BUTTONS
  // ==============================
  function hotkeyHandler(e){
    if(currentTurn!=='hero') return;
    let idx = null;
    if(e.key>='1'&&e.key<='9') idx = +e.key-1;
    else if(e.key==='0') idx = 9;
    if(idx!==null && hero.spells[idx]) castSpell(idx);
  }
  function createSpellButtons(){
    spellsContainer.innerHTML = '';
    hero.spells.forEach((sp,i)=>{
      const hot = i<9? i+1 : 0;
      const btn = document.createElement('button');
      btn.textContent = `[${hot}] ${sp.name} (${sp.cost} MP)`;
      btn.addEventListener('click', ()=>castSpell(i));
      spellsContainer.appendChild(btn);
    });
    document.removeEventListener('keydown', hotkeyHandler);
    document.addEventListener('keydown', hotkeyHandler);
  }

  // ==============================
  // TURN MANAGEMENT & ENEMY ACTION
  // ==============================
  function nextTurn(){
    if(checkBattleEnd()) return;
    if(currentTurn==='hero'){
      currentTurn='enemy';
      attackBtn.disabled=true;
      spellsContainer.querySelectorAll('button').forEach(b=>b.disabled=true);
      setTimeout(enemyTurn, 500);
    }
  }

  function enemyTurn(){
    // tick down cooldowns
    enemy.spells.forEach(sp=>{
      if(sp.currentCd>0) sp.currentCd--;
    });
    if(enemy.hp<=0||hero.hp<=0) return;
    // mana regen ~10%
    if(enemy.maxMana>0){
      const regen = Math.floor(enemy.maxMana*0.1);
      enemy.mana = Math.min(enemy.maxMana, enemy.mana+regen);
    }
    // boss phases
    if(enemy.isBoss){
      enemy.phases.forEach(p=>{
        if(!p.triggered && enemy.hp/enemy.maxHp <= p.threshold){
          Object.entries(p.buff).forEach(([k,v])=> enemy[k] = (enemy[k]||0)+v);
          logEl.textContent = p.msg;
          p.triggered = true;
        }
      });
    }
    try {
      const act = decideEnemyAction(enemy, hero);
      if(act.type==='spell')       performEnemySpell(act.spell);
      else if(act.type==='attack') performEnemyAttack();
      else                          performEnemyDefend();
    } catch(err){
      console.error("enemyTurn error:", err);
      performEnemyAttack();
    }
    if(!checkBattleEnd()){
      setTimeout(()=>{
        currentTurn='hero';
        attackBtn.disabled=false;
        spellsContainer.querySelectorAll('button').forEach(b=>b.disabled=false);
        logEl.textContent += ' Your turn!';
      }, 500);
    }
  }

  // ==============================
  // ATTACK HANDLER
  // ==============================
  attackBtn.addEventListener('click', ()=>{
  // Don’t run outside of the hero’s turn or if either side is down
  if (currentTurn !== 'hero' || hero.hp <= 0 || enemy.hp <= 0) return;

  playSfx('attack');

  // ─── Strength Bonus ──────────────────────────────────────
  // Each point in hero.skills.Strength adds +2 flat damage
  const strPts   = hero.skills.Strength || 0;
  const strBonus = strPts * 2;

  // Roll your base weapon damage, then add Strength
  const baseDmg = getRandom(hero.attackMin, hero.attackMax);
  let dmg = baseDmg + strBonus;

  // ─── Critical Chance ─────────────────────────────────────
  // Core crit, plus property-based Luck, plus skill-based Luck & Ability
  const luckProp   = hero.luck            || 0;      // e.g. hero.luck = 1.0 for 100%
  const luckPts    = hero.skills.Luck     || 0;      // skill points in Luck
  const abilityPts = hero.skills.Ability  || 0;      // skill points in Ability
  // Each skill‐point grants 0.1% crit (0.001)
  const critBonus = luckProp + luckPts * 0.001 + abilityPts * 0.001;
  const effectiveCrit = Math.min(1, hero.critChance + critBonus);

  if (Math.random() < effectiveCrit) {
    dmg *= 2;
    logEl.textContent = '💥 Hero Critical! ';
  } else {
    logEl.textContent = '';
  }

  // ─── Deal Damage & Cleanup ───────────────────────────────
  enemy.hp = Math.max(0, enemy.hp - dmg);
  playSfx('hit');
  logEl.textContent += `You dealt ${dmg}.`;
  updateUI();
  nextTurn();
});

  // ==============================
  // CAST SPELL
  // ==============================
  function castSpell(i){
    if(currentTurn!=='hero'||hero.hp<=0||enemy.hp<=0) return;
    const sp = hero.spells[i];
    if(sp.cost>hero.mana){
      logEl.textContent = '⚠️ Not enough Mana!';
      return;
    }
    playSfx('spell');
    hero.mana -= sp.cost;
    if(sp.type==='damage'){
      const d = getSpellDamage(sp, hero);
      enemy.hp = Math.max(0, enemy.hp - d);
      logEl.textContent = `${sp.msg} (−${d} HP, −${sp.cost} MP)`;
    } else if(sp.type==='heal'){
      const h = getSpellHeal(sp, hero);
      hero.hp = Math.min(hero.maxHp, hero.hp + h);
      logEl.textContent = `${sp.msg} (+${h} HP, −${sp.cost} MP)`;
    } else if(sp.type==='drain'){
      const d = getSpellHeal(sp, hero);
      enemy.hp = Math.max(0, enemy.hp - d);
      hero.hp = Math.min(hero.maxHp, hero.hp + d);
      logEl.textContent = `${sp.msg} (drain ${d}, −${sp.cost} MP)`;
    }
    updateUI();
    if(!checkBattleEnd()) nextTurn();
  }

  // ==============================
  // BATTLE END & LEVEL UP
  // ==============================
  function checkBattleEnd(){
    if(enemy.hp===0){
      playSfx('levelUp');
      const xpGain = Math.floor(enemy.xpReward*(1+hero.xpGainBonus));
      hero.xp += xpGain;
      if(enemy.isBoss){
        logEl.textContent += ` 🎉 You’ve slain the boss ${enemy.name}! +${xpGain} XP`;
        pendingLoot = { name:`${enemy.name} Trophy`, slot:'necklace', stats:{ defense:5, maxHp:20 } };
      } else {
        logEl.textContent += ` 🎉 Defeated Level ${enemy.level} ${enemy.name}! +${xpGain} XP`;
        pendingLoot = lootPool[Math.floor(Math.random()*lootPool.length)];
      }
      let leveled = false;
      while(hero.xp>=hero.xpToNext){
        playSfx('levelUp');
        hero.xp -= hero.xpToNext;
        hero.level++;
        hero.skillPoints++;
        hero.maxHp+=20; hero.hp=hero.maxHp;
        hero.attackMin+=2; hero.attackMax+=2;
        hero.xpToNext = Math.floor(hero.xpToNext*1.5);
        logEl.textContent += ` 🎊 Level ${hero.level}!`;
        leveled = true;
      }
      updateUI();
      if(leveled) showSkillAllocation();
      else       showLootPick(pendingLoot), pendingLoot=null;
      return true;
    } else if(hero.hp===0){
      playSfx('death');
      logEl.textContent += ' 💀 You died!';
      attackBtn.disabled = true;
      document.removeEventListener('keydown', hotkeyHandler);
      return true;
    }
    return false;
  }

  // ==============================
  // LOOT PICK OVERLAY
  // ==============================
  function showLootPick(item){
    attackBtn.disabled=true;
    const overlay = document.createElement('div');
    overlay.id='loot-overlay';
    Object.assign(overlay.style,{
      position:'fixed',inset:0,background:'#000b',
      display:'flex',alignItems:'center',justifyContent:'center',zIndex:10000
    });
    overlay.innerHTML = `
      <div style="background:#1e1e1e;padding:20px;border-radius:8px;color:#eee;max-width:300px;text-align:center">
        <h3>Loot Found!</h3>
        <p><strong>${item.name}</strong> (${item.slot})</p>
        <button id="loot-equip">Equip</button>
        <button id="loot-skip">Skip</button>
      </div>`;
    document.body.appendChild(overlay);
    document.getElementById('loot-equip').addEventListener('click', ()=>{
      playSfx('click'); equipItem(item.slot,item); close();
    });
    document.getElementById('loot-skip').addEventListener('click', ()=>{
      playSfx('click'); close();
    });
    function close(){
      document.body.removeChild(overlay);
      setTimeout(spawnEnemy,600);
    }
  }

  // ==============================
  // SKILL ALLOCATION OVERLAY
  // ==============================
  function showSkillAllocation(){
    attackBtn.disabled=true;
    document.removeEventListener('keydown',hotkeyHandler);
    const overlay=document.createElement('div');
    overlay.id='skill-overlay';
    Object.assign(overlay.style,{
      position:'fixed',inset:0,background:'#000',
      display:'flex',alignItems:'center',justifyContent:'center',zIndex:10000
    });
    let html=`<div style="background:#1e1e1e;padding:20px;border-radius:8px;color:#eee;max-width:400px">
      <h3>Use SP (<span id="rem-sp">${hero.skillPoints}</span>)</h3><ul style="list-style:none;padding:0">`;
    skillDefinitions.forEach((sd,i)=>{
      html+=`<li style="margin:8px 0">
        <strong>${sd.name}</strong> — <em>${sd.desc}</em><br>
        <span id="lvl-${i}">${hero.skills[sd.name]||0}</span>
        <button id="plus-${i}"${hero.skillPoints===0?' disabled':''}>+</button>
      </li>`;
    });
    html+=`</ul><button id="auto-btn">Auto-Allocate</button> <button id="ok-btn">OK</button></div>`;
    overlay.innerHTML=html;
    document.body.appendChild(overlay);
    skillDefinitions.forEach((sd,i)=>{
      document.getElementById(`plus-${i}`).addEventListener('click',()=>{
        playSfx('click');
        if(hero.skillPoints>0){
          hero.skillPoints--;
          hero.skills[sd.name]=(hero.skills[sd.name]||0)+1;
          sd.apply();
          document.getElementById(`lvl-${i}`).textContent=hero.skills[sd.name];
          document.getElementById('rem-sp').textContent=hero.skillPoints;
          if(hero.skillPoints===0)
            document.querySelectorAll("[id^='plus-']").forEach(b=>b.disabled=true);
        }
      });
    });
    document.getElementById('auto-btn').addEventListener('click',()=>{
      playSfx('click');
      const top=autoPriorities[hero.className][0];
      const sd=skillDefinitions.find(s=>s.name===top);
      while(hero.skillPoints>0){
        hero.skillPoints--;
        hero.skills[top]=(hero.skills[top]||0)+1;
        sd.apply();
      }
      document.getElementById(`lvl-${skillDefinitions.indexOf(sd)}`).textContent=hero.skills[top];
      document.getElementById('rem-sp').textContent=hero.skillPoints;
      document.querySelectorAll("[id^='plus-']").forEach(b=>b.disabled=true);
    });
    document.getElementById('ok-btn').addEventListener('click',()=>{
      playSfx('click');
      document.body.removeChild(overlay);
      const hasSpells = Array.isArray(spellsList[hero.className]) && spellsList[hero.className].length>0;
      if(hasSpells) showSpellPick();
      else {
        attackBtn.disabled=false;
        setTimeout(spawnEnemy,600);
        if(pendingLoot){ showLootPick(pendingLoot); pendingLoot=null; }
      }
    });
  }

  // ==============================
  // SPELL PICK OVERLAY
  // ==============================
  function showSpellPick(){
  // Disable hero input while picking a spell
  attackBtn.disabled = true;
  document.removeEventListener('keydown', hotkeyHandler);

  // Create the overlay container
  const overlay = document.createElement('div');
  overlay.id = 'spell-pick';
  Object.assign(overlay.style, {
    position: 'fixed',
    inset: 0,
    background: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000
  });

  // Build a filtered list of spells the hero doesn't already know
  const available = spellsList[hero.className] || [];
  const choices   = available.filter(sp => !hero.spells.find(s => s.name === sp.name));

  // Generate HTML for the menu
  let html = `
    <div style="
      background: #1e1e1e;
      padding: 20px;
      border-radius: 8px;
      color: #eee;
      max-width: 400px;
      text-align: center;
    ">
      <h3>Learn a New Spell</h3>
      <ul style="list-style:none;padding:0;margin:0">
  `;
  choices.forEach((sp, i) => {
    html += `
      <li style="margin:8px 0">
        <button data-i="${i}">${sp.name} (${sp.cost} MP)</button>
      </li>`;
  });
  html += `
      </ul>
      <button id="skip-spell">Skip</button>
    </div>`;

  overlay.innerHTML = html;
  document.body.appendChild(overlay);

  // When the player selects a spell, add it from the filtered choices array
  overlay.querySelectorAll('button[data-i]').forEach(btn => {
    btn.addEventListener('click', e => {
      playSfx('click');
      const idx = +e.currentTarget.dataset.i;
      hero.spells.push(choices[idx]);
      closePick();
    });
  });

  // Skip learning a new spell
  document.getElementById('skip-spell').addEventListener('click', () => {
    playSfx('click');
    closePick();
  });

  // Cleanup and resume the battle flow
  function closePick(){
    document.body.removeChild(overlay);
    attackBtn.disabled = false;
    createSpellButtons();
    setTimeout(spawnEnemy, 600);
    document.addEventListener('keydown', hotkeyHandler);
    if (pendingLoot) {
      showLootPick(pendingLoot);
      pendingLoot = null;
    }
  }
}

  // ==============================
  // CHARACTER SHEET OVERLAY & HELPER
  // ==============================
  function refreshCharSheetOverlay(){
    const overlay=document.getElementById('char-sheet-overlay');
    if(!overlay) return;
    const core=overlay.querySelector('.sheet-section.core');
    core.querySelector('p:nth-of-type(1)').innerHTML=`<strong>Level:</strong> ${hero.level}`;
    core.querySelector('p:nth-of-type(2)').innerHTML=`<strong>XP:</strong> ${hero.xp} / ${hero.xpToNext}`;
    core.querySelector('p:nth-of-type(3)').innerHTML=`<strong>HP:</strong> ${hero.hp} / ${hero.maxHp}`;
    core.querySelector('p:nth-of-type(4)').innerHTML=`<strong>Attack:</strong> ${hero.attackMin} – ${hero.attackMax}`;
    core.querySelector('p:nth-of-type(5)').innerHTML=`<strong>Defense:</strong> ${hero.defense}`;
    core.querySelector('p:nth-of-type(6)').innerHTML=`<strong>Crit %:</strong> ${Math.round(hero.critChance*100)}%`;
  }
  charSheetBtn.addEventListener('click', ()=>{
    playSfx('click');
    attackBtn.disabled=true;
    document.removeEventListener('keydown',hotkeyHandler);
    const gearHtml = `
      <section class="sheet-section gear">
        <h3>Gear</h3>
        <div class="gear-container">
          <img src="clip-art/gear.png" alt="gear slots">
          ${gearSlots.map(slot=>`
            <button class="gear-slot" data-slot="${slot}">
              ${hero.gear[slot]?.name||slot.charAt(0).toUpperCase()+slot.slice(1)}
            </button>`).join('')}
        </div>
      </section>`;
    const overlay=document.createElement('div');
    overlay.id='char-sheet-overlay';
    Object.assign(overlay.style,{
      position:'fixed',inset:0,background:'#000',
      display:'flex',alignItems:'center',justifyContent:'center',zIndex:2000
    });
    overlay.innerHTML=`
      <div class="sheet-container">
        <header class="sheet-header"><h2>${hero.name} the ${hero.className}</h2></header>
        <div class="sheet-content">
          <section class="sheet-section core">
            <h3>Core Stats</h3>
            <p><strong>Level:</strong> ${hero.level}</p>
            <p><strong>XP:</strong> ${hero.xp} / ${hero.xpToNext}</p>
            <p><strong>HP:</strong> ${hero.hp} / ${hero.maxHp}</p>
            <p><strong>Attack:</strong> ${hero.attackMin} – ${hero.attackMax}</p>
            <p><strong>Defense:</strong> ${hero.defense}</p>
            <p><strong>Crit %:</strong> ${Math.round(hero.critChance*100)}%</p>
            <p><strong>SP:</strong> ${hero.skillPoints}</p>
          </section>
          <section class="sheet-section skills">
            <h3>Skills</h3><ul>
              ${skillDefinitions.map(sd=>`<li><strong>${sd.name}:</strong> ${hero.skills[sd.name]||0}</li>`).join('')}
            </ul>
          </section>
          <section class="sheet-section spells">
            <h3>Spells</h3><ul>
              ${hero.spells.map(sp=>`<li>${sp.name} <span class="spell-cost">(${sp.cost} MP)</span></li>`).join('')}
            </ul>
          </section>
          ${gearHtml}
        </div>
        <button id="close-char-sheet">Close</button>
      </div>`;
    document.body.appendChild(overlay);
    document.querySelectorAll('.gear-slot').forEach(btn=>{
      btn.addEventListener('click', e=>{
        const slot=e.currentTarget.dataset.slot;
        unequipItem(slot);
        e.currentTarget.textContent = slot.charAt(0).toUpperCase()+slot.slice(1);
      });
    });
    document.getElementById('close-char-sheet').addEventListener('click', ()=>{
      playSfx('click');
      document.body.removeChild(overlay);
      attackBtn.disabled=false;
      createSpellButtons();
      document.addEventListener('keydown',hotkeyHandler);
    });
  });

  // ==============================
  // SAVE / LOAD SLOTS OVERLAY
  // ==============================
  function showSlotOverlay(type){
    playSfx('click');
    const overlay=document.createElement('div');
    overlay.id='slot-overlay';
    Object.assign(overlay.style,{
      position:'fixed',inset:0,background:'#000',
      display:'flex',alignItems:'center',justifyContent:'center',zIndex:2000
    });
    let html=`<div style="background:#1e1e1e;padding:20px;border-radius:8px;color:#eee;max-width:300px">
        <h3>${type==='save'?'Save':'Load'} Slot</h3><ul style="list-style:none;padding:0">`;
    for(let i=1;i<=3;i++){
      const key=`rpg_slot${i}`, raw=localStorage.getItem(key);
      let lbl=`Slot ${i}`;
      if(type==='load'&&raw){
        const h=JSON.parse(raw);
        lbl=`${h.name}_${h.className}_Lv${h.level}`;
      }
      html+=`<li style="margin:8px 0"><button data-slot="${i}">${lbl}</button></li>`;
    }
    html+=`</ul><button id="slot-cancel">Cancel</button></div>`;
    overlay.innerHTML=html;
    document.body.appendChild(overlay);
    overlay.querySelectorAll('button[data-slot]').forEach(btn=>{
      btn.addEventListener('click',e=>{
        playSfx('click');
        const slot=e.currentTarget.dataset.slot;
        const key=`rpg_slot${slot}`;
        const raw=localStorage.getItem(key);
        if(type==='save'){
          localStorage.setItem(key, JSON.stringify(hero));
          logEl.textContent=`💾 Saved to ${hero.name}_${hero.className}_Lv${hero.level}`;
        } else if(raw){
          hero=JSON.parse(raw);
          mainMenu.style.display='none';
          creationArea.style.display='none';
          battleSection.style.display='block';
          beginBattle();
          logEl.textContent=`📂 Loaded ${hero.name}_${hero.className}_Lv${hero.level}`;
        } else {
          logEl.textContent='⚠️ Empty Slot';
        }
        document.body.removeChild(overlay);
      });
    });
    document.getElementById('slot-cancel').addEventListener('click', ()=>{
      playSfx('click');
      document.body.removeChild(overlay);
    });
  }

  // ==============================
  // MENU HANDLERS
  // ==============================
  menuNew.addEventListener('click',     ()=>{ playSfx('click'); mainMenu.style.display='none'; creationArea.style.display='block'; });
  menuLoad.addEventListener('click',    ()=>{ playSfx('click'); showSlotOverlay('load'); });
  menuOptions.addEventListener('click', ()=>{ playSfx('click'); optionsMenu.style.display='flex'; });
  optBack.addEventListener('click',     ()=>{ playSfx('click'); optionsMenu.style.display='none'; });
  optMainMenu.addEventListener('click', ()=>{ playSfx('click'); battleSection.style.display='none'; creationArea.style.display='none'; mainMenu.style.display='flex'; });
  optNewGame.addEventListener('click',  ()=>{ playSfx('click'); battleSection.style.display='none'; mainMenu.style.display='none'; creationArea.style.display='block'; });
  optSave.addEventListener('click',     ()=>{ playSfx('click'); showSlotOverlay('save'); });
  optLoad.addEventListener('click',     ()=>{ playSfx('click'); showSlotOverlay('load'); });
optDeveloper.addEventListener('click', showDevMenu);
  optOptions.addEventListener('click', () => {
    playSfx('click');
    optionsMenu.style.display = 'flex';
  });

//==============================
  // CHARACTER CREATION & START
  //==============================
  startBtn.addEventListener('click', ()=>{
    playSfx('click');
    const name = heroNameInput.value.trim();
    if(!name){ alert('Enter a name'); return; }
    const race = raceSelect.value;
    const cls  = classSelect.value;
    const base = classData[cls];
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
    mainMenu.style.display='none';
    creationArea.style.display='none';
    battleSection.style.display='block';
if (autoBattle) {
    autoBattle = false;
    clearInterval(autoBattleInterval);
}
    beginBattle();
  });

  // ==============================
  // BEGIN BATTLE
  // ==============================
  function beginBattle(){
    spellsContainer.innerHTML='';
    document.removeEventListener('keydown', hotkeyHandler);
    createSpellButtons();
    spawnEnemy();
    updateUI();
  }

  // ─── Developer Menu ─────────────────────────────────────────
  function showDevMenu() {
    // create overlay
    const overlay = document.createElement('div');
    overlay.id = 'dev-menu-overlay';
    overlay.innerHTML = `
      <div id="dev-menu">
        <h3>Developer Menu</h3>
        <button id="cheat-infinite-health">Infinite Health</button>
        <button id="cheat-infinite-mana">Infinite Mana</button>
        <button id="cheat-level-up">Level Up</button>
        <button id="cheat-add-xp">Add XP</button>
        <button id="cheat-kill-enemy">Kill Enemy</button>
<button id="cheat-max-stats">Max Stats</button>
<button id="cheat-auto-battle-toggle">Auto-Battle: Off</button>
        <button id="cheat-close">Close</button>
      </div>`;
    document.body.appendChild(overlay);

    // Cheat actions
    document.getElementById('cheat-infinite-health').addEventListener('click', ()=>{
      hero.maxHp = hero.maxHp * 999;
      hero.hp = hero.maxHp;
      updateUI();
    });
    document.getElementById('cheat-infinite-mana').addEventListener('click', ()=>{
      if (hero.maxMana > 0) {
        hero.maxMana = hero.maxMana * 999;
        hero.mana = hero.maxMana;
        updateUI();
      }
    });
    document.getElementById('cheat-level-up').addEventListener('click', ()=>{
      hero.level++;
      hero.skillPoints++;
      hero.maxHp += 20; hero.hp = hero.maxHp;
      hero.attackMin += 2; hero.attackMax += 2;
      hero.xpToNext = Math.floor(hero.xpToNext * 1.5);
      playSfx('levelUp');
      updateUI();
    });
    document.getElementById('cheat-add-xp').addEventListener('click', ()=>{
      const amt = parseInt(prompt('Enter XP to add:', '100'), 10);
      if (!isNaN(amt)) {
        hero.xp += amt;
        logEl.textContent = `🔧 Added ${amt} XP`;
        updateUI();
        // auto-level if enough XP
        while (hero.xp >= hero.xpToNext) {
          document.getElementById('cheat-level-up').click();
        }
      }
    });
    document.getElementById('cheat-kill-enemy').addEventListener('click', ()=>{
      enemy.hp = 0;
      updateUI();
      checkBattleEnd();
    });
  // ─── **INSERT AUTO-BATTLE TOGGLE HERE** ─────────────────
  // Place this block **immediately after** the Kill Enemy handler:
document.getElementById('cheat-auto-battle-toggle').addEventListener('click', () => {
    autoBattle = !autoBattle;
    const btn = document.getElementById('cheat-auto-battle-toggle');
    btn.textContent = `Auto-Battle: ${autoBattle ? 'On' : 'Off'}`;
    if (autoBattle) {
      autoBattleInterval = setInterval(() => {
        // Only auto-attack if it's your turn, both are alive,
    // attack button is enabled, AND neither skill/spell nor loot overlays are showing
if (
currentTurn === 'hero' &&
hero.hp > 0 &&
enemy.hp > 0 &&
!attackBtn.disabled &&
 
// wait through skill/spell pick & loot pick overlays
!document.getElementById('skill-overlay') &&
!document.getElementById('spell-pick') &&
!document.getElementById('loot-overlay')
) {
        attackBtn.click();
       }
      }, 600);
    } else {
      clearInterval(autoBattleInterval);
    }
  });

  // ─── **INSERT MAX-STATS HANDLER HERE** ──────────────────
  // Place this block **directly after** the auto-battle code:
  document.getElementById('cheat-max-stats').addEventListener('click', () => {
    const stat = prompt('Enter stat to max (e.g. Strength, Defense, Speed, Luck):');
    if (!stat) return;
    const key = stat.charAt(0).toLowerCase() + stat.slice(1);
    if (hero[key] !== undefined) {
      // Numeric caps
      if (key === 'critChance' || key === 'luck') hero[key] = 1.0;
      else hero[key] = 999;
      if (key === 'maxHp') hero.hp = hero.maxHp;
      if (key === 'maxMana') hero.mana = hero.maxMana;
      updateUI();
    } else if (hero.skills && hero.skills[stat] !== undefined) {
      hero.skills[stat] = 999;
      refreshCharSheetOverlay();
    } else {
      alert('Stat not found.');
    }
  });
    document.getElementById('cheat-close').addEventListener('click', ()=>{
      document.body.removeChild(overlay);
    });
  }
});
