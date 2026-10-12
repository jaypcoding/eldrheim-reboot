import type {
  Combatant,
  CombatState,
  CombatLogEntry,
  Skill,
  CombatStatus,
} from "../types";
import { PLAYER_SKILLS, createPlayerCombatant, createEnemy } from "./data";

let logCounter = 0;

function makeLog(
  text: string,
  side: CombatLogEntry["side"],
  kind: CombatLogEntry["kind"]
): CombatLogEntry {
  return { id: ++logCounter, text, side, kind };
}

export function createCombat(enemyId: string): CombatState {
  const player = createPlayerCombatant();
  const enemy = createEnemy(enemyId);
  const first = player.speed >= enemy.speed ? "player" : "enemy";
  return {
    player,
    enemy,
    turn: first,
    log: [
      makeLog(
        `${enemy.name} surge das sombras!`,
        "system",
        "info"
      ),
    ],
    ended: false,
    result: null,
    selectedSkillId: null,
    busy: false,
  };
}

export function getSkillById(id: string): Skill | undefined {
  return PLAYER_SKILLS.find((s) => s.id === id);
}

export function canUseSkill(
  skill: Skill,
  combatant: Combatant
): { ok: boolean; reason?: string } {
  if (combatant.energy < skill.energyCost) {
    return { ok: false, reason: "Energia insuficiente" };
  }
  if (combatant.mana < skill.manaCost) {
    return { ok: false, reason: "Mana insuficiente" };
  }
  return { ok: true };
}

function isFrozen(combatant: Combatant): boolean {
  return combatant.statuses.some((s) => s.type === "freeze");
}

function isDefending(combatant: Combatant): boolean {
  return combatant.statuses.some((s) => s.type === "defend");
}

function getAtkBuff(combatant: Combatant): number {
  const buff = combatant.statuses.find((s) => s.type === "buff_atk");
  return buff ? buff.value : 0;
}

function getDefDebuff(combatant: Combatant): number {
  const debuff = combatant.statuses.find((s) => s.type === "debuff_def");
  return debuff ? debuff.value : 0;
}

function calcDamage(
  attacker: Combatant,
  defender: Combatant,
  power: number
): number {
  const atkBuff = getAtkBuff(attacker);
  const defDebuff = getDefDebuff(defender);
  const baseAttack = attacker.attack * (1 + atkBuff);
  const baseDefense = defender.defense * (1 - defDebuff);
  let dmg = Math.max(1, Math.round(baseAttack * power - baseDefense * 0.5));
  if (isDefending(defender)) {
    dmg = Math.round(dmg * 0.5);
  }
  return dmg;
}

function applyDamage(combatant: Combatant, amount: number): void {
  combatant.hp = Math.max(0, combatant.hp - amount);
}

function addStatus(
  combatant: Combatant,
  status: CombatStatus
): void {
  const existing = combatant.statuses.findIndex(
    (s) => s.type === status.type
  );
  if (existing >= 0) {
    combatant.statuses[existing] = status;
  } else {
    combatant.statuses.push(status);
  }
}

function tickStatuses(
  combatant: Combatant,
  logs: CombatLogEntry[],
  side: CombatLogEntry["side"]
): void {
  const remaining: CombatStatus[] = [];
  for (const status of combatant.statuses) {
    if (status.type === "bleed") {
      applyDamage(combatant, status.value);
      logs.push(
        makeLog(
          `${combatant.name} sofre ${status.value} de sangramento.`,
          side,
          "effect"
        )
      );
    }
    status.duration -= 1;
    if (status.duration > 0) {
      remaining.push(status);
    } else {
      logs.push(
        makeLog(
          `${combatant.name}: ${statusLabel(status.type)} expirou.`,
          side,
          "effect"
        )
      );
    }
  }
  combatant.statuses = remaining;
}

function statusLabel(type: CombatStatus["type"]): string {
  const labels: Record<CombatStatus["type"], string> = {
    bleed: "Sangramento",
    freeze: "Congelamento",
    defend: "Guarda",
    burn: "Queimadura",
    buff_atk: "Fúria",
    debuff_def: "Vulnerabilidade",
  };
  return labels[type] ?? type;
}

export function playerUseSkill(
  state: CombatState,
  skillId: string
): CombatState {
  if (state.ended || state.turn !== "player" || state.busy) {
    return state;
  }
  const skill = getSkillById(skillId);
  if (!skill) return state;
  const check = canUseSkill(skill, state.player);
  if (!check.ok) return state;

  const newState: CombatState = structuredClone(state);
  const player = newState.player;
  const enemy = newState.enemy;
  const logs: CombatLogEntry[] = [];

  player.energy -= skill.energyCost;
  player.mana -= skill.manaCost;

  switch (skill.type) {
    case "attack": {
      const dmg = calcDamage(player, enemy, skill.power);
      applyDamage(enemy, dmg);
      logs.push(
        makeLog(
          `${player.name} usa ${skill.name}! ${enemy.name} sofre ${dmg} de dano.`,
          "player",
          "attack"
        )
      );
      if (skill.statusEffect) {
        addStatus(enemy, { ...skill.statusEffect });
        logs.push(
          makeLog(
            `${enemy.name} agora tem ${statusLabel(skill.statusEffect.type)}.`,
            "player",
            "effect"
          )
        );
      }
      break;
    }
    case "defend": {
      if (skill.statusEffect) {
        addStatus(player, { ...skill.statusEffect });
      }
      logs.push(
        makeLog(`${player.name} assume postura defensiva.`, "player", "defend")
      );
      break;
    }
    case "heal": {
      const heal = skill.power;
      player.hp = Math.min(player.maxHp, player.hp + heal);
      logs.push(
        makeLog(
          `${player.name} canaliza ${skill.name} e recupera ${heal} de vida.`,
          "player",
          "heal"
        )
      );
      break;
    }
    case "buff": {
      if (skill.statusEffect) {
        addStatus(player, { ...skill.statusEffect });
      }
      logs.push(
        makeLog(`${player.name} usa ${skill.name}!`, "player", "buff")
      );
      break;
    }
    case "debuff": {
      const dmg = calcDamage(player, enemy, skill.power);
      applyDamage(enemy, dmg);
      logs.push(
        makeLog(
          `${player.name} lança ${skill.name}! ${enemy.name} sofre ${dmg} de dano.`,
          "player",
          "attack"
        )
      );
      if (skill.statusEffect) {
        addStatus(enemy, { ...skill.statusEffect });
        logs.push(
          makeLog(
            `${enemy.name} está ${statusLabel(skill.statusEffect.type)}!`,
            "player",
            "effect"
          )
        );
      }
      break;
    }
  }

  if (enemy.hp <= 0) {
    newState.ended = true;
    newState.result = "victory";
    logs.push(makeLog(`${enemy.name} foi derrotado!`, "system", "victory"));
    newState.log.push(...logs);
    return newState;
  }

  tickStatuses(enemy, logs, "enemy");
  if (enemy.hp <= 0) {
    newState.ended = true;
    newState.result = "victory";
    logs.push(makeLog(`${enemy.name} foi derrotado!`, "system", "victory"));
    newState.log.push(...logs);
    return newState;
  }

  newState.turn = "enemy";
  newState.busy = true;
  newState.log.push(...logs);
  return newState;
}

export function enemyTurn(state: CombatState): CombatState {
  if (state.ended || state.turn !== "enemy") return state;

  const newState: CombatState = structuredClone(state);
  const player = newState.player;
  const enemy = newState.enemy;
  const logs: CombatLogEntry[] = [];

  if (isFrozen(enemy)) {
    logs.push(
      makeLog(`${enemy.name} está congelado e não pode agir!`, "enemy", "effect")
    );
  } else {
    const dmg = calcDamage(enemy, player, 1.0);
    applyDamage(player, dmg);
    logs.push(
      makeLog(
        `${enemy.name} ataca! ${player.name} sofre ${dmg} de dano.`,
        "enemy",
        "attack"
      )
    );
  }

  if (player.hp <= 0) {
    newState.ended = true;
    newState.result = "defeat";
    logs.push(
      makeLog(`${player.name} caiu em combate.`, "system", "defeat")
    );
    newState.log.push(...logs);
    return newState;
  }

  tickStatuses(player, logs, "player");
  if (player.hp <= 0) {
    newState.ended = true;
    newState.result = "defeat";
    logs.push(
      makeLog(`${player.name} caiu em combate.`, "system", "defeat")
    );
    newState.log.push(...logs);
    return newState;
  }

  enemy.energy = Math.min(enemy.maxEnergy, enemy.energy + 15);
  newState.turn = "player";
  newState.busy = false;
  newState.log.push(...logs);
  return newState;
}

export function regenerateEnergy(
  state: CombatState
): CombatState {
  if (state.ended) return state;
  const newState: CombatState = structuredClone(state);
  newState.player.energy = Math.min(
    newState.player.maxEnergy,
    newState.player.energy + 5
  );
  return newState;
}
