import { useState, type ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { AuthScreen } from "../components/screens/AuthScreen";
import { MenuScreen } from "../components/screens/MenuScreen";
import { CityScreen } from "../components/screens/CityScreen";
import { CombatScreen } from "../components/screens/CombatScreen";
import { CharacterScreen } from "../components/screens/CharacterScreen";
import { InventoryScreen } from "../components/screens/InventoryScreen";
import { PlaceholderScreen } from "../components/screens/PlaceholderScreen";
import { ToastContainer } from "../components/ui/Toast";
import { LoadingDots } from "../components/ui/LoadingDots";
import { SceneBackground } from "../components/ui/SceneBackground";
import type { ScreenId } from "../types";

export function App(): ReactNode {
  const { user, loading, signIn, signUp, signOut } = useAuth();
  const [screen, setScreen] = useState<ScreenId>("menu");
  const [combatEnemyId, setCombatEnemyId] = useState("frost_wolf");

  if (loading) {
    return (
      <>
        <SceneBackground type="dark" showSnow showFog />
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LoadingDots label="Carregando ELDRHEIM" />
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <AuthScreen
          onAuthSuccess={() => setScreen("menu")}
          signIn={signIn}
          signUp={signUp}
        />
        <ToastContainer />
      </>
    );
  }

  switch (screen) {
    case "menu":
      return (
        <>
          <MenuScreen
            user={user}
            onEnterCity={() => setScreen("city")}
            onContinue={() => setScreen("city")}
            onSignOut={signOut}
          />
          <ToastContainer />
        </>
      );

    case "city":
      return (
        <>
          <CityScreen
            user={user}
            onNavigate={(s: ScreenId) => setScreen(s)}
            onExitToCombat={(enemyId: string) => {
              setCombatEnemyId(enemyId);
              setScreen("combat");
            }}
            onSignOut={signOut}
          />
          <ToastContainer />
        </>
      );

    case "combat":
      return (
        <>
          <CombatScreen
            enemyId={combatEnemyId}
            onVictory={() => setScreen("city")}
            onDefeat={() => setScreen("city")}
            onRetreat={() => setScreen("city")}
          />
          <ToastContainer />
        </>
      );

    case "character":
      return (
        <>
          <CharacterScreen onBack={() => setScreen("city")} />
          <ToastContainer />
        </>
      );

    case "inventory":
      return (
        <>
          <InventoryScreen onBack={() => setScreen("city")} />
          <ToastContainer />
        </>
      );

    case "skills":
      return (
        <>
          <PlaceholderScreen
            title="Árvore de Habilidades"
            description="As Runas Primordiais dos cinco deuses aguardam serem despertadas. Aqui, futuramente, você poderá investir em caminhos de poder — mas cuidado: o uso das runas corrompe."
            onBack={() => setScreen("city")}
            sceneType="dark"
          />
          <ToastContainer />
        </>
      );

    case "map":
      return (
        <>
          <PlaceholderScreen
            title="Mapa de Regiões"
            description="O reino de Valdheim e as regiões de Haldergard, Frostmarch, Thornwood, Ironpeak e Morbhaven compõem o mundo conhecido. A exploração de mapas está em desenvolvimento."
            onBack={() => setScreen("city")}
            sceneType="dark"
          />
          <ToastContainer />
        </>
      );

    case "quests":
      return (
        <>
          <PlaceholderScreen
            title="Registro de Missões"
            description="Nenhuma missão ativa. O sistema de missões e objetivos será implementado nas próximas etapas do desenvolvimento."
            onBack={() => setScreen("city")}
            sceneType="dark"
          />
          <ToastContainer />
        </>
      );

    case "journal":
      return (
        <>
          <PlaceholderScreen
            title="Diário de Exploração"
            description="Seus passos pelo mundo de ELDRHEIM serão registrados aqui. O diário está vazio — a jornada ainda não começou."
            onBack={() => setScreen("city")}
            sceneType="dark"
          />
          <ToastContainer />
        </>
      );

    default:
      return (
        <>
          <MenuScreen
            user={user}
            onEnterCity={() => setScreen("city")}
            onContinue={() => setScreen("city")}
            onSignOut={signOut}
          />
          <ToastContainer />
        </>
      );
  }
}
