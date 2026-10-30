import styled from "styled-components";

export const Content = styled.main`
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    max-width: 1400px;
    margin: 1.5rem auto 0;
`

export const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1rem;

    @media (max-width: 1100px) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @media (max-width: 600px) {
        grid-template-columns: 1fr;
    }
`

export const Span = styled.div<{ $cols: number }>`
    display: grid;
    grid-column: span ${({ $cols }) => $cols};

    @media (max-width: 1100px) {
        grid-column: 1 / -1;
    }
`
