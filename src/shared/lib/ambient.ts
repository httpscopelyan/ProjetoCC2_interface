// Sets the page-wide tint color through a CSS variable on <html>. No React state is involved, so hovering
// a card repaints one faint layer instead of re-rendering the tree.
export const setAmbientTint = (color: string | null) => {
  const root = document.documentElement.style;
  if (color) root.setProperty("--ambient-hover", color);
  else root.removeProperty("--ambient-hover");
};
