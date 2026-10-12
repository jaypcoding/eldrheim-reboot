import { useEffect, useRef, useState, type ReactNode } from "react";
import { SceneBackground } from "../ui/SceneBackground";
import { Button } from "../ui/Button";
import { LoadingDots } from "../ui/LoadingDots";
import {
  createCombat,
  playerUseSkill,
  enemyTurn,
  canUseSkill,
} from "../../game/combat";
import { PLAYER_SKILLS } from "../../game/data";
import type { CombatState, Combatant, Skill } from "../../types";

interface CombatScreenProps {
  enemyId: string;
  onVictory: () => void;
  onDefeat: () => void;
  onRetreat: () => void;
}

export function CombatScreen({
  enemyId,
  onVictory,
  onDefeat,
  onRetreat,
}: CombatScreenProps): ReactNode {
  const [state, setState] = useState<CombatState>(() => createCombat(enemyId));
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  // Enemy turn auto-execution
  useEffect(() => {
    if (state.ended) return;
    if (state.turn !== "enemy") return;
    const timer = setTimeout(() => {
      setState((prev) => enemyTurn(prev));
    }, 1200);
    return () => clearTimeout(timer);
  }, [state.turn, state.ended]);

  // Scroll log to bottom
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [state.log]);

  // Handle victory/defeat
  useEffect(() => {
    if (!state.ended) return;
    const timer = setTimeout(() => {
      if (state.result === "victory") onVictory();
      else onDefeat();
    }, 2500);
    return () => clearTimeout(timer);
  }, [state.ended, state.result, onVictory, onDefeat]);

  const handleUseSkill = (skill: Skill) => {
    if (state.ended || state.turn !== "player" || state.busy) return;
    const check = canUseSkill(skill, state.player);
    if (!check.ok) return;
    setState((prev) => playerUseSkill(prev, skill.id));
    setSelectedSkillId(null);
  };

  return (
    <>
      <SceneBackground type="combat" showSnow={false} showFog />
      <div className="content-overlay">
        {/* Top bar */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "var(--sp-2) var(--sp-4)",
            background: "rgba(11, 16, 24, 0.7)",
            borderBottom: "1px solid var(--c-panel-border)",
            backdropFilter: "blur(4px)",
          }}
        >
          <Button variant="ghost" size="sm" onClick={onRetreat} disabled={state.ended}>
            Recuar
          </Button>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--fs-md)",
              color: state.turn === "player" ? "var(--c-rune-gold)" : "var(--c-ember-light)",
            }}
          >
            {state.ended
              ? state.result === "victory"
                ? "Vitória"
                : "Derrota"
              : state.turn === "player"
                ? "Seu Turno"
                : "Turno do Inimigo"}
          </span>
        </header>

        {/* Combatants area */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "var(--sp-5)",
            padding: "var(--sp-4)",
            minHeight: 0,
          }}
        >
          {/* Enemy combatant */}
          <CombatantCard combatant={state.enemy} side="enemy" active={state.turn === "enemy"} />

          {/* VS indicator */}
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--fs-lg)",
              color: "var(--c-frost-gray)",
              opacity: 0.5,
            }}
          >
            ⚔
          </div>

          {/* Player combatant */}
          <CombatantCard combatant={state.player} side="player" active={state.turn === "player"} />
        </div>

        {/* Bottom panel: skills + log */}
        <div
          style={{
            display: "flex",
            gap: "var(--sp-3)",
            padding: "var(--sp-3) var(--sp-4)",
            background: "rgba(11, 16, 24, 0.85)",
            borderTop: "1px solid var(--c-panel-border)",
            backdropFilter: "blur(4px)",
            maxHeight: "42vh",
          }}
        >
          {/* Skills */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--fs-sm)",
                color: "var(--c-rune-gold)",
                marginBottom: "var(--sp-2)",
                letterSpacing: "0.05em",
              }}
            >
              Ações
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
                gap: "var(--sp-2)",
              }}
            >
              {PLAYER_SKILLS.map((skill) => {
                const check = canUseSkill(skill, state.player);
                const canUse =
                  check.ok &&
                  state.turn === "player" &&
                  !state.ended &&
                  !state.busy;
                return (
                  <button
                    key={skill.id}
                    className="skill-btn"
                    onClick={() => handleUseSkill(skill)}
                    disabled={!canUse}
                    style={{
                      padding: "var(--sp-2)",
                      background: selectedSkillId === skill.id
                        ? "rgba(200, 162, 74, 0.15)"
                        : "rgba(27, 38, 51, 0.8)",
                      border: selectedSkillId === skill.id
                        ? "1px solid var(--c-rune-gold)"
                        : "1px solid var(--c-panel-border)",
                      borderRadius: "var(--bd-radius)",
                      color: canUse ? "var(--c-snow)" : "var(--c-frost-gray)",
                      fontSize: "var(--fs-xs)",
                      textAlign: "left",
                      cursor: canUse ? "pointer" : "not-allowed",
                      transition: "all var(--tr-fast)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                    title={skill.description}
                  >
                    <span
                      style={{
                        fontWeight: "var(--fw-semibold)",
                        fontSize: "var(--fs-sm)",
                        color: canUse ? "var(--c-snow)" : "var(--c-frost-gray)",
                      }}
                    >
                      {skill.name}
                    </span>
                    <span style={{ color: "var(--c-frost-gray)", fontSize: "var(--fs-xs)" }}>
                      {skill.energyCost > 0 && `⚡${skill.energyCost} `}
                      {skill.manaCost > 0 && `✦${skill.manaCost}`}
                    </span>
                    {!check.ok && (
                      <span style={{ color: "var(--c-error)", fontSize: "var(--fs-xs)" }}>
                        {check.reason}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Combat log */}
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--fs-sm)",
                color: "var(--c-rune-gold)",
                marginBottom: "var(--sp-2)",
                letterSpacing: "0.05em",
              }}
            >
              Registro
            </h3>
            <div
              ref={logRef}
              className="scrollable"
              style={{
                flex: 1,
                background: "rgba(7, 10, 16, 0.6)",
                border: "1px solid var(--c-panel-border)",
                borderRadius: "var(--bd-radius)",
                padding: "var(--sp-2) var(--sp-3)",
                fontSize: "var(--fs-xs)",
                lineHeight: 1.6,
                maxHeight: "30vh",
              }}
            >
              {state.log.map((entry) => (
                <div
                  key={entry.id}
                  style={{
                    color:
                      entry.kind === "victory"
                        ? "var(--c-frost-green-light)"
                        : entry.kind === "defeat"
                          ? "var(--c-error)"
                          : entry.side === "player"
                            ? "var(--c-snow)"
                            : entry.side === "enemy"
                              ? "var(--c-ember-light)"
                              : "var(--c-ice)",
                    marginBottom: "2px",
                  }}
                >
                  {entry.text}
                </div>
              ))}
              {state.busy && !state.ended && (
                <div style={{ color: "var(--c-frost-gray)", marginTop: "var(--sp-1)" }}>
                  <LoadingDots />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

interface CombatantCardProps {
  combatant: Combatant;
  side: "player" | "enemy";
  active: boolean;
}

function CombatantCard({ combatant, side, active }: CombatantCardProps): ReactNode {
  const hpPct = (combatant.hp / combatant.maxHp) * 100;
  const manaPct = (combatant.mana / combatant.maxMana) * 100;
  const energyPct = (combatant.energy / combatant.maxEnergy) * 100;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "var(--sp-2)",
        padding: "var(--sp-3) var(--sp-5)",
        background: active
          ? "rgba(27, 38, 51, 0.5)"
          : "rgba(11, 16, 24, 0.3)",
        border: active
          ? "1px solid var(--c-rune-gold)"
          : "1px solid var(--c-panel-border)",
        borderRadius: "var(--bd-radius-md)",
        transition: "all var(--tr-normal)",
        minWidth: 240,
        maxWidth: 320,
        boxShadow: active ? "var(--sh-glow-gold)" : "none",
      }}
    >
      {/* Sprite */}
      <div
        style={{
          width: 56,
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `radial-gradient(circle, ${combatant.sprite.color}40 0%, transparent 70%)`,
          borderRadius: "50%",
          fontSize: "var(--fs-2xl)",
          filter: active ? "drop-shadow(0 0 8px rgba(200, 162, 74, 0.3))" : "none",
        }}
      >
        {combatant.sprite.label}
      </div>

      {/* Name */}
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--fs-md)",
          color: side === "player" ? "var(--c-rune-gold)" : "var(--c-ember-light)",
        }}
      >
        {combatant.name}
      </span>

      {/* Status badges */}
      {combatant.statuses.length > 0 && (
        <div style={{ display: "flex", gap: "var(--sp-1)", flexWrap: "wrap", justifyContent: "center" }}>
          {combatant.statuses.map((s, i) => (
            <span
              key={i}
              className={`badge ${
                s.type === "bleed" ? "badge-danger" :
                s.type === "freeze" ? "badge-frost" :
                s.type === "defend" ? "badge-gold" :
                s.type === "buff_atk" ? "badge-ember" :
                "badge-frost"
              }`}
            >
              {s.type === "bleed" ? "Sang" :
               s.type === "freeze" ? "Cong" :
               s.type === "defend" ? "Guarda" :
               s.type === "buff_atk" ? "Fúria" :
               s.type}
            </span>
          ))}
        </div>
      )}

      {/* HP bar */}
      <div style={{ width: "100%" }}>
        <div className="stat-bar-label">
          <span>Vida</span>
          <span>{combatant.hp}/{combatant.maxHp}</span>
        </div>
        <div className="stat-bar stat-bar-hp">
          <div className="stat-bar-fill" style={{ width: `${hpPct}%` }} />
        </div>
      </div>

      {/* Mana bar */}
      {combatant.maxMana > 0 && (
        <div style={{ width: "100%" }}>
          <div className="stat-bar-label">
            <span>Mana</span>
            <span>{combatant.mana}/{combatant.maxMana}</span>
          </div>
          <div className="stat-bar stat-bar-mana">
            <div className="stat-bar-fill" style={{ width: `${manaPct}%` }} />
          </div>
        </div>
      )}

      {/* Energy bar */}
      <div style={{ width: "100%" }}>
        <div className="stat-bar-label">
          <span>Energia</span>
          <span>{combatant.energy}/{combatant.maxEnergy}</span>
        </div>
        <div className="stat-bar stat-bar-energy">
          <div className="stat-bar-fill" style={{ width: `${energyPct}%` }} />
        </div>
      </div>
    </div>
  );
}
