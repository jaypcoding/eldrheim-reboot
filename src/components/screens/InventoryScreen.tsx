import type { ReactNode } from "react";
import { SceneBackground } from "../ui/SceneBackground";
import { Button } from "../ui/Button";
import { Panel } from "../ui/Panel";

interface InventoryScreenProps {
  onBack: () => void;
}

export function InventoryScreen({ onBack }: InventoryScreenProps): ReactNode {
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
            Inventário
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
          }}
        >
          <Panel style={{ maxWidth: 500, width: "100%" }}>
            <span className="panel-corner tl" />
            <span className="panel-corner tr" />
            <span className="panel-corner bl" />
            <span className="panel-corner br" />

            {/* Equipment slots */}
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--fs-md)",
                color: "var(--c-rune-gold)",
                marginBottom: "var(--sp-3)",
              }}
            >
              Equipamentos
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "var(--sp-2)",
                marginBottom: "var(--sp-5)",
              }}
            >
              {["Cabeça", "Tronco", "Mãos", "Arma", "Escudo", "Botas"].map((slot) => (
                <div
                  key={slot}
                  style={{
                    aspectRatio: "1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(11, 16, 24, 0.6)",
                    border: "1px solid var(--c-panel-border)",
                    borderRadius: "var(--bd-radius)",
                    color: "var(--c-frost-gray)",
                    fontSize: "var(--fs-xs)",
                    flexDirection: "column",
                    gap: "var(--sp-1)",
                  }}
                >
                  <span style={{ fontSize: "var(--fs-lg)", opacity: 0.3 }}>—</span>
                  <span>{slot}</span>
                </div>
              ))}
            </div>

            <div className="separator" />

            {/* Items */}
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--fs-md)",
                color: "var(--c-rune-gold)",
                marginBottom: "var(--sp-3)",
              }}
            >
              Itens
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(50px, 1fr))",
                gap: "var(--sp-2)",
                minHeight: 80,
              }}
            >
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    aspectRatio: "1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(11, 16, 24, 0.4)",
                    border: "1px solid var(--c-panel-border)",
                    borderRadius: "var(--bd-radius)",
                    color: "var(--c-frost-gray)",
                    fontSize: "var(--fs-xs)",
                  }}
                >
                  —
                </div>
              ))}
            </div>

            <p
              style={{
                marginTop: "var(--sp-4)",
                fontSize: "var(--fs-sm)",
                color: "var(--c-frost-gray)",
                textAlign: "center",
              }}
            >
              Nenhum item equipado. O sistema de inventário persistente
              está em desenvolvimento.
            </p>
          </Panel>
        </div>
      </div>
    </>
  );
}
