import { useEffect, useState } from "react";

import PeriodSwitch from "../../features/PeriodSwitch";
import CsvExport from "../../features/CsvExport";
import { clock, dayMonth, salutation } from "../../shared/lib/date";
import { Actions, Clock, DateLine, Row, Title } from "./style";

// Minute precision is enough, so a 30 s tick keeps this from re-rendering constantly.
const TICK_MS = 30000;

const Greeting = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), TICK_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <Row>
      <div>
        <DateLine>
          {dayMonth(now)}
          <Clock>{clock(now)}</Clock>
        </DateLine>
        <Title>{salutation(now)}</Title>
      </div>
      <Actions>
        <PeriodSwitch />
        <CsvExport />
      </Actions>
    </Row>
  );
};

export default Greeting;
