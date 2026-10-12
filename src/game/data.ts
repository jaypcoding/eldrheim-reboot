import type { Skill, Combatant, CityLocationId } from "../types";

export const PLAYER_SKILLS: Skill[] = [
  {
    id: "strike",
    name: "Golpe",
    description: "Ataque básico com a arma equipada.",
    energyCost: 10,
    manaCost: 0,
    type: "attack",
    power: 1.0,
  },
  {
    id: "heavy_strike",
    name: "Golpe Pesado",
    description: "Ataque devastador que causa sangramento.",
    energyCost: 25,
    manaCost: 0,
    type: "attack",
    power: 1.6,
    statusEffect: { type: "bleed", duration: 3, value: 4 },
  },
  {
    id: "guard",
    name: "Guarda",
    description: "Postura defensiva que reduz o dano recebido.",
    energyCost: 15,
    manaCost: 0,
    type: "defend",
    power: 0,
    statusEffect: { type: "defend", duration: 2, value: 0.5 },
  },
  {
    id: "rune_frost",
    name: "Runa de Gelo",
    description: "Congela o inimigo, impedindo sua ação.",
    energyCost: 10,
    manaCost: 15,
    type: "debuff",
    power: 0.5,
    statusEffect: { type: "freeze", duration: 2, value: 0 },
  },
  {
    id: "rune_mend",
    name: "Runa de Cura",
    description: "Canaliza energia rúnica para restaurar vida.",
    energyCost: 10,
    manaCost: 20,
    type: "heal",
    power: 30,
  },
  {
    id: "rune_warcry",
    name: "Grito de Guerra",
    description: "Aumenta o ataque por alguns turnos.",
    energyCost: 20,
    manaCost: 10,
    type: "buff",
    power: 0,
    statusEffect: { type: "buff_atk", duration: 3, value: 0.3 },
  },
];

export const ENEMY_TEMPLATES: Record<
  string,
  Omit<Combatant, "id" | "hp" | "mana" | "energy" | "statuses">
> = {
  frost_wolf: {
    name: "Lobo Gélido",
    isPlayer: false,
    maxHp: 60,
    maxMana: 0,
    maxEnergy: 80,
    attack: 14,
    defense: 6,
    speed: 18,
    sprite: {
      label: "🐺",
      color: "#6B7D8C",
      accent: "#A9C5D8",
    },
  },
  draugr: {
    name: "Draugr",
    isPlayer: false,
    maxHp: 90,
    maxMana: 20,
    maxEnergy: 60,
    attack: 18,
    defense: 10,
    speed: 10,
    sprite: {
      label: "🧟",
      color: "#4A6B5A",
      accent: "#8B9E8A",
    },
  },
  ice_troll: {
    name: "Troll de Gelo",
    isPlayer: false,
    maxHp: 140,
    maxMana: 0,
    maxEnergy: 100,
    attack: 24,
    defense: 14,
    speed: 7,
    sprite: {
      label: "👹",
      color: "#3A5A6A",
      accent: "#A9C5D8",
    },
  },
};

export function createPlayerCombatant(): Combatant {
  return {
    id: "player",
    name: "Guerreiro",
    isPlayer: true,
    maxHp: 120,
    hp: 120,
    maxMana: 60,
    mana: 60,
    maxEnergy: 100,
    energy: 100,
    attack: 20,
    defense: 8,
    speed: 14,
    statuses: [],
    sprite: {
      label: "⚔",
      color: "#C8A24A",
      accent: "#E0BC60",
    },
  };
}

export function createEnemy(id: string): Combatant {
  const template = ENEMY_TEMPLATES[id] ?? ENEMY_TEMPLATES.frost_wolf;
  return {
    ...template,
    id: "enemy",
    hp: template.maxHp,
    mana: template.maxMana,
    energy: template.maxEnergy,
    statuses: [],
  };
}

export interface CityLocation {
  id: CityLocationId;
  name: string;
  description: string;
  icon: string;
  x: number;
  y: number;
}

export const CITY_LOCATIONS: CityLocation[] = [
  {
    id: "blacksmith",
    name: "Ferreiro",
    description:
      "Uma forja aquecida por brasas antigas. O ferreiro trabalha o ferro com mãos calejadas.",
    icon: "⚒",
    x: 22,
    y: 52,
  },
  {
    id: "merchant",
    name: "Mercador",
    description:
      "Suprimentos e provisões para a jornada. O mercador murmura preços enquanto observa a neve cair.",
    icon: "⚖",
    x: 50,
    y: 68,
  },
  {
    id: "tavern",
    name: "Taverna",
    description:
      "Calor de lareira e cheiro de hidromel. Viajantes trocam histórias de terras distantes.",
    icon: "🍺",
    x: 38,
    y: 38,
  },
  {
    id: "gates",
    name: "Portões de Saída",
    description:
      "Os portões se abrem para a nevasca. Além deles, o mundo hostil aguarda.",
    icon: "⚔",
    x: 76,
    y: 55,
  },
  {
    id: "workshop",
    name: "Oficina",
    description:
      "Ferramentas e bancos de trabalho para reparos e criação de itens.",
    icon: "🔨",
    x: 62,
    y: 30,
  },
  {
    id: "shrine",
    name: "Santuário das Runas",
    description:
      "Runas antigas brilham na pedra. Um lugar de poder e meditação.",
    icon: "✦",
    x: 15,
    y: 28,
  },
];

export const ENEMY_ENCOUNTERS = ["frost_wolf", "draugr", "ice_troll"];
