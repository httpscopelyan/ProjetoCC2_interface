import Reveal from "../../shared/ui/Reveal";
import Header from "../../widgets/Header";
import Greeting from "../../widgets/Greeting";
import StatsOverview from "../../widgets/StatsOverview";
import SensorChart from "../../widgets/SensorChart";
import AlertsPanel from "../../widgets/AlertsPanel";
import { Content, Grid, Span } from "./style"

// Reveal orders: header 0, greeting 1, the six sensor cards 2-7, then the grid.
const Index = () => {
    return (
        <>
            <Reveal order={0}><Header /></Reveal>

            <Content>
                <Reveal order={1}><Greeting /></Reveal>
                <StatsOverview />

                <Grid>
                    <Span $cols={3}><Reveal order={8}><SensorChart /></Reveal></Span>
                    <Span $cols={1}><Reveal order={9}><AlertsPanel /></Reveal></Span>
                </Grid>
            </Content>
        </>
    )
}

export default Index
