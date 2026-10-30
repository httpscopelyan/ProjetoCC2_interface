import type { Alert } from "../../../entities/alert/model";

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60000).toISOString();

export const mockAlerts = (): Alert[] => [
  { id: "1", sensorId: "temperature", severity: "warning", title: "Temperatura em alta", message: "A temperatura passou de 29 °C na última hora.", at: minutesAgo(6) },
  { id: "2", sensorId: "airQuality", severity: "critical", title: "Qualidade do ar ruim", message: "O índice de qualidade do ar ultrapassou 100.", at: minutesAgo(48) },
  { id: "3", sensorId: "rain", severity: "info", title: "Chuva detectada", message: "O sensor registrou garoa fraca.", at: minutesAgo(130) },
  { id: "4", sensorId: "humidity", severity: "warning", title: "Umidade baixa", message: "A umidade ficou abaixo de 30%.", at: minutesAgo(310) },
  { id: "5", sensorId: "pressure", severity: "info", title: "Pressão em queda", message: "A pressão caiu 6 hPa nas últimas 3 horas.", at: minutesAgo(26 * 60) },
  { id: "6", sensorId: "luminosity", severity: "info", title: "Sensor de luz recalibrado", message: "A luminosidade foi recalibrada automaticamente.", at: minutesAgo(30 * 60) },
  { id: "7", sensorId: "temperature", severity: "critical", title: "Temperatura muito alta", message: "A temperatura chegou a 33 °C.", at: minutesAgo(52 * 60) },
  { id: "8", sensorId: "rain", severity: "warning", title: "Chuva forte", message: "A intensidade da chuva passou de 10 mm/h.", at: minutesAgo(75 * 60) },
];
