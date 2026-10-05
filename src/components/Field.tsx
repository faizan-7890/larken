import type { ReactNode } from "react";

export function Field({
  label,
  error,
  children,
  className = "",
}: {
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`field ${className}`}>
      <span>{label}</span>
      {children}
      {error ? <em className="err">{error}</em> : null}
    </label>
  );
}
