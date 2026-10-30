import { Download } from "lucide-react";

import { SENSOR_BY_ID, SENSOR_DEFS } from "../../shared/config/sensors";
import { downloadCsv, toCsv } from "../../shared/lib/csv";
import { useSensorControls, useSensorData } from "../../entities/sensor/context";
import { ExportButton } from "./style";

const CsvExport = () => {
  const { selectedId, period, day } = useSensorControls();
  const { seriesBySensor, readings } = useSensorData();

  const exportCsv = () => {
    const def = SENSOR_BY_ID[selectedId];
    const points = seriesBySensor[selectedId]?.points ?? [];
    const now = new Date().toLocaleString("pt-BR");

    // The selected sensor's series for the current view; with no series yet, the current value of every sensor.
    const rows =
      points.length > 0
        ? points.map((p) => ({
            sensor: def.title,
            data: new Date(p.at).toLocaleString("pt-BR"),
            valor: Number(p.value.toFixed(def.decimals)),
            unidade: def.unit,
          }))
        : SENSOR_DEFS.flatMap((d) =>
            readings[d.id] === undefined
              ? []
              : [{ sensor: d.title, data: now, valor: Number((readings[d.id] as number).toFixed(d.decimals)), unidade: d.unit }],
          );

    if (rows.length === 0) return;
    downloadCsv(`sensores-${selectedId}-${day ?? period}.csv`, toCsv(rows));
  };

  return (
    <ExportButton type="button" onClick={exportCsv}>
      <Download size={14} />
      Exportar CSV
    </ExportButton>
  );
};

export default CsvExport;
