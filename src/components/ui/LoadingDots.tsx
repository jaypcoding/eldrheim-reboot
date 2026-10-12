interface LoadingDotsProps {
  label?: string;
}

export function LoadingDots({ label }: LoadingDotsProps) {
  return (
    <span
      className="loading-dots"
      role="status"
      aria-label={label ?? "Carregando"}
    >
      <span className="loading-dot" />
      <span className="loading-dot" />
      <span className="loading-dot" />
      {label && (
        <span className="sr-only">{label}</span>
      )}
    </span>
  );
}
