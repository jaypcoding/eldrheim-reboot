import type { ReactNode } from "react";

interface PanelProps {
  children: ReactNode;
  title?: string;
  className?: string;
  actions?: ReactNode;
}

export function Panel({ children, title, className = "", actions }: PanelProps) {
  return (
    <div className={`panel ${className}`.trim()}>
      <span className="panel-corner tl" />
      <span className="panel-corner tr" />
      <span className="panel-corner bl" />
      <span className="panel-corner br" />
      {(title || actions) && (
        <div className="panel-header">
          {title && <h2 className="panel-title">{title}</h2>}
          {actions}
        </div>
      )}
      {children}
    </div>
  );
}
