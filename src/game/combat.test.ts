import { describe, it, expect } from "vitest";
import {
  createCombat,
  playerUseSkill,
  enemyTurn,
  getSkillById,
  canUseSkill,
} from "./combat";
import { PLAYER_SKILLS, createPlayerCombatant } from "./data";

describe("combat engine", () => {
  it("creates combat with player and enemy", () => {
    const combat = createCombat("frost_wolf");
    expect(combat.player.isPlayer).toBe(true);
    expect(combat.enemy.isPlayer).toBe(false);
    expect(combat.ended).toBe(false);
    expect(combat.result).toBeNull();
    expect(combat.log.length).toBeGreaterThan(0);
  });

  it("player strikes deal damage to enemy", () => {
    const combat = createCombat("frost_wolf");
    const initialHp = combat.enemy.hp;
    const strike = getSkillById("strike")!;
    const after = playerUseSkill(combat, strike.id);
    expect(after.enemy.hp).toBeLessThan(initialHp);
  });

  it("guard skill does not change enemy hp", () => {
    const combat = createCombat("frost_wolf");
    const initialHp = combat.enemy.hp;
    const guard = getSkillById("guard")!;
    const after = playerUseSkill(combat, guard.id);
    expect(after.enemy.hp).toBe(initialHp);
    expect(after.player.statuses.some((s) => s.type === "defend")).toBe(true);
  });

  it("heal skill restores player hp", () => {
    const combat = createCombat("frost_wolf");
    combat.player.hp = 50;
    const heal = getSkillById("rune_mend")!;
    const after = playerUseSkill(combat, heal.id);
    expect(after.player.hp).toBeGreaterThan(50);
    expect(after.player.hp).toBeLessThanOrEqual(after.player.maxHp);
  });

  it("frost rune freezes enemy and skips their turn attack", () => {
    const combat = createCombat("frost_wolf");
    const frost = getSkillById("rune_frost")!;
    const after = playerUseSkill(combat, frost.id);
    expect(after.enemy.statuses.some((s) => s.type === "freeze")).toBe(true);
    const afterEnemy = enemyTurn(after);
    const freezeLog = afterEnemy.log.find((l) =>
      l.text.includes("congelado")
    );
    expect(freezeLog).toBeTruthy();
  });

  it("heavy strike applies bleed to enemy", () => {
    const combat = createCombat("frost_wolf");
    const heavy = getSkillById("heavy_strike")!;
    const after = playerUseSkill(combat, heavy.id);
    expect(after.enemy.statuses.some((s) => s.type === "bleed")).toBe(true);
  });

  it("warcry buff increases player attack", () => {
    const combat = createCombat("frost_wolf");
    const warcry = getSkillById("rune_warcry")!;
    const after = playerUseSkill(combat, warcry.id);
    expect(after.player.statuses.some((s) => s.type === "buff_atk")).toBe(true);
  });

  it("cannot use skill without enough energy", () => {
    const player = createPlayerCombatant();
    player.energy = 0;
    const strike = PLAYER_SKILLS.find((s) => s.id === "strike")!;
    const check = canUseSkill(strike, player);
    expect(check.ok).toBe(false);
  });

  it("cannot use skill without enough mana", () => {
    const player = createPlayerCombatant();
    player.mana = 0;
    const mend = PLAYER_SKILLS.find((s) => s.id === "rune_mend")!;
    const check = canUseSkill(mend, player);
    expect(check.ok).toBe(false);
  });

  it("combat ends on enemy defeat", () => {
    const combat = createCombat("frost_wolf");
    combat.enemy.hp = 1;
    const strike = getSkillById("strike")!;
    const after = playerUseSkill(combat, strike.id);
    expect(after.ended).toBe(true);
    expect(after.result).toBe("victory");
  });

  it("enemy turn deals damage to player", () => {
    const combat = createCombat("frost_wolf");
    const initialHp = combat.player.hp;
    combat.turn = "enemy";
    const after = enemyTurn(combat);
    expect(after.player.hp).toBeLessThan(initialHp);
    expect(after.turn).toBe("player");
  });

  it("defending halves incoming damage", () => {
    const combat = createCombat("frost_wolf");
    const guard = getSkillById("guard")!;
    const afterGuard = playerUseSkill(combat, guard.id);
    afterGuard.turn = "enemy";
    const afterEnemy = enemyTurn(afterGuard);
    const noGuardCombat = createCombat("frost_wolf");
    noGuardCombat.turn = "enemy";
    const noGuardResult = enemyTurn(noGuardCombat);
    expect(afterEnemy.player.hp).toBeGreaterThan(noGuardResult.player.hp);
  });

  it("player speed determines first turn", () => {
    const combat = createCombat("ice_troll");
    expect(combat.player.speed).toBeGreaterThan(combat.enemy.speed);
    expect(combat.turn).toBe("player");
  });

  it("faster enemy goes first", () => {
    const combat = createCombat("frost_wolf");
    expect(combat.enemy.speed).toBeGreaterThan(combat.player.speed);
    expect(combat.turn).toBe("enemy");
  });
});
