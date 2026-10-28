import React from "react";
import StatsCard from "../shared/ui/Cards/Card";
import { Clock } from "lucide-react";
import ambient from "../assets/background_ambient.jpg"
import {Bakc} from "./style"

const Index = () => {
    return (
        <Bakc style={{backgroundImage: ambient }}>

            <StatsCard
                title="Hours Logged"
                value="164h"
                change={8}
                icon={Clock}
            />
            <StatsCard
                title="Hours Logged"
                value="164h"
                change={8}
                icon={Clock}
            />
            <StatsCard
                title="Hours Logged"
                value="164h"
                change={8}
                icon={Clock}
            />
            <StatsCard
                title="Hours Logged"
                value="164h"
                change={8}
                icon={Clock}
            />
        </Bakc>
    )
}

export default Index