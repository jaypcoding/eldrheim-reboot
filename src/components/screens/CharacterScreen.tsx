import type { ReactNode } from "react";
import { SceneBackground } from "../ui/SceneBackground";
import { Button } from "../ui/Button";
import { Panel } from "../ui/Panel";
import { createPlayerCombatant } from "../../game/data";

interface CharacterScreenProps {
  onBack: () => void;
}

export function CharacterScreen({ onBack }: CharacterScreenProps): ReactNode {
  const player = createPlayerCombatant();

  return (
    <>
      <SceneBackground type="interior" showSnow={false} showFog />
      <div className="content-overlay">
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "var(--sp-3) var(--sp-5)",
            background: "rgba(11, 16, 24, 0.7)",
            borderBottom: "1px solid var(--c-panel-border)",
            backdropFilter: "blur(4px)",
          }}
        >
          <Button variant="ghost" size="sm" onClick={onBack}>
            ← Voltar à Cidade
          </Button>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--fs-lg)",
              color: "var(--c-rune-gold)",
            }}
          >
            Ficha do Personagem
          </span>
          <span style={{ width: 120 }} />
        </header>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "var(--sp-5)",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: "var(--sp-5)",
              maxWidth: 600,
              width: "100%",
            }}
            className="char-grid"
          >
            {/* Portrait */}
            <Panel>
              <span className="panel-corner tl" />
              <span className="panel-corner tr" />
              <span className="panel-corner bl" />
              <span className="panel-corner br" />
              <div
                style={{
                  width: 120,
                  height: 120,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "radial-gradient(circle, rgba(200, 162, 74, 0.1) 0%, transparent 70%)",
                  borderRadius: "var(--bd-radius-md)",
                  fontSize: "var(--fs-3xl)",
                  margin: "0 auto",
                }}
              >
                {player.sprite.label}
              </div>
              <p
                style={{
                  textAlign: "center",
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--fs-md)",
                  color: "var(--c-rune-gold)",
                  marginTop: "var(--sp-3)",
                }}
              >
                {player.name}
              </p>
              <p
                style={{
                  textAlign: "center",
                  fontSize: "var(--fs-xs)",
                  color: "var(--c-frost-gray)",
                  marginTop: "var(--sp-1)",
                }}
              >
                Nível 1 — Iniciante
              </p>
            </Panel>

            {/* Stats */}
            <Panel title="Atributos">
              <span className="panel-corner tl" />
              <span className="panel-corner tr" />
              <span className="panel-corner bl" />
              <span className="panel-corner br" />
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
                <StatRow label="Vida" value={`${player.maxHp}`} />
                <StatRow label="Mana" value={`${player.maxMana}`} />
                <StatRow label="Energia" value={`${player.maxEnergy}`} />
                <div className="separator" />
                <StatRow label="Ataque" value={`${player.attack}`} />
                <StatRow label="Defesa" value={`${player.defense}`} />
                <StatRow label="Velocidade" value={`${player.speed}`} />
              </div>
            </Panel>
          </div>

          {/* Empty state notice */}
          <p
            style={{
              marginTop: "var(--sp-5)",
              fontSize: "var(--fs-sm)",
              color: "var(--c-frost-gray)",
              textAlign: "center",
              maxWidth: 400,
              lineHeight: 1.6,
            }}
          >
            A persistência de personagem, progressão por níveis e equipamentos
            ainda não foi implementada. Esta ficha apresenta os atributos de
            combate padrão.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .char-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}

function StatRow({ label, value }: { label: string; value: string }): ReactNode {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "var(--sp-2) var(--sp-3)",
        background: "rgba(11, 16, 24, 0.4)",
        borderRadius: "var(--bd-radius)",
        border: "1px solid var(--c-panel-border)",
      }}
    >
      <span style={{ fontSize: "var(--fs-sm)", color: "var(--c-ice)" }}>{label}</span>
      <span
        style={{
          fontSize: "var(--fs-md)",
          color: "var(--c-snow)",
          fontWeight: "var(--fw-semibold)",
          fontFamily: "var(--font-mono)",
        }}
      >
        {value}
      </span>
    </div>
  );
}
