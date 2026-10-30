import styled from "styled-components";
import backgroundss from "../../assets/background_ambient.webp"

export const Shell = styled.div`
    min-height: 100vh;
    padding: 1.5rem 1.5rem 2rem 5.5rem;
    isolation: isolate;

    /* fixed layer instead of background-attachment: fixed, which repaints on every scroll frame */
    &::before {
        content: "";
        position: fixed;
        inset: 0;
        z-index: -1;
        background-image: url(${backgroundss});
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        transform: translateZ(0);
    }
`
