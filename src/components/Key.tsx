import { ComponentChildren } from "preact";
import { useEffect, useState, useRef, useCallback } from "preact/hooks";

export interface KeyProps {
  class?: string;
  label: ComponentChildren;
  sublabel?: string;
  description?: string;
  onKeyDown?: () => void;
  onKeyUp?: () => void;
}

export function Key({
  class: className,
  label,
  sublabel,
  description,
  onKeyDown,
  onKeyUp,
}: KeyProps) {
  const [isActive, setIsActive] = useState(false);
  const isActiveRef = useRef(isActive);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  const handlePointerDown = useCallback(() => {
    if (isActiveRef.current) {
      return;
    }
    setIsActive(true);
    onKeyDown?.();
  }, [onKeyDown]);
  const handlePointerUp = useCallback(() => {
    if (!isActiveRef.current) {
      return;
    }
    setIsActive(false);
    onKeyUp?.();
  }, [onKeyUp]);
  const handlePointerLeave = useCallback(() => {
    if (isActiveRef.current) {
      handlePointerUp();
    }
  }, [handlePointerUp]);
  const handlePointerCancel = useCallback(() => {
    if (isActiveRef.current) {
      handlePointerUp();
    }
  }, []);
  return (
    <div
      class={`key ${className ?? ""} ${isActive ? "active" : ""}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerCancel}
    >
      <div class="label">
        <span>{label}</span>
        {sublabel && (
          <>
            <span class="or"> or </span>
            <span>{sublabel}</span>
          </>
        )}
      </div>
      {description && <div class="description">{description}</div>}
    </div>
  );
}
