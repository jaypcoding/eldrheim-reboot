import { SnowLayer } from "./SnowLayer";

type SceneType = "title" | "city" | "combat" | "interior" | "dark";

interface SceneBackgroundProps {
  type: SceneType;
  showSnow?: boolean;
  showFog?: boolean;
}

export function SceneBackground({
  type,
  showSnow = true,
  showFog = true,
}: SceneBackgroundProps) {
  return (
    <div className={`pixel-scene scene-${type}`} aria-hidden="true">
      {type === "title" && <TitleSceneDecor />}
      {type === "city" && <CitySceneDecor />}
      {type === "combat" && <CombatSceneDecor />}
      {type === "interior" && <InteriorSceneDecor />}
      {type === "dark" && <DarkSceneDecor />}
      {showFog && <div className="fog-layer" />}
      {showSnow && <SnowLayer />}
      <div className="scene-vignette" />
    </div>
  );
}

function TitleSceneDecor() {
  return (
    <>
      <div className="scene-title-mountains">
        <div className="mountain m1" />
        <div className="mountain m2" />
        <div className="mountain m3" />
        <div className="mountain m4" />
        <div className="mountain m5" />
      </div>
      <div className="scene-title-trees">
        <div className="pine-tree" />
        <div className="pine-tree" />
        <div className="pine-tree" />
        <div className="pine-tree" />
      </div>
      <div className="fortress-wall" />
      <div className="scene-title-fortress">
        <div className="fortress-tower t1" />
        <div className="fortress-tower t2" />
        <div className="fortress-tower t3" />
        <div className="fortress-tower t4" />
        <div className="fortress-tower t5" />
      </div>
      <div className="scene-title-ground" />
    </>
  );
}

function CitySceneDecor() {
  return (
    <>
      <div className="scene-city-ground" />
      <div className="scene-city-path" />
      {/* Distant pine trees */}
      <div
        className="pine-tree"
        style={{ position: "absolute", bottom: "55%", left: "8%", zIndex: 0, opacity: 0.5 }}
      />
      <div
        className="pine-tree"
        style={{ position: "absolute", bottom: "58%", right: "10%", zIndex: 0, opacity: 0.5 }}
      />
      <div
        className="pine-tree"
        style={{ position: "absolute", bottom: "50%", left: "3%", zIndex: 0, opacity: 0.4 }}
      />
      {/* Rune glow accents */}
      <div className="rune-glow" style={{ top: "20%", left: "15%" }} />
      <div className="rune-glow" style={{ top: "25%", right: "20%", animationDelay: "2s" }} />
    </>
  );
}

function CombatSceneDecor() {
  return (
    <>
      <div className="scene-combat-wall" />
      <div className="scene-combat-arena" />
      <div className="torch-glow" style={{ bottom: "35%", left: "5%" }} />
      <div className="torch-glow" style={{ bottom: "35%", right: "5%", animationDelay: "1s" }} />
      <div className="rune-glow" style={{ bottom: "45%", left: "50%" }} />
    </>
  );
}

function InteriorSceneDecor() {
  return (
    <>
      <div className="rune-glow" style={{ top: "30%", left: "10%" }} />
      <div className="rune-glow" style={{ top: "40%", right: "12%", animationDelay: "1.5s" }} />
      <div className="rune-glow" style={{ bottom: "20%", left: "45%", animationDelay: "3s" }} />
    </>
  );
}

function DarkSceneDecor() {
  return (
    <>
      <div className="rune-glow" style={{ top: "15%", left: "20%" }} />
      <div className="rune-glow" style={{ top: "20%", right: "25%", animationDelay: "2s" }} />
      <div className="rune-glow" style={{ bottom: "30%", left: "70%", animationDelay: "4s" }} />
    </>
  );
}
