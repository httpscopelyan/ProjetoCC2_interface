import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`

* {
    margin: 0;
    padding:0;
    box-sizing: border-box;
}

html.lenis, html.lenis body {
    height: auto;
}

.lenis.lenis-smooth {
    scroll-behavior: auto !important;
}

body {
    font-family: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
    color: #ffffff;
    background: #141416;
    -webkit-font-smoothing: antialiased;
}

html[data-kiosk] {
    font-size: 125%;
}

html[data-high-contrast] {
    filter: contrast(1.25);
}

html[data-high-contrast] body {
    background: #000000;
}

html[data-high-contrast] section {
    background: rgba(0, 0, 0, 0.88);
    border-color: rgba(255, 255, 255, 0.55);
}

button {
    font: inherit;
    color: inherit;
    background: none;
    border: 0;
    cursor: pointer;
}
`
