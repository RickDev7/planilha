"use client";

import { useEffect, useRef, useState } from "react";

interface SignaturePadProps {
  /** Assinatura atual (data URL PNG) ou string vazia. */
  value: string;
  /** Recebe o novo data URL ao terminar um traço, ou "" ao limpar. */
  onChange: (dataUrl: string) => void;
  /** Salva a assinatura atual de forma permanente. */
  onSave: () => void;
  /** Remove a assinatura permanente salva. */
  onClearSaved: () => void;
  /** Indica se já existe uma assinatura salva permanentemente. */
  saved: boolean;
}

/**
 * Área de assinatura por toque/mouse. Desenha em um <canvas> e devolve
 * a imagem como data URL PNG (fundo transparente), embutida no PDF.
 * A assinatura pode ser salva para reutilização automática em folhas futuras.
 */
export function SignaturePad({
  value,
  onChange,
  onSave,
  onClearSaved,
  saved,
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  // Último data URL que este componente emitiu, para distinguir mudanças
  // internas (traço do usuário) de mudanças externas (assinatura carregada).
  const selfEmittedRef = useRef<string>("");
  const [hasInk, setHasInk] = useState(Boolean(value));

  const configureContext = (ctx: CanvasRenderingContext2D) => {
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#111111";
  };

  // Ajusta a resolução do canvas ao tamanho real do elemento (uma vez).
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    ctx.scale(ratio, ratio);
    configureContext(ctx);
  }, []);

  // Desenha a assinatura quando ela muda por fonte externa (carregada/removida).
  useEffect(() => {
    if (value === selfEmittedRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (value) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
      };
      img.src = value;
      setHasInk(true);
    } else {
      setHasInk(false);
    }
  }, [value]);

  const pointFromEvent = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    lastRef.current = pointFromEvent(e);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    const last = lastRef.current;
    if (!ctx || !last) return;

    const p = pointFromEvent(e);
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    lastRef.current = p;
    if (!hasInk) setHasInk(true);
  };

  const endDraw = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    lastRef.current = null;
    const canvas = canvasRef.current;
    if (canvas && hasInk) {
      const dataUrl = canvas.toDataURL("image/png");
      selfEmittedRef.current = dataUrl;
      onChange(dataUrl);
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHasInk(false);
    selfEmittedRef.current = "";
    onChange("");
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-neutral-600">
          Unterschrift Mitarbeiter
        </span>
        <button
          type="button"
          onClick={clear}
          className="text-xs font-medium text-kile-copper hover:underline"
        >
          Neu
        </button>
      </div>
      <canvas
        ref={canvasRef}
        onPointerDown={startDraw}
        onPointerMove={draw}
        onPointerUp={endDraw}
        onPointerLeave={endDraw}
        className="h-40 w-full touch-none rounded-lg border border-neutral-300 bg-white shadow-sm"
      />
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-neutral-400">
          {saved
            ? "Gespeicherte Unterschrift wird automatisch verwendet."
            : "Mit dem Finger unterschreiben."}
        </p>
        <div className="flex shrink-0 gap-3">
          {saved && (
            <button
              type="button"
              onClick={onClearSaved}
              className="text-xs font-medium text-neutral-500 hover:underline"
            >
              Gespeicherte löschen
            </button>
          )}
          <button
            type="button"
            onClick={onSave}
            disabled={!hasInk}
            className="text-xs font-semibold text-kile-copper hover:underline disabled:cursor-not-allowed disabled:text-neutral-300 disabled:no-underline"
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
}
