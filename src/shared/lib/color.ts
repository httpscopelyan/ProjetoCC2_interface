const toRgb = (hex: string): [number, number, number] => {
  const value = hex.replace("#", "");
  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16),
  ];
};

const toHex = (channel: number) => Math.round(channel).toString(16).padStart(2, "0");

// Linear RGB interpolation between two #rrggbb colors; t is clamped to 0..1.
export const mixHex = (a: string, b: string, t: number): string => {
  const k = Math.min(1, Math.max(0, t));
  const [ar, ag, ab] = toRgb(a);
  const [br, bg, bb] = toRgb(b);
  return `#${toHex(ar + (br - ar) * k)}${toHex(ag + (bg - ag) * k)}${toHex(ab + (bb - ab) * k)}`;
};

export const withAlpha = (hex: string, alpha: number): string => {
  const [r, g, b] = toRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
