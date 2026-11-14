const MARGIN = 14;

export interface ReportData {
  filename: string;
  title: string;
  subtitle: string;
  chartImage: string | null;
  tableHead: string[];
  tableRows: string[][];
}

export const downloadPdfReport = async ({
  filename,
  title,
  subtitle,
  chartImage,
  tableHead,
  tableRows,
}: ReportData) => {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([import("jspdf"), import("jspdf-autotable")]);
  const doc = new jsPDF();
  const contentWidth = doc.internal.pageSize.getWidth() - MARGIN * 2;

  doc.setFontSize(18);
  doc.text(title, MARGIN, 20);
  doc.setFontSize(10);
  doc.setTextColor(110);
  doc.text(subtitle, MARGIN, 27);

  let nextY = 34;
  if (chartImage) {
    const { width, height } = doc.getImageProperties(chartImage);
    const chartHeight = (height / width) * contentWidth;
    doc.addImage(chartImage, "PNG", MARGIN, nextY, contentWidth, chartHeight);
    nextY += chartHeight + 8;
  }

  autoTable(doc, { startY: nextY, head: [tableHead], body: tableRows, margin: { left: MARGIN, right: MARGIN } });
  doc.save(filename);
};
