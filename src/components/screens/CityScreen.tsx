import { useState, type ReactNode } from "react";
import { SceneBackground } from "../ui/SceneBackground";
import { Button } from "../ui/Button";
import { Panel } from "../ui/Panel";
import { CITY_LOCATIONS, type CityLocation } from "../../game/data";
import type { CityLocationId, UserSession } from "../../types";

interface CityScreenProps {
  user: UserSession;
  onNavigate: (screen: "character" | "inventory" | "skills" | "map" | "quests" | "journal") => void;
  onExitToCombat: (enemyId: string) => void;
  onSignOut: () => void;
}

const LOCATION_DIALOG: Record<CityLocationId, { npc: string; line: string }> = {
  blacksmith: {
    npc: "Ferreiro Brunni",
    line: "O ferro se curva diante do fogo, mas o gelo curva os homens. Que forja te traz?",
  },
  merchant: {
    npc: "Mercadora Hild",
    line: "Suprimentos para os corajosos — e os tolos. A neve não faz distinção.",
  },
  tavern: {
    npc: "Taverneiro Aldkell",
    line: "Senta, viajante. O hidromel aquece, as histórias esfriam. O que te traz dos portões?",
  },
  gates: {
    npc: "Guarda dos Portões",
    line: "Além destes portões, o mundo é neve e presas. Tens certeza de que queres sair?",
  },
  workshop: {
    npc: "Artesã Eira",
    line: "Ferramentas afiadas, mentes afiadas. Aqui consertamos o que o inverno quebra.",
  },
  shrine: {
    npc: "Guardião das Runas",
    line: "As Runas Primordiais sussurram na pedra. Vetrosil as guardava. Agora... apenas eco.",
  },
};

export function CityScreen({
  user,
  onNavigate,
  onExitToCombat,
  onSignOut,
}: CityScreenProps): ReactNode {
  const [activeLocation, setActiveLocation] = useState<CityLocation | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const handleLocationClick = (loc: CityLocation) => {
    setActiveLocation(loc);
  };

  const handleLocationAction = (loc: CityLocation) => {
    if (loc.id === "gates") {
      setShowExitConfirm(true);
      return;
    }
    // Other locations show dialog only for now
  };

  const handleExitConfirm = () => {
    setShowExitConfirm(false);
    setActiveLocation(null);
    onExitToCombat("frost_wolf");
  };

  return (
    <>
      <SceneBackground type="city" showSnow showFog />
      <div className="content-overlay">
        {/* Top bar */}
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
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--fs-lg)",
              color: "var(--c-rune-gold)",
              letterSpacing: "0.05em",
            }}
          >
            ELDRHEIM
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)" }}>
            <span style={{ fontSize: "var(--fs-sm)", color: "var(--c-ice)" }}>
              {user.username}
            </span>
            <Button variant="ghost" size="sm" onClick={onSignOut}>
              Sair
            </Button>
          </div>
        </header>

        {/* City map area */}
        <div
          style={{
            flex: 1,
            position: "relative",
            minHeight: 0,
          }}
        >
          {/* Location hotspots */}
          {CITY_LOCATIONS.map((loc) => (
            <button
              key={loc.id}
              onClick={() => handleLocationClick(loc)}
              className="city-hotspot"
              style={{
                position: "absolute",
                left: `${loc.x}%`,
                top: `${loc.y}%`,
                transform: "translate(-50%, -50%)",
                zIndex: 10,
                background: activeLocation?.id === loc.id
                  ? "rgba(200, 162, 74, 0.2)"
                  : "rgba(27, 38, 51, 0.8)",
                border: activeLocation?.id === loc.id
                  ? "2px solid var(--c-rune-gold)"
                  : "1px solid var(--c-panel-border)",
                borderRadius: "var(--bd-radius-md)",
                padding: "var(--sp-2) var(--sp-3)",
                cursor: "pointer",
                transition: "all var(--tr-normal)",
                boxShadow: activeLocation?.id === loc.id
                  ? "var(--sh-glow-gold)"
                  : "var(--sh-sm)",
                display: "flex",
                alignItems: "center",
                gap: "var(--sp-2)",
                color: "var(--c-snow)",
                fontSize: "var(--fs-sm)",
                fontWeight: "var(--fw-medium)",
                fontFamily: "var(--font-body)",
                whiteSpace: "nowrap",
              }}
              aria-label={loc.name}
            >
              <span style={{ fontSize: "var(--fs-md)", lineHeight: 1 }}>{loc.icon}</span>
              <span>{loc.name}</span>
            </button>
          ))}

          {/* Bottom navigation bar */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              display: "flex",
              gap: "var(--sp-2)",
              padding: "var(--sp-3) var(--sp-4)",
              background: "rgba(11, 16, 24, 0.8)",
              borderTop: "1px solid var(--c-panel-border)",
              justifyContent: "center",
              flexWrap: "wrap",
              backdropFilter: "blur(4px)",
            }}
          >
            <Button variant="secondary" size="sm" onClick={() => onNavigate("character")}>
              Personagem
            </Button>
            <Button variant="secondary" size="sm" onClick={() => onNavigate("inventory")}>
              Inventário
            </Button>
            <Button variant="secondary" size="sm" onClick={() => onNavigate("skills")}>
              Habilidades
            </Button>
            <Button variant="secondary" size="sm" onClick={() => onNavigate("map")}>
              Mapa
            </Button>
            <Button variant="secondary" size="sm" onClick={() => onNavigate("quests")}>
              Missões
            </Button>
            <Button variant="secondary" size="sm" onClick={() => onNavigate("journal")}>
              Diário
            </Button>
          </div>
        </div>
      </div>

      {/* Location detail modal */}
      {activeLocation && !showExitConfirm && (
        <div
          className="modal-overlay"
          onClick={() => setActiveLocation(null)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <Panel title={activeLocation.name}>
              <span className="panel-corner tl" />
              <span className="panel-corner tr" />
              <span className="panel-corner bl" />
              <span className="panel-corner br" />
              <p
                style={{
                  color: "var(--c-snow-dim)",
                  fontSize: "var(--fs-base)",
                  lineHeight: 1.6,
                  marginBottom: "var(--sp-4)",
                }}
              >
                {activeLocation.description}
              </p>
              <div
                style={{
                  padding: "var(--sp-3) var(--sp-4)",
                  background: "rgba(11, 16, 24, 0.5)",
                  borderRadius: "var(--bd-radius)",
                  border: "1px solid var(--c-panel-border)",
                  marginBottom: "var(--sp-4)",
                }}
              >
                <p
                  style={{
                    fontSize: "var(--fs-sm)",
                    color: "var(--c-rune-gold)",
                    marginBottom: "var(--sp-1)",
                    fontWeight: "var(--fw-medium)",
                  }}
                >
                  {LOCATION_DIALOG[activeLocation.id].npc}:
                </p>
                <p
                  style={{
                    fontSize: "var(--fs-base)",
                    color: "var(--c-ice)",
                    fontStyle: "italic",
                    lineHeight: 1.5,
                  }}
                >
                  "{LOCATION_DIALOG[activeLocation.id].line}"
                </p>
              </div>
              {activeLocation.id === "gates" && (
                <p
                  style={{
                    fontSize: "var(--fs-sm)",
                    color: "var(--c-ember-light)",
                    marginBottom: "var(--sp-3)",
                  }}
                >
                  Sair dos portões inicia um combate.
                </p>
              )}
              <div
                style={{
                  display: "flex",
                  gap: "var(--sp-2)",
                  justifyContent: "flex-end",
                }}
              >
                <Button variant="ghost" size="sm" onClick={() => setActiveLocation(null)}>
                  Fechar
                </Button>
                {activeLocation.id === "gates" && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleLocationAction(activeLocation)}
                  >
                    Sair dos Portões
                  </Button>
                )}
              </div>
            </Panel>
          </div>
        </div>
      )}

      {/* Exit confirmation modal */}
      {showExitConfirm && (
        <div className="modal-overlay" onClick={() => setShowExitConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <Panel title="Portões de Saída">
              <span className="panel-corner tl" />
              <span className="panel-corner tr" />
              <span className="panel-corner bl" />
              <span className="panel-corner br" />
              <p
                style={{
                  color: "var(--c-snow-dim)",
                  fontSize: "var(--fs-base)",
                  lineHeight: 1.6,
                  marginBottom: "var(--sp-4)",
                }}
              >
                Além dos portões, o Inverno Eterno domina. Criaturas gélidas e mortos-vivos
                vagam pela nevasca. Deseja aventurar-se?
              </p>
              <div style={{ display: "flex", gap: "var(--sp-2)", justifyContent: "flex-end" }}>
                <Button variant="ghost" size="sm" onClick={() => setShowExitConfirm(false)}>
                  Permanecer
                </Button>
                <Button variant="danger" size="sm" onClick={handleExitConfirm}>
                  Enfrentar o Inverno
                </Button>
              </div>
            </Panel>
          </div>
        </div>
      )}
    </>
  );
}
