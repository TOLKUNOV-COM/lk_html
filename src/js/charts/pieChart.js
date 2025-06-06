import * as echarts from 'echarts';
import { declension } from '../utils.js';

export default function pieCharts() {
    document.querySelectorAll('[data-module="pieChart"]').forEach((el) => {
        let data;

        try {
            data = JSON.parse(el.dataset.chart || '[]');
        } catch (e) {
            console.error(e);
        } finally {
            pieChart(el, data);
        }
    });
}

/**
 * Инициализирует и рисует круговую (donut) диаграмму в контейнере 'pieChart'.
 * Легенда выводится в отдельном блоке справа от графика.
 * Сегменты разделены зазором 4px, имеют скругление, толщина кольца 50px,
 * при наведении сегмент немного отодвигается.
 */
export function pieChart(container = 'pieChart', data = []) {
    // Получаем DOM-элемент
    const chartDom = typeof container === 'string'
        ? document.getElementById(container)
        : container;

    if (!chartDom) {
        return;
    }

    const myChart = echarts.init(chartDom);

    const total = data.reduce((sum, item) => sum + item.value, 0);

    // Функция для определения радиуса в зависимости от ширины экрана
    const getChartRadius = () => {
        return window.matchMedia('(min-width: 90rem)').matches
            ? ['75px', '125px']
            : ['53px', '91px'];
    };

    // Функция для получения стилей текста в зависимости от ширины экрана
    const getTextStyles = () => {
        return window.matchMedia('(min-width: 90rem)').matches
            ? {
                value: { fontFamily: 'Craftwork Grotesk', fontSize: 32, fontWeight: 700, color: '#161F6A', lineHeight: 40 },
                name: { fontFamily: 'Craftwork Sans', fontSize: 16, fontWeight: 700, color: '#ABB1C4', lineHeight: 20, letterSpacing: 0.16 }
              }
            : {
                value: { fontFamily: 'Craftwork Grotesk', fontSize: 23.296, fontWeight: 700, color: '#161F6A', lineHeight: 29.12 },
                name: { fontFamily: 'Craftwork Sans', fontSize: 11.648, fontWeight: 700, color: '#ABB1C4', lineHeight: 14.56, letterSpacing: 0.116 }
              };
    };

    const option = {
        tooltip: {
            trigger: 'item',
            appendToBody: true,
            // confine: true,
            backgroundColor: '#fff',
            borderRadius: 16,
            borderWidth: 0,
            extraCssText: 'box-shadow: 0px 2px 8px 0px rgba(33, 37, 75, 0.11); padding: 16px;',
            textStyle: { color: '#161F6A' },
            position: function (point, params, dom, rect, size) {
                const [x, y] = point;
                const viewWidth = window.innerWidth;
                const viewHeight = window.innerHeight;

                let left = x + 10;
                let top = y + 10;

                if (chartDom.getBoundingClientRect().x + left + size.contentSize[0] > viewWidth - 30) {
                    left -= chartDom.getBoundingClientRect().x + left + size.contentSize[0] - viewWidth + 12 + 12 + 6;
                }
                if (chartDom.getBoundingClientRect().y + top + size.contentSize[1] > viewHeight - 18) {
                    top -= chartDom.getBoundingClientRect().y + top + size.contentSize[1] - viewHeight + 12 + 6;
                }

                return [left, top];
            },
            formatter: params => {
                const { data, percent, name } = params;
                const list = data?.list ?? [{ label: 'Количество', value: data?.value }];

                const header = `
    <div style="
      display: flex; 
      flex-direction: row; 
      align-items: center; 
      gap: 12px; 
      font-family: 'Craftwork Sans',sans-serif; 
      font-weight: 700; 
      line-height: 20px; 
      letter-spacing: 0.16px; 
      color: #161F6A;
    ">
      <div style="flex: 1;">${data.name}</div>
      <div>${percent.toFixed(0)}%</div>
    </div>
  `;

                const rows = list.map(item => `
    <div style="
      display: flex; 
      flex-direction: row; 
      align-items: center; 
      gap: 12px; 
      line-height: 20px;
      letter-spacing: 0.32px;
      font-family: 'Craftwork Sans',sans-serif;
      font-weight: 500; 
    ">
      <div style="flex: 1; color: #6E7185;">${item.label}</div>
      <div style="
        font-weight: 700; 
        color: #161F6A;
        letter-spacing: 0.16px;
      ">${item.value}</div>
    </div>
  `).join('');

                return `
    <div style="
      display: flex; 
      flex-direction: column; 
      gap: 12px;
      min-width: 168px;
    ">
      ${header}
      ${rows}
    </div>
  `;
            }

        },
        series: [
            {
                type: 'pie',
                radius: getChartRadius(),
                avoidLabelOverlap: false,
                silent: false,
                label: { show: false },
                labelLine: { show: false },
                // Добавляем отступ между сегментами через белую обводку толщиной 4px и скругление
                itemStyle: {
                    borderColor: '#ffffff',
                    borderWidth: 4,
                    borderRadius: 6
                },
                data: data
            },
            {
                type: 'pie',
                radius: ['45%', '45%'],
                silent: true,
                label: {
                    show: true,
                    position: 'center',
                    formatter: [`{value|${total}}`, `{name|${declension(total, ['тип', 'типа', 'типов'])}}`].join('\n'),
                    rich: getTextStyles()
                },
                tooltip: { show: false },
                data: [{ value: 1, name: '' }]
            }
        ]
    };

    myChart.setOption(option);

    // Функция для обновления размера и радиуса графика
    const updateChart = () => {
        myChart.setOption({
            series: [
                {
                    radius: getChartRadius()
                },
                {
                    label: {
                        rich: getTextStyles()
                    }
                }
            ]
        });
        myChart.resize();
    };

    // Обработчик изменения размера окна
    window.addEventListener('resize', updateChart);

    // Обработчик события сворачивания боковой панели
    document.addEventListener('sidebar:collapse:end', updateChart);
}
