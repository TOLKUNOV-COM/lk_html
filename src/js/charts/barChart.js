import * as echarts from 'echarts';

export default function barCharts() {
    document.querySelectorAll('[data-module="barChart"]').forEach((el) => {
        const data = JSON.parse(el.dataset.chart || '[]');
        barChart(el, data);
    });
}

/**
 * Инициализирует и рисует столбчатую диаграмму в заданном контейнере.
 * Каждый столбец имеет градиентную заливку и скругленные углы.
 * @param {string|HTMLElement} container — ID контейнера или сам элемент.
 * @param {Array} data - Массив данных для отображения, возможно с подсписком элементов
 */
export function barChart(container = 'barChart', data = []) {
    // Получаем DOM-элемент
    const chartDom = typeof container === 'string'
        ? document.getElementById(container)
        : container;

    if (!chartDom) {
        return;
    }

    const categories = data.map(item => item?.name || '');

    // Извлекаем значения для отображения (если данные в простой форме, используем их напрямую)
    const values = data.map(item => typeof item === 'object' ? item.value : item);

    const barCount = categories.length;
    const barWidth = 68;
    const gap = 8;
    const chartWidth = (barCount * (barWidth + gap)) - gap;

    // Установим ширину #chart динамически
    chartDom.style.width = chartWidth + 'px';

    // Инициализируем инстанс
    const myChart = echarts.init(chartDom);

    // Опции графика
    const option = {
        grid: {
            left: -4,
            right: -4,
            top: 20,
            bottom: 0,
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: categories,
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: {
                margin: 12,
                color: '#ABB1C4',
                fontFamily: 'Craftwork Sans',
                fontSize: 12,
                fontWeight: 900,
                lineHeight: 16,
                letterSpacing: 0.3,
                textStyle: { textTransform: 'uppercase' }
            },
            splitLine: { show: false }
        },
        yAxis: {
            type: 'value',
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { show: false },
            splitLine: { show: false }
        },
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

                if (chartDom.getBoundingClientRect().x + left + size.contentSize[0] > viewWidth) {
                    left -= chartDom.getBoundingClientRect().x + left + size.contentSize[0] - viewWidth + 12 + 10;
                }
                if (chartDom.getBoundingClientRect().y + top + size.contentSize[1] > viewHeight) {
                    top -= chartDom.getBoundingClientRect().y + top + size.contentSize[1] - viewHeight + 12 + 10;
                }

                return [left, top];
            },
            formatter: params => {
                const { data, name } = params;
                const list = data?.list ?? [{ label: 'Количество работ', value: data?.value }];

                // Формат заголовка как в pieChart
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
      <div>${data.value}</div>
    </div>
  `;

                // Формат строк данных как в pieChart
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

                // Общий шаблон тултипа
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
                name: 'Данные',
                type: 'bar',
                barWidth: barWidth,         // ширина столбца
                barCategoryGap: gap,
                data: data,
                label: {
                    show: true,
                    position: 'top',
                    distance: 4,
                    color: '#ABB1C4',
                    fontFamily: 'Craftwork Sans',
                    fontSize: 12,
                    fontWeight: 900,
                    lineHeight: 16,
                    letterSpacing: 0.3,
                    textStyle: {
                        textTransform: 'uppercase'
                    }
                },
                itemStyle: {
                    color: 'rgba(40, 86, 246, 0.10)',
                    borderColor: 'rgba(40, 86, 246, 0.06)',
                    borderWidth: 1,
                    barBorderRadius: [8, 8, 8, 8],
                },
                emphasis: {
                    itemStyle: {
                        color: '#2856F6',
                        borderColor: '#2856F6',
                        borderWidth: 1
                    },
                    label: {
                        color: '#161F6A'
                    }
                },
                zlevel: 1
            }
        ]
    };

    // Отрисуем
    myChart.setOption(option);

    // Реакция на ресайз окна
    window.addEventListener('resize', () => {
        myChart.resize();
    });

    document.addEventListener('sidebar:collapse:end', () => myChart.resize());
}
