// pieChart.js
import * as echarts from 'echarts';

/**
 * Инициализирует и рисует круговую (donut) диаграмму в контейнере 'pieChart'.
 * Легенда выводится в отдельном блоке справа от графика.
 * Сегменты разделены зазором 4px, имеют скругление, толщина кольца 50px,
 * при наведении сегмент немного отодвигается.
 */
export default function pieChart() {
    const chartDom = document.getElementById('pieChart');
    if (!chartDom) {
        console.error('Контейнер с id "pieChart" не найден');
        return;
    }

    const myChart = echarts.init(chartDom);
    const data = [
        { value: 21, name: 'Баннеры', itemStyle: { color: '#2856F6' } },
        { value: 8,  name: 'Анимация', itemStyle: { color: '#4C6FFF' } },
        { value: 3,  name: 'Видео',    itemStyle: { color: '#AB67FE' } },
        { value: 3,  name: '3D',       itemStyle: { color: 'rgba(224, 199, 254, 0.4)' } },
        { value: 9,  name: 'Другое',   itemStyle: { color: 'rgba(237, 172, 172, 0.4)' } }
    ];

    const total = data.reduce((sum, item) => sum + item.value, 0);

    const option = {
        tooltip: { show: false },
        // Легенда справа от графика, в своём блоке
        legend: {
            orient: 'vertical',
            right: '5%',
            top: 'center',
            itemWidth: 12,
            itemHeight: 12,
            icon: 'circle',
            itemGap: 20,
            textStyle: { color: '#161F6A', fontSize: 14 },
            formatter: name => {
                const item = data.find(d => d.name === name);
                const pct = ((item.value / total) * 100).toFixed(0);
                return `{title|${name}} {percent|(${pct}%)} `;
            },
            textStyleRich: {
                title: { fontFamily: 'Craftwork Sans', fontSize: 14, fontWeight: 500, color: '#161F6A' },
                percent: { fontFamily: 'Craftwork Sans', fontSize: 14, fontWeight: 500, color: '#6E7185' }
            }
        },
        series: [
            {
                type: 'pie',
                radius: ['80px', '130px'], // толщина 50px
                center: ['40%', '50%'],    // сдвинули влево, чтобы освободить правую область для легенды
                avoidLabelOverlap: false,
                silent: true,
                label: { show: false },
                labelLine: { show: false },
                hoverOffset: 10,
                itemStyle: { borderColor: '#ffffff', borderWidth: 4, borderRadius: 8 },
                data: data
            },
            {
                type: 'pie',
                radius: ['45%', '45%'],
                center: ['40%', '50%'],
                label: {
                    show: true,
                    position: 'center',
                    formatter: [`{value|${total}}`, `{name|типа}`].join('\n'),
                    rich: {
                        value: { fontFamily: 'Craftwork Grotesk', fontSize: 32, fontWeight: 700, color: '#161F6A', lineHeight: 36 },
                        name: { fontFamily: 'Craftwork Sans', fontSize: 16, fontWeight: 500, color: '#6E7185', lineHeight: 20 }
                    }
                },
                tooltip: { show: false },
                data: [{ value: 1, name: '' }]
            }
        ]
    };

    myChart.setOption(option);
    window.addEventListener('resize', () => myChart.resize());
}
