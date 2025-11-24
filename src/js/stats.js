import { lineCharts, pieCharts, barCharts } from "./charts/index.js";
import initMap from "./stats/map.js";
import initFacts from "./stats/facts.js";
import tabs from "./tabs.js";

// Инициализация табов
tabs();

// Инициализация графиков
lineCharts();
pieCharts();
barCharts();

// Инициализация блока фактов
initFacts();

// Инициализация карты
initMap();
