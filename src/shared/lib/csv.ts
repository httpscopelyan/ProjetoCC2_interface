type Cell = string | number;

const escape = (cell: Cell) => {
  // pt-BR Excel: decimal comma and ';' separator.
  const text = typeof cell === "number" ? String(cell).replace(".", ",") : cell;
  return /[";\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export const toCsv = (rows: Record<string, Cell>[]): string => {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const lines = rows.map((row) => headers.map((h) => escape(row[h])).join(";"));
  return [headers.join(";"), ...lines].join("\r\n");
};

export const downloadCsv = (filename: string, csv: string) => {
  // BOM so Excel reads accents as UTF-8.
  const blob = new Blob(["﻿", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
