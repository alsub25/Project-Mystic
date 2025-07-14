# Changelog

All notable changes to this project will be documented in this file.

## [0.5.0] – 2025-07-13

### 🚀 Added
- **Core Combat System**  
  - Turn-based battle loop with melee attacks, spells, healing, and status effects  
  - Target selection, hit/miss/evasion calculations, and XP rewards  
- **Race & Class Selection**  
  - Multiple fantasy races, each granting unique stat bonuses  
  - Class archetypes with distinct base HP, mana, attack ranges, and available spells  
- **Spellcasting Framework**  
  - Damage, heal, and drain spells that scale with class level and allocated skill points  
  - Per-class spellbooks defined in `spellsList[className]`  
- **Gear & Loot**  
  - Equippable items granting flat stat bonuses (`attackMin`, `defense`, `speed`, `luck`, etc.)  
  - Boss-drop logic and `lootPool` configuration  
- **Character Progression**  
  - Level-up system awarding skill points  
  - Manual and auto-distribute options for allocating points across Strength, Vitality, Agility, Defense, Intelligence, Luck, Speed, Endurance, Critical Strike, and Mana  
- **Enemy AI & Boss Encounters**  
  - AI decision-making for optimal attack or spell choices  
  - Multi-phase boss mechanics with special abilities  
- **Responsive UI Modes**  
  - Auto-detect and switch between **PC UI** (wide layout with panel grids) and **Phone UI** (touch-optimized scrollable menus)  
- **Audio System**  
  - Toggleable background music and sound effects with independent volume controls  
- **Persistent Saves**  
  - Three localStorage save slots accessible via in-game menu  
- **Developer Tools**  
  - Built-in cheats and debugging: infinite HP/Mana, manual level-up, add XP, instant kill, auto-battle toggle, max stat override  

### 🔄 Changed
- **UI Refinements**  
  - Redesigned spell grid for clarity on PC and streamlined button layout on mobile  
  - Improved touch target sizes and scroll performance in Phone UI  
- **Performance Optimizations**  
  - Reduced reflows by caching DOM queries in `game.js`  
  - Batched state updates during combat to minimize UI lag  
- **Code Modularization (Foundation)**  
  - Split `game.js` into logical sections for data (race, class, spells, gear) and engine (combat loop, AI, saving)  
  - Introduced `raceData`, `bossTypes`, and `lootPool` objects for easier content extension  

### 🐛 Fixed
- **Spell Scaling Bug**  
  - Corrected calculation of spell damage multiplier when Intelligence > level  
- **Save/Load Edge Case**  
  - Prevented overwrite of slot 3 when no save data exists  
- **Mobile Layout Overflow**  
  - Fixed character sheet panels extending off-screen on some Android devices  

### ⚠️ Known Issues
- **Multiplayer/PvP** – Not yet implemented; placeholder hooks exist  
- **Inventory Management** – No consumables or item stacking support  
- **Procedural Gear** – Rarity and modifier systems pending  
- **Weather/Time-of-Day** – Framework exists but effects are not yet active  

---

[Compare changes](https://github.com/yourusername/project-mystic/compare/v0.4.0...v0.5.0)

[0.5.0]: https://github.com/yourusername/project-mystic/releases/tag/v0.5.0  