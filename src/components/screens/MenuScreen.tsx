import { useState, type ReactNode } from "react";
import { SceneBackground } from "../ui/SceneBackground";
import { Button } from "../ui/Button";
import { LoadingDots } from "../ui/LoadingDots";
import type { UserSession } from "../../types";

interface MenuScreenProps {
  user: UserSession;
  onEnterCity: () => void;
  onContinue: () => void;
  onSignOut: () => void;
}

export function MenuScreen({
  user,
  onEnterCity,
  onContinue,
  onSignOut,
}: MenuScreenProps): ReactNode {
  const [busy, setBusy] = useState(false);

  const handleNew = () => {
    setBusy(true);
    onEnterCity();
  };

  const handleContinue = () => {
    setBusy(true);
    onContinue();
  };

  const handleSignOut = () => {
    onSignOut();
  };

  return (
    <>
      <SceneBackground type="title" showSnow showFog />
      <div className="content-overlay">
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "var(--sp-4)",
            minHeight: "100vh",
          }}
        >
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "var(--sp-7)" }}>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(3rem, 10vw, 5rem)",
                color: "var(--c-snow)",
                textShadow:
                  "0 0 30px rgba(169, 197, 216, 0.15), 0 0 60px rgba(200, 162, 74, 0.08), 0 2px 8px rgba(0,0,0,0.9)",
                letterSpacing: "0.1em",
                margin: 0,
                lineHeight: 1,
              }}
            >
              ELDRHEIM
            </h1>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1rem, 3vw, 1.5rem)",
                color: "var(--c-rune-gold)",
                letterSpacing: "0.2em",
                marginTop: "var(--sp-3)",
                opacity: 0.7,
              }}
            >
              ⚔ Inverno Eterno ⚔
            </p>
          </div>

          {/* Menu */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--sp-3)",
              width: "100%",
              maxWidth: 320,
            }}
          >
            <Button
              variant="primary"
              size="lg"
              block
              onClick={handleNew}
              disabled={busy}
            >
              {busy ? <LoadingDots /> : "Nova Jornada"}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              block
              onClick={handleContinue}
            >
              Continuar Jornada
            </Button>

            <div className="separator" />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "var(--sp-3)",
              }}
            >
              <span
                style={{
                  fontSize: "var(--fs-sm)",
                  color: "var(--c-ice)",
                }}
              >
                {user.username}
              </span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                Sair
              </Button>
            </div>
          </div>

          <p
            style={{
              marginTop: "var(--sp-7)",
              fontSize: "var(--fs-xs)",
              color: "var(--c-frost-gray)",
              textAlign: "center",
              maxWidth: 300,
              lineHeight: 1.6,
            }}
          >
            Um reino condenado pelo Inverno Eterno aguarda. As Runas Primordiais
            chamam, mas o poder corrompe.
          </p>
        </div>
      </div>
    </>
  );
}
