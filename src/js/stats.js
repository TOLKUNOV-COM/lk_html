import { lineCharts, pieCharts, barCharts } from "./charts/index.js";
import initMap from "./stats/map.js";
import initFacts from "./stats/facts.js";

// Инициализация графиков
lineCharts();
pieCharts();
barCharts();

// Инициализация блока фактов
initFacts();

// Инициализация карты
initMap();
