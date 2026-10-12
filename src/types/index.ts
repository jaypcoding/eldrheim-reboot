export type ScreenId =
  | "menu"
  | "auth"
  | "city"
  | "combat"
  | "character"
  | "inventory"
  | "skills"
  | "map"
  | "quests"
  | "journal";

export type CityLocationId =
  | "blacksmith"
  | "merchant"
  | "tavern"
  | "gates"
  | "workshop"
  | "shrine";

export interface UserSession {
  id: string;
  email: string;
  username: string;
}

export interface Combatant {
  id: string;
  name: string;
  isPlayer: boolean;
  maxHp: number;
  hp: number;
  maxMana: number;
  mana: number;
  maxEnergy: number;
  energy: number;
  attack: number;
  defense: number;
  speed: number;
  statuses: CombatStatus[];
  sprite: SpriteInfo;
}

export interface CombatStatus {
  type: "bleed" | "freeze" | "defend" | "burn" | "buff_atk" | "debuff_def";
  duration: number;
  value: number;
}

export interface SpriteInfo {
  label: string;
  color: string;
  accent: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  energyCost: number;
  manaCost: number;
  type: "attack" | "defend" | "heal" | "buff" | "debuff";
  power: number;
  statusEffect?: CombatStatus;
}

export interface CombatLogEntry {
  id: number;
  text: string;
  side: "player" | "enemy" | "system";
  kind: "attack" | "defend" | "heal" | "buff" | "effect" | "info" | "victory" | "defeat";
}

export interface CombatState {
  player: Combatant;
  enemy: Combatant;
  turn: "player" | "enemy";
  log: CombatLogEntry[];
  ended: boolean;
  result: "victory" | "defeat" | null;
  selectedSkillId: string | null;
  busy: boolean;
}
