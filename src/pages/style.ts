import styled from "styled-components";
import backgroundss from "../assets/background_ambient.jpg"

export const Bakc = styled.div`    
    position: absolute;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: start;
    justify-content: space-between;
    padding: 1.5rem;
    background-image: url(${backgroundss});
    background-repeat: no-repeat;
    background-size: cover;
`

