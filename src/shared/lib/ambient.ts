export const setAmbientTint = (color: string | null) => {
  const root = document.documentElement.style;
  if (color) root.setProperty("--ambient-hover", color);
  else root.removeProperty("--ambient-hover");
};
