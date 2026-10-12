import type { ReactNode } from "react";
import { SceneBackground } from "../ui/SceneBackground";
import { Button } from "../ui/Button";
import { Panel } from "../ui/Panel";

interface PlaceholderScreenProps {
  title: string;
  description: string;
  onBack: () => void;
  sceneType?: "dark" | "interior";
}

export function PlaceholderScreen({
  title,
  description,
  onBack,
  sceneType = "dark",
}: PlaceholderScreenProps): ReactNode {
  return (
    <>
      <SceneBackground type={sceneType} showSnow showFog />
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
            {title}
          </span>
          <span style={{ width: 120 }} />
        </header>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "var(--sp-5)",
          }}
        >
          <Panel style={{ maxWidth: 440, width: "100%" }}>
            <span className="panel-corner tl" />
            <span className="panel-corner tr" />
            <span className="panel-corner bl" />
            <span className="panel-corner br" />
            <div
              style={{
                textAlign: "center",
                padding: "var(--sp-4) 0",
              }}
            >
              <div
                style={{
                  fontSize: "var(--fs-3xl)",
                  marginBottom: "var(--sp-3)",
                  opacity: 0.3,
                }}
              >
                ✦
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--fs-xl)",
                  color: "var(--c-rune-gold)",
                  marginBottom: "var(--sp-3)",
                }}
              >
                {title}
              </h2>
              <p
                style={{
                  fontSize: "var(--fs-base)",
                  color: "var(--c-snow-dim)",
                  lineHeight: 1.6,
                }}
              >
                {description}
              </p>
              <span className="badge badge-frost" style={{ marginTop: "var(--sp-4)" }}>
                Em Desenvolvimento
              </span>
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
