import { useEffect, useState } from "react";

import PeriodSwitch from "../../features/PeriodSwitch";
import CsvExport from "../../features/CsvExport";
import PdfExport from "../../features/PdfExport";
import { clock, dayMonth, salutation } from "../../shared/lib/date";
import { Actions, Clock, DateLine, Row, Title } from "./style";

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
        <PdfExport />
      </Actions>
    </Row>
  );
};

export default Greeting;
