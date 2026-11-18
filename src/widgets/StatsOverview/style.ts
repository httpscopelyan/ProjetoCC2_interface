import styled, { css } from "styled-components";

const COLUMNS = 12;
const MAX_PER_ROW = 4;

// Divide `count` cards em linhas o mais iguais possível (ex.: 7 -> 4 + 3) e devolve
// quantas colunas (de 12) cada card ocupa, para que toda linha feche sem sobras.
export const rowSpans = (count: number): number[] => {
  if (count <= 0) return [];
  const rows = Math.ceil(count / MAX_PER_ROW);
  const base = Math.floor(count / rows);
  const extra = count % rows;
  return Array.from({ length: rows }, (_, row) => (row < extra ? base + 1 : base)).flatMap((perRow) =>
    Array.from({ length: perRow }, () => COLUMNS / perRow),
  );
};

export const Grid = styled.div<{ $count: number }>`
  display: grid;
  grid-template-columns: repeat(${COLUMNS}, minmax(0, 1fr));
  gap: 1rem;

  ${({ $count }) =>
    rowSpans($count).map(
      (span, index) => css`
        & > :nth-child(${index + 1}) {
          grid-column: span ${span};
        }
      `,
    )}

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    & > * {
      grid-column: auto !important;
    }

    & > :last-child:nth-child(odd) {
      grid-column: 1 / -1 !important;
    }
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;

    & > :last-child:nth-child(odd) {
      grid-column: auto !important;
    }
  }
`;
