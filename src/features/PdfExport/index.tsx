import { useState } from "react";
import { FileText } from "lucide-react";
import { toPng } from "html-to-image";

import { CHART_ELEMENT_ID } from "../../shared/config/dom";
import { downloadPdfReport } from "../../shared/lib/pdf";
import { useSensorControls, useSensorData } from "../../entities/sensor/context";
import { formatValue, resolveState } from "../../entities/sensor/states";
import { useSensorDefs } from "../../entities/settings/useSensorDefs";
import { ExportButton } from "../CsvExport/style";

const BACKGROUND = "#141416";

const captureChart = async (): Promise<string | null> => {
  const element = document.getElementById(CHART_ELEMENT_ID);
  return element ? toPng(element, { backgroundColor: BACKGROUND, pixelRatio: 2 }) : null;
};

const PdfExport = () => {
  const { selectedId, period, day } = useSensorControls();
  const { readings } = useSensorData();
  const { defs, byId } = useSensorDefs();
  const [generating, setGenerating] = useState(false);

  const exportPdf = async () => {
    setGenerating(true);
    try {
      const tableRows = defs.flatMap((def) => {
        const value = readings[def.id];
        return value === undefined ? [] : [[def.title, formatValue(def, value), resolveState(def, value, readings).state.label]];
      });
      await downloadPdfReport({
        filename: `relatorio-${selectedId}-${day ?? period}.pdf`,
        title: "Relatório da estação meteorológica",
        subtitle: `${byId[selectedId].title} · ${day ?? period} · gerado em ${new Date().toLocaleString("pt-BR")}`,
        chartImage: await captureChart(),
        tableHead: ["Sensor", "Valor", "Estado"],
        tableRows,
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <ExportButton type="button" disabled={generating} onClick={exportPdf}>
      <FileText size={14} />
      {generating ? "Gerando…" : "Exportar PDF"}
    </ExportButton>
  );
};

export default PdfExport;
