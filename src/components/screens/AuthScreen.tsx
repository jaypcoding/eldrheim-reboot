import { useState, type ReactNode } from "react";
import { SceneBackground } from "../ui/SceneBackground";
import { Button } from "../ui/Button";
import { LoadingDots } from "../ui/LoadingDots";
import { showToast } from "../ui/Toast";

interface AuthScreenProps {
  onAuthSuccess: () => void;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    username: string
  ) => Promise<{ error: string | null }>;
}

type Mode = "login" | "signup";

export function AuthScreen({ onAuthSuccess, signIn, signUp }: AuthScreenProps): ReactNode {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);

    if (mode === "signup" && !username.trim()) {
      setError("Escolha um nome de viajante.");
      setBusy(false);
      return;
    }

    const result =
      mode === "login"
        ? await signIn(email, password)
        : await signUp(email, password, username.trim());

    if (result.error) {
      setError(result.error);
      setBusy(false);
      return;
    }

    if (mode === "signup") {
      showToast("Conta criada. Verifique seu e-mail se a confirmação estiver ativa.", "info");
    }

    setBusy(false);
    onAuthSuccess();
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
          <div style={{ textAlign: "center", marginBottom: "var(--sp-6)" }}>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.5rem, 8vw, 4rem)",
                color: "var(--c-snow)",
                textShadow: "0 0 20px rgba(169, 197, 216, 0.2), 0 2px 4px rgba(0,0,0,0.8)",
                letterSpacing: "0.08em",
                margin: 0,
              }}
            >
              ELDRHEIM
            </h1>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--fs-md)",
                color: "var(--c-rune-gold)",
                letterSpacing: "0.15em",
                marginTop: "var(--sp-2)",
                opacity: 0.8,
              }}
            >
              Inverno Eterno
            </p>
          </div>

          {/* Auth panel */}
          <div className="panel" style={{ maxWidth: 380, width: "100%" }}>
            <span className="panel-corner tl" />
            <span className="panel-corner tr" />
            <span className="panel-corner bl" />
            <span className="panel-corner br" />

            <div style={{ display: "flex", gap: "var(--sp-1)", marginBottom: "var(--sp-4)" }}>
              <button
                className={`btn ${mode === "login" ? "btn-primary" : "btn-ghost"} btn-sm`}
                style={{ flex: 1 }}
                onClick={() => {
                  setMode("login");
                  setError(null);
                }}
                type="button"
              >
                Entrar
              </button>
              <button
                className={`btn ${mode === "signup" ? "btn-primary" : "btn-ghost"} btn-sm`}
                style={{ flex: 1 }}
                onClick={() => {
                  setMode("signup");
                  setError(null);
                }}
                type="button"
              >
                Criar Conta
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
              {mode === "signup" && (
                <div className="field">
                  <label className="field-label" htmlFor="auth-username">
                    Nome de Viajante
                  </label>
                  <input
                    id="auth-username"
                    className="input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Como deseja ser conhecido"
                    autoComplete="username"
                    disabled={busy}
                  />
                </div>
              )}

              <div className="field">
                <label className="field-label" htmlFor="auth-email">
                  E-mail
                </label>
                <input
                  id="auth-email"
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  autoComplete="email"
                  disabled={busy}
                  required
                />
              </div>

              <div className="field">
                <label className="field-label" htmlFor="auth-password">
                  Senha
                </label>
                <input
                  id="auth-password"
                  className="input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  disabled={busy}
                  minLength={6}
                  required
                />
              </div>

              {error && (
                <p
                  style={{
                    color: "var(--c-error)",
                    fontSize: "var(--fs-sm)",
                    padding: "var(--sp-2) var(--sp-3)",
                    background: "rgba(184, 68, 58, 0.1)",
                    borderRadius: "var(--bd-radius)",
                    border: "1px solid rgba(184, 68, 58, 0.2)",
                  }}
                  role="alert"
                >
                  {error}
                </p>
              )}

              <Button
                type="submit"
                variant="primary"
                block
                disabled={busy}
                size="lg"
              >
                {busy ? <LoadingDots /> : mode === "login" ? "Entrar em ELDRHEIM" : "Iniciar Jornada"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
