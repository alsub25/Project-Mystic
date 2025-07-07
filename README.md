# (Codename) 🔖 Project: Mystic V0.5

_An HTML5/JavaScript-powered pixel-style RPG featuring tactical battles, character customization, spells, gear, skill progression, and both PC and mobile UI modes._

---

## 📦 Features

- **Turn-Based Combat** – Strategic battles with melee, spells, healing, and special effects.
- **Race & Class System** – Pick from multiple fantasy races and classes with unique stats and abilities.
- **Spellcasting System** – Learn spells that scale with skill points and class level.
- **Gear & Loot** – Equip and unequip gear with stat boosts. Bosses drop unique items.
- **Character Progression** – Level up, gain skill points, and allocate them manually or auto-distribute.
- **Enemy AI & Boss Fights** – Enemies choose optimal strategies; bosses have phases and specials.
- **Responsive UI** – Auto-detects mobile/desktop and adapts layout.
- **Sound Effects & Music** – Toggleable and volume-controlled background music and SFX.
- **Save/Load System** – Save to 3 localStorage slots and reload your character anytime.
- **Developer Menu** – Built-in cheats and debugging tools (infinite HP, level-up, auto-battle, etc).

---

## 🚀 Getting Started

1. **Clone or Download**
   ```bash
   git clone https://github.com/yourusername/project-mystic.git
   ```
   Or just download the `.zip` and extract.

2. **Open the Game**
   Open `index.html` in any modern browser (Chrome, Firefox, Edge).

---

## 🕹 Gameplay Overview

### 1. Create a Hero
- Choose your **name**, **race**, and **class**.
- Each race grants unique bonuses to your skills.
- Classes determine base HP, mana, attack, and available spells.

### 2. Battle Enemies
- Press **Attack** or cast a **spell**.
- Your turn alternates with the enemy's.
- Win battles to gain XP and loot.
- Leveling up grants skill points (SP).

### 3. Allocate Skills
Choose from:
- **Strength** – Boost physical damage
- **Vitality** – More max HP
- **Agility** – Boost crit and evasion
- **Defense** – Reduces incoming damage
- **Intelligence** – Boosts spell effectiveness
- **Luck** – Increases crit and loot chances
- **Speed, Endurance, Critical Strike, Mana**

### 4. Equip Gear
- Loot items with stat bonuses (attack, defense, mana, etc).
- Equip items via the **Character Sheet** UI.
- Bosses drop powerful gear and trophies.

---

## 🧠 Data Structure Summary

### Class Data
- Defines HP, Mana, Attack Range
- Determines starting spellbook

### Race Data
- Assigns bonuses to specific stats/skills

### Spells
- Type: `damage`, `heal`, or `drain`
- Scale with level + skills
- Each class has a unique spell list

### Gear
- Items grant flat bonuses to stats like `defense`, `attackMin`, `speed`, `luck`, etc.

### Skills
- Passive enhancements applied via skill points
- Have both immediate effect and future scaling value

---

## 📱 UI Modes

Supports:
- **PC UI** – Wide layout, larger spell grid, and panel-based design.
- **Phone UI** – Mobile-first layout, optimized touch buttons, scroll-friendly content.

Auto-detects device or override via options menu.

---

## 🎮 Controls

### Hotkeys (PC)
- `1-9`, `0`: Cast corresponding spell
- `☰ Menu`: Open Save/Load/Options
- `📋 Character Sheet`: View stats and gear

### Mouse/Touch
- All buttons and menus are fully clickable/touchable
- Loot and Spell selection menus are fully interactive

---

## 💾 Save/Load System

- 3 Save slots stored in `localStorage`
- Save/load your character progress from the game UI

---

## 🧪 Developer Menu

Access via `☰ Menu > Developer Menu`

Includes:
- Infinite Health / Mana
- Manual Level Up
- Add XP
- Instant Enemy Kill
- Auto-Battle Toggle
- Max Stat Override

---

## 📁 File Structure

```
/project-mystic
├── index.html
├── game.js
├── style.css
├── /sfx
├── /clip-art
```

---

## ⚙️ Customization Tips

- Add spells to `spellsList[className]`
- Add gear to `lootPool`
- Add new bosses or races via `bossTypes` or `raceData`

---

## 📜 License

MIT — feel free to use and modify!

---

## 📌 To Do / Ideas

- Add quest and lore systems
- Implement map exploration and NPC interactions
- Add consumable items and inventory management
- Add multiplayer support or PvP mode
- Introduce skill synergies and class ultimates
- Procedural gear with rarity and modifiers
- Add elemental resistances and status effects (burn, freeze, etc)
- Dynamic weather or time-of-day effects
- Visual polish: particle effects, animations
- Boss-specific gear sets or achievements
- UI fixes and modernization
- Deepen all other systems


