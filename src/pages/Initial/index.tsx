import Reveal from "../../shared/ui/Reveal";
import Header from "../../widgets/Header";
import Greeting from "../../widgets/Greeting";
import StatsOverview from "../../widgets/StatsOverview";
import DailyBriefing from "../../widgets/DailyBriefing";
import SensorChart from "../../widgets/SensorChart";
import AlertsPanel from "../../widgets/AlertsPanel";
import ActivityPanel from "../../widgets/ActivityPanel";
import TrendPanel from "../../widgets/TrendPanel";
import EventTimeline from "../../widgets/EventTimeline";
import { Content, Grid, Span } from "./style"

const Index = () => {
    return (
        <>
            <Reveal order={0}><Header /></Reveal>

            <Content>
                <Reveal order={1}><Greeting /></Reveal>
                <StatsOverview />

                <Reveal order={7}><DailyBriefing /></Reveal>

                <Grid>
                    <Span $cols={3}><Reveal order={8}><SensorChart /></Reveal></Span>
                    <Span $cols={1}><Reveal order={9}><ActivityPanel /></Reveal></Span>
                </Grid>

                <Grid>
                    <Span $cols={2}><Reveal order={10}><TrendPanel /></Reveal></Span>
                    <Span $cols={1}><Reveal order={11}><EventTimeline /></Reveal></Span>
                    <Span $cols={1}><Reveal order={12}><AlertsPanel /></Reveal></Span>
                </Grid>
            </Content>
        </>
    )
}

export default Index
