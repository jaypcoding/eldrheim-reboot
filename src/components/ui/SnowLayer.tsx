import { useMemo } from "react";

interface SnowLayerProps {
  count?: number;
}

export function SnowLayer({ count = 30 }: SnowLayerProps) {
  const flakes = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 6 + Math.random() * 8,
        size: 1 + Math.random() * 2,
      })),
    [count]
  );

  return (
    <div className="snow-layer" aria-hidden="true">
      {flakes.map((f) => (
        <span
          key={f.id}
          className="snow-flake"
          style={{
            left: `${f.left}%`,
            animationDelay: `${f.delay}s`,
            animationDuration: `${f.duration}s`,
            width: `${f.size}px`,
            height: `${f.size}px`,
          }}
        />
      ))}
    </div>
  );
}
