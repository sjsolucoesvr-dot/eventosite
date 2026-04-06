import { useEffect, useMemo, useRef, useState } from "react";
import { Palette } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type PreviewMode = "solid" | "gradient";

interface ColorPickerFieldProps {
  label: string;
  onChange: (value: string) => void;
  previewMode?: PreviewMode;
  secondaryValue?: string;
  value: string;
}

interface HSV {
  h: number;
  s: number;
  v: number;
}

const DEFAULT_HEX = "#E8547A";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const normalizeHex = (value: string) => {
  const cleaned = value.trim().replace(/^#/, "");

  if (/^[0-9a-fA-F]{3}$/.test(cleaned)) {
    return `#${cleaned
      .split("")
      .map((char) => `${char}${char}`)
      .join("")
      .toUpperCase()}`;
  }

  if (/^[0-9a-fA-F]{6}$/.test(cleaned)) {
    return `#${cleaned.toUpperCase()}`;
  }

  return null;
};

const hexToRgb = (hex: string) => {
  const normalized = normalizeHex(hex) ?? DEFAULT_HEX;
  const numeric = Number.parseInt(normalized.slice(1), 16);

  return {
    r: (numeric >> 16) & 255,
    g: (numeric >> 8) & 255,
    b: numeric & 255,
  };
};

const rgbToHsv = ({ r, g, b }: { r: number; g: number; b: number }): HSV => {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;

  let hue = 0;

  if (delta !== 0) {
    if (max === red) hue = ((green - blue) / delta) % 6;
    else if (max === green) hue = (blue - red) / delta + 2;
    else hue = (red - green) / delta + 4;
  }

  return {
    h: Math.round((hue * 60 + 360) % 360),
    s: Math.round(max === 0 ? 0 : (delta / max) * 100),
    v: Math.round(max * 100),
  };
};

const hexToHsv = (hex: string) => rgbToHsv(hexToRgb(hex));

const hsvToHex = ({ h, s, v }: HSV) => {
  const saturation = clamp(s, 0, 100) / 100;
  const value = clamp(v, 0, 100) / 100;
  const chroma = value * saturation;
  const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1));
  const match = value - chroma;

  let red = 0;
  let green = 0;
  let blue = 0;

  if (h < 60) [red, green, blue] = [chroma, x, 0];
  else if (h < 120) [red, green, blue] = [x, chroma, 0];
  else if (h < 180) [red, green, blue] = [0, chroma, x];
  else if (h < 240) [red, green, blue] = [0, x, chroma];
  else if (h < 300) [red, green, blue] = [x, 0, chroma];
  else [red, green, blue] = [chroma, 0, x];

  return `#${[red, green, blue]
    .map((channel) => Math.round((channel + match) * 255).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;
};

const ColorPickerField = ({
  label,
  onChange,
  previewMode = "solid",
  secondaryValue,
  value,
}: ColorPickerFieldProps) => {
  const normalizedValue = useMemo(() => normalizeHex(value) ?? DEFAULT_HEX, [value]);
  const [draftHex, setDraftHex] = useState(normalizedValue);
  const [hsv, setHsv] = useState<HSV>(() => hexToHsv(normalizedValue));
  const saturationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDraftHex(normalizedValue);
    setHsv(hexToHsv(normalizedValue));
  }, [normalizedValue]);

  const commitHex = (nextHex: string) => {
    const normalized = normalizeHex(nextHex);
    if (!normalized) return;
    setDraftHex(normalized);
    setHsv(hexToHsv(normalized));
    onChange(normalized);
  };

  const commitHsv = (partial: Partial<HSV>) => {
    setHsv((current) => {
      const next = {
        h: clamp(partial.h ?? current.h, 0, 360),
        s: clamp(partial.s ?? current.s, 0, 100),
        v: clamp(partial.v ?? current.v, 0, 100),
      };
      const nextHex = hsvToHex(next);
      setDraftHex(nextHex);
      onChange(nextHex);
      return next;
    });
  };

  const updateFromPointer = (clientX: number, clientY: number) => {
    const bounds = saturationRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const saturation = clamp(((clientX - bounds.left) / bounds.width) * 100, 0, 100);
    const brightness = clamp((1 - (clientY - bounds.top) / bounds.height) * 100, 0, 100);

    commitHsv({ s: saturation, v: brightness });
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    updateFromPointer(event.clientX, event.clientY);

    const handleMove = (moveEvent: PointerEvent) => updateFromPointer(moveEvent.clientX, moveEvent.clientY);
    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };

  const pickFromScreen = async () => {
    const pickerApi = window as Window & { EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> } };
    if (!pickerApi.EyeDropper) return;
    const eyeDropper = new pickerApi.EyeDropper();
    const result = await eyeDropper.open();
    commitHex(result.sRGBHex);
  };

  const gradientPreview = `linear-gradient(135deg, ${normalizedValue}, ${secondaryValue || normalizedValue})`;
  const saturationBackground = {
    background: `linear-gradient(to top, #000000, transparent), linear-gradient(to right, #ffffff, hsl(${hsv.h} 100% 50%))`,
  };

  return (
    <div className="space-y-3 rounded-[2rem] border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <Label className="font-body text-sm font-medium">{label}</Label>
        <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
          <span
            className="h-3 w-3 rounded-full border border-border"
            style={{ background: previewMode === "gradient" ? gradientPreview : normalizedValue }}
          />
          {previewMode === "gradient" ? "Gradiente" : "Cor sólida"}
        </div>
      </div>

      <div
        ref={saturationRef}
      aria-label={`${label} - área de seleção`}
        className="relative h-44 cursor-crosshair overflow-hidden rounded-[1.5rem] border border-border shadow-inner"
        onPointerDown={handlePointerDown}
        style={{ ...saturationBackground, touchAction: "none" }}
      >
        <div
          className="absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background shadow"
          style={{ left: `${hsv.s}%`, top: `${100 - hsv.v}%`, backgroundColor: normalizedValue }}
        />
      </div>

      <input
        aria-label={`${label} - matiz`}
        className="h-3 w-full cursor-pointer appearance-none rounded-full border border-border bg-transparent"
        max={360}
        min={0}
        onChange={(event) => commitHsv({ h: Number(event.target.value) })}
        style={{
          touchAction: "none",
          background:
            "linear-gradient(90deg, #FF0000 0%, #FFFF00 16%, #00FF00 33%, #00FFFF 50%, #0000FF 67%, #FF00FF 84%, #FF0000 100%)",
        }}
        type="range"
        value={hsv.h}
      />

      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center gap-3 rounded-2xl border border-border bg-background px-3 py-2.5">
          <span className="h-10 w-10 rounded-full border border-border" style={{ background: normalizedValue }} />
          <Input
            className="h-auto border-0 bg-transparent p-0 font-mono text-base shadow-none focus-visible:ring-0"
            onBlur={() => setDraftHex(normalizedValue)}
            onChange={(event) => {
              const nextValue = event.target.value.toUpperCase();
              setDraftHex(nextValue.startsWith("#") ? nextValue : `#${nextValue.replace(/^#/, "")}`);
              const normalized = normalizeHex(nextValue);
              if (normalized) {
                setHsv(hexToHsv(normalized));
                onChange(normalized);
              }
            }}
            value={draftHex}
          />
        </div>

        <Button
          className={cn("h-14 w-14 rounded-2xl border-border", !("EyeDropper" in window) && "opacity-50")}
          disabled={!("EyeDropper" in window)}
          onClick={pickFromScreen}
          size="icon"
          type="button"
          variant="outline"
        >
          <Palette className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ColorPickerField;