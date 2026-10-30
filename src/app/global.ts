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

button {
    font: inherit;
    color: inherit;
    background: none;
    border: 0;
    cursor: pointer;
}
`
