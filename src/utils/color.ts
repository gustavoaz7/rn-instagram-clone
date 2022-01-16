const HEX_COLOR_RE = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

export function addAlphaToHEX(hex: string, alpha: number) {
  if (!HEX_COLOR_RE.test(hex) || alpha < 0 || alpha > 1) return hex;

  let cleanHex = hex;
  if (hex.length === 4) {
    cleanHex = `#${hex[1].repeat(2)}${hex[2].repeat(2)}${hex[3].repeat(2)}`;
  }

  return `${cleanHex}${Math.round(255 * alpha).toString(16)}`;
}
